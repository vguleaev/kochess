import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { dynamoClient, getTableName } from '../../lib/dynamodb';
import { requireAuth } from '../../lib/auth';
import { success, badRequest, notFound, error } from '../../lib/api-response';
import { GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const userId = requireAuth(event);
    const recipeId = event.pathParameters?.id;

    if (!recipeId) {
      return badRequest('Recipe ID is required');
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

    await dynamoClient.send(
      new DeleteCommand({
        TableName: getTableName('RECIPES_TABLE_NAME'),
        Key: { id: recipeId },
      })
    );

    return success({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error('Error deleting recipe:', err);
    if (err instanceof Error && err.message.includes('Authentication')) {
      return error(err.message, 401);
    }
    return error('Failed to delete recipe', 500);
  }
};
