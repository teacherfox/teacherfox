locals {
  organization = "teacherfox"
  workspace    = "${local.organization}-${var.environment}"
}

data "tfe_outputs" "prod_outputs" {
  organization = local.organization
  workspace = "${local.organization}-prod"
}

variable "default_tags" {
  default = {

    Environment = "Staging"
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
      name = "teacherfox-staging"
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

module "iam_env" {
  source        = "../../modules/iam-env"
  environment   = var.environment
  organization  = local.organization
  github_openid_connect_provider_arn = data.tfe_outputs.prod_outputs.values.github_openid_connect_provider_arn
}

module "route53" {
  source      = "../../modules/route53"
  environment = var.environment
  organization = local.organization
}

module "vpc" {
  source       = "../../modules/vpc"
  environment  = var.environment
  organization = local.organization
}

module "ssm" {
  source = "../../modules/ssm"
  environment = var.environment
  vpc_id = module.vpc.id
  private_subnet_ids = module.vpc.private_subnet_ids
  endpoint_interface_id = module.vpc.endpoint_interface_id
  organization = local.organization
}

module "bastion" {
  source = "../../modules/bastion"
  base_tags = var.default_tags
  environment = var.environment
  public_subnet_ids = module.vpc.public_subnet_ids
  ssm_bucket = module.ssm.ssm_bucket
  ssm_client_access_policy_arn = module.ssm.ssm_client_access_policy_arn
  ssm_client_security_group_id = module.ssm.ssm_client_security_group_id
  vpc_id = module.vpc.id
}

module "cluster" {
  source = "../../modules/cluster"
  bastion_security_group_id = module.bastion.security_group_id
  certificate_arn = module.route53.wildcard_certificate_arn
  database_subnet_ids = module.vpc.database_subnet_ids
  domain_name = module.route53.domain_name
  domain_zone_id = module.route53.zone_id
  environment = var.environment
  github_role_name = module.iam_env.github_role_name
  lb_subnet_ids = module.vpc.public_subnet_ids
  organization = local.organization
  service_subnet_ids = module.vpc.private_subnet_ids
  vpc_id = module.vpc.id
}

module "frontend" {
  source = "../../modules/frontend"

  environment = var.environment
  personal_token = var.personal_token
  repository = "https://github.com/teacherfox/teacherfox"
}
