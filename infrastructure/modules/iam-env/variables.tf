variable "environment" {
  type = string
}

variable "ecr_repo_arns" {
  type = list(string)
}

variable "organization" {
  type = string
}

variable "workspace" {
  type = string
}

variable "project" {
  type = string
  default = "Default Project"
}
