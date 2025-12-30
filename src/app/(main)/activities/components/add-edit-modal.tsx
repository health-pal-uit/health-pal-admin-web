"use client";

import { useState, useEffect } from "react";
import { Activity, ActivityType, ActivityTypeLabels } from "../type";

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activity) {
      setName(activity.name);
      setMetValue(activity.met_value.toString());
      setSelectedCategories(activity.categories || []);
    } else {
      setName("");
      setMetValue("");
      setSelectedCategories([]);
    }
  }, [activity]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const metValueNum = parseFloat(metValue);
    if (isNaN(metValueNum) || metValueNum <= 0) {
      return;
    }

    if (selectedCategories.length === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        met_value: metValueNum,
        categories: selectedCategories,
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
              <span className="label-text">Categories *</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(ActivityType).map((type) => (
                <label
                  key={type}
                  className="label cursor-pointer justify-start gap-2 p-2 border rounded-lg hover:bg-base-200"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={selectedCategories.includes(type)}
                    onChange={() => handleCategoryToggle(type)}
                  />
                  <span className="label-text">{ActivityTypeLabels[type]}</span>
                </label>
              ))}
            </div>
            {selectedCategories.length === 0 && (
              <label className="label">
                <span className="label-text-alt text-error">
                  Please select at least one category
                </span>
              </label>
            )}
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
