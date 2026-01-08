import { APIGatewayProxyEvent } from 'aws-lambda';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { UserProfile } from '@kochess/shared/types';
import { dynamoClient, getTableName } from '../../lib/dynamodb';
import { requireAuth } from '../../lib/auth';
import { success, badRequest, error } from '../../lib/api-response';
import { calculateDailyCalories } from '../../helpers/calories-calculator';

export const getHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const userId = requireAuth(event);

    const result = await dynamoClient.send(
      new GetCommand({
        TableName: getTableName('USER_PROFILES_TABLE_NAME'),
        Key: { userId },
      })
    );

    if (!result.Item) {
      return success({
        profile: null,
      });
    }

    return success({
      profile: result.Item,
    });
  } catch (err) {
    console.error('Error getting profile:', err);
    if (err instanceof Error && err.message.includes('Authentication')) {
      return error(err.message, 401);
    }
    return error('Failed to get profile', 500);
  }
};

export const updateHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const userId = requireAuth(event);

    if (!event.body) {
      return badRequest('Request body is required');
    }

    const updates = JSON.parse(event.body);
    const { age, heightCm, weightKg, gender, activityLevel, goal } = updates;

    if (!age || !heightCm || !weightKg || !gender || !activityLevel || !goal) {
      return badRequest('All fields are required: age, heightCm, weightKg, gender, activityLevel, goal');
    }

    const existing = await dynamoClient.send(
      new GetCommand({
        TableName: getTableName('USER_PROFILES_TABLE_NAME'),
        Key: { userId },
      })
    );

    const dailyCalorieIntake = calculateDailyCalories(Number(age), Number(heightCm), Number(weightKg), gender, activityLevel);

    const now = new Date().toISOString();
    const profile: UserProfile = {
      userId,
      age,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      goal,
      dailyCalorieIntake,
      createdAt: existing?.Item?.createdAt || now,
      updatedAt: now,
    };

    await dynamoClient.send(
      new PutCommand({
        TableName: getTableName('USER_PROFILES_TABLE_NAME'),
        Item: profile,
      })
    );

    return success({
      profile,
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    if (err instanceof Error && err.message.includes('Authentication')) {
      return error(err.message, 401);
    }
    return error('Failed to update profile', 500);
  }
};

