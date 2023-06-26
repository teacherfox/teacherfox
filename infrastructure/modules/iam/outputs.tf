output "developers" {
  value = concat(local.developers, local.administrators)
}

output "github_openid_connect_provider_arn" {
  value = aws_iam_openid_connect_provider.github.arn
}
