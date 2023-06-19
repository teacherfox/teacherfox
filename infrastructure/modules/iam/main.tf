locals {
  users          = []
  developers     = ["nikos"]
  administrators = ["giorgos"]
}

data "aws_caller_identity" "current" {}

resource "aws_iam_policy" "user_bare_policy" {
  name        = "UserBare"
  path        = "/"
  description = "Minimum rights for any user, to force picking roles"

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Sid : "AllowViewAccountInfo"
        Effect : "Allow",
        Action = [
          "iam:ChangePassword",
          "iam:GetUser"
        ]
        Resource = "*"
      },
      {
        Sid : "AllowManageOwnAccessKeys"
        Effect : "Allow",
        Action = [
          "iam:CreateAccessKey",
          "iam:DeleteAccessKey",
          "iam:ListAccessKeys",
          "iam:UpdateAccessKey",
          "iam:GetAccessKeyLastUsed"
        ]
        Resource = [
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/$${aws:username}",
        ]
      },
      {
        Sid : "AllowManageOwnSigningCertificates"
        Effect : "Allow",
        Action = [
          "iam:DeleteSigningCertificate",
          "iam:ListSigningCertificates",
          "iam:UpdateSigningCertificate",
          "iam:UploadSigningCertificate"
        ]
        Resource = [
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/$${aws:username}",
        ]
      },
      {
        Sid : "AllowManageOwnSSHPublicKeys"
        Effect : "Allow",
        Action = [
          "iam:DeleteSSHPublicKey",
          "iam:GetSSHPublicKey",
          "iam:ListSSHPublicKeys",
          "iam:UpdateSSHPublicKey",
          "iam:UploadSSHPublicKey"
        ]
        Resource = [
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/$${aws:username}",
        ]
      },
      {
        Sid : "AllowManageOwnGitCredentials"
        Effect : "Allow",
        Action = [
          "iam:CreateServiceSpecificCredential",
          "iam:DeleteServiceSpecificCredential",
          "iam:ListServiceSpecificCredentials",
          "iam:ResetServiceSpecificCredential",
          "iam:UpdateServiceSpecificCredential"
        ]
        Resource = [
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/$${aws:username}",
        ]
      },
      {
        Sid : "AllowManageOwnUserMFA"
        Effect : "Allow",
        Action = [
          "iam:DeactivateMFADevice",
          "iam:EnableMFADevice",
          "iam:ListMFADevices",
          "iam:DeleteVirtualMFADevice",
          "iam:ResyncMFADevice"
        ]
        Resource = [
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:mfa/$${aws:username}"
        ]
      },
      {
        Sid : "AllowManageOwnVirtualMFADevice"
        Effect : "Allow",
        Action = [
          "iam:CreateVirtualMFADevice",
          "iam:DeleteVirtualMFADevice"
        ]
        Resource = [
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:mfa/*"
        ]
      },
      {
        Sid : "DenyAllExceptListedIfNoMFA"
        Effect : "Deny",
        NotAction = [
          "iam:CreateVirtualMFADevice",
          "iam:EnableMFADevice",
          "iam:GetUser",
          "iam:ListMFADevices",
          "iam:ListVirtualMFADevices",
          "iam:ResyncMFADevice",
          "iam:DeleteVirtualMFADevice",
          "sts:GetSessionToken"
        ]
        Resource = "*",
        Condition = {
          BoolIfExists : {
            "aws:MultiFactorAuthPresent" : "false"
          }
        }
      }
    ]
  })
}

resource "aws_iam_user" "users" {
  for_each      = toset(concat(local.developers, local.administrators))
  name          = each.key
  force_destroy = true
}

resource "aws_iam_user_policy_attachment" "bare_policy_attach" {
  for_each   = aws_iam_user.users
  user       = each.key
  policy_arn = aws_iam_policy.user_bare_policy.arn
}

data "aws_iam_policy_document" "instance_assume_role_policy" {
  version = "2012-10-17"
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"]
    }
    condition {
      test     = "Bool"
      values   = ["true"]
      variable = "aws:MultiFactorAuthPresent"
    }
  }
}

resource "aws_iam_policy" "developer_policy" {
  name        = "ReadToUseServices"
  path        = "/"
  description = "Minimum rights for any user, to force picking roles"

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Sid : "AllowViewAccountInfo"
        Effect : "Allow",
        Action = [
          "iam:ListAccountAliases"
        ]
        Resource = "*"
      },
      {
        Sid : "AllowReadAccessToUsingServices"
        Effect : "Allow",
        Action = [
          "ecr:List*",
          "ecr:Get*",
          "ecr:BatchGet*",
          "ecr:BatchCheck*",
          "ecr:Describe*"
        ]
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_role" "developer_role" {
  name        = "developer"
  description = "View access in all services, write access in non production services"
  max_session_duration = 43200
  assume_role_policy   = data.aws_iam_policy_document.instance_assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "developer_policy_attach" {
  role       = aws_iam_role.developer_role.name
  policy_arn = aws_iam_policy.developer_policy.arn
}

resource "aws_iam_policy" "developer_assume_policy" {
  name        = "DeveloperAssumePolicy"
  path        = "/"
  description = "Policy that allows developers to assume the developer role"

  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Sid : "DeveloperAssume"
        Effect : "Allow",
        Action   = ["sts:AssumeRole"]
        Resource = [
          aws_iam_role.developer_role.arn
        ]
      },
    ]
  })
}

resource "aws_iam_group" "developers_group" {
  name = "developers"
}

resource "aws_iam_group_policy_attachment" "developers_assume_policy_attach" {
  group      = aws_iam_group.developers_group.name
  policy_arn = aws_iam_policy.developer_assume_policy.arn
}

resource "aws_iam_user_group_membership" "developers_membership" {
  for_each = toset(local.developers)
  user     = each.key

  groups = [
    aws_iam_group.developers_group.name,
  ]
  depends_on = [aws_iam_user.users]
}

resource "aws_iam_role" "administrator_role" {
  name        = "admin"
  description = "Administrator access to all services"

  managed_policy_arns  = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  max_session_duration = 43200
  assume_role_policy   = data.aws_iam_policy_document.instance_assume_role_policy.json
}

resource "aws_iam_policy" "administrator_assume_policy" {
  name        = "AdministratorAssumePolicy"
  path        = "/"
  description = "Policy that allows administrators to assume the administrator role"

  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Sid : "DeveloperAssume"
        Effect : "Allow",
        Action   = ["sts:AssumeRole"]
        Resource = [
          aws_iam_role.administrator_role.arn
        ]
      },
    ]
  })
}

resource "aws_iam_group" "administrators_group" {
  name = "administrators"
}

resource "aws_iam_group_policy_attachment" "administrator_assume_policy_attach" {
  group      = aws_iam_group.administrators_group.name
  policy_arn = aws_iam_policy.administrator_assume_policy.arn
}

resource "aws_iam_user_group_membership" "administrators_membership" {
  for_each = toset(local.administrators)
  user     = each.key

  groups = [
    aws_iam_group.administrators_group.name,
  ]
  depends_on = [aws_iam_user.users]
}
