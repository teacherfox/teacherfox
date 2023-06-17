variable "default_tags" {
  default = {

    Environment = "Production"
    ManagedBy   = "terraform"
    Project     = "teacherfox-prod"

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
  source = "../../modules/iam"
    environment = var.environment
}

module "graphql" {
  source = "../../modules/graphql"
  environment = var.environment
}

module "route53" {
  source = "../../modules/route53"
  environment = var.environment
}
