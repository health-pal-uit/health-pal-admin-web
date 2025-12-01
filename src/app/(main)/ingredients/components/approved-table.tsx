import { MoreVertical, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { ApprovedIngredient } from "../type";
import { getImageUrl } from "@/src/utils/image-helpers";

export type { ApprovedIngredient as Ingredient };

interface ApprovedTableProps {
  data: ApprovedIngredient[];
  onEdit: (ingredient: ApprovedIngredient) => void;
  onDelete?: (ingredient: ApprovedIngredient) => void;
}

export function ApprovedTable({ data, onEdit, onDelete }: ApprovedTableProps) {
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-8 text-base-content/50"
                  >
                    No ingredients found
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
                              <img
                                src={imgUrl}
                                alt={ingredient.name}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                  (
                                    e.target as HTMLImageElement
                                  ).nextElementSibling?.classList.remove(
                                    "hidden",
                                  );
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-base-content/30" />
                              </div>
                            )}
                            <div className="hidden w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-base-content/30" />
                            </div>
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
                        <div className="dropdown dropdown-end">
                          <button
                            tabIndex={0}
                            className="btn btn-ghost btn-circle btn-sm"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10"
                          >
                            <li>
                              <a onClick={() => onEdit(ingredient)}>
                                <Pencil className="h-4 w-4" /> Edit
                              </a>
                            </li>
                            <li>
                              <a
                                className="text-error"
                                onClick={() => onDelete && onDelete(ingredient)}
                              >
                                <Trash2 className="h-4 w-4" /> Delete
                              </a>
                            </li>
                          </ul>
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
