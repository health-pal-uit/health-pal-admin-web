export type RecipeStatus = "pending" | "approved" | "rejected";
export type Recipe = {
  id: number;
  title: string;
  author: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  status: RecipeStatus;
  submittedDate: string;
  cookTime: string;
  difficulty: string;
  rating?: number;
  imageUrl?: string;
};
