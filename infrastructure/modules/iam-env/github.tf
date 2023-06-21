locals {
  ecr_actions = [
    "ecr:BatchGetImage",
    "ecr:BatchCheckLayerAvailability",
    "ecr:CompleteLayerUpload",
    "ecr:GetAuthorizationToken",
    "ecr:GetDownloadUrlForLayer",
    "ecr:InitiateLayerUpload",
    "ecr:GetDownloadUrlForLayer",
    "ecr:PutImage",
    "ecr:UploadLayerPart"
  ]
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
      identifiers = [aws_iam_openid_connect_provider.github_openid_connect_provider.arn]
    }
    condition {
      test     = "StringEquals"
      values   = [local.github_audience]
      variable = "${local.github_provider_url}:aud"
    }
    condition {
      test     = "StringLike"
      values   = ["repo:teacherfox/teacherfox:*"]
      variable = "${local.github_provider_url}:sub"
    }
  }
}

resource "aws_iam_openid_connect_provider" "github_openid_connect_provider" {
  url = "https://${local.github_provider_url}"

  client_id_list = [
    local.github_audience,
  ]

  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

data "aws_iam_policy_document" "server_deploy" {
  statement {
    actions   = local.ecr_actions
    effect    = "Allow"
    resources = var.ecr_repo_arns
  }

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

resource "aws_iam_policy" "server_deploy" {
  name   = "${var.environment}-server-deploy"
  policy = data.aws_iam_policy_document.server_deploy.json
}

resource "aws_iam_role_policy_attachment" "github_server_deploy" {
  role       = aws_iam_role.github_role.name
  policy_arn = aws_iam_policy.server_deploy.arn
}
