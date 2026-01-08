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

