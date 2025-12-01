import { ApprovedIngredient } from "../type";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ReviewModalProps {
  ingredient: ApprovedIngredient | null;
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

  const getImageUrl = (img: ApprovedIngredient["image_url"]): string | null => {
    if (!img) return null;
    if (typeof img === "string") return img;
    if (typeof img === "object" && "url" in img)
      return (img as { url: string }).url;
    return null;
  };

  const imgUrl = getImageUrl(ingredient.image_url);

  return (
    <dialog id="review_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {action === "approve" ? "Approve Ingredient" : "Reject Ingredient"}
        </h3>

        <div className="flex items-center gap-3 py-4">
          <div className="avatar">
            <div className="w-16 h-16 rounded-lg bg-base-200">
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt={ingredient.name}
                  width={64}
                  height={64}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-base-content/30" />
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="font-bold text-lg">{ingredient.name}</p>
            {ingredient.tags && ingredient.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {ingredient.tags.map((tag, index) => (
                  <span key={index} className="badge badge-outline badge-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 py-4">
          <div className="bg-base-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-base-content/70">Calories</p>
                <p className="font-bold text-base-content">
                  {ingredient.kcal_per_100gr} kcal/100g
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Protein</p>
                <p className="font-bold text-base-content">
                  {ingredient.protein_per_100gr}g
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Carbs</p>
                <p className="font-bold text-base-content">
                  {ingredient.carbs_per_100gr}g
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Fat</p>
                <p className="font-bold text-base-content">
                  {ingredient.fat_per_100gr}g
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Fiber</p>
                <p className="font-bold text-base-content">
                  {ingredient.fiber_per_100gr}g
                </p>
              </div>
            </div>
          </div>
          {ingredient.notes && (
            <div className="bg-base-200 rounded-lg p-4">
              <p className="text-sm text-base-content/70 mb-1">
                Ingredient Notes
              </p>
              <p className="text-base-content">{ingredient.notes}</p>
            </div>
          )}
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
