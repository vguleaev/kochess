import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { requireAuth } from '../../lib/auth';
import { success, badRequest, error } from '../../lib/api-response';
import { createOpenAIClient } from '../../lib/openai';

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const userId = requireAuth(event);

    if (!event.body) {
      return badRequest('Request body is required');
    }

    const { ingredients } = JSON.parse(event.body);

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return badRequest('Ingredients array is required');
    }

    const openai = createOpenAIClient();
    const recipe = await openai.generateRecipe(ingredients);

    return success({
      ...recipe,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error generating recipe:', err);
    if (err instanceof Error && err.message.includes('Authentication')) {
      return error(err.message, 401);
    }
    return error('Failed to generate recipe', 500);
  }
};
