variable "default_tags" {
  default = {

    Environment = "Development"
    ManagedBy   = "terraform"
    Project     = "learn-tfc-aws"

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
  organization = "teacherfox"
  workspace = "teacherfox-prod"
}

module "s3" {
  for_each = toset(data.tfe_outputs.prod_outputs.nonsensitive_values.developers)
  source = "../../modules/s3"
  environment = "${var.environment}-${each.key}"
}
