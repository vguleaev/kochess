export const calculateDailyCalories = (
  age: number,
  height: number,
  weight: number,
  sex: string,
  activityLevel: string
): number => {
  const bmr =
    sex === 'male'
      ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
      : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    'lightly active': 1.375,
    'moderately active': 1.55,
    'very active': 1.725,
    'super active': 1.9,
  };

  const multiplier = activityMultipliers[activityLevel.toLowerCase()] || 1.2;
  return Math.round(bmr * multiplier);
};

