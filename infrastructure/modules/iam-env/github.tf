locals {
  github_provider_url = "token.actions.githubusercontent.com"
  github_audience = "sts.amazonaws.com"
}
resource "aws_iam_role" "github_role" {
  name        = "${var.environment}-github"
  description = "CI/CD role for deploying ${var.environment} environment"
  max_session_duration = 43200
  assume_role_policy   = data.aws_iam_policy_document.github_assume_role_policy.json
}

data "aws_iam_policy_document" "github_assume_role_policy" {
  version = "2012-10-17"
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    principals {
      type        = "Federated"
      identifiers = [var.github_openid_connect_provider_arn]
    }
    condition {
      test     = "StringEquals"
      values   = [local.github_audience]
      variable = "${local.github_provider_url}:aud"
    }
    condition {
      test     = "StringLike"
      values   = ["repo:${var.organization}/${var.organization}:*"]
      variable = "${local.github_provider_url}:sub"
    }
  }
}

data "aws_iam_policy_document" "services_deploy" {

#  dynamic "statement" {
#    for_each = toset(length(local.server_ecr_arns) > 0 ? ["a"] : [])
#
#    content {
#      actions   = local.ecr_actions
#      effect    = "Allow"
#      resources = local.server_ecr_arns
#    }
#  }

#  dynamic "statement" {
#    for_each = toset(length(local.server_ecs_role_arns) > 0 ? ["a"] : [])
#
#    content {
#      actions   = ["iam:PassRole"]
#      effect    = "Allow"
#      resources = local.server_ecs_role_arns
#    }
#  }
#
#  dynamic "statement" {
#    for_each = toset(length(local.server_ecs_service_arns) > 0 ? ["a"] : [])
#
#    content {
#      actions   = ["ecs:DeployService", "ecs:DescribeServices", "ecs:UpdateService"]
#      effect    = "Allow"
#      resources = local.server_ecs_service_arns
#    }
#  }
}

resource "aws_iam_policy" "service_deploy" {
  name   = "${var.environment}-server-deploy"
  policy = data.aws_iam_policy_document.services_deploy.json
}

resource "aws_iam_role_policy_attachment" "github_server_deploy" {
  role       = aws_iam_role.github_role.name
  policy_arn = aws_iam_policy.service_deploy.arn
}
