import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { dynamoClient, getTableName } from '../../lib/dynamodb';
import { requireAuth } from '../../lib/auth';
import { success, badRequest, error } from '../../lib/api-response';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { UserProfile } from '../../types';

const calculateDailyCalories = (
  age: number,
  height: number,
  weight: number,
  sex: string,
  activityLevel: string
): number => {
  const bmr =
    sex === 'male'
      ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
      : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    'lightly active': 1.375,
    'moderately active': 1.55,
    'very active': 1.725,
    'super active': 1.9,
  };

  const multiplier = activityMultipliers[activityLevel.toLowerCase()] || 1.2;
  return Math.round(bmr * multiplier);
};

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const userId = requireAuth(event);

    if (!event.body) {
      return badRequest('Request body is required');
    }

    const { age, height, weight, sex, activityLevel } = JSON.parse(event.body);

    if (!age || !height || !weight || !sex || !activityLevel) {
      return badRequest('All fields are required: age, height, weight, sex, activityLevel');
    }

    const dailyCalorieIntake = calculateDailyCalories(Number(age), Number(height), Number(weight), sex, activityLevel);

    const now = new Date().toISOString();
    const profile: UserProfile = {
      userId,
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      activityLevel,
      dailyCalorieIntake,
      createdAt: now,
      updatedAt: now,
    };

    await dynamoClient.send(
      new PutCommand({
        TableName: getTableName('USER_PROFILES_TABLE_NAME'),
        Item: profile,
      })
    );

    return success(profile, 201);
  } catch (err) {
    console.error('Error completing onboarding:', err);
    if (err instanceof Error && err.message.includes('Authentication')) {
      return error(err.message, 401);
    }
    return error('Failed to complete onboarding', 500);
  }
};
