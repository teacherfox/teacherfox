data "aws_region" "current" {}

locals {
  endpoint_regions     = [data.aws_region.current.name]
  availability_zones   = ["${data.aws_region.current.name}a", "${data.aws_region.current.name}b", "${data.aws_region.current.name}c"]
  cidr_block           = "10.1.0.0/16"
  public_cidr_blocks   = ["10.1.0.0/20", "10.1.16.0/20", "10.1.32.0/20"]
  private_cidr_blocks  = ["10.1.128.0/20", "10.1.144.0/20", "10.1.160.0/20"]
  database_cidr_blocks = ["10.1.176.0/20", "10.1.192.0/20", "10.1.208.0/20"]
}

resource "aws_vpc" "main" {
  cidr_block                       = local.cidr_block
  enable_dns_hostnames             = true
  enable_dns_support               = true
  assign_generated_ipv6_cidr_block = true
  tags                             = { Name = "${var.environment}-${var.organization}" }
}

resource "aws_default_security_group" "default" {
  vpc_id = aws_vpc.main.id
}

resource "aws_internet_gateway" "gateway" {
  vpc_id = aws_vpc.main.id
}

resource "aws_egress_only_internet_gateway" "gateway" {
  vpc_id = aws_vpc.main.id
}

# Public Subnets (These can connect to the internet and the internet can connect to them.)

resource "aws_route_table" "public_routes" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.environment}-public-routes" }
}

resource "aws_route" "public_routes_internet_gateway_ipv4" {
  route_table_id         = aws_route_table.public_routes.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.gateway.id
}

resource "aws_route" "public_routes_internet_gateway_ipv6" {
  route_table_id              = aws_route_table.public_routes.id
  destination_ipv6_cidr_block = "::/0"
  gateway_id                  = aws_internet_gateway.gateway.id
}

resource "aws_subnet" "public" {
  count                   = length(local.public_cidr_blocks)
  availability_zone       = element(local.availability_zones, count.index)
  cidr_block              = element(local.public_cidr_blocks, count.index)
  ipv6_cidr_block         = cidrsubnet(aws_vpc.main.ipv6_cidr_block, 8, count.index + 1)
  map_public_ip_on_launch = true
  tags                    = { Name = "${var.environment}-public${count.index}-${element(local.availability_zones, count.index)}" }
  vpc_id                  = aws_vpc.main.id
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = element(aws_subnet.public.*.id, count.index)
  route_table_id = aws_route_table.public_routes.id
}

# Private Subnets (These can connect to the internet, but the internet cannot directly connect to them.)

resource "aws_eip" "nat" {
  count  = var.multi_nat ? length(local.public_cidr_blocks) : 1
  domain = "vpc"
  tags   = { Name = "${var.environment}-eip-nat-${element(local.availability_zones, count.index)}" }
}

# Nat gateways are pretty expensive, for all our throwaway environments let's use our own that
resource "aws_nat_gateway" "nat" {
  count         = var.use_personal_nat ? 0 : length(aws_eip.nat)
  allocation_id = element(aws_eip.nat.*.id, count.index)
  subnet_id     = element(aws_subnet.public.*.id, count.index)
  tags          = { Name = "${var.environment}-nat-${element(local.availability_zones, count.index)}" }
}

module "personal_nat" {
  source        = "../personal_nat"
  count         = var.use_personal_nat ? length(aws_eip.nat) : 0
  environment   = var.environment
  allocation_id = element(aws_eip.nat.*.id, count.index)
  subnet_id     = element(aws_subnet.public.*.id, count.index)
  tags          = { Name = "${var.environment}-nat-${element(local.availability_zones, count.index)}" }
}

resource "aws_route_table" "private_routes" {
  count  = length(local.private_cidr_blocks)
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.environment}-private-${element(local.availability_zones, count.index)}" }
}

resource "aws_route" "private_nat_gateway" {
  count                  = var.use_personal_nat ? 0 : length(aws_route_table.private_routes)
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = element(aws_nat_gateway.nat.*.id, min(length(aws_nat_gateway.nat), count.index))
  route_table_id         = element(aws_route_table.private_routes.*.id, count.index)

  timeouts {
    create = "20m"
  }
}

resource "aws_route" "private_personal_nat_gateway" {
  count                  = var.use_personal_nat ? length(aws_route_table.private_routes) : 0
  destination_cidr_block = "0.0.0.0/0"
  network_interface_id   = element(module.personal_nat.*.eni_id, min(length(module.personal_nat), count.index))
  route_table_id         = element(aws_route_table.private_routes.*.id, count.index)

  timeouts {
    create = "20m"
  }
}

resource "aws_route" "private_ipv6_egress" {
  count                       = length(aws_route_table.private_routes)
  destination_ipv6_cidr_block = "::/0"
  egress_only_gateway_id      = aws_egress_only_internet_gateway.gateway.id
  route_table_id              = element(aws_route_table.private_routes.*.id, count.index)
}

