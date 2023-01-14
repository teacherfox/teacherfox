# TeacherFox

A bunch of cool staff for teachers.

## Development Setup

### Prerequisites

- [postgres](https://www.postgresql.org/download/)
- [pnpm](https://pnpm.io/installation)

### Setup

1. Clone the repo
2. Create a db named `teacherfox` in postgres
3. Create a `.env` file in the apps/graphql directory and add the following variables:

```
DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@localhost:5432/teacherfox?schema=public&connection_limit=5"
```

4. Run `pnpm i`
5. Run `pnpm run dev`

### Additional setup based on your role

#### Terraform

1. Install [terraform-cli](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)

#### AWS

1. Install [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
