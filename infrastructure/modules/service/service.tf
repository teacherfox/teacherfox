locals {
  name           = "${var.environment}-${var.service_name}"
  service_port   = 4000
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

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

resource "aws_cloudwatch_log_group" "service_log_group" {
  name              = "/ecs/${var.environment}/${var.service_name}"
  retention_in_days = var.environment == "prod" ? 0 : 180
}

module "database" {
  count  = var.create_database ? 1 : 0
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

resource "aws_secretsmanager_secret" "server_secret" {
  for_each = var.secrets
  name     = "${var.environment}/${var.service_name}/${each.key}"
}
