output "public_subnet_ids" {
  value = aws_subnet.public.*.id
}

output "private_subnet_ids" {
  value = aws_subnet.private.*.id
}

output "id" {
  value = aws_vpc.main.id
}

output "endpoint_interface_id" {
  value = aws_security_group.endpoint_interface.id
}

output "database_subnet_ids" {
  value = aws_subnet.database.*.id
}
