
resource "null_resource" "test_lambda_nodejs_layer" {
  provisioner "local-exec" {
    working_dir = "${path.module}/lambda/function"
    command = "npm install"
  }

  triggers = {
    rerun_every_time = "${uuid()}"
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

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.module}/function"
  output_path = "${path.module}/archive/function.zip"
}

resource "aws_lambda_function" "test_lambda" {
  filename      = "${path.module}/archive/function.zip"
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
