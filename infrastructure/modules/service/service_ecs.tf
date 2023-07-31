locals {
  service_memory = 1024

  db_secrets = var.create_database ? [
    {
      name      = "DATABASE_URL"
      valueFrom = "${module.database[0].urls_arn}:url::"
    },
    {
      name      = "READ_ONLY_DATABASE_URL"
      valueFrom = "${module.database[0].urls_arn}:reader_url::"
    },
  ] : []

}

resource "aws_ecs_task_definition" "task_definition" {
  family                   = local.name
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.execution_role.arn
  task_role_arn            = aws_iam_role.task_role.arn
  network_mode             = "awsvpc"
  cpu                      = 512
  memory                   = local.service_memory
  container_definitions    = jsonencode(concat([
    {
      cpu          = 0
      name         = local.name
      image        = "${aws_ecr_repository.ecr_repo.repository_url}:latest"
      essential    = true
      portMappings = [
        {
          hostPort      = local.service_port
          protocol      = "tcp"
          containerPort = local.service_port
        }
      ]
      secrets = concat(
        local.db_secrets,
        [
          for k, v in var.mapped_secrets : {
          name      = upper(v.name)
          valueFrom = v.valueFrom
        }
        ],
        [
          for k, v in aws_secretsmanager_secret.server_secret : {
          name      = upper(k)
          valueFrom = v.arn
        }
        ]
      )
      environment = concat([
        {
          name  = "NODE_OPTIONS"
          value = "--max-old-space-size=${floor(local.service_memory * 0.8)}"
        },
        {
          name  = "AWS_ACCOUNT_ID",
          value = data.aws_caller_identity.current.account_id
        },
        {
          name  = "AWS_REGION",
          value = data.aws_region.current.name
        },
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "MODE"
          value = var.environment
        }
      ], [
        for k, v in var.environment_variables : {
          name  = k
          value = v
        }
      ]),
      logConfiguration = {
        logDriver = "awslogs"
        options   = {
          awslogs-group         = aws_cloudwatch_log_group.service_log_group.name
          awslogs-region        = data.aws_region.current.name
          awslogs-stream-prefix = "ecs"
        }
      }
    },
  ],
  ))

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }
}


resource "aws_ecs_service" "ecs_service" {
  name            = local.name
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.task_definition.arn
  desired_count   = var.min_instances
  launch_type     = "FARGATE"

  load_balancer {
    target_group_arn = aws_lb_target_group.lb_target_group.arn
    container_name   = local.name
    container_port   = local.service_port
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  deployment_controller {
    type = "ECS"
  }

  network_configuration {
    subnets          = var.service_subnet_ids
    security_groups  = [aws_security_group.service_security_group.id]
    assign_public_ip = false
  }

  lifecycle {
    ignore_changes = [desired_count, task_definition]
  }
}

resource "aws_appautoscaling_target" "scaling_target" {
  max_capacity       = var.max_instances
  min_capacity       = var.min_instances
  resource_id        = "service/${var.cluster_name}/${aws_ecs_service.ecs_service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "scaling_policy" {
  name               = local.name
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.scaling_target.resource_id
  scalable_dimension = aws_appautoscaling_target.scaling_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.scaling_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value = 75
  }
}
