variable "environment" {
  type = string
}

variable "allocation_id" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "tags" {
  type    = map(any)
  default = {}
}

# Build from fck-nat
variable "ami_id" {
  type    = string
  default = "ami-0825bb144d7b66fa4"
}

variable "instance_type" {
  type    = string
  default = "t4g.nano"
}
