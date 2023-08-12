resource "aws_lb" "service_lb" {
  name                       = local.name
  load_balancer_type         = "application"
  drop_invalid_header_fields = true
  internal                   = false
  enable_http2               = true
  enable_deletion_protection = false
  ip_address_type            = "dualstack"
  subnets                    = var.lb_subnet_ids
  security_groups            = [aws_security_group.lb_service.id]
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
    path                = "/graphql"
    timeout             = 6
  }

  lifecycle {
    create_before_destroy = true
    # Holdover from migration, don't want to deal with recreating it
    ignore_changes        = [name]
  }
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
