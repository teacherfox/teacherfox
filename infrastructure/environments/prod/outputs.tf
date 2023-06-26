output "developers" {
  value = module.iam.developers
}

output "zone_id" {
  value = module.route53.zone_id
}

output "github_openid_connect_provider_arn" {
  value = module.iam.github_openid_connect_provider_arn
}
