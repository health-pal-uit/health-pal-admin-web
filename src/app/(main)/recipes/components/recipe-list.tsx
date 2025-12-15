import Image from "next/image";
import { CheckCircle, XCircle, Clock, Star, Eye } from "lucide-react";
import { Recipe } from "../type";

interface RecipeListProps {
  recipes: Recipe[];
  isLoading: boolean;
  onViewDetails: (recipe: Recipe) => void;
  onApprove: (recipe: Recipe) => void;
  onReject: (recipe: Recipe) => void;
}

export const RecipeList = ({
  recipes,
  isLoading,
  onViewDetails,
  onApprove,
  onReject,
}: RecipeListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12 text-base-content/60">
        No recipes found for this tab.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recipes.map((recipe) => (
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
                      <span>{recipe.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              ) : recipe.status === "rejected" ? (
                <div className="badge badge-error gap-1">
                  <XCircle className="h-3 w-3" /> Rejected
                </div>
              ) : (
                <div className="badge badge-warning gap-1">
                  <Clock className="h-3 w-3" /> Pending
                </div>
              )}
            </div>

            <div>
              <h3 className="card-title text-xl mb-1">{recipe.title}</h3>
              <p className="text-sm text-base-content/60">
                {recipe.submittedDate}
                {recipe.madeFromIngredients &&
                  ` • ${recipe.ingredients.length} ingredients`}
              </p>
              {recipe.tags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {recipe.tags.map((tag) => (
                    <span key={tag} className="badge badge-sm badge-outline">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
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
                  onClick={() => onViewDetails(recipe)}
                >
                  <Eye className="h-4 w-4" /> View Details
                </button>
                <button
                  className="btn btn-sm btn-outline btn-success rounded-full"
                  onClick={() => onApprove(recipe)}
                >
                  <CheckCircle className="h-4 w-4" /> Approve
                </button>
                <button
                  className="btn btn-sm btn-outline btn-error rounded-full"
                  onClick={() => onReject(recipe)}
                >
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
