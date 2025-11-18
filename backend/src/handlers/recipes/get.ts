import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { dynamoClient, getTableName } from '../../lib/dynamodb';
import { requireAuth } from '../../lib/auth';
import { success, notFound, error } from '../../lib/api-response';
import { GetCommand } from '@aws-sdk/lib-dynamodb';

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const userId = requireAuth(event);
    const recipeId = event.pathParameters?.id;

    if (!recipeId) {
      return error('Recipe ID is required', 400);
    }

    const result = await dynamoClient.send(
      new GetCommand({
        TableName: getTableName('RECIPES_TABLE_NAME'),
        Key: { id: recipeId },
      })
    );

    if (!result.Item) {
      return notFound('Recipe not found');
    }

    const recipe = result.Item;

    if (recipe.userId !== userId) {
      return error('Unauthorized', 403);
    }

    return success(recipe);
  } catch (err) {
    console.error('Error getting recipe:', err);
    if (err instanceof Error && err.message.includes('Authentication')) {
      return error(err.message, 401);
    }
    return error('Failed to get recipe', 500);
  }
};
