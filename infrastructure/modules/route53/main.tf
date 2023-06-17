locals {
  domain = "teacherfox.com.cy"
}

resource "aws_route53_zone" "teacherfox" {
  name         = var.environment == "production" ? local.domain : "${var.environment}.${local.domain}"
}

resource "aws_route53_record" "zoho_verification" {
  count   = var.environment == "production" ? 1 : 0
  zone_id = aws_route53_zone.teacherfox.zone_id
  name    = "zoho_verification"
  type    = "TXT"
  ttl     = "86400"
  records = ["zoho-verification=zb82681392.zmverify.zoho.eu", "v=spf1 include:zoho.eu ~all"]
}

resource "aws_route53_record" "mail" {
  count   = var.environment == "production" ? 1 : 0
  zone_id = aws_route53_zone.teacherfox.zone_id
  name    = "mail"
  type    = "MX"
  ttl     = "300"
  records = ["10 mx.zoho.eu.", "20 mx2.zoho.eu.", "50 mx2.zoho.eu."]
}
