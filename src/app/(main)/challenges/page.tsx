"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Challenge } from "./type";
import { ChallengeCard } from "./components/challenge-card";
import { AddEditChallengeModal } from "./components/add-edit-modal";
import Header from "@/src/components/shared/Header";

export default function ChallengesPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalChallenges, setTotalChallenges] = useState(0);
  const [limit] = useState(10);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(
    null,
  );
  const [deletingChallenge, setDeletingChallenge] = useState<Challenge | null>(
    null,
  );

  const fetchChallenges = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/challenges?page=${currentPage}&limit=${limit}`,
      );

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch challenges");
        return;
      }

      const challengesList = Array.isArray(data.data) ? data.data : [];
      setChallenges(challengesList);
      setTotalChallenges(challengesList.length);
      setTotalPages(Math.ceil(challengesList.length / limit));
    } catch (error) {
      toast.error("An error occurred while fetching challenges.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, router]);

  const handleSaveChallenge = async (data: {
    name: string;
    note: string;
    difficulty: string;
    image?: File;
  }) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("difficulty", data.difficulty);

      if (data.note) {
        formData.append("note", data.note);
      }

      if (data.image) {
        formData.append("image", data.image);
      }

      const isEdit = !!editingChallenge;
      const url = isEdit
        ? `/api/challenges/${editingChallenge.id}`
        : "/api/challenges";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
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
            `Failed to ${isEdit ? "update" : "create"} challenge`,
        );
        return;
      }

      toast.success(
        `Challenge ${isEdit ? "updated" : "created"} successfully!`,
      );
      await fetchChallenges();
    } catch (error) {
      toast.error("An error occurred while saving the challenge.");
      console.error(error);
    }
  };

  const handleAddEdit = (challenge?: Challenge) => {
    setEditingChallenge(challenge || null);
    (
      document.getElementById("add_edit_challenge_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleDeleteChallenge = (challenge: Challenge) => {
    setDeletingChallenge(challenge);
    (
      document.getElementById("delete_challenge_modal") as HTMLDialogElement
    )?.showModal();
  };

  const confirmDelete = async () => {
    if (!deletingChallenge) return;

    try {
      const res = await fetch(`/api/challenges/${deletingChallenge.id}`, {
        method: "DELETE",
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to delete challenge");
        return;
      }

      toast.success("Challenge deleted successfully!");
      (
        document.getElementById("delete_challenge_modal") as HTMLDialogElement
      )?.close();
      setDeletingChallenge(null);
      await fetchChallenges();
    } catch (error) {
      toast.error("An error occurred while deleting the challenge.");
      console.error(error);
    }
  };

  const handleCancelDelete = () => {
    (
      document.getElementById("delete_challenge_modal") as HTMLDialogElement
    )?.close();
    setDeletingChallenge(null);
  };

  const handleCloseModal = () => {
    (
      document.getElementById("add_edit_challenge_modal") as HTMLDialogElement
    )?.close();
    setTimeout(() => {
      setEditingChallenge(null);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-8">
      <Header
        tabName="Challenge Management"
        description="Create and manage health challenges for users"
        buttonName="Challenge"
        onAddClick={() => handleAddEdit()}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : challenges.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-center py-8 text-base-content/50">
              No challenges found
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onEdit={handleAddEdit}
              onDelete={handleDeleteChallenge}
            />
          ))}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div className="text-sm text-base-content/70">
                Showing {(currentPage - 1) * limit + 1} to{" "}
                {Math.min(currentPage * limit, totalChallenges)} of{" "}
                {totalChallenges} challenges
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

      <AddEditChallengeModal
        challenge={editingChallenge}
        onClose={handleCloseModal}
        onSave={handleSaveChallenge}
      />

      <dialog id="delete_challenge_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận xóa</h3>
          <p className="py-4">
            Bạn có chắc chắn muốn xóa challenge{" "}
            <span className="font-semibold">
              &quot;{deletingChallenge?.name}&quot;
            </span>
            ?
          </p>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleCancelDelete}
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={confirmDelete}
            >
              Xóa
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleCancelDelete}>close</button>
        </form>
      </dialog>
    </div>
  );
}
