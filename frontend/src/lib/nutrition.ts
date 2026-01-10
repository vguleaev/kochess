const PROTEIN_PER_KG = 2.0;
const FAT_PER_KG = 0.8;

export interface MacroGrams {
  protein: number;
  fats: number;
  carbs: number;
}

export function calculateMacros(dailyCalories: number, weightKg: number): MacroGrams {
  const proteinGrams = weightKg * PROTEIN_PER_KG;
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
