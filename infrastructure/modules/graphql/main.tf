resource "aws_ecr_repository" "graphql" {
  name                 = "${var.environment}-graphql"
  image_tag_mutability = "MUTABLE"
  force_delete         = var.environment == "prod" ? false : true

  image_scanning_configuration {
    scan_on_push = true
  }
}
