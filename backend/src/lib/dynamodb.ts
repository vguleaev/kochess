import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'eu-central-1',
});

export const dynamoClient = DynamoDBDocumentClient.from(client);

export const getTableName = (tableName: string): string => {
  const envTableName = process.env[tableName];
  if (!envTableName) {
    throw new Error(`Table name ${tableName} not found in environment variables`);
  }
  return envTableName;
};
