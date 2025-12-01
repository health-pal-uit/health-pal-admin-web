export type IngredientStatus = "approved" | "pending";

export interface ApprovedIngredient {
  id: string | number;
  name: string;
  kcal_per_100gr: number;
  protein_per_100gr: number;
  fat_per_100gr: number;
  carbs_per_100gr: number;
  fiber_per_100gr: number;
  notes?: string | null;
  tags: string[];
  is_verified: boolean;
  image_url?: string | { url: string } | null;
  created_at: string;
  deleted_at?: string | null;
}

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
