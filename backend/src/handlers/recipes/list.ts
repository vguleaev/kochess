import { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoClient, getTableName } from '../../lib/dynamodb';
import { requireAuth } from '../../lib/auth';
import { success, error } from '../../lib/api-response';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const userId = requireAuth(event);

    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: getTableName('RECIPES_TABLE_NAME'),
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
    );

    return success({
      recipes: result.Items || [],
      count: result.Items?.length || 0,
    });
  } catch (err) {
    console.error('Error listing recipes:', err);
    if (err instanceof Error && err.message.includes('Authentication')) {
      return error(err.message, 401);
    }
    return error('Failed to list recipes', 500);
  }
};
