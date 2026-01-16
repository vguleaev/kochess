import { GOAL } from '@kochess/shared/constants';
import type { Goal } from '@kochess/shared/types';

const PROTEIN_PER_KG_FOR_GOAL = {
  [GOAL.LOSE]: 1.4,
  [GOAL.MAINTAIN]: 2.0,
  [GOAL.GAIN]: 2.2,
}
const FAT_PER_KG = 0.8;

export interface MacroGrams {
  protein: number;
  fats: number;
  carbs: number;
}

export function calculateMacros(dailyCalories: number, weightKg: number, goal: Goal): MacroGrams {
  const proteinPerKg = PROTEIN_PER_KG_FOR_GOAL[goal];

  const proteinGrams = weightKg * proteinPerKg;
  const proteinKcal = proteinGrams * 4;

  const fatGrams = weightKg * FAT_PER_KG;
  const fatKcal = fatGrams * 9;

  const carbsKcal = dailyCalories - (proteinKcal + fatKcal);
  const carbsGrams = carbsKcal / 4;

  return {
    protein: Math.round(proteinGrams),
    fats: Math.round(fatGrams),
    carbs: Math.round(carbsGrams),
  };
}
