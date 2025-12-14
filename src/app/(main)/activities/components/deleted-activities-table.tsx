"use client";

import { Activity as ActivityIcon } from "lucide-react";
import { Activity } from "../type";

interface DeletedActivitiesTableProps {
  activities: Activity[];
}

export function DeletedActivitiesTable({
  activities,
}: DeletedActivitiesTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (activities.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mb-4">Deleted Activities</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Activity Name</th>
                <th>MET Value</th>
                <th>Categories</th>
                <th>Created At</th>
                <th>Deleted At</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id} className="opacity-60">
                  <td>
                    <div className="flex items-center gap-2">
                      <ActivityIcon className="h-4 w-4 text-base-content/40" />
                      {activity.name}
                    </div>
                  </td>
                  <td>{activity.met_value.toFixed(1)}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {activity.categories.map((category, idx) => (
                        <div
                          key={idx}
                          className="badge badge-outline badge-ghost badge-sm"
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>{formatDate(activity.created_at)}</td>
                  <td>
                    {activity.deleted_at && formatDate(activity.deleted_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
