"use client";
import { Post } from "../type";

interface ReviewModalProps {
  post: Post | null;
  action: "approve" | "reject" | null;
  onClose: () => void;
}

export function ReviewModal({ post, action, onClose }: ReviewModalProps) {
  if (!post) return null;

  return (
    <dialog id="review_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {action === "approve" ? "Approve Post" : "Reject/Delete Post"}
        </h3>
        <p className="py-2 text-base-content/80">
          Post from {post.user?.fullname || "Unknown User"} (@
          {post.user?.username || "N/A"})
        </p>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-base-200 rounded-lg">
            <p className="text-base-content">{post.content}</p>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Notes {action === "reject" && "(required)"}
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24 w-full"
              placeholder="Enter reason or notes..."
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
