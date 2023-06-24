locals {
  organization = "teacherfox"
  workspace    = "${local.organization}-${var.environment}"
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

module "iam" {
  source        = "../../modules/iam"
  environments   = [var.environment, "dev", "staging"]
  organization  = local.organization
}

module "iam_env" {
  source        = "../../modules/iam-env"
  environment   = var.environment
  ecr_repo_arns = [module.graphql.ecr_repo_arn]
  organization  = local.organization
}

module "graphql" {
  source      = "../../modules/graphql"
  environment = var.environment
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
  environment = var.environment
  base_tags = var.default_tags
  public_subnet_ids = module.vpc.public_subnet_ids
  ssm_bucket = module.ssm.ssm_bucket
  ssm_client_access_policy_arn = module.ssm.ssm_client_access_policy_arn
  ssm_client_security_group_id = module.ssm.ssm_client_security_group_id
  vpc_id = module.vpc.id
}

module "server" {
  source = "../../modules/server"
  bastion_security_group_id = module.bastion.security_group_id
  database_subnet_ids = module.vpc.database_subnet_ids
  environment = var.environment
  vpc_id = module.vpc.id
}
