import { Recipe } from "../type";

interface ReviewModalProps {
  recipe: Recipe | null;
  action: "approve" | "reject" | null;
  onClose: () => void;
  onSubmit: () => void;
}

export const ReviewModal = ({
  recipe,
  action,
  onClose,
  onSubmit,
}: ReviewModalProps) => {
  return (
    <dialog id="review_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {action === "approve" ? "Approve Recipe" : "Reject Recipe"}
        </h3>
        <p className="py-2 text-base-content/80">Recipe: {recipe?.title}</p>

        <div className="space-y-4 py-4">
          {action === "approve" && (
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
            onClick={onSubmit}
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
};
