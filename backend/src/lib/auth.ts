import { APIGatewayProxyEvent } from 'aws-lambda';
import { unauthorized } from './api-response';

export const getUserId = (event: APIGatewayProxyEvent): string => {
  const userId = event.requestContext.authorizer?.userId || event.headers['x-user-id'] || event.headers['X-User-Id'];

  if (!userId) {
    throw new Error('User ID not found in request');
  }

  return userId;
};

export const requireAuth = (event: APIGatewayProxyEvent): string => {
  try {
    return getUserId(event);
  } catch {
    throw unauthorized('Authentication required');
  }
};
