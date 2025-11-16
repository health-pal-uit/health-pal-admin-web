import { PendingIngredient } from "../type";

interface ReviewModalProps {
  ingredient: PendingIngredient | null;
  action: "approve" | "reject" | null;
  onClose: () => void;
  // Thêm onSubmit: (notes) => void;
}

export function ReviewIngredientModal({
  ingredient,
  action,
  onClose,
}: ReviewModalProps) {
  if (!ingredient) return null;

  return (
    <dialog id="review_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {action === "approve" ? "Approve Ingredient" : "Reject Ingredient"}
        </h3>
        <p className="py-2 text-base-content/80">
          {ingredient.name} submitted by {ingredient.submittedBy}
        </p>

        <div className="space-y-4 py-4">
          <div className="bg-base-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-base-content/70">Category</p>
                <p className="font-bold text-base-content">
                  {ingredient.category}
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Calories</p>
                <p className="font-bold text-base-content">
                  {ingredient.calories} kcal
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Protein</p>
                <p className="font-bold text-base-content">
                  {ingredient.protein}g
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Carbs</p>
                <p className="font-bold text-base-content">
                  {ingredient.carbs}g
                </p>
              </div>
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Notes {action === "reject" && "(required)"}
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Enter notes..."
            ></textarea>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`btn ${action === "approve" ? "btn-success" : "btn-error"}`}
            onClick={onClose}
          >
            {action === "approve" ? "Approve" : "Reject"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
