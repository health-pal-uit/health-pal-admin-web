import { ApiMeal, Recipe, RecipeStatus } from "../type";

export function processApiMeal(meal: ApiMeal): Recipe {
  const status: RecipeStatus = meal.is_verified
    ? "approved"
    : meal.deleted_at
      ? "rejected"
      : "pending";

  const submittedDate = new Date(meal.created_at).toLocaleDateString("vi-VN");

  return {
    id: meal.id,
    title: meal.name,
    calories: Math.round(meal.kcal_per_100gr),
    protein: Math.round(meal.protein_per_100gr * 10) / 10,
    carbs: Math.round(meal.carbs_per_100gr * 10) / 10,
    fat: Math.round(meal.fat_per_100gr * 10) / 10,
    fiber: meal.fiber_per_100gr,
    status,
    submittedDate,
    rating: meal.rating,
    imageUrl: meal.image_url,
    tags: meal.tags,
    madeFromIngredients: meal.made_from_ingredients,
    ingredients: meal.ingre_meals,
    notes: meal.notes,
  };
}
