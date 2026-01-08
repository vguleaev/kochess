import { success } from '../lib/api-response';

export const handler = async () => {
  return success({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'kochess-backend',
  });
};
