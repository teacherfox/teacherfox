resource "aws_s3_bucket" "to_be_destroyed_bucket" {
  bucket = "${var.environment}-some-forsaken-bucket"
}
