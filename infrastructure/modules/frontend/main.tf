data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

data "aws_iam_policy_document" "service_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["amplify.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "service_role" {
  name               = "${var.environment}-frontend-service-role"
  assume_role_policy = data.aws_iam_policy_document.service_assume_role_policy.json
}

data "aws_iam_policy_document" "service_policy_document" {
  statement {
    actions   = ["logs:CreateLogStream", "logs:PutLogEvents"]
    effect    = "Allow"
    resources = [
      "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:/aws/amplify/*:log-stream:*"
    ]
  }

  statement {
    actions   = ["logs:CreateLogGroup"]
    effect    = "Allow"
    resources = [
      "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:/aws/amplify/*"
    ]
  }

  statement {
    actions   = ["logs:DescribeLogGroups"]
    effect    = "Allow"
    resources = [
      "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:*"
    ]
  }
}

resource "aws_iam_policy" "service_policy" {
  name   = "${var.environment}-frontend-service-policy"
  policy = data.aws_iam_policy_document.service_policy_document.json
}

resource "aws_iam_role_policy_attachment" "execution_role_attachment" {
  role       = aws_iam_role.service_role.name
  policy_arn = aws_iam_policy.service_policy.arn
}

resource "aws_amplify_app" "frontend" {
  name                  = "${var.environment}-frontend"
  repository            = var.repository
  environment_variables = {
    AMPLIFY_DIFF_DEPLOY       = "false"
    AMPLIFY_MONOREPO_APP_ROOT = "apps/web"
  }
  access_token = var.personal_token
  build_spec           = <<-EOT
    version: 1
    applications:
      - frontend:
          phases:
            preBuild:
              commands:
                - npm install -g pnpm
                - pnpm add turbo --save-dev --ignore-workspace-root-check
            build:
              commands:
                - pnpm turbo run build --filter=web
          artifacts:
            baseDirectory: apps/web/.next
            files:
              - '**/*'
          cache:
            paths:
              - node_modules/**/*
              - .next/cache/**/*
          buildPath: /
        appRoot: apps/web
  EOT
  iam_service_role_arn = aws_iam_role.service_role.arn
  platform             = "WEB_COMPUTE"
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.frontend.id
  branch_name = var.environment == "prod" ? "main" : "TF-37-Deploy-Frontend"
  enable_performance_mode = var.environment == "prod" ? true : false

  framework = "Next.js - SSR"
  stage     = "PRODUCTION"
}

resource "aws_amplify_domain_association" "domain_association" {
  app_id      = aws_amplify_app.frontend.id
  domain_name = var.domain_name

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = ""
  }

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "www"
  }
}
