variable "environment" {
  type = string
}

variable "organization" {
  type = string
}

variable "multi_nat" {
  type    = bool
  default = false
}

variable "use_personal_nat" {
  type    = bool
  default = false
}
