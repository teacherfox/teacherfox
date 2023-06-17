locals {
  domain = "teacherfox.com.cy"
}

resource "aws_route53_zone" "teacherfox" {
  name         = var.environment == "prod" ? local.domain : "${var.environment}.${local.domain}"
}

resource "aws_route53_record" "zoho_verification" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.teacherfox.zone_id
  name    = ""
  type    = "TXT"
  ttl     = "86400"
  records = ["zoho-verification=zb82681392.zmverify.zoho.eu", "v=spf1 include:zoho.eu ~all"]
}

resource "aws_route53_record" "dkim" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.teacherfox.zone_id
  name    = "teacherfox._domainkey"
  type    = "TXT"
  ttl     = "86400"
  records = ["v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCLom4XYPxiyGVy/3skOMfvamHOOlnrQs/ZhKo1hVciQmJlGlG4U1HHGsFs8+9EchpaXYofFb35k7HvbpVn1274L7rIKtHZoQaAPkIQ9tMyVoE3eadIEhPZHvmEn6RBh5tScIU2OZS2pcwc5iufnPvUyOfSe/a+NJ9prkww2dXNbwIDAQAB"]
}

resource "aws_route53_record" "mail" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.teacherfox.zone_id
  name    = ""
  type    = "MX"
  ttl     = "300"
  records = ["10 mx.zoho.eu.", "20 mx2.zoho.eu.", "50 mx2.zoho.eu."]
}
