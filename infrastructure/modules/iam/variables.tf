variable "environments" {
  type = set(string)
}

variable "organization" {
  type = string
}

variable "project" {
  type = string
  default = "Default Project"
}

variable "task_role_policies_arn" {
  type = list(string)
}
