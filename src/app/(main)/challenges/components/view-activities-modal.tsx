"use client";

import { X, Activity } from "lucide-react";
import { Challenge } from "../type";

interface ViewActivitiesModalProps {
  challenge: Challenge | null;
  onClose: () => void;
}

export const ViewActivitiesModal = ({
  challenge,
  onClose,
}: ViewActivitiesModalProps) => {
  if (!challenge) return null;

  const totalDuration = challenge.activity_records.reduce(
    (sum, record) => sum + record.duration_minutes,
    0,
  );

  return (
    <dialog id="view_activities_modal" className="modal">
      <div className="modal-box max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">Challenge Activities</h3>
            <p className="text-sm text-base-content/70 mt-1">
              {challenge.name}
            </p>
          </div>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-base-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {challenge.activity_records.length}{" "}
                {challenge.activity_records.length === 1
                  ? "Activity"
                  : "Activities"}
              </span>
            </div>
            <span className="text-sm text-base-content/70">
              {totalDuration} min total
            </span>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {challenge.activity_records.length === 0 ? (
            <div className="text-center py-8 text-base-content/50">
              No activities added yet
            </div>
          ) : (
            challenge.activity_records.map((record, index) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {record.activity?.name || "Unknown Activity"}
                      </span>
                      <span className="badge badge-sm badge-ghost">
                        #{index + 1}
                      </span>
                    </div>
                    <p className="text-xs text-base-content/60 mt-1">
                      {new Date(record.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">
                    {record.duration_minutes} min
                  </div>
                  {record.kcal_burned && (
                    <div className="text-xs text-base-content/60">
                      {record.kcal_burned} kcal
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose} type="button">
          close
        </button>
      </form>
    </dialog>
  );
};
