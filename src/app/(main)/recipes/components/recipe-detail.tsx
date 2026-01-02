"use client";

import Image from "next/image";
import { Clock, Users, ChefHat, Utensils, Apple } from "lucide-react";
import type { Recipe } from "../type";

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export function RecipeDetailModal({ recipe, onClose }: RecipeDetailModalProps) {
  return (
    <dialog id="recipe_detail_modal" className="modal">
      {recipe && (
        <div className="modal-box max-w-4xl">
          <h3 className="font-bold text-lg">{recipe.title}</h3>
          <form method="dialog" className="modal-backdrop">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={onClose}
            >
              ✕
            </button>
          </form>

          <div className="py-4 max-h-[70vh] overflow-y-auto">
            <figure className="w-full h-64 bg-base-200 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
              {recipe.imageUrl ? (
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title || "Recipe"}
                  width={800}
                  height={400}
                  className="h-full w-auto object-contain"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  {recipe.madeFromIngredients ? (
                    <Apple className="h-24 w-24 text-base-content/30" />
                  ) : (
                    <Utensils className="h-24 w-24 text-base-content/30" />
                  )}
                </div>
              )}
            </figure>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 text-base-content/70">
                <ChefHat className="w-5 h-5" />
                <div>
                  <p className="text-sm">Type</p>
                  <p className="font-semibold text-base-content">
                    {recipe.madeFromIngredients
                      ? "From Ingredients"
                      : "Single Meal"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-base-content/70">
                <Users className="w-5 h-5" />
                <div>
                  <p className="text-sm">Status</p>
                  <p className="font-semibold text-base-content capitalize">
                    {recipe.status}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-base-content/70">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="text-sm">Submitted</p>
                  <p className="font-semibold text-base-content">
                    {recipe.submittedDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-warning/10 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-base-content mb-3">
                Nutrition Facts (per 100g)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-base-content/70">Calories</p>
                  <p className="text-warning text-xl font-semibold">
                    {recipe.calories}
                  </p>
                  <p className="text-xs text-base-content/70">kcal</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Protein</p>
                  <p className="text-primary text-xl font-semibold">
                    {recipe.protein}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Carbs</p>
                  <p className="text-success text-xl font-semibold">
                    {recipe.carbs}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Fat</p>
                  <p className="text-info text-xl font-semibold">
                    {recipe.fat}g
                  </p>
                </div>
              </div>
            </div>

            {recipe.madeFromIngredients && recipe.ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-base-content mb-3">
                  Ingredients
                </h3>
                <div className="space-y-3">
                  {recipe.ingredients.map((ingredientMeal) => (
                    <div
                      key={ingredientMeal.id}
                      className="flex items-start gap-3 p-3 bg-base-200 rounded-lg"
                    >
                      <div className="avatar">
                        <div className="w-12 h-12 rounded">
                          <Image
                            src={
                              ingredientMeal.ingredient.image_url ||
                              "https://placehold.co/100x100/E8F5F1/2D8B6E?text=Ing"
                            }
                            alt={ingredientMeal.ingredient.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">
                          {ingredientMeal.ingredient.name}
                        </p>
                        <p className="text-sm text-base-content/70">
                          Quantity: {parseFloat(ingredientMeal.quantity_kg)} kg
                        </p>
                        <div className="flex gap-4 mt-1 text-xs text-base-content/60">
                          <span>
                            {ingredientMeal.ingredient.kcal_per_100gr} kcal
                          </span>
                          <span>
                            P: {ingredientMeal.ingredient.protein_per_100gr}g
                          </span>
                          <span>
                            C: {ingredientMeal.ingredient.carbs_per_100gr}g
                          </span>
                          <span>
                            F: {ingredientMeal.ingredient.fat_per_100gr}g
                          </span>
                        </div>
                        {ingredientMeal.ingredient.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {ingredientMeal.ingredient.tags.map((tag) => (
                              <span
                                key={tag}
                                className="badge badge-xs badge-outline"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recipe.notes && (
              <div className="mb-6">
                <h3 className="font-bold text-base-content mb-3">Notes</h3>
                <p className="text-base-content/80 bg-base-200 p-3 rounded-lg">
                  {recipe.notes}
                </p>
              </div>
            )}

            {recipe.tags.length > 0 && (
              <div>
                <h4 className="font-bold text-base-content mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <div key={index} className="badge badge-outline">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
