// API Response Types
export interface Ingredient {
  id: string;
  name: string;
  kcal_per_100gr: number;
  protein_per_100gr: number;
  fat_per_100gr: number;
  carbs_per_100gr: number;
  fiber_per_100gr: number | null;
  notes: string | null;
  tags: string[];
  is_verified: boolean;
  image_url: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface IngreMeal {
  id: string;
  quantity_kg: string;
  ingredient: Ingredient;
}

export interface ApiMeal {
  id: string;
  name: string;
  kcal_per_100gr: number;
  protein_per_100gr: number;
  fat_per_100gr: number;
  carbs_per_100gr: number;
  fiber_per_100gr: number | null;
  rating: number | null;
  tags: string[];
  notes: string | null;
  created_at: string;
  is_verified: boolean;
  image_url: string | null;
  deleted_at: string | null;
  made_from_ingredients: boolean;
  ingre_meals: IngreMeal[];
}

// UI Types
export type RecipeStatus = "pending" | "approved" | "rejected";

export interface Recipe {
  id: string;
  title: string;
  author?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  status: RecipeStatus;
  submittedDate: string;
  cookTime?: string;
  difficulty?: string;
  rating: number | null;
  imageUrl: string | null;
  tags: string[];
  madeFromIngredients: boolean;
  ingredients: IngreMeal[];
  notes: string | null;
}
