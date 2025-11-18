import { APIGatewayProxyResult } from 'aws-lambda';

export const createResponse = (
  statusCode: number,
  body: unknown,
  headers?: Record<string, string>
): APIGatewayProxyResult => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    ...headers,
  };

  return {
    statusCode,
    headers: defaultHeaders,
    body: JSON.stringify(body),
  };
};

export const success = (body: unknown, statusCode = 200): APIGatewayProxyResult => {
  return createResponse(statusCode, body);
};

export const error = (message: string, statusCode = 500): APIGatewayProxyResult => {
  return createResponse(statusCode, { error: message });
};

export const badRequest = (message: string): APIGatewayProxyResult => {
  return error(message, 400);
};

export const unauthorized = (message = 'Unauthorized'): APIGatewayProxyResult => {
  return error(message, 401);
};

export const notFound = (message = 'Not found'): APIGatewayProxyResult => {
  return error(message, 404);
};
