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
      values   = [var.github_audience]
      variable = "${var.github_provider_url}:aud"
    }
    condition {
      test     = "StringLike"
      values   = ["repo:${var.organization}/${var.organization}:*"]
      variable = "${var.github_provider_url}:sub"
    }
  }
}

data "aws_iam_policy_document" "services_deploy" {
  statement {
    actions   = ["ecr:GetAuthorizationToken", "ecs:DescribeTaskDefinition", "ecs:RegisterTaskDefinition"]
    effect    = "Allow"
    resources = ["*"]
  }
}

resource "aws_iam_policy" "service_deploy" {
  name   = "${var.environment}-server-deploy"
  policy = data.aws_iam_policy_document.services_deploy.json
}

resource "aws_iam_role_policy_attachment" "github_server_deploy" {
  role       = aws_iam_role.github_role.name
  policy_arn = aws_iam_policy.service_deploy.arn
}

#data "aws_iam_policy_document" "server_task_role_policy_document" {
#  statement {
#    actions   = ["ses:SendTemplatedEmail"]
#    effect    = "Allow"
#    resources = [var.ses_identity_arn]
#  }
#}
#
#resource "aws_iam_policy" "server_task_role_policy" {
#  name   = "${var.environment}-server-task-role-policy"
#  policy = data.aws_iam_policy_document.server_task_role_policy_document.json
#}
