"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Challenge } from "./type";
import { ChallengeCard } from "./components/challenge-card";
import { AddEditChallengeModal } from "./components/add-edit-modal";

const mockChallenges: Challenge[] = [
  {
    id: 1,
    title: "30 Day Detox",
    description: "Join a 30-day detox program",
    duration: "30 days",
    participants: 245,
    status: "active",
    startDate: "01/11/2024",
    endDate: "30/11/2024",
  },
  {
    id: 2,
    title: "7 Day Plank Challenge",
    description: "Plank exercise every day for a week",
    duration: "7 days",
    participants: 432,
    status: "active",
    startDate: "01/11/2024",
    endDate: "07/11/2024",
  },
  {
    id: 3,
    title: "Vegan Week",
    description: "Try a complete plant-based diet",
    duration: "7 days",
    participants: 189,
    status: "upcoming",
    startDate: "15/11/2024",
    endDate: "21/11/2024",
  },
  {
    id: 4,
    title: "10,000 Steps Daily",
    description: "Walk 10,000 steps every day for 30 days",
    duration: "30 days",
    participants: 567,
    status: "active",
    startDate: "01/11/2024",
    endDate: "30/11/2024",
  },
];

export default function ChallengesPage() {
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(
    null,
  );

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onEdit={handleAddEdit}
          />
        ))}
      </div>

      <AddEditChallengeModal
        challenge={editingChallenge}
        onClose={handleCloseModal}
      />
    </div>
  );
}
