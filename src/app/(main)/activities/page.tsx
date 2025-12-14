"use client";

import { useState } from "react";
import {
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Activity as ActivityIcon,
} from "lucide-react";
import { Activity } from "./type";
import Header from "@/src/components/shared/Header";

const mockActivities = [
  {
    id: "1",
    name: "Running",
    met_value: 9.8,
    categories: ["Cardio", "Outdoor"],
    created_at: "2024-01-15T00:00:00.000Z",
    deleted_at: null,
  },
  {
    id: "2",
    name: "Swimming",
    met_value: 8.0,
    categories: ["Cardio", "Water Sports"],
    created_at: "2024-01-16T00:00:00.000Z",
    deleted_at: null,
  },
  {
    id: "3",
    name: "Yoga",
    met_value: 3.0,
    categories: ["Flexibility", "Mind-Body"],
    created_at: "2024-01-17T00:00:00.000Z",
    deleted_at: null,
  },
  {
    id: "4",
    name: "Weight Training",
    met_value: 6.0,
    categories: ["Strength", "Gym"],
    created_at: "2024-01-18T00:00:00.000Z",
    deleted_at: null,
  },
  {
    id: "5",
    name: "Cycling",
    met_value: 7.5,
    categories: ["Cardio", "Outdoor"],
    created_at: "2024-01-19T00:00:00.000Z",
    deleted_at: null,
  },
  {
    id: "6",
    name: "Walking",
    met_value: 3.5,
    categories: ["Cardio", "Outdoor"],
    created_at: "2024-01-10T00:00:00.000Z",
    deleted_at: "2024-02-01T00:00:00.000Z",
  },
];

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const activeActivities = mockActivities.filter((a) => !a.deleted_at);
  const deletedActivities = mockActivities.filter((a) => a.deleted_at);

  const filteredActive = activeActivities.filter((activity) =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddEdit = (activity?: Activity) => {
    setEditingActivity(activity || null);
    (
      document.getElementById("add_edit_activity_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleCloseModal = () => {
    (
      document.getElementById("add_edit_activity_modal") as HTMLDialogElement
    )?.close();
    setTimeout(() => {
      setEditingActivity(null);
    }, 300);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <Header
        tabName="Activities Management"
        description="Manage physical activities and their MET values"
        buttonName="Activity"
        onAddClick={() => handleAddEdit()}
      />

      <label className="input input-bordered flex items-center gap-2 rounded-full">
        <Search className="h-5 w-5 text-base-content/60" />
        <input
          type="text"
          className="grow"
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </label>

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
                {filteredActive.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-base-content/50"
                    >
                      No activities found
                    </td>
                  </tr>
                ) : (
                  filteredActive.map((activity) => (
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
                              className="badge badge-outline badge-primary badge-sm"
                            >
                              {category}
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
                              <a onClick={() => handleAddEdit(activity)}>
                                <Pencil className="h-4 w-4" /> Edit
                              </a>
                            </li>
                            <li>
                              <a className="text-error">
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

      {deletedActivities.length > 0 && (
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
                  {deletedActivities.map((activity) => (
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
      )}

      <dialog id="add_edit_activity_modal" className="modal modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {editingActivity ? "Edit Activity" : "Add New Activity"}
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
                defaultValue={editingActivity?.name}
                className="input input-bordered"
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
                defaultValue={editingActivity?.met_value}
                className="input input-bordered"
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
                defaultValue={editingActivity?.categories?.join(", ")}
                className="input input-bordered"
              />
            </div>
          </form>

          <div className="modal-action">
            <button className="btn btn-ghost" onClick={handleCloseModal}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCloseModal}>
              {editingActivity ? "Update Activity" : "Add Activity"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleCloseModal}>close</button>
        </form>
      </dialog>
    </div>
  );
}
