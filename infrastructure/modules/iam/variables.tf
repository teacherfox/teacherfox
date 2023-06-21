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
