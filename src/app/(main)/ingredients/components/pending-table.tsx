import { CheckCircle, XCircle } from "lucide-react";
import { PendingIngredient } from "../type";

interface PendingTableProps {
  data: PendingIngredient[];
  onReview: (
    ingredient: PendingIngredient,
    action: "approve" | "reject",
  ) => void;
}

export function PendingTable({ data, onReview }: PendingTableProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Ingredient Name</th>
                <th>Category</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Submitted By</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((ingredient) => (
                <tr key={ingredient.id} className="hover">
                  <td className="font-semibold">{ingredient.name}</td>
                  <td>
                    <div className="badge badge-outline">
                      {ingredient.category}
                    </div>
                  </td>
                  <td>{ingredient.calories} kcal</td>
                  <td>{ingredient.protein}g</td>
                  <td>
                    <div>
                      <div className="font-bold">{ingredient.submittedBy}</div>
                      <div className="text-sm text-base-content/60">
                        {ingredient.submittedDate}
                      </div>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
