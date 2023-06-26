output "ecr_repo_arn" {
  value = aws_ecr_repository.ecr_repo.arn
}

output "ecs_service_arns" {
  value = ["arn:aws:ecs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:service/${var.cluster_name}/${aws_ecs_service.ecs_service.name}"]
}
