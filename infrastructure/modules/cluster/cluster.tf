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

resource "aws_secretsmanager_secret" "google_oauth" {
  name = "${var.environment}/server/google_oauth"
}

# Seed secret
resource "aws_secretsmanager_secret_version" "google_oauth_version" {
  secret_id     = aws_secretsmanager_secret.google_oauth.id
  secret_string = jsonencode({
    clientId     = "clientId"
    clientSecret = "clientSecret"
    redirectUri  = "redirectUri"
  })
}

module "server" {
  source                    = "../service"
  bastion_security_group_id = var.bastion_security_group_id
  certificate_arn           = var.certificate_arn
  cluster_id                = aws_ecs_cluster.teacherfox.id
  cluster_name              = aws_ecs_cluster.teacherfox.name
  create_database           = true
  database_subnet_ids       = var.database_subnet_ids
  domain_name               = var.domain_name
  domain_zone_id            = var.domain_zone_id
  environment               = var.environment
  environment_variables     = {
    PORT = 4000,
  }
  github_role_name = var.github_role_name
  lb_subnet_ids    = var.lb_subnet_ids
  min_instances    = var.environment == "production" ? 2 : 1
  max_instances    = 10
  route53_endpoint = "api"
  secrets          = ["auth_secret"]
  mapped_secrets   = [
    {
      name = "google_client_id"
      valueFrom  = "${aws_secretsmanager_secret_version.google_oauth_version.arn}:clientId::"
    },
    {
      name = "google_client_secret"
      valueFrom  = "${aws_secretsmanager_secret_version.google_oauth_version.arn}:clientSecret::"
    },
    {
      name = "google_redirect_uri"
      valueFrom  = "${aws_secretsmanager_secret_version.google_oauth_version.arn}:redirectUri::"
    }
  ]
  service_name         = "server"
  service_subnet_ids   = var.service_subnet_ids
  task_role_policy_arn = var.server_task_role_policy_arn
  vpc_id               = var.vpc_id
}
