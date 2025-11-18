# Kochess Backend

Serverless Lambda functions for the Kochess recipe management application.

## Project Structure

```
backend/
├── src/
│   ├── handlers/          # Lambda function handlers
│   │   ├── recipes/       # Recipe CRUD operations
│   │   ├── ai/            # AI-powered features
│   │   ├── users/         # User profile management
│   │   └── health.ts      # Health check endpoint
│   ├── lib/               # Shared utilities
│   │   ├── api-response.ts  # API Gateway response helpers
│   │   ├── auth.ts        # Authentication utilities
│   │   ├── dynamodb.ts    # DynamoDB client
│   │   └── openai.ts      # OpenAI client
│   └── types/             # TypeScript type definitions
├── dist/                  # Compiled JavaScript (generated)
└── package.json
```

## Lambda Handlers

### Recipes
- `create.ts` - Create a new recipe
- `get.ts` - Get a recipe by ID
- `list.ts` - List all recipes for a user
- `update.ts` - Update a recipe
- `delete.ts` - Delete a recipe

### AI Features
- `extract-calories.ts` - Extract calorie content from ingredients (async)
- `generate-recipe.ts` - Generate a recipe from ingredients

### Users
- `profile.ts` - Get/update user profile
- `onboarding.ts` - Complete user onboarding with calorie calculation

### Health
- `health.ts` - Health check endpoint

## Environment Variables

The following environment variables need to be set in your Lambda functions:

- `RECIPES_TABLE_NAME` - DynamoDB table name for recipes
- `USER_PROFILES_TABLE_NAME` - DynamoDB table name for user profiles
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `AWS_REGION` - AWS region (defaults to us-east-1)

## Building

```bash
# Build the backend
pnpm build

# Or from root
pnpm build:backend
```

## Development

The backend uses TypeScript and compiles to JavaScript in the `dist/` directory. Each handler is a separate Lambda function that should be deployed individually.

## Integration with CDK

When setting up your CDK infrastructure, you'll need to:

1. Create DynamoDB tables for recipes and user profiles
2. Create Lambda functions for each handler
3. Set up API Gateway routes
4. Configure environment variables
5. Set up IAM permissions for DynamoDB access

Example CDK setup:

```typescript
const recipesTable = new dynamodb.Table(this, 'RecipesTable', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
});

const createRecipeLambda = new lambda.Function(this, 'CreateRecipeFunction', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'handlers.recipes.create.handler',
  code: lambda.Code.fromAsset('backend/dist'),
  environment: {
    RECIPES_TABLE_NAME: recipesTable.tableName,
  },
});
```

