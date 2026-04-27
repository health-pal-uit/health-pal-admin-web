"use client";

import { Expert } from "../type";
import Image from "next/image";
import { useState, forwardRef } from "react";

interface ReviewExpertModalProps {
  expert: Expert | null;
  action: "approve" | "reject" | null;
  onClose: () => void;
  onSubmit: (notes?: string) => void;
  isLoading?: boolean;
}

export const ReviewExpertModal = forwardRef<
  HTMLDialogElement,
  ReviewExpertModalProps
>(({ expert, action, onClose, onSubmit, isLoading = false }, ref) => {
  const [notes, setNotes] = useState("");

  if (!expert || !action) return null;

  const handleSubmit = () => {
    onSubmit(notes);
    setNotes("");
  };

  const handleClose = () => {
    setNotes("");
    onClose();
  };

  return (
    <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {action === "approve" ? "Approve Expert" : "Reject Expert"}
        </h3>

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
                <p className="text-sm text-base-content/70">Experience</p>
                <p className="font-bold text-base-content">
                  {expert.experience_years} years
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Application Date</p>
                <p className="font-bold text-base-content">
                  {new Date(expert.application_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Certificates</p>
                <p className="font-bold text-base-content">
                  {expert.certificates_count || 0}
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

          {expert.qualifications && expert.qualifications.length > 0 && (
            <div className="bg-base-200 rounded-lg p-4">
              <p className="text-sm text-base-content/70 mb-2">
                Qualifications
              </p>
              <ul className="space-y-1">
                {expert.qualifications.map((qual, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-base-content flex items-start gap-2"
                  >
                    <span className="text-success">✓</span>
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {expert.status === "rejected" && expert.rejection_reason && (
            <div className="bg-error/10 rounded-lg p-4 border border-error/20">
              <p className="text-sm text-error font-bold mb-1">
                Rejection Reason
              </p>
              <p className="text-sm text-error/80">{expert.rejection_reason}</p>
            </div>
          )}

          {action === "reject" && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Rejection Reason (required)</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Enter rejection reason..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}
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
            className={`btn ${action === "approve" ? "btn-success" : "btn-error"}`}
            onClick={handleSubmit}
            disabled={isLoading || (action === "reject" && !notes.trim())}
          >
            {isLoading
              ? "Processing..."
              : action === "approve"
                ? "Approve"
                : "Reject"}
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
