locals {
  ecr_actions = [
    "ecr:BatchGetImage",
    "ecr:BatchCheckLayerAvailability",
    "ecr:CompleteLayerUpload",
    "ecr:GetDownloadUrlForLayer",
    "ecr:InitiateLayerUpload",
    "ecr:GetDownloadUrlForLayer",
    "ecr:PutImage",
    "ecr:UploadLayerPart"
  ]
  name           = "${var.environment}-${var.service_name}"
  service_port   = 4000
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

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

resource "aws_security_group" "service_security_group" {
  name   = local.name
  vpc_id = var.vpc_id
  tags   = { Name = local.name }
}
resource "aws_security_group_rule" "bastion_ssh_http_ingress" {
  count                    = var.bastion_security_group_id == "" ? 0 : 1
  type                     = "ingress"
  from_port                = local.service_port
  to_port                  = local.service_port
  protocol                 = "tcp"
  security_group_id        = aws_security_group.service_security_group.id
  source_security_group_id = var.bastion_security_group_id
}

resource "aws_security_group_rule" "service_database" {
  for_each                 = var.create_database ? toset(["ingress", "egress"]) : toset([])
  type                     = each.key
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.service_security_group.id
  source_security_group_id = module.database[0].security_group_id
}

resource "aws_security_group_rule" "lb_service_ingress" {
  type                     = "ingress"
  from_port                = local.service_port
  to_port                  = local.service_port
  protocol                 = "tcp"
  security_group_id        = aws_security_group.service_security_group.id
  source_security_group_id = aws_security_group.lb_service.id
}

resource "aws_security_group_rule" "service_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
  security_group_id = aws_security_group.service_security_group.id
}

resource "aws_security_group" "lb_service" {
  name        = "${local.name}-lb"
  vpc_id      = var.vpc_id
  description = "LB-BE ${local.name}"
  tags        = {
    Name               = "${local.name}-lb"
    ServiceEnvironment = var.environment
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "lb_service_http_tcp_ingress" {
  for_each          = toset(["80", "443"])
  type              = "ingress"
  from_port         = tonumber(each.key)
  to_port           = tonumber(each.key)
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
  security_group_id = aws_security_group.lb_service.id
}

resource "aws_security_group_rule" "lb_service_http_udp_ingress" {
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "udp"
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
  security_group_id = aws_security_group.lb_service.id
}

resource "aws_security_group_rule" "lb_service_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
  security_group_id = aws_security_group.lb_service.id
}

resource "aws_lb_target_group" "lb_target_group" {
  name                 = local.name
  port                 = local.service_port
  protocol             = "HTTP"
  target_type          = "ip"
  vpc_id               = var.vpc_id
  deregistration_delay = 30

  health_check {
    enabled             = true
    interval            = 30
    healthy_threshold   = 3
    unhealthy_threshold = 5
    protocol            = "HTTP"
    path                = "/health"
    timeout             = 6
  }

  lifecycle {
    create_before_destroy = true
    # Holdover from migration, don't want to deal with recreating it
    ignore_changes        = [name]
  }
}

resource "aws_route53_record" "domain_record" {
  for_each = toset(["A", "AAAA"])
  zone_id  = var.domain_zone_id
  name     = var.route53_endpoint != "" ? "${var.route53_endpoint}.${var.domain_name}" : var.domain_name
  type     = each.key

  alias {
    name                   = aws_lb.service_lb.dns_name
    zone_id                = aws_lb.service_lb.zone_id
    evaluate_target_health = true
  }
}


resource "aws_ecr_repository" "ecr_repo" {
  name                 = local.name
  image_tag_mutability = "MUTABLE"
  force_delete         = var.environment == "prod" ? false : true

  image_scanning_configuration {
    scan_on_push = true
  }
}


resource "aws_lb" "service_lb" {
  name                       = local.name
  load_balancer_type         = "application"
  drop_invalid_header_fields = true
  internal                   = false
  enable_http2               = true
  enable_deletion_protection = var.environment == "prod" ? true : false
  ip_address_type            = "dualstack"
  subnets                    = var.lb_subnet_ids
  security_groups            = [aws_security_group.lb_service.id]
}

resource "aws_lb_listener" "https_listener" {
  load_balancer_arn = aws_lb.service_lb.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = var.certificate_arn
  ssl_policy        = "ELBSecurityPolicy-FS-1-2-Res-2020-10"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.lb_target_group.arn
  }
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.service_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = 443
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}


data "aws_iam_policy_document" "service_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com", "ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "execution_role" {
  name               = "${local.name}-execution-role"
  assume_role_policy = data.aws_iam_policy_document.service_assume_role_policy.json
}

resource "aws_iam_role" "task_role" {
  name               = "${local.name}-task-role"
  assume_role_policy = data.aws_iam_policy_document.service_assume_role_policy.json
}

data "aws_iam_policy_document" "execution_policy_document" {
  statement {
    actions   = ["secretsmanager:DescribeSecret", "secretsmanager:GetSecretValue"]
    resources = concat([
      "arn:aws:secretsmanager:*:${data.aws_caller_identity.current.account_id}:secret:/${var.environment}/${var.service_name}/*",
      var.create_database ? module.database[0].urls_arn : ""
    ])
  }
}

resource "aws_iam_policy" "execution_policy" {
  name   = "${local.name}-execution-policy"
  policy = data.aws_iam_policy_document.execution_policy_document.json
}

resource "aws_iam_role_policy_attachment" "execution_role_attachment" {
  role       = aws_iam_role.execution_role.name
  policy_arn = aws_iam_policy.execution_policy.arn
}

resource "aws_iam_role_policy_attachment" "managed_execution_role_attachment" {
  role       = aws_iam_role.execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_cloudwatch_log_group" "service_log_group" {
  name              = "/ecs/${var.environment}/${var.service_name}"
  retention_in_days = var.environment == "prod" ? 0 : 180
}

module "database" {
  count = var.create_database ? 1 : 0
  source = "../database"

  environment               = var.environment
  bastion_security_group_id = var.bastion_security_group_id
  database_subnet_ids       = var.database_subnet_ids
  instances                 = {
    one = {}
  }
  service                   = var.service_name
  service_security_group_id = aws_security_group.service_security_group.id
  vpc_id                    = var.vpc_id
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
      secrets = local.db_secrets
      environment = [
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
      ],
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

data "aws_iam_policy_document" "github_operating" {
  statement {
    actions   = local.ecr_actions
    effect    = "Allow"
    resources = [aws_ecr_repository.ecr_repo.arn]
  }

  statement {
    actions   = ["iam:PassRole"]
    effect    = "Allow"
    resources = [aws_iam_role.task_role.arn, aws_iam_role.execution_role.arn]
  }

  statement {
    actions   = ["ecs:UpdateService", "ecs:DescribeServices"]
    effect    = "Allow"
    resources = [
      "arn:aws:ecs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:service/${var.cluster_name}/${aws_ecs_service.ecs_service.name}"
    ]
  }
}

resource "aws_iam_policy" "ecs_deploying_policy" {
  name   = "${local.name}-github-operating"
  policy = data.aws_iam_policy_document.github_operating.json
}

resource "aws_iam_role_policy_attachment" "github_operating" {
  role       = var.github_role_name
  policy_arn = aws_iam_policy.ecs_deploying_policy.arn
}
