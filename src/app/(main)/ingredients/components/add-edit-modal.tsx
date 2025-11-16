import { Ingredient } from "../type";

interface AddEditModalProps {
  ingredient: Ingredient | null;
  onClose: () => void;
}

export function AddEditIngredientModal({
  ingredient,
  onClose,
}: AddEditModalProps) {
  const formKey = ingredient ? `edit-${ingredient.id}` : "add-new";

  return (
    <dialog id="add_edit_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg">
          {ingredient ? "Edit Ingredient" : "Add New Ingredient"}
        </h3>
        <p className="py-2 text-base-content/80">
          Enter nutritional information per 100g
        </p>

        <form key={formKey} className="grid grid-cols-2 gap-4 py-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Ingredient Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Chicken Breast"
              className="input input-bordered"
              defaultValue={ingredient?.name}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Meat"
              className="input input-bordered"
              defaultValue={ingredient?.category}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Calories (kcal)</span>
            </label>
            <input
              type="number"
              placeholder="165"
              className="input input-bordered"
              defaultValue={ingredient?.calories}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Protein (g)</span>
            </label>
            <input
              type="number"
              placeholder="31"
              className="input input-bordered"
              defaultValue={ingredient?.protein}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Carbs (g)</span>
            </label>
            <input
              type="number"
              placeholder="0"
              className="input input-bordered"
              defaultValue={ingredient?.carbs}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Fat (g)</span>
            </label>
            <input
              type="number"
              placeholder="3.6"
              className="input input-bordered"
              defaultValue={ingredient?.fat}
            />
          </div>
        </form>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            {ingredient ? "Update" : "Add Ingredient"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
