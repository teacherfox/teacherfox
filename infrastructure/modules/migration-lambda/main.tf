
# Archive lambda function
data "archive_file" "main" {
  type        = "zip"
  source_dir  = "lambda/function"
  output_path = "${path.module}/.terraform/archive_files/function.zip"

  depends_on = [null_resource.main]
}

# Provisioner to install dependencies in lambda package before upload it.
resource "null_resource" "main" {

  triggers = {
    updated_at = timestamp()
  }

  provisioner "local-exec" {
    command = <<EOF
    yarn
    EOF

    working_dir = "${path.module}/lambda/function"
  }
}

resource "aws_lambda_function" "lambda_hello_world" {
  filename      = "${path.module}/.terraform/archive_files/function.zip"
  function_name = "lambda-hello-world"
  role          = aws_iam_role.lambda_hello_world_role.arn
  handler       = "index.handler"
  runtime       = "nodejs16.x"
  timeout = 300

  source_code_hash = data.archive_file.main.output_base64sha256
}

resource "aws_iam_role" "lambda_hello_world_role" {
  name               = "lambda_hello_world_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
  inline_policy {
    name = "lamda-hello-world-policy"
    policy = jsonencode({
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Sid" : "LambdaHelloWorld1",
          "Effect" : "Allow",
          "Action" : [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents",
          ],
          "Resource" : "*"
        }
      ]
    })
  }
}
