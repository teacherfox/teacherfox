locals {
  organization = "teacherfox"
  workspace    = "${local.organization}-${var.environment}"
}

variable "default_tags" {
  default = {

    Environment = "Development"
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
      name = "teacherfox-dev"
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

data "tfe_outputs" "prod_outputs" {
  organization = local.organization
  workspace = "${local.organization}-prod"
}

module "route53" {
  source       = "../../modules/route53"
  environment  = var.environment
  organization = local.organization
}

module "ses" {
  source      = "../../modules/ses"
  domain = module.route53.domain_name
  environment = var.environment
  zone_id = module.route53.zone_id
}
