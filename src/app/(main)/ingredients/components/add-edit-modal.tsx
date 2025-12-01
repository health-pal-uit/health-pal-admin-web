import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ApprovedIngredient } from "../type";

interface AddEditModalProps {
  ingredient: ApprovedIngredient | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddEditIngredientModal({
  ingredient,
  onClose,
  onSuccess,
}: AddEditModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formKey = ingredient ? `edit-${ingredient.id}` : "add-new";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const tagsString = formData.get("tags") as string;

    const payload = {
      name: formData.get("name") as string,
      kcal_per_100gr: parseFloat(formData.get("kcal_per_100gr") as string),
      protein_per_100gr: parseFloat(
        formData.get("protein_per_100gr") as string,
      ),
      fat_per_100gr: parseFloat(formData.get("fat_per_100gr") as string),
      carbs_per_100gr: parseFloat(formData.get("carbs_per_100gr") as string),
      fiber_per_100gr: parseFloat(formData.get("fiber_per_100gr") as string),
      notes: (formData.get("notes") as string) || null,
      tags: tagsString ? tagsString.split(",").map((tag) => tag.trim()) : [],
    };

    if (!payload.name) {
      toast.error("Please enter an ingredient name");
      return;
    }

    try {
      setIsSubmitting(true);

      if (ingredient) {
        const res = await fetch(`/api/ingredients/${ingredient.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          router.push("/login");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to update ingredient");
          return;
        }

        toast.success("Ingredient updated successfully");
      } else {
        // TODO: Add new ingredient API call when endpoint is available
        toast.success("Add ingredient functionality coming soon");
        return;
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error("An error occurred while saving the ingredient");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog id="add_edit_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg">
          {ingredient ? "Edit Ingredient" : "Add New Ingredient"}
        </h3>
        <p className="py-2 text-base-content/80">
          Enter nutritional information per 100g
        </p>

        <form
          key={formKey}
          className="grid grid-cols-2 gap-4 py-4"
          onSubmit={handleSubmit}
        >
          <div className="form-control">
            <label className="label">
              <span className="label-text">Ingredient Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Chicken Breast"
              className="input input-bordered"
              defaultValue={ingredient?.name}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Tags (comma-separated)</span>
            </label>
            <input
              type="text"
              name="tags"
              placeholder="e.g., meat, protein"
              className="input input-bordered"
              defaultValue={ingredient?.tags?.join(", ")}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Calories (kcal)</span>
            </label>
            <input
              type="number"
              name="kcal_per_100gr"
              placeholder="165"
              step="0.01"
              className="input input-bordered"
              defaultValue={ingredient?.kcal_per_100gr}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Protein (g)</span>
            </label>
            <input
              type="number"
              name="protein_per_100gr"
              placeholder="31"
              step="0.01"
              className="input input-bordered"
              defaultValue={ingredient?.protein_per_100gr}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Carbs (g)</span>
            </label>
            <input
              type="number"
              name="carbs_per_100gr"
              placeholder="0"
              step="0.01"
              className="input input-bordered"
              defaultValue={ingredient?.carbs_per_100gr}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Fat (g)</span>
            </label>
            <input
              type="number"
              name="fat_per_100gr"
              placeholder="3.6"
              step="0.01"
              className="input input-bordered"
              defaultValue={ingredient?.fat_per_100gr}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Fiber (g)</span>
            </label>
            <input
              type="number"
              name="fiber_per_100gr"
              placeholder="0"
              step="0.01"
              className="input input-bordered"
              defaultValue={ingredient?.fiber_per_100gr}
              required
            />
          </div>
          <div className="form-control col-span-2">
            <label className="label">
              <span className="label-text">Notes (optional)</span>
            </label>
            <textarea
              name="notes"
              placeholder="Additional information..."
              className="textarea textarea-bordered"
              defaultValue={ingredient?.notes || ""}
            />
          </div>

          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>{ingredient ? "Update" : "Add Ingredient"}</>
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
