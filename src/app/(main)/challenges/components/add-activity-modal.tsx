"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { Challenge } from "../type";

interface Activity {
  id: string;
  name: string;
  met_value: number;
  categories: string[];
}

interface AddActivityModalProps {
  challenge: Challenge | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddActivityModal = ({
  challenge,
  onClose,
  onSuccess,
}: AddActivityModalProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (challenge) {
      fetchActivities();
    }
  }, [challenge]);

  const fetchActivities = async () => {
    try {
      setIsLoadingActivities(true);
      const res = await fetch("/api/activities?page=1&limit=1000");

      if (!res.ok) {
        throw new Error("Failed to fetch activities");
      }

      const data = await res.json();
      const activitiesList = Array.isArray(data.data) ? data.data : [];

      // Filter only active activities
      const activeActivities = activitiesList.filter(
        (activity: Activity) => !activity.deleted_at,
      );

      setActivities(activeActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Failed to load activities");
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge || !selectedActivityId || !durationMinutes) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/activity-records/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activity_id: selectedActivityId,
          challenge_id: challenge.id,
          duration_minutes: parseInt(durationMinutes),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add activity");
      }

      toast.success("Activity added to challenge successfully!");
      onSuccess();
      onClose();

      // Reset form
      setSelectedActivityId("");
      setDurationMinutes("");
    } catch (error) {
      console.error("Error adding activity:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add activity",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedActivityId("");
    setDurationMinutes("");
    onClose();
  };

  if (!challenge) return null;

  return (
    <dialog id="add_activity_modal" className="modal">
      <div className="modal-box">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">Add Activity to Challenge</h3>
            <p className="text-sm text-base-content/70 mt-1">
              {challenge.name}
            </p>
          </div>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handleClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Select Activity *</span>
            </label>
            {isLoadingActivities ? (
              <div className="flex items-center justify-center h-12">
                <span className="loading loading-spinner loading-sm"></span>
              </div>
            ) : (
              <select
                className="select select-bordered w-full"
                value={selectedActivityId}
                onChange={(e) => setSelectedActivityId(e.target.value)}
                required
              >
                <option value="">Choose an activity...</option>
                {activities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.name} (MET: {activity.met_value})
                  </option>
                ))}
              </select>
            )}
            {activities.length === 0 && !isLoadingActivities && (
              <label className="label">
                <span className="label-text-alt text-warning">
                  No activities available
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Duration (minutes) *</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="e.g., 60"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              min="1"
              required
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                How long should this activity be performed?
              </span>
            </label>
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !selectedActivityId || !durationMinutes}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Adding...
                </>
              ) : (
                "Add Activity"
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose} type="button">
          close
        </button>
      </form>
    </dialog>
  );
};
