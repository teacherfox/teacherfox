variable "environment" {
  type = string
}

variable "ecr_repo_arns" {
  type = list(string)
}

variable "ecs_service_arns" {
  type = list(string)
}

variable "organization" {
  type = string
}

variable "github_openid_connect_provider_arn" {
  type = string
}
