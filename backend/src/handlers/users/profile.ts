import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { dynamoClient, getTableName } from '../../lib/dynamodb';
import { requireAuth } from '../../lib/auth';
import { success, badRequest, error } from '../../lib/api-response';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { UserProfile } from '../../types';

export const getHandler = async (event: APIGatewayProxyEvent, context: Context) => {
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
        userId,
        message: 'Profile not found',
      });
    }

    return success(result.Item);
  } catch (err) {
    console.error('Error getting profile:', err);
    if (err instanceof Error && err.message.includes('Authentication')) {
      return error(err.message, 401);
    }
    return error('Failed to get profile', 500);
  }
};

export const updateHandler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const userId = requireAuth(event);

    if (!event.body) {
      return badRequest('Request body is required');
    }

    const updates = JSON.parse(event.body);
    const { age, height, weight, activityLevel } = updates;

    const existing = await dynamoClient.send(
      new GetCommand({
        TableName: getTableName('USER_PROFILES_TABLE_NAME'),
        Key: { userId },
      })
    );

    const now = new Date().toISOString();
    const profile: UserProfile = {
      userId,
      age: age !== undefined ? Number(age) : existing?.Item?.age,
      height: height !== undefined ? Number(height) : existing?.Item?.height,
      weight: weight !== undefined ? Number(weight) : existing?.Item?.weight,
      activityLevel: activityLevel || existing?.Item?.activityLevel,
      dailyCalorieIntake: existing?.Item?.dailyCalorieIntake,
      createdAt: existing?.Item?.createdAt || now,
      updatedAt: now,
    };

    await dynamoClient.send(
      new PutCommand({
        TableName: getTableName('USER_PROFILES_TABLE_NAME'),
        Item: profile,
      })
    );

    return success(profile);
  } catch (err) {
    console.error('Error updating profile:', err);
    if (err instanceof Error && err.message.includes('Authentication')) {
      return error(err.message, 401);
    }
    return error('Failed to update profile', 500);
  }
};
