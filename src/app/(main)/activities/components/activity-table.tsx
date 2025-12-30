"use client";

import {
  MoreVertical,
  Pencil,
  Trash2,
  Activity as ActivityIcon,
} from "lucide-react";
import { Activity, ActivityTypeLabels } from "../type";

interface ActivityTableProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete?: (activity: Activity) => void;
}

export function ActivityTable({
  activities,
  onEdit,
  onDelete,
}: ActivityTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mb-4">Active Activities</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Activity Name</th>
                <th>MET Value</th>
                <th>Categories</th>
                <th>Created At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-base-content/50"
                  >
                    No activities found
                  </td>
                </tr>
              ) : (
                activities.map((activity) => (
                  <tr key={activity.id} className="hover">
                    <td>
                      <div className="flex items-center gap-2 font-semibold">
                        <ActivityIcon className="h-4 w-4 text-primary" />
                        {activity.name}
                      </div>
                    </td>
                    <td>{activity.met_value.toFixed(1)}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {activity.categories.map((category, idx) => (
                          <div
                            key={idx}
                            className="badge badge-outline badge-primary badge-sm capitalize"
                          >
                            {ActivityTypeLabels[
                              category as keyof typeof ActivityTypeLabels
                            ] || category}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>{formatDate(activity.created_at)}</td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <button
                          tabIndex={0}
                          className="btn btn-ghost btn-circle btn-sm"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10"
                        >
                          <li>
                            <a onClick={() => onEdit(activity)}>
                              <Pencil className="h-4 w-4" /> Edit
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-error"
                              onClick={() => onDelete?.(activity)}
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
