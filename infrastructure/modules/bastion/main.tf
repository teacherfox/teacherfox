locals {
  bastion_ami_id = "ami-07b1ee62009c93962"
}

data "aws_region" "current" {}

data "aws_iam_policy_document" "bastion_ec2_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

data "archive_file" "bastion_ansible" {
  type        = "zip"
  output_path = "${path.module}/${var.environment}_bastion_ansible.zip"
  source_dir  = "${path.module}/playbooks/bastion"
}

resource "aws_s3_object" "bastion_ansible" {
  bucket = var.ssm_bucket
  key    = "playbooks/bastion.zip"
  source = data.archive_file.bastion_ansible.output_path
  etag   = filemd5(data.archive_file.bastion_ansible.output_path)
}

data "aws_ssm_document" "bastion_ansible" {
  name            = "AWS-ApplyAnsiblePlaybooks"
  document_format = "JSON"
}

resource "aws_ssm_association" "bastion_ansible" {
  association_name    = "${var.environment}-bastion-ansible"
  name                = data.aws_ssm_document.bastion_ansible.name
  schedule_expression = "rate(1 hour)"

  parameters = {
    SourceType          = "S3"
    SourceInfo          = jsonencode({ path = "https://s3.amazonaws.com/${var.ssm_bucket}/playbooks/bastion.zip" })
    InstallDependencies = "True"
    PlaybookFile        = "main.yml"
    ExtraVariables      = "SSM=True"
  }

  targets {
    key    = "tag:Name"
    values = ["${var.environment}-bastion"]
  }
}

resource "aws_iam_role" "bastion" {
  name               = "${data.aws_region.current.name}-${var.environment}-bastion"
  assume_role_policy = data.aws_iam_policy_document.bastion_ec2_assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "bastion_ssm_access" {
  role       = aws_iam_role.bastion.name
  policy_arn = var.ssm_client_access_policy_arn
}

resource "aws_iam_instance_profile" "bastion" {
  name = "${data.aws_region.current.name}-${var.environment}-bastion"
  role = aws_iam_role.bastion.name
}

resource "aws_security_group" "bastion" {
  name        = var.environment == "staging" ? "BASTION-STG" : "${var.environment}-bastion"
  description = var.environment == "staging" ? "staging bastion" : "Managed by ${var.environment == "production" ? "T" : "t"}erraform"
  vpc_id      = var.vpc_id
  tags        = { Name = "${var.environment}-bastion" }
}

resource "aws_security_group_rule" "bastion_ssh_ingress" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
  security_group_id = aws_security_group.bastion.id
}

resource "aws_security_group_rule" "bastion_ingress_delete_me" {
  type              = "ingress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
  security_group_id = aws_security_group.bastion.id
}

resource "aws_security_group_rule" "bastion_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
  security_group_id = aws_security_group.bastion.id
}


resource "aws_launch_template" "bastion" {
  name                   = "${var.environment}-bastion"
  image_id               = local.bastion_ami_id
  instance_type          = var.environment == "production" ? "t4g.small" : var.environment == "staging" ? "t4g.small" : "t4g.nano"
  vpc_security_group_ids = [aws_security_group.bastion.id, var.ssm_client_security_group_id]

  iam_instance_profile {
    arn = aws_iam_instance_profile.bastion.arn
  }

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
    instance_metadata_tags      = "enabled"
  }

  block_device_mappings {
    device_name = "/dev/sda1"

    ebs {
      volume_size           = 8
      delete_on_termination = true
      encrypted             = true
      throughput            = 125
      iops                  = 3000
      volume_type           = "gp3"
    }
  }
}

resource "aws_autoscaling_group" "bastion" {
  name                  = "${var.environment}-bastion"
  max_size              = 1
  min_size              = 1
  vpc_zone_identifier   = var.public_subnet_ids
  protect_from_scale_in = false

  launch_template {
    id      = aws_launch_template.bastion.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.environment}-bastion"
    propagate_at_launch = true
  }

  dynamic "tag" {
    for_each = var.base_tags

    content {
      key                 = tag.key
      value               = tag.value
      propagate_at_launch = true
    }
  }
}

# Now we need to associate the elastic ip on boot
resource "aws_eip" "bastion_eip" {
  domain = "vpc"
  tags   = { Name = "${var.environment}-bastion" }
}

module "bastion_eip_associater" {
  source                 = "../eip_associater"
  autoscaling_group_name = aws_autoscaling_group.bastion.name
  environment            = var.environment
  name                   = "bastion"
  eip_id                 = aws_eip.bastion_eip.id
}
