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

variable "certificate_arn" {
  type = string
}

variable "lb_subnet_ids" {
  type = list(string)
}

variable "organization" {
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

variable "ses_identity_arn" {
  type = string
}
