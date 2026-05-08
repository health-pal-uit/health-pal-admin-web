"use client";

import { Expert } from "../type";
import Image from "next/image";
import { useState, forwardRef } from "react";

interface ReviewExpertModalProps {
  expert: Expert | null;
  onClose: () => void;
  onVerify: (notes?: string) => void;
  onReject: (notes: string) => void;
  isLoading?: boolean;
}

export const ReviewExpertModal = forwardRef<
  HTMLDialogElement,
  ReviewExpertModalProps
>(({ expert, onClose, onVerify, onReject, isLoading = false }, ref) => {
  const [notes, setNotes] = useState("");

  if (!expert) return null;

  const handleVerify = () => {
    onVerify(notes);
    setNotes("");
  };

  const handleReject = () => {
    if (!notes.trim()) return;
    onReject(notes);
    setNotes("");
  };

  const handleClose = () => {
    setNotes("");
    onClose();
  };

  return (
    <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Review Expert</h3>

        <div className="flex items-center gap-3 py-4">
          <div className="avatar">
            <div className="w-16 h-16 rounded-lg bg-base-200">
              {expert.avatar ? (
                <Image
                  src={expert.avatar}
                  alt={expert.name}
                  width={64}
                  height={64}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-base-content/50">
                  {expert.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="font-bold text-lg">{expert.name}</p>
            <p className="text-sm text-base-content/60">{expert.email}</p>
            {expert.phone && (
              <p className="text-sm text-base-content/60">{expert.phone}</p>
            )}
          </div>
        </div>

        <div className="space-y-4 py-4">
          <div className="bg-base-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-base-content/70">Specialization</p>
                <p className="font-bold text-base-content">
                  {expert.specialization}
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Rating</p>
                <p className="font-bold text-base-content">
                  {expert.rating.count > 0
                    ? `${expert.rating.avg.toFixed(1)}★ (${expert.rating.count})`
                    : "No ratings"}
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Application Date</p>
                <p className="font-bold text-base-content">
                  {new Date(expert.application_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Video Available</p>
                <p className="font-bold text-base-content">
                  {expert.canDoVideo ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {expert.bio && (
            <div className="bg-base-200 rounded-lg p-4">
              <p className="text-sm text-base-content/70 mb-1">Bio</p>
              <p className="text-base-content">{expert.bio}</p>
            </div>
          )}

          {expert.licenseUrl && (
            <div className="bg-base-200 rounded-lg p-4">
              <p className="text-sm text-base-content/70 mb-2">License</p>
              <div className="relative w-full h-40 bg-base-300 rounded">
                <Image
                  src={expert.licenseUrl}
                  alt="License"
                  fill
                  className="rounded object-cover"
                />
              </div>
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text">Notes (required for rejection)</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Enter notes or rejection reason..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={handleReject}
            disabled={isLoading || !notes.trim()}
          >
            {isLoading ? "Processing..." : "Reject"}
          </button>
          <button
            className="btn btn-success"
            onClick={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Verify"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose} disabled={isLoading}>
          Close
        </button>
      </form>
    </dialog>
  );
});

ReviewExpertModal.displayName = "ReviewExpertModal";
