import { GENDER, ACTIVITY_MULTIPLIERS } from '@kochess/shared/constants';
import { ActivityLevel } from '@kochess/shared/types';

export const calculateDailyCalories = (
  age: number,
  height: number,
  weight: number,
  sex: string,
  activityLevel: string
): number => {
  // Mifflin-St Jeor Equation
  // BMR = 10W + 6.25H - 5A + 5 (Men)
  // BMR = 10W + 6.25H - 5A - 161 (Women)

  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === GENDER.MALE ? 5 : -161);

  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel as ActivityLevel] || 1.2;

  return Math.round(bmr * multiplier);
};
