output "ssm_bucket" {
  value = aws_s3_bucket.ssm.id
}

output "ssm_client_access_policy_arn" {
  value = aws_iam_policy.ssm_client_access.arn
}

output "ssm_client_security_group_id" {
  value = aws_security_group.ssm_client.id
}
