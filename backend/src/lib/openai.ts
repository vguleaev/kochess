export interface OpenAIClient {
  extractCalories: (ingredients: string) => Promise<number>;
  generateRecipe: (ingredients: string[]) => Promise<{
    title: string;
    description: string;
    ingredients: string;
    instructions: string;
  }>;
}

export const createOpenAIClient = (): OpenAIClient => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not found in environment variables');
  }

  return {
    async extractCalories(ingredients: string): Promise<number> {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content:
                'You are a nutrition expert. Extract the calorie content per 100g from the given ingredients. Return only a number.',
            },
            {
              role: 'user',
              content: `Calculate calories per 100g for: ${ingredients}`,
            },
          ],
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      const calories = parseFloat(data.choices[0]?.message?.content || '0');
      return isNaN(calories) ? 0 : calories;
    },

    async generateRecipe(ingredients: string[]): Promise<{
      title: string;
      description: string;
      ingredients: string;
      instructions: string;
    }> {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content:
                'You are a professional chef. Generate a recipe based on the provided ingredients. Return a JSON object with title, description, ingredients (as a formatted string), and instructions.',
            },
            {
              role: 'user',
              content: `Generate a recipe using these ingredients: ${ingredients.join(', ')}`,
            },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '{}';
      return JSON.parse(content);
    },
  };
};
