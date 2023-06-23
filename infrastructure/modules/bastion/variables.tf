variable "environment" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "base_tags" {
  type = map(string)
}

variable "vpc_id" {
  type = string
}

variable "ssm_bucket" {
  type = string
}

variable "ssm_client_access_policy_arn" {
  type = string
}

variable "ssm_client_security_group_id" {
  type = string
}
