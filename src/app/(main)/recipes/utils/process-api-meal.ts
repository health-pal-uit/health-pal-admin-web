import { ApiMeal, Recipe, RecipeStatus } from "../type";

export function processApiMeal(meal: ApiMeal): Recipe {
  // Handle status from either new API format (status: "PENDING") or old format (is_verified)
  let status: RecipeStatus;
  if (meal.status) {
    // New API format
    status =
      meal.status === "PENDING"
        ? "pending"
        : meal.deleted_at
          ? "rejected"
          : "approved";
  } else {
    // Old API format
    status = meal.deleted_at
      ? "rejected"
      : meal.is_verified
        ? "approved"
        : "pending";
  }

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
    rating: meal.rating || null,
    imageUrl: meal.image_url,
    tags: meal.tags,
    madeFromIngredients: meal.made_from_ingredients || false,
    ingredients: meal.ingre_meals || [],
    notes: meal.notes,
  };
}
