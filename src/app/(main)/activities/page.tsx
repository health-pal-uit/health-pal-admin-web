"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { Activity } from "./type";
import Header from "@/src/components/shared/Header";
import { ActivityTable } from "./components/activity-table";
import { DeletedActivitiesTable } from "./components/deleted-activities-table";
import { AddEditActivityModal } from "./components/add-edit-modal";

export default function ActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/activities?page=1&limit=1000`);

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch activities");
        return;
      }

      const activitiesList = Array.isArray(data.data) ? data.data : [];
      setActivities(activitiesList);
    } catch (error) {
      toast.error("An error occurred while fetching activities.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const activeActivities = activities.filter((a) => !a.deleted_at);
  const deletedActivities = activities.filter((a) => a.deleted_at);

  const filteredActive = activeActivities.filter((activity) =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Client-side pagination
  const totalFilteredActivities = filteredActive.length;
  const totalPages = Math.ceil(totalFilteredActivities / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedActivities = filteredActive.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  const handleSaveActivity = async (data: {
    name: string;
    met_value: number;
    categories: string[];
  }) => {
    try {
      const isEdit = !!editingActivity;
      const url = isEdit
        ? `/api/activities/${editingActivity.id}`
        : "/api/activities";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const result = await res.json();

      if (!res.ok) {
        toast.error(
          result.message ||
            `Failed to ${isEdit ? "update" : "create"} activity`,
        );
        return;
      }

      toast.success(`Activity ${isEdit ? "updated" : "created"} successfully!`);
      await fetchActivities();
      handleCloseModal();
    } catch (error) {
      toast.error("An error occurred while saving the activity.");
      console.error(error);
    }
  };

  const handleDeleteActivity = (activity: Activity) => {
    setDeletingActivity(activity);
    (
      document.getElementById("delete_activity_modal") as HTMLDialogElement
    )?.showModal();
  };

  const confirmDelete = async () => {
    if (!deletingActivity) return;

    try {
      const res = await fetch(`/api/activities/${deletingActivity.id}`, {
        method: "DELETE",
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to delete activity");
        return;
      }

      toast.success("Activity deleted successfully!");
      (
        document.getElementById("delete_activity_modal") as HTMLDialogElement
      )?.close();
      setDeletingActivity(null);

      // Update local state instead of refetching
      setActivities((prev) => prev.filter((a) => a.id !== deletingActivity.id));

      // Adjust page if last item on current page was deleted
      if (paginatedActivities.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the activity.");
      console.error(error);
    }
  };

  const handleCancelDelete = () => {
    (
      document.getElementById("delete_activity_modal") as HTMLDialogElement
    )?.close();
    setDeletingActivity(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

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

      <ActivityTable
        activities={paginatedActivities}
        onEdit={handleAddEdit}
        onDelete={handleDeleteActivity}
      />

      {!isLoading && totalPages > 1 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div className="text-sm text-base-content/70">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, totalFilteredActivities)} of{" "}
                {totalFilteredActivities} {searchQuery ? "filtered " : ""}
                activities
              </div>
              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <button className="join-item btn btn-sm">
                  Page {currentPage} of {totalPages}
                </button>
                <button
                  className="join-item btn btn-sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeletedActivitiesTable activities={deletedActivities} />

      <AddEditActivityModal
        activity={editingActivity}
        onClose={handleCloseModal}
        onSave={handleSaveActivity}
      />

      <dialog id="delete_activity_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Delete</h3>
          <p className="py-4">
            Are you sure you want to delete activity{" "}
            <span className="font-semibold">
              &quot;{deletingActivity?.name}&quot;
            </span>
            ?
          </p>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleCancelDelete}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
