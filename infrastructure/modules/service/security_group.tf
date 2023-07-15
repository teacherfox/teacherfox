
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
