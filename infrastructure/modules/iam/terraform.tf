locals {
  terraform_provider_url = "app.terraform.io"
  terraform_audience     = "aws.workload.identity"
}

resource "aws_iam_role" "terraform_role" {
  name        = "${var.environment}-terraform"
  description = "Terraform role for managing ${var.environment} resources"

  managed_policy_arns  = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  max_session_duration = 43200
  assume_role_policy   = data.aws_iam_policy_document.terraform_assume_role_policy.json
}

data "aws_iam_policy_document" "terraform_assume_role_policy" {
  version = "2012-10-17"
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.terraform_openid_connect_provider.arn]
    }
    condition {
      test     = "StringEquals"
      values   = [local.terraform_audience]
      variable = "${local.terraform_provider_url}:aud"
    }
    condition {
      test     = "StringLike"
      values   = ["organization:${var.organization}:project:${var.project}:workspace:${var.workspace}:*"]
      variable = "${local.terraform_provider_url}:sub"
    }
  }
}

data "external" "thumbprint" {
  program = ["${path.module}/thumbprint.sh", local.terraform_provider_url]
}

resource "aws_iam_openid_connect_provider" "terraform_openid_connect_provider" {
  url = "https://${local.terraform_provider_url}"

  client_id_list = [
    local.terraform_audience,
  ]

  thumbprint_list = [data.external.thumbprint.result.thumbprint]
}