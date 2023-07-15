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

variable "server_task_role_policy_arn" {
  type = string
}
