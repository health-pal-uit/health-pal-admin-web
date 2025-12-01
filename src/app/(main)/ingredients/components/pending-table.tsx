import { CheckCircle, XCircle, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { ApprovedIngredient } from "../type";

interface PendingTableProps {
  data: ApprovedIngredient[];
  onReview: (
    ingredient: ApprovedIngredient,
    action: "approve" | "reject",
  ) => void;
}

export function PendingTable({ data, onReview }: PendingTableProps) {
  const getImageUrl = (img: ApprovedIngredient["image_url"]): string | null => {
    if (!img) return null;
    if (typeof img === "string") return img;
    if (typeof img === "object" && "url" in img)
      return (img as { url: string }).url;
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Ingredient Name</th>
                <th>Tags</th>
                <th>Calories (100g)</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fat</th>
                <th>Fiber</th>
                <th>Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-8 text-base-content/50"
                  >
                    No pending ingredients
                  </td>
                </tr>
              ) : (
                data.map((ingredient) => {
                  const imgUrl = getImageUrl(ingredient.image_url);

                  return (
                    <tr key={ingredient.id} className="hover">
                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10 bg-base-200">
                            {imgUrl ? (
                              <Image
                                src={imgUrl}
                                alt={ingredient.name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-base-content/30" />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="font-semibold">
                        {ingredient.name}
                        {ingredient.notes && (
                          <div className="text-xs text-base-content/50 truncate max-w-[150px]">
                            {ingredient.notes}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {ingredient.tags && ingredient.tags.length > 0 ? (
                            ingredient.tags.slice(0, 2).map((tag, index) => (
                              <div
                                key={index}
                                className="badge badge-outline badge-sm"
                              >
                                {tag}
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-base-content/50">
                              -
                            </span>
                          )}
                          {ingredient.tags && ingredient.tags.length > 2 && (
                            <div className="badge badge-ghost badge-sm">
                              +{ingredient.tags.length - 2}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{ingredient.kcal_per_100gr} kcal</td>
                      <td>{ingredient.protein_per_100gr}g</td>
                      <td>{ingredient.carbs_per_100gr}g</td>
                      <td>{ingredient.fat_per_100gr}g</td>
                      <td>{ingredient.fiber_per_100gr}g</td>
                      <td>
                        <div className="text-sm text-base-content/60">
                          {formatDate(ingredient.created_at)}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            className="btn btn-ghost btn-sm text-success"
                            onClick={() => onReview(ingredient, "approve")}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm text-error"
                            onClick={() => onReview(ingredient, "reject")}
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
