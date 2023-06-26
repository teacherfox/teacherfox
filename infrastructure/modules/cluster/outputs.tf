output "ecr_repo_arns" {
  value = [module.server.ecr_repo_arn]
}

output "ecs_service_arns" {
  value = module.server.ecs_service_arns
}
