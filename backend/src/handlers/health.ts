import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { success } from '../lib/api-response';

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  return success({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'kochess-backend',
  });
};
