locals {
  function_path = "${path.module}/function"
}
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

resource "null_resource" "test_lambda_nodejs_layer" {
  provisioner "local-exec" {
    working_dir = local.function_path
    command = "npm install"
  }

  triggers = {
    index = sha256(file("${local.function_path}/index.js"))
    package = sha256(file("${local.function_path}/package.json"))
    lock = sha256(file("${local.function_path}/package-lock.json"))
    node = sha256(join("",fileset(local.function_path, "**/*.js")))
  }
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
  ]
}

data "aws_iam_policy_document" "lambda_policy_document" {
  statement {
    actions   = ["ec2:CreateNetworkInterface", "ec2:DescribeNetworkInterfaces"]
    effect    = "Allow"
    resources = ["*"]
  }

  statement {
    actions   = ["ec2:DeleteNetworkInterface"]
    effect    = "Allow"
    resources = ["arn:aws:ec2:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*/*"]
  }
}

resource "aws_iam_policy" "lambda_policy" {
  name   = "lambda_policy"
  policy = data.aws_iam_policy_document.lambda_policy_document.json
}

resource "aws_iam_role_policy_attachment" "github_server_deploy" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = local.function_path
  output_path = "${local.function_path}.zip"
}

resource "aws_lambda_function" "test_lambda" {
  filename      = "${local.function_path}.zip"
  function_name = "lambda_function_name"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  runtime = "nodejs18.x"

  vpc_config {
    # Every subnet should be able to reach an EFS mount target in the same Availability Zone. Cross-AZ mounts are not permitted.
    subnet_ids         = var.subnet_ids
    security_group_ids = [var.bastion_security_group_id]
  }

  environment {
    variables = {
      foo = "bar"
    }
  }
}
