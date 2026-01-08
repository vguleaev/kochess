import { GENDER, ACTIVITY_LEVEL, GOAL } from '../constants/profile';

export type Gender = typeof GENDER[keyof typeof GENDER];
export type ActivityLevel = typeof ACTIVITY_LEVEL[keyof typeof ACTIVITY_LEVEL];
export type Goal = typeof GOAL[keyof typeof GOAL];

export interface UserProfile {
  userId: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  dailyCalorieIntake: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  profile: UserProfile | null;
}

export interface UpsertProfileRequest extends Omit<UserProfile, 'userId' | 'dailyCalorieIntake' | 'createdAt' | 'updatedAt'> { }

export interface UpsertProfileResponse {
  profile: UserProfile;
}