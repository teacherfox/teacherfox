resource "aws_ecs_cluster" "teacherfox" {
  name = "${var.environment}-${var.organization}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_cluster_capacity_providers" "capacity_providers" {
  cluster_name       = aws_ecs_cluster.teacherfox.name
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]
}

module "server" {
  source = "../service"
  bastion_security_group_id = var.bastion_security_group_id
  certificate_arn = var.certificate_arn
  cluster_id = aws_ecs_cluster.teacherfox.id
  database_subnet_ids = var.database_subnet_ids
  environment = var.environment
  lb_subnet_ids = var.lb_subnet_ids
  service_name = "server"
  service_subnet_ids = var.service_subnet_ids
  vpc_id = var.vpc_id
}
