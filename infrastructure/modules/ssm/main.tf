data "aws_region" "current" {}

# Set up bucket for configuration
resource "aws_s3_bucket" "ssm" {
  bucket = "${var.environment}-drip-ssm"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "ssm" {
  bucket = aws_s3_bucket.ssm.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_acl" "ssm" {
  bucket = aws_s3_bucket.ssm.id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "ssm" {
  bucket = aws_s3_bucket.ssm.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "ssm" {
  bucket                  = aws_s3_bucket.ssm.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_iam_policy_document" "ssm_bucket" {
  statement {
    effect    = "Deny"
    actions   = ["s3:*"]
    resources = [aws_s3_bucket.ssm.arn, "${aws_s3_bucket.ssm.arn}/*"]

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

resource "aws_s3_bucket_policy" "ssm" {
  bucket = aws_s3_bucket.ssm.id
  policy = data.aws_iam_policy_document.ssm_bucket.json
}

# Set up security groups for host and clients

resource "aws_security_group" "ssm_host" {
  name        = "${var.environment}-ssm-host"
  description = "Specific rules for ssm managment"
  vpc_id      = var.vpc_id
  tags        = { Name = "${var.environment}-ssm-host" }
}

resource "aws_security_group_rule" "ssm_host_ingress_https" {
  for_each          = toset(["tcp", "udp"])
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = each.key
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
  security_group_id = aws_security_group.ssm_host.id
}

resource "aws_security_group_rule" "ssm_host_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 65535
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
  security_group_id = aws_security_group.ssm_host.id
}


resource "aws_security_group" "ssm_client" {
  name        = "${var.environment}-ssm-client"
  description = "Ability to connect to the ssm endpoing"
  vpc_id      = var.vpc_id
  tags        = { Name = "${var.environment}-ssm-client" }
}

resource "aws_security_group_rule" "ssm_client_ingress_tls" {
  for_each                 = toset(["tcp", "udp"])
  type                     = "ingress"
  from_port                = 443
  to_port                  = 443
  protocol                 = each.key
  security_group_id        = aws_security_group.ssm_client.id
  source_security_group_id = aws_security_group.ssm_host.id
}

resource "aws_security_group_rule" "ssm_client_egress_tls" {
  for_each                 = toset(["tcp", "udp"])
  type                     = "egress"
  from_port                = 443
  to_port                  = 443
  protocol                 = each.key
  security_group_id        = aws_security_group.ssm_client.id
  source_security_group_id = aws_security_group.ssm_host.id
}

# Set up the vpc endpoint

data "aws_vpc_endpoint_service" "ssm" {
  service = "ssm"
}

resource "aws_vpc_endpoint" "ssm" {
  vpc_id              = var.vpc_id
  vpc_endpoint_type   = "Interface"
  service_name        = data.aws_vpc_endpoint_service.ssm.service_name
  subnet_ids          = var.private_subnet_ids
  security_group_ids  = [var.endpoint_interface_id, aws_security_group.ssm_host.id]
  private_dns_enabled = true
  tags                = { Name = "${var.environment}-ssm-endpoint" }
}

# data "aws_iam_policy_document" "ssm_commands_read_only" {
#   statement {
#     actions   = ["ssm:ListCommands", "ssm:ListCommandInvocations", "ssm:GetCommandInvocation"]
#     resources = ["*"]

#     principals {
#       type        = "AWS"
#       identifiers = ["*"]
#     }
#   }
# }

# resource "aws_vpc_endpoint_policy" "ssm_commands_read_only" {
#   vpc_endpoint_id = aws_vpc_endpoint.ssm.id
#   policy          = data.aws_iam_policy_document.ssm_commands_read_only.json
# }

# Access policy for clients
data "aws_iam_policy_document" "ssm_client_access" {
  statement {
    actions = [
      "ssm:ListCommands",
      "ssm:ListCommandInvocations",
      "ssm:GetCommandInvocation",
      "ssm:PutInventory",
      "ssm:GetDocument",
      "ssm:UpdateInstanceAssociationStatus",
      "ssm:UpdateInstanceInformation",
      "ssm:DescribeInstanceProperties",
      "ssm:DescribeDocumentParameters",
      "ssm:ListInstanceAssociations",
      "ssmmessages:CreateControlChannel",
      "ssmmessages:CreateDataChannel",
      "ssmmessages:OpenControlChannel",
      "ssmmessages:OpenDataChannel",
      "ec2messages:AcknowledgeMessage",
      "ec2messages:DeleteMessage",
      "ec2messages:FailMessage",
      "ec2messages:GetEndpoint",
      "ec2messages:GetMessages",
      "ec2messages:SendReply"
    ]
    resources = ["*"]
  }

  statement {
    actions = ["s3:GetObject"]

    resources = [
      "arn:aws:s3:::aws-ssm-${data.aws_region.current.name}/*",
      "arn:aws:s3:::aws-windows-downloads-${data.aws_region.current.name}/*",
      "arn:aws:s3:::amazon-ssm-${data.aws_region.current.name}/*",
      "arn:aws:s3:::amazon-ssm-packages-${data.aws_region.current.name}/*",
      "arn:aws:s3:::${data.aws_region.current.name}-birdwatcher-prod/*",
      "arn:aws:s3:::aws-ssm-distributor-file-${data.aws_region.current.name}/*",
      "arn:aws:s3:::aws-ssm-document-attachments-${data.aws_region.current.name}/*",
      "arn:aws:s3:::patch-baseline-snapshot-${data.aws_region.current.name}/*"
    ]
  }

  statement {
    actions   = ["s3:GetObject", "s3:PutObject", "s3:PutObjectAcl", "s3:GetEncryptionConfiguration"]
    resources = [aws_s3_bucket.ssm.arn, "${aws_s3_bucket.ssm.arn}/*"]
  }
}

resource "aws_iam_policy" "ssm_client_access" {
  name   = "${data.aws_region.current.name}-${var.environment}-ssm-client-access"
  policy = data.aws_iam_policy_document.ssm_client_access.json
}
