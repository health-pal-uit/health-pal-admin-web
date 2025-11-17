"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Medal } from "./type";
import { MedalCard } from "./components/medal-card";
import { AddEditMedalModal } from "./components/add-edit-modal";

const mockMedals: Medal[] = [
  {
    id: 1,
    name: "Beginner",
    tier: "Bronze",
    description: "Complete 7 days in a row",
    icon: "🥉",
  },
  {
    id: 2,
    name: "Warrior",
    tier: "Silver",
    description: "Complete 30 days in a row",
    icon: "🥈",
  },
  {
    id: 3,
    name: "Legend",
    tier: "Gold",
    description: "Complete 100 days in a row",
    icon: "🥇",
  },
  {
    id: 4,
    name: "Weight Loss Champion",
    tier: "Gold",
    description: "Lost 5kg",
    icon: "⭐",
  },
  {
    id: 5,
    name: "Athlete",
    tier: "Silver",
    description: "Complete 50 workouts",
    icon: "💪",
  },
];

export default function MedalsPage() {
  const [editingMedal, setEditingMedal] = useState<Medal | null>(null);

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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Medal Management
          </h1>
          <p className="text-base-content/70">
            Create and manage achievement medals for users
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => handleAddEdit()}>
          <Plus className="h-4 w-4" />
          Add Medal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMedals.map((medal) => (
          <MedalCard key={medal.id} medal={medal} onEdit={handleAddEdit} />
        ))}
      </div>

      <AddEditMedalModal medal={editingMedal} onClose={handleCloseModal} />
    </div>
  );
}