resource "aws_subnet" "private" {
  count                   = length(local.private_cidr_blocks)
  availability_zone       = element(local.availability_zones, count.index)
  cidr_block              = element(local.private_cidr_blocks, count.index)
  map_public_ip_on_launch = false
  tags                    = { Name = "${var.environment}-private-${element(local.availability_zones, count.index)}" }
  vpc_id                  = aws_vpc.main.id
}

resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private)
  route_table_id = aws_route_table.private_routes[count.index].id
  subnet_id      = element(aws_subnet.private.*.id, count.index)
}

# Database subnets (These are not connected to the internet)

resource "aws_route_table" "database_routes" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.environment}-database" }
}

resource "aws_subnet" "database" {
  count                   = length(local.database_cidr_blocks)
  availability_zone       = element(local.availability_zones, count.index)
  cidr_block              = element(local.database_cidr_blocks, count.index)
  map_public_ip_on_launch = false
  tags                    = { Name = "${var.environment}-database-${element(local.availability_zones, count.index)}" }
  vpc_id                  = aws_vpc.main.id
}

resource "aws_route_table_association" "database" {
  count          = length(aws_subnet.database)
  route_table_id = aws_route_table.database_routes.id
  subnet_id      = element(aws_subnet.database.*.id, count.index)
}

# Aws Vpc Endpoints

locals {
  route_table_ids = concat(
    [aws_route_table.public_routes.id, aws_route_table.database_routes.id],
    aws_route_table.private_routes.*.id,
  )
}

resource "aws_security_group" "endpoint_interface" {
  name        = "${var.environment}-endpoint-interface"
  description = "ingress and egress for http(s) to the vpc for interface endpoints"
  vpc_id      = aws_vpc.main.id
  tags        = { Name = "${var.environment}-endpoint-interface" }
}

resource "aws_security_group_rule" "interface_ingress_all" {
  type              = "ingress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = [aws_vpc.main.cidr_block]
  ipv6_cidr_blocks  = [aws_vpc.main.ipv6_cidr_block]
  security_group_id = aws_security_group.endpoint_interface.id
}

resource "aws_security_group_rule" "interface_egress_all" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
  security_group_id = aws_security_group.endpoint_interface.id
}

resource "aws_security_group_rule" "interface_http_tcp" {
  for_each          = toset(["ingress", "egress"])
  type              = each.key
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = [aws_vpc.main.cidr_block]
  ipv6_cidr_blocks  = [aws_vpc.main.ipv6_cidr_block]
  security_group_id = aws_security_group.endpoint_interface.id
}

resource "aws_security_group_rule" "interface_http_quic" {
  for_each          = toset(["ingress", "egress"])
  type              = each.key
  from_port         = 80
  to_port           = 80
  protocol          = "udp"
  cidr_blocks       = [aws_vpc.main.cidr_block]
  ipv6_cidr_blocks  = [aws_vpc.main.ipv6_cidr_block]
  security_group_id = aws_security_group.endpoint_interface.id
}

resource "aws_security_group_rule" "interface_https_tcp" {
  for_each          = toset(["ingress", "egress"])
  type              = each.key
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = [aws_vpc.main.cidr_block]
  ipv6_cidr_blocks  = [aws_vpc.main.ipv6_cidr_block]
  security_group_id = aws_security_group.endpoint_interface.id
}

resource "aws_security_group_rule" "interface_https_quic" {
  for_each          = toset(["ingress", "egress"])
  type              = each.key
  from_port         = 443
  to_port           = 443
  protocol          = "udp"
  cidr_blocks       = [aws_vpc.main.cidr_block]
  ipv6_cidr_blocks  = [aws_vpc.main.ipv6_cidr_block]
  security_group_id = aws_security_group.endpoint_interface.id
}

resource "aws_vpc_endpoint" "ec2" {
  for_each            = toset(local.endpoint_regions)
  vpc_id              = aws_vpc.main.id
  vpc_endpoint_type   = "Interface"
  service_name        = "com.amazonaws.${each.key}.ec2"
  subnet_ids          = aws_subnet.private.*.id
  security_group_ids  = [aws_security_group.endpoint_interface.id]
  private_dns_enabled = true
  tags                = { Name = "${var.environment}-${each.key}-ec2" }
}

resource "aws_vpc_endpoint" "ec2messages" {
  for_each            = toset(local.endpoint_regions)
  vpc_id              = aws_vpc.main.id
  vpc_endpoint_type   = "Interface"
  service_name        = "com.amazonaws.${each.key}.ec2messages"
  subnet_ids          = [aws_subnet.private[0].id]
  security_group_ids  = [aws_security_group.endpoint_interface.id]
  private_dns_enabled = true
  tags                = { Name = "${var.environment}-${each.key}-ec2messages" }
}

