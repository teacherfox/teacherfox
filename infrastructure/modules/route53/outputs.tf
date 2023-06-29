output "zone_id" {
  value = aws_route53_zone.teacherfox.id
}

output "wildcard_certificate_arn" {
  value = aws_acm_certificate.wildcard.arn
}

output "domain_name" {
  value = aws_route53_zone.teacherfox.name
}
