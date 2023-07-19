resource "aws_route53_zone" "com_zone" {
  count = var.environment == "prod" ? 1 : 0
  name         = "teacherfox.com"
}

resource "aws_route53_zone" "gr_zone" {
  count = var.environment == "prod" ? 1 : 0
  name         = "teacherfox.gr"
}

resource "aws_route53_record" "teacherfox_com" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.com_zone.zone_id[0]
  name    = ""
  type    = "CNAME"
  ttl     = "14400"
  records = ["teacherfox.com."]
}

resource "aws_route53_record" "teacherfox_com_a" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.com_zone.zone_id[0]
  name    = ""
  type    = "A"
  ttl     = "14400"
  records = ["185.138.42.92"]
}

resource "aws_route53_record" "teacherfox_com_ipv6_extra" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.com_zone.zone_id[0]
  name    = "ipv6"
  type    = "AAAA"
  ttl     = "14400"
  records = ["2a02:c500:1:128::1"]
}

resource "aws_route53_record" "teacherfox_com_ipv6" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.com_zone.zone_id[0]
  name    = ""
  type    = "AAAA"
  ttl     = "14400"
  records = ["2a02:c500:1:128::1"]
}

resource "aws_route53_record" "fast_mail" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.com_zone.zone_id[0]
  name    = ""
  type    = "TXT"
  ttl     = "14400"
  records = ["v=spf1 +a +mx include:_spf.fastmail.gr +ip6:2a02:c500:1:128::1 -all"]
}

resource "aws_route53_record" "teacherfox_com_ftp" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.com_zone.zone_id[0]
  name    = "ftp"
  type    = "CNAME"
  ttl     = "14400"
  records = ["teacherfox.com."]
}

resource "aws_route53_record" "teacherfox_com_webmail_a" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.com_zone.zone_id[0]
  name    = "webmail"
  type    = "A"
  ttl     = "14400"
  records = ["185.138.42.92"]
}

resource "aws_route53_record" "teacherfox_com_webmail_aaaa" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.com_zone.zone_id[0]
  name    = "webmail"
  type    = "AAAA"
  ttl     = "14400"
  records = ["2a02:c500:1:128::1"]
}

resource "aws_route53_record" "teacherfox_com_mail_a" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.com_zone.zone_id[0]
  name    = "mail"
  type    = "A"
  ttl     = "14400"
  records = ["185.138.42.92"]
}


resource "aws_route53_record" "teacherfox_com_mail_aaaa" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.com_zone.zone_id[0]
  name    = "mail"
  type    = "AAAA"
  ttl     = "14400"
  records = ["2a02:c500:1:128::1"]
}

resource "aws_route53_record" "teacherfox_com_mail" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.com_zone.zone_id[0]
  name    = ""
  type    = "MX"
  ttl     = "300"
  records = ["10 mail.teacherfox.com."]
}

resource "aws_route53_record" "teacherfox_com_autoconfig" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.com_zone.zone_id[0]
  name    = "autoconfig"
  type    = "CNAME"
  ttl     = "14400"
  records = ["linuxzone153.grserver.gr."]
}

resource "aws_route53_record" "teacherfox_com_acme_challenge" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.com_zone.zone_id[0]
  name    = "_acme-challenge"
  type    = "TXT"
  ttl     = "14400"
  records = ["_NP0BhgfIwfQJjowYP03EuXXxULfpKbHYan0lGCOSDk"]
}

resource "aws_route53_record" "teacherfox_com_autodiscover" {
  count   = var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.com_zone.zone_id[0]
  name    = "_autodiscover._tcp"
  type    = "SRV"
  ttl     = "14400"
  records = ["linuxzone153.grserver.gr."]
}
