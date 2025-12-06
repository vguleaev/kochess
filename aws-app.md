# Kochess PWA - AWS Serverless Architecture

A modern, mobile-first Progressive Web App for load testing with AWS serverless infrastructure.

## 🎯 Architecture Overview

### Frontend Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool (10x faster than Next.js)
- **TanStack Router** - Type-safe routing with better DX than Next.js
- **TanStack Query** - Server state management for API calls
- **Zustand** - Client state management
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Mobile-optimized component library
- **PWA** - Offline support with service workers
- **Chart.js** - Data visualization

### Backend Stack

- **AWS Lambda** - Serverless functions for load testing
- **DynamoDB** - NoSQL database for test results
- **API Gateway** - RESTful API endpoints
- **Step Functions** - Long-running workflow orchestration
- **OpenAI API** - AI-powered test insights

### Infrastructure Stack

- **AWS CDK (TypeScript)** - Infrastructure as Code
- **S3** - Static website hosting
- **CloudFront** - Global CDN with edge caching
- **Cognito** - User authentication and authorization
- **Step Functions** - Workflow management for long-running tests

## 🚀 Why This Stack?

### Frontend Benefits

- ✅ **10x faster builds** (Vite vs Next.js)
- ✅ **Smaller bundle size** (100KB+ savings)
- ✅ **Better mobile support** (PWA + responsive design)
- ✅ **Type-safe routing** (TanStack Router)
- ✅ **Offline-first** (Service workers + caching)

### Backend Benefits

- ✅ **Serverless scaling** (Pay per request)
- ✅ **No server management** (AWS handles infrastructure)
- ✅ **Cost-effective** (Free tier covers most usage)
- ✅ **Global deployment** (CloudFront edge locations)

### Learning Benefits

- ✅ **Deep AWS knowledge** (CDK teaches core services)
- ✅ **Modern development** (Latest React patterns)
- ✅ **Production-ready** (Enterprise-grade architecture)
- ✅ **Transferable skills** (CDK → Terraform, Pulumi)

## 📱 Mobile-First PWA Features

### Progressive Web App Capabilities

- **Offline Support** - App works without internet
- **App-like Experience** - Standalone mode, no browser UI
- **Push Notifications** - Test completion alerts
- **Background Sync** - Queue actions when offline
- **Install Prompt** - Add to home screen

### Mobile-Optimized Components

- **Touch-friendly** - 44px+ touch targets
- **Responsive design** - Mobile-first approach
- **Gesture support** - Swipe, pinch, tap interactions
- **Performance** - Optimized for mobile networks

## 🏗️ AWS Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CloudFront    │    │   S3 Bucket     │    │   API Gateway   │
│   (CDN + SSL)   │◄───┤   (Static Site) │    │   (REST API)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                           │
         │                                           ▼
         │                                  ┌─────────────────┐
         │                                  │   Lambda        │
         │                                  │   Functions     │
         │                                  └─────────────────┘
         │                                           │
         │                                           ▼
         │                                  ┌─────────────────┐
         │                                  │   DynamoDB      │
         │                                  │   (Database)    │
         │                                  └─────────────────┘
         │                                           │
         │                                           ▼
         │                                  ┌─────────────────┐
         │                                  │   Step Functions│
         │                                  │   (Workflows)   │
         │                                  └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Cognito       │
