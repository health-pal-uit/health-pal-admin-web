"use client";

import { Activity } from "../type";

interface AddEditActivityModalProps {
  activity: Activity | null;
  onClose: () => void;
}

export function AddEditActivityModal({
  activity,
  onClose,
}: AddEditActivityModalProps) {
  return (
    <dialog id="add_edit_activity_modal" className="modal modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {activity ? "Edit Activity" : "Add New Activity"}
        </h3>
        <p className="py-2 text-base-content/70">
          Enter activity details and MET (Metabolic Equivalent of Task) value
        </p>

        <form className="space-y-4 mt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Activity Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Running, Swimming"
              defaultValue={activity?.name}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">MET Value</span>
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g., 9.8"
              defaultValue={activity?.met_value}
              className="input input-bordered w-full"
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                MET represents the energy cost of physical activities
              </span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Categories</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Cardio, Outdoor (comma-separated)"
              defaultValue={activity?.categories?.join(", ")}
              className="input input-bordered w-full"
            />
          </div>
        </form>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            {activity ? "Update Activity" : "Add Activity"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
