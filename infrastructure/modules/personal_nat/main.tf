data "aws_region" "current" {}

data "aws_subnet" "subnet" {
  id = var.subnet_id
}

data "aws_vpc" "vpc" {
  id = data.aws_subnet.subnet.vpc_id
}

resource "aws_security_group" "nat" {
  name_prefix = "${var.environment}-nat"
  description = "Security Group for NAT Instance"
  vpc_id      = data.aws_subnet.subnet.vpc_id
  tags        = var.tags
}

resource "aws_security_group_rule" "egress" {
  description       = "Allow all egress traffic"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"] #tfsec:ignore:AWS007
  security_group_id = aws_security_group.nat.id
  type              = "egress"
}

resource "aws_security_group_rule" "ingress" {
  description       = "Allow ingress traffic from the VPC CIDR block"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = [data.aws_vpc.vpc.cidr_block]
  security_group_id = aws_security_group.nat.id
  type              = "ingress"
}

resource "aws_network_interface" "nat" {
  subnet_id         = data.aws_subnet.subnet.id
  security_groups   = [aws_security_group.nat.id]
  source_dest_check = false # Required for a nat
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "nat" {
  name_prefix        = "${data.aws_region.current.name}-${var.environment}-nat-"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

resource "aws_iam_instance_profile" "nat" {
  name = aws_iam_role.nat.name
  role = aws_iam_role.nat.name
}

resource "aws_launch_template" "nat" {
  name          = "nat-${aws_network_interface.nat.id}"
  image_id      = var.ami_id
  instance_type = var.instance_type
  tags          = var.tags

  iam_instance_profile {
    arn = aws_iam_instance_profile.nat.arn
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

  network_interfaces {
    device_index         = 0
    network_interface_id = aws_network_interface.nat.id
  }
}

resource "aws_autoscaling_group" "nat" {
  name                  = "${var.environment}-nat-${aws_network_interface.nat.id}"
  desired_capacity      = 1
  max_size              = 1
  min_size              = 1
  availability_zones    = [data.aws_subnet.subnet.availability_zone]
  protect_from_scale_in = false

  launch_template {
    id      = aws_launch_template.nat.id
    version = "$Latest"
  }

  dynamic "tag" {
    for_each = merge({ Name = "${var.environment}-nat-${aws_network_interface.nat.id}" }, var.tags)

    content {
      key                 = tag.key
      value               = tag.value
      propagate_at_launch = true
    }
  }
}

module "bastion_eip_associater" {
  source                 = "../eip_associater"
  autoscaling_group_name = aws_autoscaling_group.nat.name
  environment            = var.environment
  name                   = substr("nat-${aws_network_interface.nat.id}", 0, 10)
  eip_id                 = var.allocation_id
}
