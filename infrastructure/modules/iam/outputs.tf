output "developers" {
  value = concat(local.developers, local.administrators)
}
