export type IngredientStatus = "approved" | "pending";

export type Ingredient = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  unit: string;
  category: string;
  status: IngredientStatus;
};

export type PendingIngredient = Ingredient & {
  submittedBy: string;
  submittedDate: string;
};
