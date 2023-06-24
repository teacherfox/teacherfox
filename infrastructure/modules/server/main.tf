resource "aws_security_group" "server_security_group" {
  name   = "${var.environment}-server"
  vpc_id = var.vpc_id
  tags   = { Name = "${var.environment}-server" }
}

module "database" {
  source = "../database"

  environment               = var.environment
  bastion_security_group_id = var.bastion_security_group_id
  database_subnet_ids       = var.database_subnet_ids
  instances                 = {
    one = {}
  }
  service                   = "server"
  service_security_group_id = aws_security_group.server_security_group.id
  vpc_id                    = var.vpc_id
}
