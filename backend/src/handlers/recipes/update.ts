import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { dynamoClient, getTableName } from '../../lib/dynamodb';
import { requireAuth } from '../../lib/auth';
import { success, badRequest, notFound, error } from '../../lib/api-response';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const userId = requireAuth(event);
    const recipeId = event.pathParameters?.id;

    if (!recipeId) {
      return badRequest('Recipe ID is required');
    }

    if (!event.body) {
      return badRequest('Request body is required');
    }

    const existing = await dynamoClient.send(
      new GetCommand({
        TableName: getTableName('RECIPES_TABLE_NAME'),
        Key: { id: recipeId },
      })
    );

    if (!existing.Item) {
      return notFound('Recipe not found');
    }

    if (existing.Item.userId !== userId) {
      return error('Unauthorized', 403);
    }

    const updates = JSON.parse(event.body);
    const updateExpression: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    Object.keys(updates).forEach((key) => {
      if (key !== 'id' && key !== 'userId' && key !== 'createdAt') {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updates[key];
      }
    });

    if (updateExpression.length === 0) {
      return badRequest('No valid fields to update');
    }

    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    await dynamoClient.send(
      new UpdateCommand({
        TableName: getTableName('RECIPES_TABLE_NAME'),
        Key: { id: recipeId },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );

    const updated = await dynamoClient.send(
      new GetCommand({
        TableName: getTableName('RECIPES_TABLE_NAME'),
        Key: { id: recipeId },
      })
    );

    return success(updated.Item);
  } catch (err) {
    console.error('Error updating recipe:', err);
    if (err instanceof Error && err.message.includes('Authentication')) {
      return error(err.message, 401);
    }
    return error('Failed to update recipe', 500);
  }
};