│   (Auth)        │
└─────────────────┘
```

## 💰 AWS Free Tier Usage (Frankfurt Region - eu-central-1)

All services listed below are **available in Frankfurt region** and eligible for free tier benefits.

| Service            | Free Tier Limit              | Duration       | Your Usage             |
| ------------------ | ---------------------------- | -------------- | ---------------------- |
| **S3**             | 5GB storage, 20k GET, 2k PUT | ✅ Always Free | ✅ Static hosting      |
| **CloudFront**     | 50GB transfer, 2M requests   | ✅ Always Free | ✅ CDN distribution    |
| **Lambda**         | 1M requests, 400k GB-seconds | ✅ Always Free | ✅ API functions       |
| **DynamoDB**       | 25GB storage, 25 RCU/WCU     | ✅ Always Free | ✅ Test results        |
| **API Gateway**    | 1M requests per month        | ⚠️ 12 Months   | ✅ REST endpoints      |
| **Cognito**        | 50k MAUs                     | ✅ Always Free | ✅ User authentication |
| **Step Functions** | 4k state transitions         | ✅ Always Free | ✅ Long-running tests  |

### Free Tier Analysis

**✅ Always Free Services (6/7):**

- S3, CloudFront, Lambda, DynamoDB, Cognito, Step Functions
- These services remain free indefinitely within the specified limits

**⚠️ 12-Month Free Tier (1/7):**

- **API Gateway**: Free for first 12 months only
- After 12 months: ~$3.50 per million requests (still very affordable)

**Estimated Monthly Cost:**

- **First 12 months**: $0 (fully covered by free tier)
- **After 12 months**: $0-3.50/month (only if exceeding API Gateway free tier)

**Note**: CloudFront free tier is **50GB transfer** (not 1TB as previously stated). This is sufficient for most small-to-medium applications, but monitor usage if you expect high traffic.

## 🌍 Frankfurt Region (eu-central-1) Compatibility

**✅ All services are fully available in Frankfurt region:**

- ✅ **S3** - Available in eu-central-1
- ✅ **CloudFront** - Global service, works with Frankfurt origin
- ✅ **Lambda** - Available in eu-central-1
- ✅ **DynamoDB** - Available in eu-central-1
- ✅ **API Gateway** - Available in eu-central-1
- ✅ **Cognito** - Available in eu-central-1
- ✅ **Step Functions** - Available in eu-central-1

**Regional Considerations:**

- All free tier benefits apply in Frankfurt region
- Data residency: Data stays within EU (GDPR compliant)
- Latency: Lower latency for EU users
- Pricing: Same free tier limits apply globally (except China regions)

**CDK Configuration for Frankfurt:**

```typescript
// Set region in CDK app
const app = new cdk.App();
new LoadTestingStack(app, 'LoadTestingStack', {
  env: {
    region: 'eu-central-1', // Frankfurt
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- AWS CLI configured
- AWS CDK installed

### Quick Start

```bash
# 1. Create Vite project
npm create vite@latest kochess -- --template react-ts
cd kochess

# 2. Install dependencies
npm install @tanstack/react-router @tanstack/react-query
npm install zustand chart.js react-chartjs-2
npm install tailwindcss @tailwindcss/typography
npm install @radix-ui/react-* lucide-react
npm install vite-plugin-pwa workbox-window

# 3. Set up CDK
npm install -g aws-cdk
cdk init app --language typescript

# 4. Bootstrap CDK (one-time setup)
cdk bootstrap

# 5. Deploy infrastructure
cdk deploy
```

## 📁 Project Structure

```
kochess/
├── src/
│   ├── components/          # React components
│   │   ├── ui/            # Shadcn/UI components
│   │   ├── charts/        # Chart.js components
│   │   └── forms/          # Form components
│   ├── pages/            # Route components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   ├── stores/           # Zustand stores
│   └── router.ts         # TanStack Router config
├── lambda/               # AWS Lambda functions
│   ├── kochess-app/      # Kochess app logic
│   ├── results/          # Results processing
│   └── auth/             # Authentication handlers
├── lib/                  # CDK infrastructure
│   └── kochess-stack.ts
├── dist/                 # Vite build output
└── cdk.json             # CDK configuration
```

## 🔧 Key Features

### PWA Features

- **Offline Mode** - Works without internet
- **Background Sync** - Queue tests when offline
- **Push Notifications** - Test completion alerts
- **Install Prompt** - Add to home screen
- **App-like UI** - Standalone mode

### AWS Integration

- **Serverless Backend** - Lambda + DynamoDB
- **Global CDN** - CloudFront edge caching
- **Authentication** - Cognito user management
- **Workflow Orchestration** - Step Functions
- **Cost Optimization** - Free tier friendly

## 📱 Mobile Optimization

### Responsive Design

```typescript
// Mobile-first approach
<div
  className="
  w-full p-4
  sm:p-6
  md:p-8
  lg:max-w-4xl lg:mx-auto
">
  <Card
    className="
    w-full
    sm:max-w-md
    md:max-w-lg
    lg:max-w-none
  ">
    {/* Content */}
  </Card>
</div>
```

### Touch Interactions

```typescript
// Mobile-optimized buttons
<Button
  className="
    w-full h-12
    text-base
    touch-manipulation
    active:scale-95
    transition-transform
  "
  size="lg">
  Start Load Test
</Button>
```

### PWA Manifest

```json
{
  "name": "Load Testing App",
  "short_name": "LoadTest",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#1f2937",
  "background_color": "#ffffff",
  "start_url": "/",
  "scope": "/"
}
```

## 🚀 Deployment

### CDK Stack Configuration

```typescript
// lib/load-testing-stack.ts
export class LoadTestingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Frontend (S3 + CloudFront)
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
    });

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new cloudfront.origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      // SPA routing support
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // Backend (Lambda + DynamoDB)
    const testResultsTable = new dynamodb.Table(this, 'TestResultsTable', {
      partitionKey: { name: 'testId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const loadTestLambda = new lambda.Function(this, 'LoadTestFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: testResultsTable.tableName,
        OPENAI_API_KEY: 'your-openai-key',
      },
      timeout: cdk.Duration.minutes(15),
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'LoadTestingApi');
    const testsResource = api.root.addResource('tests');
    testsResource.addMethod('POST', new apigateway.LambdaIntegration(loadTestLambda));

    // Authentication
    const userPool = new cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
    });

    // Deploy frontend
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('dist')],
      destinationBucket: websiteBucket,
      distribution,
    });
  }
}
```

### Deployment Commands

```bash
# Build frontend
npm run build

# Deploy infrastructure
cdk deploy

# Deploy frontend to S3
cdk deploy LoadTestingStack
```

## 📚 Learning Outcomes

### AWS Skills

- **CDK** - Infrastructure as Code with TypeScript
- **S3** - Object storage and static hosting
- **CloudFront** - CDN and edge computing
- **Lambda** - Serverless function development
- **DynamoDB** - NoSQL database design
- **API Gateway** - RESTful API development
- **Cognito** - User authentication
- **Step Functions** - Workflow orchestration

### Frontend Skills

- **Vite** - Modern build tooling
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management
- **PWA Development** - Progressive Web Apps
- **Mobile-first Design** - Responsive development

### DevOps Skills

- **Infrastructure as Code** - CDK patterns
- **CI/CD** - Automated deployments
- **Monitoring** - CloudWatch integration
- **Security** - IAM and Cognito

## 🔒 Security Considerations

### Authentication

- **Cognito User Pools** - Managed authentication
- **JWT Tokens** - Secure API access
- **Role-based Access** - User permissions

### API Security

- **API Gateway** - Request validation
- **Lambda Authorizers** - Custom authentication
- **CORS Configuration** - Cross-origin policies

### Data Protection

- **DynamoDB Encryption** - At-rest encryption
- **HTTPS Only** - Secure communication
- **Environment Variables** - Secret management

## 📊 Performance Optimization

### Frontend

- **Vite Build** - Optimized bundles
- **Code Splitting** - Lazy loading
- **Image Optimization** - WebP format
- **Caching Strategy** - Service worker

### Backend

- **Lambda Cold Starts** - Provisioned concurrency
- **DynamoDB** - Efficient queries
- **CloudFront** - Edge caching
- **API Gateway** - Request throttling

## 🎯 Next Steps

1. **Set up development environment**
2. **Create Vite project with dependencies**
3. **Configure CDK infrastructure**
4. **Build mobile-optimized components**
5. **Implement PWA features**
6. **Deploy to AWS**
7. **Add monitoring and analytics**

## 📖 Resources

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [Vite Documentation](https://vitejs.dev/)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Shadcn/UI Components](https://ui.shadcn.com/)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

---

**Ready to build a modern, scalable PWA with AWS serverless architecture!** 🚀
