import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { requireAuth } from '../../lib/auth';
import { success, badRequest, error } from '../../lib/api-response';
import { createOpenAIClient } from '../../lib/openai';
import { dynamoClient, getTableName } from '../../lib/dynamodb';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const userId = requireAuth(event);
    const recipeId = event.pathParameters?.id;

    if (!recipeId) {
      return badRequest('Recipe ID is required');
    }

    const openai = createOpenAIClient();

    const recipeResponse = await dynamoClient.send(
      new GetCommand({
        TableName: getTableName('RECIPES_TABLE_NAME'),
        Key: { id: recipeId },
      })
    );

    if (!recipeResponse.Item) {
      return error('Recipe not found', 404);
    }

    const recipe = recipeResponse.Item;

    if (recipe.userId !== userId) {
      return error('Unauthorized', 403);
    }

    if (!recipe.ingredients) {
      return badRequest('Recipe has no ingredients to extract calories from');
    }

    const caloriesPer100g = await openai.extractCalories(recipe.ingredients);

    await dynamoClient.send(
      new UpdateCommand({
        TableName: getTableName('RECIPES_TABLE_NAME'),
        Key: { id: recipeId },
        UpdateExpression: 'SET caloriesPer100g = :calories, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':calories': caloriesPer100g,
          ':updatedAt': new Date().toISOString(),
        },
      })
    );

    return success({
      recipeId,
      caloriesPer100g,
      message: 'Calories extracted successfully',
    });
  } catch (err) {
    console.error('Error extracting calories:', err);
    if (err instanceof Error && err.message.includes('Authentication')) {
      return error(err.message, 401);
    }
    return error('Failed to extract calories', 500);
  }
};
