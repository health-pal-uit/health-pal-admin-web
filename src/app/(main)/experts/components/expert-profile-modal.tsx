"use client";

import { Expert } from "../type";
import Image from "next/image";
import { forwardRef, useState } from "react";
import { X } from "lucide-react";

interface ExpertProfileModalProps {
  expert: Expert | null;
  onClose: () => void;
}

export const ExpertProfileModal = forwardRef<
  HTMLDialogElement,
  ExpertProfileModalProps
>(({ expert, onClose }, ref) => {
  if (!expert) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-2xl">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4 pb-4 border-b border-base-300">
          <div className="avatar">
            <div className="w-20 h-20 rounded-lg bg-base-200">
              {expert.avatar ? (
                <Image
                  src={expert.avatar}
                  alt={expert.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-base-content/50">
                  {expert.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-base-content">
              {expert.name}
            </h2>
            <p className="text-base-content/60">{expert.email}</p>
            {expert.phone && (
              <p className="text-base-content/60">{expert.phone}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`badge ${
                  expert.status === "verified"
                    ? "badge-success"
                    : "badge-warning"
                }`}
              >
                {expert.status === "verified" ? "Verified" : "Pending"}
              </span>
              {expert.canDoVideo && (
                <span className="badge badge-info">Video Available</span>
              )}
            </div>
          </div>
        </div>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="bg-base-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-base-content/60 uppercase">
                Specialization
              </p>
              <p className="text-sm font-bold text-base-content mt-1">
                {expert.specialization}
              </p>
            </div>

            <div className="bg-base-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-base-content/60 uppercase">
                Rating
              </p>
              <p className="text-sm font-bold text-base-content mt-1">
                {expert.rating.count > 0
                  ? `${expert.rating.avg.toFixed(1)}★ (${expert.rating.count})`
                  : "No ratings"}
              </p>
            </div>

            <div className="bg-base-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-base-content/60 uppercase">
                Applied Date
              </p>
              <p className="text-sm font-bold text-base-content mt-1">
                {new Date(expert.application_date).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-base-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-base-content/60 uppercase">
                Verified Since
              </p>
              <p className="text-sm font-bold text-base-content mt-1">
                {new Date(expert.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-base-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-base-content/60 uppercase">
                Token Rate
              </p>
              <p className="text-sm font-bold text-base-content mt-1">
                {expert.tokenPerMinute} tokens/min
              </p>
            </div>

            <div className="bg-base-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-base-content/60 uppercase">
                Status
              </p>
              <p className="text-sm font-bold text-base-content mt-1 capitalize">
                {expert.isVerified ? "Active" : "Pending"}
              </p>
            </div>
          </div>

          {expert.bio && (
            <div className="bg-base-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-base-content/70 mb-2">
                Bio
              </p>
              <p className="text-sm text-base-content leading-relaxed">
                {expert.bio}
              </p>
            </div>
          )}

          {expert.licenseUrl && (
            <div className="bg-base-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-base-content/70 mb-3">
                License
              </p>
              <div className="relative w-full h-48 bg-base-300 rounded overflow-hidden">
                <Image
                  src={expert.licenseUrl}
                  alt="License"
                  fill
                  className="object-cover"
                />
              </div>
              {expert.licenseId && (
                <p className="text-xs text-base-content/60 mt-2">
                  License ID: {expert.licenseId}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="modal-action border-t border-base-300 pt-4">
          <button className="btn btn-ghost" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>Close</button>
      </form>
    </dialog>
  );
});

ExpertProfileModal.displayName = "ExpertProfileModal";
