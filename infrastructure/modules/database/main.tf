data "aws_partition" "current" {}

locals {
  port                         = 5432
  name                         = "${var.environment}-${var.service}"
  is_prod                      = var.environment == "prod"
  preferred_maintenance_window = "mon:02:30-mon:03:00"
}

data "aws_rds_engine_version" "postgresql" {
  engine  = "aurora-postgresql"
  version = "15.2"
}

################################################################################
# DB Subnet Group
################################################################################

resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "${var.environment}-${var.service}-database"
  subnet_ids = var.database_subnet_ids
}

################################################################################
# Cluster
################################################################################

resource "aws_rds_cluster" "this" {
  allow_major_version_upgrade         = !local.is_prod
  apply_immediately                   = !local.is_prod
  #  availability_zones                  = local.availability_zones
  cluster_identifier                  = local.name
  backup_retention_period             = 30
  database_name                       = replace(local.name, "-", "_")
  #  db_cluster_instance_class           = var.db_cluster_instance_class
  db_subnet_group_name                = aws_db_subnet_group.db_subnet_group.name
  deletion_protection                 = local.is_prod
  enabled_cloudwatch_logs_exports     = var.enabled_cloudwatch_logs_exports
  engine                              = data.aws_rds_engine_version.postgresql.engine
  engine_mode                         = "provisioned"
  engine_version                      = data.aws_rds_engine_version.postgresql.version
  final_snapshot_identifier           = "${local.name}-final"
  iam_database_authentication_enabled = var.iam_database_authentication_enabled
  manage_master_user_password         = true
  master_username                     = replace("${var.environment}-${var.service}", "-", "_")
  port                                = local.port
  preferred_maintenance_window        = local.preferred_maintenance_window
  replication_source_identifier       = var.replication_source_identifier

  serverlessv2_scaling_configuration {
    max_capacity = 1.0
    min_capacity = 0.5
  }

  skip_final_snapshot    = local.is_prod ? false : true
  storage_encrypted      = true
  vpc_security_group_ids = [aws_security_group.database.id]

  timeouts {
    create = try(var.cluster_timeouts.create, null)
    update = try(var.cluster_timeouts.update, null)
    delete = try(var.cluster_timeouts.delete, null)
  }

  lifecycle {
    ignore_changes = [
      # See https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/rds_cluster#replication_source_identifier
      # Since this is used either in read-replica clusters or global clusters, this should be acceptable to specify
      replication_source_identifier,
      # See docs here https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/rds_global_cluster#new-global-cluster-from-existing-db-cluster
      global_cluster_identifier,
      snapshot_identifier,
    ]
  }

  depends_on = [aws_cloudwatch_log_group.this]
}

################################################################################
# Cluster Instance(s)
################################################################################

resource "aws_rds_cluster_instance" "this" {
  for_each = {for k, v in var.instances : k => v}

  apply_immediately            = !local.is_prod
  cluster_identifier           = aws_rds_cluster.this.id
  db_subnet_group_name         = aws_db_subnet_group.db_subnet_group.name
  engine                       = data.aws_rds_engine_version.postgresql.engine
  engine_version               = data.aws_rds_engine_version.postgresql.version
  identifier                   = "${local.name}-${each.key}"
  instance_class               = "db.serverless"
  monitoring_interval          = local.is_prod ? 60 : 0
  monitoring_role_arn          = local.is_prod ? aws_iam_role.rds_enhanced_monitoring[0].arn : null
  performance_insights_enabled = local.is_prod ? true : false
  #  performance_insights_kms_key_id = var.performance_insights_kms_key_id
  preferred_maintenance_window = local.preferred_maintenance_window
}

################################################################################
# Cluster IAM Roles
################################################################################

resource "aws_rds_cluster_role_association" "this" {
  for_each = {for k, v in var.iam_roles : k => v}

  db_cluster_identifier = aws_rds_cluster.this.id
  feature_name          = each.value.feature_name
  role_arn              = each.value.role_arn
}

################################################################################
# Enhanced Monitoring
################################################################################

data "aws_iam_policy_document" "monitoring_rds_assume_role" {
  count = local.is_prod ? 1 : 0

  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["monitoring.rds.${data.aws_partition.current.dns_suffix}"]
    }
  }
}

resource "aws_iam_role" "rds_enhanced_monitoring" {
  count = local.is_prod ? 1 : 0

  name        = var.iam_role_name
  description = var.iam_role_description
  path        = var.iam_role_path

  assume_role_policy    = data.aws_iam_policy_document.monitoring_rds_assume_role[0].json
  managed_policy_arns   = var.iam_role_managed_policy_arns
  permissions_boundary  = var.iam_role_permissions_boundary
  force_detach_policies = var.iam_role_force_detach_policies
  max_session_duration  = var.iam_role_max_session_duration
}

resource "aws_iam_role_policy_attachment" "rds_enhanced_monitoring" {
  count = local.is_prod ? 1 : 0

  role       = aws_iam_role.rds_enhanced_monitoring[0].name
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}


################################################################################
# Security Group
################################################################################

resource "aws_security_group" "database" {
  name        = "${var.environment}-${var.service}-database"
  description = "database security group"
  vpc_id      = var.vpc_id
  tags        = { Name = "${var.environment}-${var.service}-database" }
}

resource "aws_security_group_rule" "database_bastion_ssh_ingress" {
  type                     = "ingress"
  from_port                = 22
  to_port                  = 22
  protocol                 = "tcp"
  security_group_id        = aws_security_group.database.id
  source_security_group_id = var.bastion_security_group_id
}

resource "aws_security_group_rule" "database_bastion" {
  for_each                 = toset(["ingress", "egress"])
  type                     = each.key
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.database.id
  source_security_group_id = var.bastion_security_group_id
}

resource "aws_security_group_rule" "database_internal" {
  for_each                 = toset(["ingress", "egress"])
  type                     = each.key
  from_port                = 0
  to_port                  = 65535
  protocol                 = "-1"
  security_group_id        = aws_security_group.database.id
  source_security_group_id = aws_security_group.database.id
}

resource "aws_security_group_rule" "database_service" {
  for_each                 = toset(["ingress", "egress"])
  type                     = each.key
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.database.id
  source_security_group_id = var.service_security_group_id
}

################################################################################
# CloudWatch Log Group
################################################################################

# Log groups will not be created if using a cluster identifier prefix
resource "aws_cloudwatch_log_group" "this" {
  for_each = toset([for log in var.enabled_cloudwatch_logs_exports : log if var.create_cloudwatch_log_group])

  name              = "/aws/rds/cluster/${local.name}/${each.value}"
  retention_in_days = var.cloudwatch_log_group_retention_in_days
  kms_key_id        = var.cloudwatch_log_group_kms_key_id
}