resource "aws_vpc_endpoint" "ecs" {
  for_each            = toset(local.endpoint_regions)
  vpc_id              = aws_vpc.main.id
  vpc_endpoint_type   = "Interface"
  service_name        = "com.amazonaws.${each.key}.ecs"
  subnet_ids          = aws_subnet.private.*.id
  security_group_ids  = [aws_security_group.endpoint_interface.id]
  private_dns_enabled = true
  tags                = { Name = "${var.environment}-${each.key}-ecs" }
}

resource "aws_vpc_endpoint" "kms" {
  for_each            = toset(local.endpoint_regions)
  vpc_id              = aws_vpc.main.id
  vpc_endpoint_type   = "Interface"
  service_name        = "com.amazonaws.${each.key}.kms"
  subnet_ids          = [aws_subnet.private[0].id]
  security_group_ids  = [aws_security_group.endpoint_interface.id]
  private_dns_enabled = true
  tags                = { Name = "${var.environment}-${each.key}-kms" }
}

resource "aws_vpc_endpoint" "logs" {
  for_each            = toset(local.endpoint_regions)
  vpc_id              = aws_vpc.main.id
  vpc_endpoint_type   = "Interface"
  service_name        = "com.amazonaws.${each.key}.logs"
  subnet_ids          = [aws_subnet.private[0].id]
  security_group_ids  = [aws_security_group.endpoint_interface.id]
  private_dns_enabled = true
  tags                = { Name = "${var.environment}-${each.key}-logs" }
}

resource "aws_vpc_endpoint" "qldb" {
  for_each            = toset(local.endpoint_regions)
  vpc_id              = aws_vpc.main.id
  vpc_endpoint_type   = "Interface"
  service_name        = "com.amazonaws.${each.key}.qldb.session"
  subnet_ids          = [aws_subnet.private[0].id]
  security_group_ids  = [aws_security_group.endpoint_interface.id]
  private_dns_enabled = true
  tags                = { Name = "${var.environment}-${each.key}-qldb" }
}

resource "aws_vpc_endpoint" "s3" {
  for_each          = toset(local.endpoint_regions)
  service_name      = "com.amazonaws.${each.key}.s3"
  vpc_id            = aws_vpc.main.id
  vpc_endpoint_type = "Gateway"
  route_table_ids   = local.route_table_ids
  tags              = { Name = "${var.environment}-${each.key}-s3" }
}

resource "aws_vpc_endpoint" "secretsmanager" {
  for_each            = toset(local.endpoint_regions)
  vpc_id              = aws_vpc.main.id
  vpc_endpoint_type   = "Interface"
  service_name        = "com.amazonaws.${each.key}.secretsmanager"
  subnet_ids          = aws_subnet.private.*.id
  security_group_ids  = [aws_security_group.endpoint_interface.id]
  private_dns_enabled = true
  tags                = { Name = "${var.environment}-${each.key}-secretsmanager" }
}

resource "aws_vpc_endpoint" "ecr_api" {
  for_each            = toset(local.endpoint_regions)
  vpc_id              = aws_vpc.main.id
  vpc_endpoint_type   = "Interface"
  service_name        = "com.amazonaws.${each.key}.ecr.api"
  subnet_ids          = aws_subnet.private.*.id
  security_group_ids  = [aws_security_group.endpoint_interface.id]
  private_dns_enabled = true
  tags                = { Name = "${var.environment}-${each.key}-ecr-api" }
}

resource "aws_vpc_endpoint" "ecr_dkr" {
  for_each            = toset(local.endpoint_regions)
  vpc_id              = aws_vpc.main.id
  vpc_endpoint_type   = "Interface"
  service_name        = "com.amazonaws.${each.key}.ecr.dkr"
  subnet_ids          = aws_subnet.private.*.id
  security_group_ids  = [aws_security_group.endpoint_interface.id]
  private_dns_enabled = true
  tags                = { Name = "${var.environment}-${each.key}-ecr-dkr" }
}

resource "aws_vpc_endpoint" "sqs" {
  for_each            = toset(local.endpoint_regions)
  vpc_id              = aws_vpc.main.id
  vpc_endpoint_type   = "Interface"
  service_name        = "com.amazonaws.${each.key}.sqs"
  subnet_ids          = aws_subnet.private.*.id
  security_group_ids  = [aws_security_group.endpoint_interface.id]
  private_dns_enabled = true
  tags                = { Name = "${var.environment}-${each.key}-sqs" }
}

resource "aws_vpc_endpoint" "ssmmessages" {
  for_each            = toset(local.endpoint_regions)
  vpc_id              = aws_vpc.main.id
  vpc_endpoint_type   = "Interface"
  service_name        = "com.amazonaws.${each.key}.ssmmessages"
  subnet_ids          = aws_subnet.private.*.id
  security_group_ids  = [aws_security_group.endpoint_interface.id]
  private_dns_enabled = true
  tags                = { Name = "${var.environment}-${each.key}-ssmmessages" }
}
