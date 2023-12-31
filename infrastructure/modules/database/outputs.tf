################################################################################
# DB Subnet Group
################################################################################

output "db_subnet_group_name" {
  description = "The db subnet group name"
  value       = aws_db_subnet_group.db_subnet_group.name
}

################################################################################
# Cluster
################################################################################

output "cluster_arn" {
  description = "Amazon Resource Name (ARN) of cluster"
  value       = try(aws_rds_cluster.this.arn, null)
}

output "cluster_id" {
  description = "The RDS Cluster Identifier"
  value       = try(aws_rds_cluster.this.id, null)
}

output "cluster_resource_id" {
  description = "The RDS Cluster Resource ID"
  value       = try(aws_rds_cluster.this.cluster_resource_id, null)
}

output "cluster_members" {
  description = "List of RDS Instances that are a part of this cluster"
  value       = try(aws_rds_cluster.this.cluster_members, null)
}

output "cluster_endpoint" {
  description = "Writer endpoint for the cluster"
  value       = try(aws_rds_cluster.this.endpoint, null)
}

output "cluster_reader_endpoint" {
  description = "A read-only endpoint for the cluster, automatically load-balanced across replicas"
  value       = try(aws_rds_cluster.this.reader_endpoint, null)
}

output "cluster_engine_version_actual" {
  description = "The running version of the cluster database"
  value       = try(aws_rds_cluster.this.engine_version_actual, null)
}

# database_name is not set on `aws_rds_cluster` resource if it was not specified, so can't be used in output
output "cluster_database_name" {
  description = "Name for an automatically created database on cluster creation"
  value       = aws_rds_cluster.this.database_name
}

output "cluster_port" {
  description = "The database port"
  value       = try(aws_rds_cluster.this.port, null)
}

output "cluster_master_password" {
  description = "The database master password"
  value       = try(aws_rds_cluster.this.master_password, null)
  sensitive   = true
}

output "cluster_master_username" {
  description = "The database master username"
  value       = try(aws_rds_cluster.this.master_username, null)
  sensitive   = true
}

output "cluster_hosted_zone_id" {
  description = "The Route53 Hosted Zone ID of the endpoint"
  value       = try(aws_rds_cluster.this.hosted_zone_id, null)
}

output "cluster_url" {
    description = "The connection url to connect to the cluster"
    value       = aws_rds_cluster.this.endpoint
}


output "cluster_read_only_url" {
  description = "The connection url to connect to the cluster"
  value       = aws_rds_cluster.this.reader_endpoint
}

################################################################################
# Cluster Instance(s)
################################################################################

output "cluster_instances" {
  description = "A map of cluster instances and their attributes"
  value       = aws_rds_cluster_instance.this
}

################################################################################
# Cluster IAM Roles
################################################################################

output "cluster_role_associations" {
  description = "A map of IAM roles associated with the cluster and their attributes"
  value       = aws_rds_cluster_role_association.this
}

################################################################################
# Enhanced Monitoring
################################################################################

output "enhanced_monitoring_iam_role_name" {
  description = "The name of the enhanced monitoring role"
  value       = try(aws_iam_role.rds_enhanced_monitoring[0].name, null)
}

output "enhanced_monitoring_iam_role_arn" {
  description = "The Amazon Resource Name (ARN) specifying the enhanced monitoring role"
  value       = try(aws_iam_role.rds_enhanced_monitoring[0].arn, null)
}

output "enhanced_monitoring_iam_role_unique_id" {
  description = "Stable and unique string identifying the enhanced monitoring role"
  value       = try(aws_iam_role.rds_enhanced_monitoring[0].unique_id, null)
}

################################################################################
# CloudWatch Log Group
################################################################################

output "db_cluster_cloudwatch_log_groups" {
  description = "Map of CloudWatch log groups created and their attributes"
  value       = aws_cloudwatch_log_group.this
}

################################################################################
# Security Group
################################################################################

output "security_group_id" {
  description = "The ID of the security group"
  value       = aws_security_group.database.id
}

################################################################################
# Secret
################################################################################

output "urls_arn" {
  value = aws_secretsmanager_secret.urls.arn
}
