# Associate the elastic ip on boot
#
# This is only for autoscaling groups of 1 where you want to replicate the concept of a single instance
# but make it... "cloud friendly".

locals {
  name_prefix = "${var.environment}-${var.name}"
}

data "aws_region" "current" {}

resource "aws_sns_topic" "scale" {
  name = "${replace(local.name_prefix, "_", "-")}-scale"
}

resource "aws_autoscaling_notification" "scale" {
  group_names   = [var.autoscaling_group_name]
  topic_arn     = aws_sns_topic.scale.arn
  notifications = ["autoscaling:EC2_INSTANCE_LAUNCH"]
}

resource "aws_sqs_queue" "scale_deadletter" {
  name                      = "${local.name_prefix}-scale-deadletter"
  receive_wait_time_seconds = 10
}

resource "aws_sqs_queue" "scale" {
  name                      = "${local.name_prefix}-scale"
  receive_wait_time_seconds = 10

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.scale_deadletter.arn
    maxReceiveCount     = 10
  })
}

data "aws_iam_policy_document" "scale_sns_to_sqs" {
  statement {
    actions   = ["sqs:SendMessage", "sqs:GetQueueUrl"]
    resources = [aws_sqs_queue.scale.arn]

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = [aws_sns_topic.scale.arn]
    }
  }
}

resource "aws_sqs_queue_policy" "scale" {
  queue_url = aws_sqs_queue.scale.id
  policy    = data.aws_iam_policy_document.scale_sns_to_sqs.json
}

resource "aws_sns_topic_subscription" "scale" {
  topic_arn = aws_sns_topic.scale.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.scale.arn
}

data "aws_iam_policy_document" "associate_address" {
  statement {
    resources = [aws_sqs_queue.scale.arn]
    actions = [
      "sqs:ChangeMessageVisibility",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes",
      "sqs:GetQueueUrl",
      "sqs:ReceiveMessage"
    ]
  }

  statement {
    resources = ["*"]
    actions   = ["ec2:AssociateAddress", "ec2:DescribeAddresses", "ec2:DescribeInstances"]
  }
}

resource "aws_iam_policy" "associate_address" {
  name   = "${data.aws_region.current.name}-${local.name_prefix}-associate-address"
  policy = data.aws_iam_policy_document.associate_address.json
}

data "aws_iam_policy_document" "associate_address_lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "associate_address" {
  name               = "${data.aws_region.current.name}-${local.name_prefix}-associate-address"
  assume_role_policy = data.aws_iam_policy_document.associate_address_lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "associate_address_associate" {
  role       = aws_iam_role.associate_address.name
  policy_arn = aws_iam_policy.associate_address.arn
}

resource "aws_iam_role_policy_attachment" "associate_address_basic_execution" {
  role       = aws_iam_role.associate_address.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "archive_file" "associate_address" {
  type        = "zip"
  output_path = "${path.module}/${replace(local.name_prefix, "-", "_")}_associate.zip"
  source_file = "${path.module}/associate.js"
}

resource "aws_lambda_function" "associate" {
  filename         = data.archive_file.associate_address.output_path
  function_name    = "${replace(local.name_prefix, "_", "-")}-associate-address"
  source_code_hash = data.archive_file.associate_address.output_base64sha256
  role             = aws_iam_role.associate_address.arn
  handler          = "associate.handler"
  runtime          = "nodejs18.x"

  environment {
    variables = {
      EIP_ID = var.eip_id
    }
  }
}

resource "aws_lambda_permission" "associate" {
  statement_id_prefix = "${data.aws_region.current.name}-${replace(local.name_prefix, "_", "-")}-associate-"
  action              = "lambda:InvokeFunction"
  function_name       = aws_lambda_function.associate.function_name
  principal           = "sns.amazonaws.com"
  source_arn          = aws_sqs_queue.scale.arn
}

resource "aws_lambda_event_source_mapping" "scale" {
  event_source_arn = aws_sqs_queue.scale.arn
  enabled          = true
  function_name    = aws_lambda_function.associate.arn
  batch_size       = 1
}
