"use client";

import { useState, useEffect } from "react";
import { Activity } from "../type";

interface AddEditActivityModalProps {
  activity: Activity | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    met_value: number;
    categories: string[];
  }) => Promise<void>;
}

export function AddEditActivityModal({
  activity,
  onClose,
  onSave,
}: AddEditActivityModalProps) {
  const [name, setName] = useState("");
  const [metValue, setMetValue] = useState("");
  const [categories, setCategories] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activity) {
      setName(activity.name);
      setMetValue(activity.met_value.toString());
      setCategories(activity.categories?.join(", ") || "");
    } else {
      setName("");
      setMetValue("");
      setCategories("");
    }
  }, [activity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const metValueNum = parseFloat(metValue);
    if (isNaN(metValueNum) || metValueNum <= 0) {
      return;
    }

    const categoriesArray = categories
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        met_value: metValueNum,
        categories: categoriesArray,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog id="add_edit_activity_modal" className="modal modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {activity ? "Edit Activity" : "Add New Activity"}
        </h3>
        <p className="py-2 text-base-content/70">
          Enter activity details and MET (Metabolic Equivalent of Task) value
        </p>

        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Activity Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Running, Swimming"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
              required
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
              value={metValue}
              onChange={(e) => setMetValue(e.target.value)}
              className="input input-bordered w-full"
              required
              min="0.1"
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
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="modal-action">
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
              ) : activity ? (
                "Update Activity"
              ) : (
                "Add Activity"
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
