data "aws_region" "current" {}

resource "aws_ecs_cluster" "teacherfox" {
  name = "${var.environment}-${var.organization}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_cluster_capacity_providers" "capacity_providers" {
  cluster_name       = aws_ecs_cluster.teacherfox.name
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]
}

module "server" {
  source = "../service"
  bastion_security_group_id = var.bastion_security_group_id
  certificate_arn = var.certificate_arn
  cluster_id = aws_ecs_cluster.teacherfox.id
  cluster_name = aws_ecs_cluster.teacherfox.name
  create_database = true
  database_subnet_ids = var.database_subnet_ids
  domain_name = var.domain_name
  domain_zone_id = var.domain_zone_id
  environment = var.environment
  environment_variables = {
    PORT = 4000,
    AWS_REGION = data.aws_region.current.name
  }
  github_role_name = var.github_role_name
  lb_subnet_ids = var.lb_subnet_ids
  min_instances = var.environment == "production" ? 2 : 1
  max_instances = 10
  route53_endpoint = "api"
  service_name = "server"
  service_subnet_ids = var.service_subnet_ids
  ses_identity_arn = var.ses_identity_arn
  vpc_id = var.vpc_id
  secrets = ["auth_secret"]
}
