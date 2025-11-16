import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Ingredient } from "../type";

interface ApprovedTableProps {
  data: Ingredient[];
  onEdit: (ingredient: Ingredient) => void;
}

export function ApprovedTable({ data, onEdit }: ApprovedTableProps) {
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
                <th>Carbs</th>
                <th>Fat</th>
                <th>Unit</th>
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
                  <td>{ingredient.carbs}g</td>
                  <td>{ingredient.fat}g</td>
                  <td>{ingredient.unit}</td>
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
                          <a className="text-error">
                            <Trash2 className="h-4 w-4" /> Delete
                          </a>
                        </li>
                      </ul>
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
