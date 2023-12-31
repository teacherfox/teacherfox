variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "bastion_security_group_id" {
  type = string
}

variable "database_subnet_ids" {
  type = list(string)
}

variable "service_subnet_ids" {
  type = list(string)
}

variable "lb_subnet_ids" {
  type = list(string)
}

variable "service_name" {
  type = string
}

variable "cluster_id" {
  type = string
}

variable "certificate_arn" {
  type = string
}

variable "cluster_name" {
  type = string
}

variable "github_role_name" {
  type = string
}

variable "domain_zone_id" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "min_instances" {
  type = number
}

variable "max_instances" {
  type = number
}

variable "route53_endpoint" {
  type = string
}

variable "create_database" {
  type = bool
}

variable "secrets" {
  type = set(string)
}

variable "mapped_secrets" {
  type = set(map(string))
}

variable "environment_variables" {
  type = map(string)
}

variable "task_role_policy_arn" {
  type = string
}
