"use client";

import { Challenge } from "../type";

interface AddEditModalProps {
  challenge: Challenge | null;
  onClose: () => void;
}

export function AddEditChallengeModal({
  challenge,
  onClose,
}: AddEditModalProps) {
  const formKey = challenge ? `edit-${challenge.id}` : "add-new";

  return (
    <dialog id="add_edit_challenge_modal" className="modal modal-middle">
      <div className="modal-box rounded-xl p-6 bg-base-100 max-w-lg">
        <h3 className="font-semibold text-xl">
          {challenge ? "Edit Challenge" : "Create New Challenge"}
        </h3>
        <p className="mt-1 text-base-content/70">Fill in challenge details</p>

        <form key={formKey} className="mt-6 space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium">Challenge Name</label>
            <input
              type="text"
              placeholder="e.g., 30 Day Detox"
              defaultValue={challenge?.title}
              className="input input-bordered w-full rounded-lg bg-base-200/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder="Detailed description of the challenge..."
              defaultValue={challenge?.description}
              className="textarea textarea-bordered w-full rounded-lg bg-base-200/50 h-24"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                defaultValue={challenge?.startDate}
                className="input input-bordered w-full rounded-lg bg-base-200/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">End Date</label>
              <input
                type="date"
                defaultValue={challenge?.endDate}
                className="input input-bordered w-full rounded-lg bg-base-200/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Duration</label>
            <input
              type="text"
              placeholder="e.g., 30 days"
              defaultValue={challenge?.duration}
              className="input input-bordered w-full rounded-lg bg-base-200/50"
            />
          </div>
        </form>

        <div className="modal-action flex justify-end gap-2 mt-4">
          <button className="btn btn-sm rounded-lg" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-sm btn-primary rounded-lg"
            onClick={onClose}
          >
            {challenge ? "Update" : "Create Challenge"}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
