"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Medal } from "./type";
import { MedalCard } from "./components/medal-card";
import { AddEditMedalModal } from "./components/add-edit-modal";
import { LinkChallengeModal } from "./components/link-challenge-modal";
import { ViewChallengesModal } from "./components/view-challenges-modal";
import Header from "@/src/components/shared/Header";

export default function MedalsPage() {
  const router = useRouter();
  const [medals, setMedals] = useState<Medal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMedals, setTotalMedals] = useState(0);
  const [limit] = useState(10);
  const [editingMedal, setEditingMedal] = useState<Medal | null>(null);
  const [linkingMedal, setLinkingMedal] = useState<Medal | null>(null);
  const [viewingChallengesMedal, setViewingChallengesMedal] =
    useState<Medal | null>(null);

  useEffect(() => {
    const fetchMedals = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/medals?page=${currentPage}&limit=${limit}`,
        );

        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          router.push("/login");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to fetch medals");
          return;
        }

        const medalsList = Array.isArray(data.data.data) ? data.data.data : [];
        setMedals(medalsList);
        setTotalMedals(data.data.total || 0);
        setTotalPages(Math.ceil((data.data.total || 0) / limit));
      } catch (error) {
        toast.error("An error occurred while fetching medals.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedals();
  }, [currentPage, limit, router]);

  const handleAddEdit = (medal?: Medal) => {
    setEditingMedal(medal || null);
    (
      document.getElementById("add_edit_medal_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleCloseModal = () => {
    (
      document.getElementById("add_edit_medal_modal") as HTMLDialogElement
    )?.close();
    setTimeout(() => {
      setEditingMedal(null);
    }, 300);
  };

  const handleMedalSuccess = async () => {
    try {
      const res = await fetch(`/api/medals?page=${currentPage}&limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        const medalsList = Array.isArray(data.data.data) ? data.data.data : [];
        setMedals(medalsList);
        setTotalMedals(data.data.total || 0);
      }
    } catch (error) {
      console.error("Error refetching medals:", error);
    }
  };

  const handleLinkChallenge = (medal: Medal) => {
    setLinkingMedal(medal);
    (
      document.getElementById("link_challenge_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleCloseLinkModal = () => {
    (
      document.getElementById("link_challenge_modal") as HTMLDialogElement
    )?.close();
    setTimeout(() => {
      setLinkingMedal(null);
    }, 300);
  };

  const handleLinkSuccess = () => {
    toast.success("Medal linked to challenge successfully!");
    handleMedalSuccess();
  };

  const handleOpenViewChallenges = (medal: Medal) => {
    setViewingChallengesMedal(medal);
    (
      document.getElementById("view_challenges_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleCloseViewChallenges = () => {
    (
      document.getElementById("view_challenges_modal") as HTMLDialogElement
    )?.close();
    setTimeout(() => {
      setViewingChallengesMedal(null);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-8">
      <Header
        tabName="Medal Management"
        description="Create and manage achievement medals for users"
        buttonName="Medal"
        onAddClick={() => handleAddEdit()}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : medals.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-center py-8 text-base-content/50">
              No medals found
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medals.map((medal) => (
            <MedalCard
              key={medal.id}
              medal={medal}
              onEdit={handleAddEdit}
              onLinkChallenge={handleLinkChallenge}
              onViewChallenges={handleOpenViewChallenges}
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
                {Math.min(currentPage * limit, totalMedals)} of {totalMedals}{" "}
                medals
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

      <AddEditMedalModal
        medal={editingMedal}
        onClose={handleCloseModal}
        onSuccess={handleMedalSuccess}
      />

      <LinkChallengeModal
        medal={linkingMedal}
        onClose={handleCloseLinkModal}
        onSuccess={handleLinkSuccess}
      />

      <ViewChallengesModal
        medal={viewingChallengesMedal}
        onClose={handleCloseViewChallenges}
      />
    </div>
  );
}
