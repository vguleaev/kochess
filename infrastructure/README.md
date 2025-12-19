# Kochess Infrastructure (AWS CDK)

CDK TypeScript project for deploying the Kochess App infrastructure to AWS.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Project structure

```
infrastructure/
├── bin/
│   └── infrastructure.ts          # App entry point
└── lib/
    ├── frontend-stack.ts          # S3, CloudFront (frontend)
    ├── backend-stack.ts           # Lambda, API Gateway, DynamoDB
    └── shared-stack.ts            # Shared resources (optional)
```

---

## ⚠️ AWS Account Setup

**IMPORTANT**: Never use your AWS root account for CDK deployments.

### Quick Setup

1. Create an IAM user with needed permissions

2. Configure AWS CLI profile:

```bash
aws configure --profile kochess
# Enter: access key, secret key, region: eu-central-1
```

3. Bootstrap CDK (one-time setup):

```bash
cdk bootstrap --profile kochess
```

## 🔧 AWS CLI Cheat Sheet

### Configure AWS User

```bash
# Configure default profile (uses ~/.aws/credentials)
aws configure

# Configure named profile
aws configure --profile kochess

# You'll be prompted for:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region name (e.g., eu-central-1)
# - Default output format (json)
```

### Check Current Identity

```bash
# See who you are (current user/role)
aws sts get-caller-identity

# See current profile
aws configure list

# See all configured profiles
cat ~/.aws/credentials

# See profile configuration
aws configure list --profile kochess
```

### What is an AWS Profile?

**AWS Profile** = Named set of credentials and settings stored in `~/.aws/credentials` and `~/.aws/config`.

**Why use profiles?**

- Switch between different AWS accounts/users
- Keep credentials organized
- Avoid mixing dev/prod credentials
- Work with multiple projects

**Profile locations:**

- Credentials: `~/.aws/credentials`
- Config: `~/.aws/config`

**Example profile structure:**

```ini
# ~/.aws/credentials
[default]
aws_access_key_id = AKIA...
aws_secret_access_key = ...

[kochess]
aws_access_key_id = AKIA...
aws_secret_access_key = ...

[kochess-dev]
aws_access_key_id = AKIA...
aws_secret_access_key = ...
```

### Using Profiles

```bash
# Use default profile
aws s3 ls
cdk deploy

# Use specific profile
aws s3 ls --profile kochess
cdk deploy --profile kochess

# Set profile via environment variable
export AWS_PROFILE=kochess
aws s3 ls
cdk deploy

# Temporarily use profile for one command
AWS_PROFILE=kochess aws s3 ls
```

### Common Profile Operations

```bash
# List all profiles
aws configure list-profiles

# View profile details
aws configure get region --profile kochess
aws configure get aws_access_key_id --profile kochess

# Remove profile (edit ~/.aws/credentials manually)
# Or use: aws configure --profile kochess (then leave fields empty)
```

## Deployment

### Using AWS Profile

```bash
# Deploy to default profile
cdk deploy

# Deploy with specific profile
cdk deploy --profile kochess

# Deploy to specific environment
ENVIRONMENT=dev cdk deploy --profile kochess-dev
ENVIRONMENT=prod cdk deploy --profile kochess-prod
```

### Using Environment Variables

```bash
export AWS_PROFILE=kochess
export CDK_DEFAULT_REGION=eu-central-1
export ENVIRONMENT=dev

cdk deploy
```

## Configuration

The stack is configured via environment variables:

- `ENVIRONMENT`: Environment name (dev, staging, prod) - defaults to 'dev'
- `CDK_DEFAULT_REGION`: AWS region - defaults to 'eu-central-1'
- `CDK_DEFAULT_ACCOUNT`: AWS account ID - auto-detected from AWS CLI

## Stack Tags

All resources are tagged with:

- `Environment`: The environment name (dev/staging/prod)
- `Project`: 'kochess'
- `ManagedBy`: 'CDK'

## CI/CD Setup

GitHub Actions workflows are available in `.github/workflows/`:

- `deploy-infrastructure.yml` - Uses IAM User with access keys (simpler)
- `deploy-infrastructure-oidc.yml.example` - Uses IAM Role with OIDC (more secure)

See [AWS_ACCOUNT_SETUP.md](./AWS_ACCOUNT_SETUP.md) for detailed CI/CD setup instructions.
