export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
} as const;

export const ACTIVITY_LEVEL = {
  SEDENTARY: 'sedentary', // Little or no exercise
  LIGHT: 'light', // Light exercise 1-3 days/week
  MODERATE: 'moderate', // Moderate exercise 3-5 days/week
  ACTIVE: 'active', // Hard exercise 6-7 days/week
  VERY_ACTIVE: 'very_active', // Very hard exercise & physical job
} as const;

export const GOAL = {
  LOSE: 'lose',
  MAINTAIN: 'maintain',
  GAIN: 'gain',
} as const;

// Validations
export const AGE_MIN = 13;
export const AGE_MAX = 120;

export const HEIGHT_CM_MIN = 100;
export const HEIGHT_CM_MAX = 250;

export const WEIGHT_KG_MIN = 30;
export const WEIGHT_KG_MAX = 300;

export const VALID_GENDERS = Object.values(GENDER);
export const VALID_ACTIVITY_LEVELS = Object.values(ACTIVITY_LEVEL);
export const VALID_GOALS = Object.values(GOAL);

