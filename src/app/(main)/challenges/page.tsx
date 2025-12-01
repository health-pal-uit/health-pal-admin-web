"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { Challenge } from "./type";
import { ChallengeCard } from "./components/challenge-card";
import { AddEditChallengeModal } from "./components/add-edit-modal";

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
  }, [currentPage, limit, router]);

  const handleSaveChallenge = async (data: {
    name: string;
    note: string;
    difficulty: string;
    image?: File;
  }) => {
    if (!editingChallenge) return;

    try {
      const body: Record<string, string> = {
        name: data.name,
        difficulty: data.difficulty,
      };

      if (data.note) {
        body.note = data.note;
      }

      // TODO: Handle image upload separately if needed
      // Image upload might require multipart/form-data or a separate endpoint

      const res = await fetch(`/api/challenges/${editingChallenge.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to update challenge");
        return;
      }

      toast.success("Challenge updated successfully!");
      await fetchChallenges();
    } catch (error) {
      toast.error("An error occurred while updating the challenge.");
      console.error(error);
    }
  };

  const handleAddEdit = (challenge?: Challenge) => {
    setEditingChallenge(challenge || null);
    (
      document.getElementById("add_edit_challenge_modal") as HTMLDialogElement
    )?.showModal();
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Challenge Management
          </h1>
          <p className="text-base-content/70">
            Create and manage health challenges for users
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => handleAddEdit()}>
          <Plus className="h-4 w-4" />
          Create Challenge
        </button>
      </div>

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
    </div>
  );
}
