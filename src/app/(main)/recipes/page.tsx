"use client";

import { useState } from "react";
import { Search, Clock, CheckCircle, XCircle, Star, Eye } from "lucide-react";
import Image from "next/image";
import { RecipeDetailModal } from "./components/recipe-detail";
import { Recipe, RecipeStatus } from "./type";
import Header from "@/src/components/shared/Header";

const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: "Avocado Shrimp Salad",
    author: "Chef Mai",
    calories: 350,
    protein: 25,
    carbs: 15,
    fat: 20,
    status: "pending",
    submittedDate: "01/11/2024",
    cookTime: "15 min",
    difficulty: "Easy",
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Strawberry Smoothie",
    author: "Healthy Cook",
    calories: 180,
    protein: 8,
    carbs: 30,
    fat: 5,
    status: "pending",
    submittedDate: "02/11/2024",
    cookTime: "5 min",
    difficulty: "Easy",
    imageUrl:
      "https://images.unsplash.com/photo-1541658016709-8200b36f0c16?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Brown Rice Bowl",
    author: "Nutrition Expert",
    calories: 420,
    protein: 18,
    carbs: 65,
    fat: 12,
    status: "approved",
    submittedDate: "28/10/2024",
    cookTime: "30 min",
    difficulty: "Medium",
    rating: 4.5,
    imageUrl:
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&h=300&fit=crop",
  },
];

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<RecipeStatus>("pending");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null,
  );

  const filteredRecipes = mockRecipes.filter(
    (recipe) =>
      recipe.status === activeTab &&
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenReviewModal = (
    recipe: Recipe,
    action: "approve" | "reject",
  ) => {
    setSelectedRecipe(recipe);
    setReviewAction(action);
    (document.getElementById("review_modal") as HTMLDialogElement)?.showModal();
  };

  const handleOpenDetailModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    (
      document.getElementById("recipe_detail_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleCloseModal = () => {
    (
      document.getElementById("recipe_detail_modal") as HTMLDialogElement
    )?.close();
    (document.getElementById("review_modal") as HTMLDialogElement)?.close();
    setTimeout(() => {
      setSelectedRecipe(null);
      setReviewAction(null);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-6">
      <Header
        tabName="Recipe & Meal Moderation"
        description="Review and approve user-contributed recipes"
        buttonName="Recipe"
      />

      <div className="flex w-fit items-center gap-2 p-1 rounded-full bg-base-300">
        <button
          className={`
      flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition
      ${activeTab === "pending" ? "bg-base-100 font-medium shadow-sm" : "opacity-70 hover:opacity-100"}
    `}
          onClick={() => setActiveTab("pending")}
        >
          <Clock className="h-4 w-4" />
          <span>Pending</span>
          <span className="badge badge-sm bg-base-200 border-none">23</span>
        </button>

        <button
          className={`
      flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition
      ${activeTab === "approved" ? "bg-base-100 font-medium shadow-sm" : "opacity-70 hover:opacity-100"}
    `}
          onClick={() => setActiveTab("approved")}
        >
          <CheckCircle className="h-4 w-4" />
          <span>Approved</span>
        </button>

        <button
          className={`
      flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition
      ${activeTab === "rejected" ? "bg-base-100 font-medium shadow-sm" : "opacity-70 hover:opacity-100"}
    `}
          onClick={() => setActiveTab("rejected")}
        >
          <XCircle className="h-4 w-4" />
          <span>Rejected</span>
        </button>
      </div>

      <label className="input input-bordered flex items-center gap-2 rounded-full">
        <Search className="h-5 w-5 text-base-content/60" />
        <input
          type="text"
          className="grow"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </label>

      <div className="space-y-4">
        {filteredRecipes.length === 0 && (
          <div className="text-center py-12 text-base-content/60">
            No recipes found for this tab.
          </div>
        )}

        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="card md:flex-row bg-base-100 shadow-xl rounded-2xl overflow-hidden"
          >
            <figure className="w-full md:w-56 h-48 md:h-auto flex-shrink-0">
              <Image
                src={
                  recipe.imageUrl ||
                  `https://placehold.co/400x300/E8F5F1/2D8B6E?text=Recipe`
                }
                alt={recipe.title}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </figure>

            <div className="card-body relative">
              <div className="card-actions justify-end absolute top-6 right-6">
                {recipe.status === "approved" ? (
                  <div className="flex items-center gap-2">
                    <div className="badge badge-success gap-1">
                      <CheckCircle className="h-3 w-3" /> Approved
                    </div>
                    {recipe.rating && (
                      <div className="flex items-center gap-1 font-bold">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span>{recipe.rating}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="badge badge-ghost">{recipe.difficulty}</div>
                )}
              </div>

              <div>
                <h3 className="card-title text-xl mb-1">{recipe.title}</h3>
                <p className="text-sm text-base-content/60">
                  By {recipe.author} • {recipe.submittedDate}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4">
                <div>
                  <p className="text-sm text-base-content/60">Calories</p>
                  <p className="font-bold text-lg text-base-content">
                    {recipe.calories} kcal
                  </p>
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Protein</p>
                  <p className="font-bold text-lg text-base-content">
                    {recipe.protein}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Carbs</p>
                  <p className="font-bold text-lg text-base-content">
                    {recipe.carbs}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Fat</p>
                  <p className="font-bold text-lg text-base-content">
                    {recipe.fat}g
                  </p>
                </div>
              </div>

              {recipe.status === "pending" && (
                <div className="card-actions justify-start gap-2">
                  <button
                    className="btn btn-sm btn-outline btn-ghost rounded-full"
                    onClick={() => handleOpenDetailModal(recipe)}
                  >
                    <Eye className="h-4 w-4" /> View Details
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-success rounded-full"
                    onClick={() => handleOpenReviewModal(recipe, "approve")}
                  >
                    <CheckCircle className="h-4 w-4" /> Approve
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-error rounded-full"
                    onClick={() => handleOpenReviewModal(recipe, "reject")}
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <RecipeDetailModal recipe={selectedRecipe} onClose={handleCloseModal} />

      <dialog id="review_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {reviewAction === "approve" ? "Approve Recipe" : "Reject Recipe"}
          </h3>
          <p className="py-2 text-base-content/80">
            Recipe: {selectedRecipe?.title}
          </p>

          <div className="space-y-4 py-4">
            {reviewAction === "approve" && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Rating (1-5 stars)</span>
                </label>
                <div className="rating">
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star"
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star"
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star"
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star"
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star"
                  />
                </div>
              </div>
            )}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Notes {reviewAction === "reject" && "(required)"}
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Enter notes..."
              ></textarea>
            </div>
          </div>

          <div className="modal-action">
            <button className="btn btn-ghost" onClick={handleCloseModal}>
              Cancel
            </button>
            <button
              className={`btn ${reviewAction === "approve" ? "btn-success" : "btn-error"}`}
              onClick={handleCloseModal}
            >
              {reviewAction === "approve" ? "Approve" : "Reject"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleCloseModal}>close</button>
        </form>
      </dialog>
    </div>
  );
}
