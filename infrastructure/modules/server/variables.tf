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
