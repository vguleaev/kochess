import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

export interface LambdaHandler {
  (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>;
}

export interface ApiResponse {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  photo?: string;
  description?: string;
  ingredients?: string;
  caloriesPer100g?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  age?: number;
  height?: number;
  weight?: number;
  activityLevel?: string;
  dailyCalorieIntake?: number;
  createdAt: string;
  updatedAt: string;
}
