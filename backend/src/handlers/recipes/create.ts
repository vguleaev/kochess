import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { dynamoClient, getTableName } from '../../lib/dynamodb';
import { requireAuth } from '../../lib/auth';
import { success, badRequest, error } from '../../lib/api-response';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { Recipe } from '../../types';

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const userId = requireAuth(event);

    if (!event.body) {
      return badRequest('Request body is required');
    }

    const { title, photo, description, ingredients } = JSON.parse(event.body);

    if (!title) {
      return badRequest('Title is required');
    }

    const recipeId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const recipe: Recipe = {
      id: recipeId,
      userId,
      title,
      photo: photo || undefined,
      description: description || undefined,
      ingredients: ingredients || undefined,
      createdAt: now,
      updatedAt: now,
    };

    await dynamoClient.send(
      new PutCommand({
        TableName: getTableName('RECIPES_TABLE_NAME'),
        Item: recipe,
      })
    );

    return success(recipe, 201);
  } catch (err) {
    console.error('Error creating recipe:', err);
    if (err instanceof Error && err.message.includes('Authentication')) {
      return error(err.message, 401);
    }
    return error('Failed to create recipe', 500);
  }
};
