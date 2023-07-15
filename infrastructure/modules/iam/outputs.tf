output "github_openid_connect_provider_arn" {
  value = aws_iam_openid_connect_provider.github.arn
}

output "github_provider_url" {
  value = local.github_provider_url
}

output "github_audience" {
  value = local.github_audience
}
