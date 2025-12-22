#!/usr/bin/env node
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib/core';
import { FrontendStack } from '../lib/frontend-stack';
import { BackendStack } from '../lib/backend-stack';

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = new cdk.App();

cdk.Tags.of(app).add('Project', 'kochess');

new FrontendStack(app, 'KochessFrontendStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

new BackendStack(app, 'KochessBackendStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
