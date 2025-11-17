"use client";

import Image from "next/image";
import { Clock, Users, ChefHat } from "lucide-react";
import type { Recipe } from "../page";

const ingredients = [
  "2 ripe avocados, diced",
  "200g cooked shrimp, peeled",
  "2 cups mixed greens",
  "1 cup cherry tomatoes, halved",
  "1/4 red onion, thinly sliced",
  "2 tbsp olive oil",
  "1 tbsp lime juice",
  "Salt and pepper to taste",
];
const instructions = [
  "Prepare all ingredients by washing and cutting them as specified.",
  "In a large bowl, combine the mixed greens, cherry tomatoes, and red onion.",
  "Add the diced avocado and cooked shrimp to the bowl.",
  "In a small bowl, whisk together olive oil, lime juice, salt, and pepper.",
  "Pour the dressing over the salad and gently toss to combine.",
  "Serve immediately and enjoy your healthy meal!",
];
const tags = [
  "Healthy",
  "Low Carb",
  "High Protein",
  "Gluten Free",
  "Quick & Easy",
];

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
            <figure className="w-full h-64 bg-base-200 rounded-lg overflow-hidden mb-6">
              <Image
                src={
                  recipe.imageUrl ||
                  `https://placehold.co/800x400/E8F5F1/2D8B6E?text=Recipe`
                }
                alt={recipe.title || "Recipe"}
                width={800}
                height={400}
                className="w-full h-full object-cover"
              />
            </figure>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2 text-base-content/70">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="text-sm">Cook Time</p>
                  <p className="font-semibold text-base-content">
                    {recipe.cookTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-base-content/70">
                <Users className="w-5 h-5" />
                <div>
                  <p className="text-sm">Servings</p>
                  <p className="font-semibold text-base-content">2 people</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-base-content/70">
                <ChefHat className="w-5 h-5" />
                <div>
                  <p className="text-sm">Difficulty</p>
                  <p className="font-semibold text-base-content">
                    {recipe.difficulty}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-base-content/70">
                <p className="text-sm">Author</p>
                <p className="font-semibold text-base-content">
                  {recipe.author}
                </p>
              </div>
            </div>

            <div className="bg-warning/10 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-base-content mb-3">
                Nutrition Facts (per serving)
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold text-base-content mb-3">
                  Ingredients
                </h3>
                <ul className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1.5">•</span>
                      <span className="text-base-content/90">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-base-content mb-3">
                  Instructions
                </h3>
                <ol className="space-y-3">
                  {instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-content rounded-full flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      <span className="text-base-content/90 flex-1">
                        {instruction}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-base-content mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div key={index} className="badge badge-outline">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
