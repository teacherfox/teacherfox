locals {
  organization        = "teacherfox"
  workspace           = "${local.organization}-${var.environment}"
}

variable "default_tags" {
  default = {

    Environment = "Production"
    ManagedBy   = "Terraform"
    Project     = "Teacherfox"

  }
  description = "Default Tags for Auto Scaling Group"
  type        = map(string)
}

terraform {
  cloud {
    organization = "teacherfox"
    workspaces {
      name = "teacherfox-prod"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.1.0"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = var.default_tags
  }
}

#module "iam" {
#  source                      = "../../modules/iam"
#  environments                = [var.environment, "dev", "staging"]
#  organization                = local.organization
##  server_task_role_policy_arn = module.iam_env.server_task_role_policy_arn
#}
#
#module "iam_env" {
#  source                             = "../../modules/iam-env"
#  environment                        = var.environment
#  github_audience                    = module.iam.github_audience
#  github_openid_connect_provider_arn = module.iam.github_openid_connect_provider_arn
#  github_provider_url                = module.iam.github_provider_url
#  organization                       = local.organization
##  ses_identity_arn                   = module.ses.identity_arn
#}

#module "route53" {
#  source       = "../../modules/route53"
#  environment  = var.environment
#  organization = local.organization
#}
#
#module "vpc" {
#  source       = "../../modules/vpc"
#  environment  = var.environment
#  organization = local.organization
#}
#
#module "ssm" {
#  source                = "../../modules/ssm"
#  environment           = var.environment
#  vpc_id                = module.vpc.id
#  private_subnet_ids    = module.vpc.private_subnet_ids
#  endpoint_interface_id = module.vpc.endpoint_interface_id
#  organization          = local.organization
#}
#
#module "bastion" {
#  source                       = "../../modules/bastion"
#  base_tags                    = var.default_tags
#  environment                  = var.environment
#  public_subnet_ids            = module.vpc.public_subnet_ids
#  ssm_bucket                   = module.ssm.ssm_bucket
#  ssm_client_access_policy_arn = module.ssm.ssm_client_access_policy_arn
#  ssm_client_security_group_id = module.ssm.ssm_client_security_group_id
#  vpc_id                       = module.vpc.id
#}
#
#module "cluster" {
#  source                      = "../../modules/cluster"
#  bastion_security_group_id   = module.bastion.security_group_id
#  certificate_arn             = module.route53.wildcard_certificate_arn
#  database_subnet_ids         = module.vpc.database_subnet_ids
#  domain_name                 = module.route53.domain_name
#  domain_zone_id              = module.route53.zone_id
#  environment                 = var.environment
#  github_role_name            = module.iam_env.github_role_name
#  lb_subnet_ids               = module.vpc.public_subnet_ids
#  organization                = local.organization
#  server_task_role_policy_arn = module.iam_env.server_task_role_policy_arn
#  service_subnet_ids          = module.vpc.private_subnet_ids
#  vpc_id                      = module.vpc.id
#}
#
#module "ses" {
#  source      = "../../modules/ses"
#  domain      = module.route53.domain_name
#  environment = var.environment
#  zone_id     = module.route53.zone_id
#}
