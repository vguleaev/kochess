import * as cdk from 'aws-cdk-lib/core';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambdaCore from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as path from 'path';
import { Construct } from 'constructs';
import { Config } from './config';

export class BackendStack extends cdk.Stack {
  public readonly recipesTable: dynamodb.Table;
  public readonly listRecipesLambda: lambda.NodejsFunction;
  public readonly createRecipeLambda: lambda.NodejsFunction;
  public readonly getRecipeLambda: lambda.NodejsFunction;
  public readonly updateRecipeLambda: lambda.NodejsFunction;
  public readonly deleteRecipeLambda: lambda.NodejsFunction;
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.recipesTable = new dynamodb.Table(this, 'RecipesTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    cdk.Tags.of(this.recipesTable).add('Name', 'kochess-recipes-table');

    this.recipesTable.addGlobalSecondaryIndex({
      indexName: 'userId-index',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const lambdaEnvironment = {
      RECIPES_TABLE_NAME: this.recipesTable.tableName,
    };

    const lambdaProps: lambda.NodejsFunctionProps = {
      runtime: lambdaCore.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: lambdaEnvironment,
      bundling: {
        minify: true,
        sourceMap: true,
      },
    };

    this.listRecipesLambda = new lambda.NodejsFunction(this, 'ListRecipesLambda', {
      ...lambdaProps,
      entry: path.join(__dirname, '../../backend/src/handlers/recipes/list.ts'),
      handler: 'handler',
    });
    cdk.Tags.of(this.listRecipesLambda).add('Name', 'kochess-list-recipes');

    this.createRecipeLambda = new lambda.NodejsFunction(this, 'CreateRecipeLambda', {
      ...lambdaProps,
      entry: path.join(__dirname, '../../backend/src/handlers/recipes/create.ts'),
      handler: 'handler',
    });
    cdk.Tags.of(this.createRecipeLambda).add('Name', 'kochess-create-recipe');

    this.getRecipeLambda = new lambda.NodejsFunction(this, 'GetRecipeLambda', {
      ...lambdaProps,
      entry: path.join(__dirname, '../../backend/src/handlers/recipes/get.ts'),
      handler: 'handler',
    });
    cdk.Tags.of(this.getRecipeLambda).add('Name', 'kochess-get-recipe');

    this.updateRecipeLambda = new lambda.NodejsFunction(this, 'UpdateRecipeLambda', {
      ...lambdaProps,
      entry: path.join(__dirname, '../../backend/src/handlers/recipes/update.ts'),
      handler: 'handler',
    });
    cdk.Tags.of(this.updateRecipeLambda).add('Name', 'kochess-update-recipe');

    this.deleteRecipeLambda = new lambda.NodejsFunction(this, 'DeleteRecipeLambda', {
      ...lambdaProps,
      entry: path.join(__dirname, '../../backend/src/handlers/recipes/delete.ts'),
      handler: 'handler',
    });
    cdk.Tags.of(this.deleteRecipeLambda).add('Name', 'kochess-delete-recipe');

    this.recipesTable.grantReadData(this.listRecipesLambda);
    this.recipesTable.grantReadWriteData(this.createRecipeLambda);
    this.recipesTable.grantReadWriteData(this.getRecipeLambda);
    this.recipesTable.grantReadWriteData(this.updateRecipeLambda);
    this.recipesTable.grantReadWriteData(this.deleteRecipeLambda);

    this.api = new apigateway.RestApi(this, 'KochessApi', {
      restApiName: 'Kochess API',
      description: 'API for Kochess recipe management',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization', 'X-User-Id'],
      },
    });
    cdk.Tags.of(this.api).add('Name', 'kochess-api');

    const certificateArn = Config.get('CERTIFICATE_ARN');
    const apiDomainName = `api.${Config.get('DOMAIN_NAME')}`;

    const certificate = certificatemanager.Certificate.fromCertificateArn(this, 'ApiCertificate', certificateArn);

    const customDomain = new apigateway.DomainName(this, 'ApiDomainName', {
      domainName: apiDomainName,
      certificate: certificate,
      endpointType: apigateway.EndpointType.EDGE,
      securityPolicy: apigateway.SecurityPolicy.TLS_1_2,
    });

    customDomain.addBasePathMapping(this.api);

    const recipesResource = this.api.root.addResource('recipes');
    const recipeByIdResource = recipesResource.addResource('{id}');

    recipesResource.addMethod('GET', new apigateway.LambdaIntegration(this.listRecipesLambda));
    recipesResource.addMethod('POST', new apigateway.LambdaIntegration(this.createRecipeLambda));
    recipeByIdResource.addMethod('GET', new apigateway.LambdaIntegration(this.getRecipeLambda));
    recipeByIdResource.addMethod('PUT', new apigateway.LambdaIntegration(this.updateRecipeLambda));
    recipeByIdResource.addMethod('DELETE', new apigateway.LambdaIntegration(this.deleteRecipeLambda));

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'CustomApiUrl', {
      value: `https://${apiDomainName}`,
      description: 'Custom Domain API URL',
    });

    new cdk.CfnOutput(this, 'ApiGatewayDomainTarget', {
      value: customDomain.domainNameAliasDomainName,
      description: 'CNAME target for API Gateway Domain',
    });

    new cdk.CfnOutput(this, 'RecipesTableName', {
      value: this.recipesTable.tableName,
      description: 'DynamoDB Recipes Table Name',
    });

    new cdk.CfnOutput(this, 'RecipesTableArn', {
      value: this.recipesTable.tableArn,
      description: 'DynamoDB Recipes Table ARN',
    });

    new cdk.CfnOutput(this, 'ListRecipesLambdaArn', {
      value: this.listRecipesLambda.functionArn,
      description: 'List Recipes Lambda ARN',
    });

    new cdk.CfnOutput(this, 'CreateRecipeLambdaArn', {
      value: this.createRecipeLambda.functionArn,
      description: 'Create Recipe Lambda ARN',
    });

    new cdk.CfnOutput(this, 'GetRecipeLambdaArn', {
      value: this.getRecipeLambda.functionArn,
      description: 'Get Recipe Lambda ARN',
    });

    new cdk.CfnOutput(this, 'UpdateRecipeLambdaArn', {
      value: this.updateRecipeLambda.functionArn,
      description: 'Update Recipe Lambda ARN',
    });

    new cdk.CfnOutput(this, 'DeleteRecipeLambdaArn', {
      value: this.deleteRecipeLambda.functionArn,
      description: 'Delete Recipe Lambda ARN',
    });
  }
}
