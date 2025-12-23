"use client";

import { useState } from "react";
import type { Recipe } from "../type";

interface RejectModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export function RejectModal({ recipe, onClose, onSubmit }: RejectModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) {
      return;
    }
    onSubmit(reason);
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <dialog id="reject_modal" className="modal">
      {recipe && (
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Reject Recipe</h3>
          <form method="dialog" className="modal-backdrop">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleClose}
            >
              ✕
            </button>
          </form>

          <div className="py-4">
            <div className="mb-4">
              <p className="text-base-content/70 mb-2">
                You are about to reject: <strong>{recipe.title}</strong>
              </p>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Rejection Reason <span className="text-error">*</span>
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Please provide a reason for rejection..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-action">
            <button className="btn btn-ghost" onClick={handleClose}>
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={handleSubmit}
              disabled={!reason.trim()}
            >
              Reject Recipe
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
