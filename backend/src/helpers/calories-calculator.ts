import { ACTIVITY_LEVEL, GENDER, GOAL } from '@kochess/shared/constants';
import type { ActivityLevel, Gender, Goal } from '@kochess/shared/types';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  [ACTIVITY_LEVEL.SEDENTARY]: 1.2,
  [ACTIVITY_LEVEL.LIGHT]: 1.375,
  [ACTIVITY_LEVEL.MODERATE]: 1.55,
  [ACTIVITY_LEVEL.ACTIVE]: 1.725,
  [ACTIVITY_LEVEL.VERY_ACTIVE]: 1.9,
};

export const GOAL_CALORIE_ADJUSTMENTS: Record<Goal, number> = {
  [GOAL.LOSE]: -0.20,
  [GOAL.MAINTAIN]: 0,
  [GOAL.GAIN]: +0.20,
};

export const calculateDailyCalories = (
  age: number,
  height: number,
  weight: number,
  sex: Gender,
  activityLevel: ActivityLevel,
  goal: Goal
): number => {
  // Mifflin-St Jeor Equation
  // BMR = 10W + 6.25H - 5A + 5 (Men)
  // BMR = 10W + 6.25H - 5A - 161 (Women)

  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === GENDER.MALE ? 5 : -161);

  const totalDailyCalories = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
  const goalBasedAdjustmentCalories = totalDailyCalories * GOAL_CALORIE_ADJUSTMENTS[goal];

  return Math.round(totalDailyCalories + goalBasedAdjustmentCalories);
};
