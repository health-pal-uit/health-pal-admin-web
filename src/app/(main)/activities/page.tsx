"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Activity } from "./type";
import Header from "@/src/components/shared/Header";
import { ActivityTable } from "./components/activity-table";
import { DeletedActivitiesTable } from "./components/deleted-activities-table";
import { AddEditActivityModal } from "./components/add-edit-modal";

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

      <ActivityTable activities={filteredActive} onEdit={handleAddEdit} />

      <DeletedActivitiesTable activities={deletedActivities} />

      <AddEditActivityModal
        activity={editingActivity}
        onClose={handleCloseModal}
      />
    </div>
  );
}
