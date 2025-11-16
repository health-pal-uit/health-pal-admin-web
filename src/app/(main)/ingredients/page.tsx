"use client";

import { useState } from "react";
import { Search, Plus, CheckCircle, Clock } from "lucide-react";
import { Ingredient, IngredientStatus, PendingIngredient } from "./type";
import { ApprovedTable } from "./components/approved-table";
import { PendingTable } from "./components/pending-table";
import { AddEditIngredientModal } from "./components/add-edit-modal";
import { ReviewIngredientModal } from "./components/review-modal";

const mockIngredients: Ingredient[] = [
  {
    id: 1,
    name: "Chicken Breast",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    unit: "100g",
    category: "Meat",
    status: "approved",
  },
  {
    id: 2,
    name: "Brown Rice",
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    unit: "100g",
    category: "Grains",
    status: "approved",
  },
  {
    id: 3,
    name: "Avocado",
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    unit: "100g",
    category: "Fruits",
    status: "approved",
  },
  {
    id: 4,
    name: "Tomato",
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    unit: "100g",
    category: "Vegetables",
    status: "approved",
  },
  {
    id: 5,
    name: "Eggs",
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    unit: "100g",
    category: "Protein",
    status: "approved",
  },
];
const mockPendingIngredients: PendingIngredient[] = [
  {
    id: 6,
    name: "Quinoa",
    calories: 120,
    protein: 4.4,
    carbs: 21,
    fat: 1.9,
    unit: "100g",
    category: "Grains",
    status: "pending",
    submittedBy: "@healthy_eater",
    submittedDate: "2 hours ago",
  },
  {
    id: 7,
    name: "Chia Seeds",
    calories: 486,
    protein: 16.5,
    carbs: 42,
    fat: 30.7,
    unit: "100g",
    category: "Seeds",
    status: "pending",
    submittedBy: "@nutrition_fan",
    submittedDate: "5 hours ago",
  },
  {
    id: 8,
    name: "Sweet Potato",
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    unit: "100g",
    category: "Vegetables",
    status: "pending",
    submittedBy: "@fitlife99",
    submittedDate: "1 day ago",
  },
];

export default function IngredientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<IngredientStatus>("approved");
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null,
  );
  const [reviewingIngredient, setReviewingIngredient] =
    useState<PendingIngredient | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null,
  );

  const filteredApproved = mockIngredients.filter((ing) =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const filteredPending = mockPendingIngredients.filter((ing) =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenAddModal = () => {
    setEditingIngredient(null);
    (
      document.getElementById("add_edit_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleOpenEditModal = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    (
      document.getElementById("add_edit_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleOpenReviewModal = (
    ingredient: PendingIngredient,
    action: "approve" | "reject",
  ) => {
    setReviewingIngredient(ingredient);
    setReviewAction(action);
    (document.getElementById("review_modal") as HTMLDialogElement)?.showModal();
  };

  const handleCloseModal = () => {
    (document.getElementById("add_edit_modal") as HTMLDialogElement)?.close();
    (document.getElementById("review_modal") as HTMLDialogElement)?.close();
    setTimeout(() => {
      setEditingIngredient(null);
      setReviewingIngredient(null);
      setReviewAction(null);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Ingredient Management
          </h1>
          <p className="text-base-content/70">
            Manage nutritional information for ingredients
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus className="h-4 w-4" />
          Add Ingredient
        </button>
      </div>

      <div className="flex w-fit items-center gap-2 p-1 rounded-full bg-base-300">
        <button
          className={`btn btn-sm rounded-full gap-2 ${activeTab === "approved" ? "bg-base-100 text-base-content" : "btn-ghost"}`}
          onClick={() => setActiveTab("approved")}
        >
          <CheckCircle className="h-4 w-4" />
          Approved
        </button>
        <button
          className={`btn btn-sm rounded-full gap-2 ${activeTab === "pending" ? "bg-base-100 text-base-content" : "btn-ghost"}`}
          onClick={() => setActiveTab("pending")}
        >
          <Clock className="h-4 w-4" />
          Pending Approval
          <div className="badge badge-ghost ml-1">
            {mockPendingIngredients.length}
          </div>
        </button>
      </div>

      <label className="input input-bordered flex items-center gap-2 rounded-full">
        <Search className="h-5 w-5 text-base-content/60" />
        <input
          type="text"
          className="grow"
          placeholder="Search ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </label>

      {activeTab === "approved" && (
        <ApprovedTable data={filteredApproved} onEdit={handleOpenEditModal} />
      )}

      {activeTab === "pending" && (
        <PendingTable data={filteredPending} onReview={handleOpenReviewModal} />
      )}

      <AddEditIngredientModal
        ingredient={editingIngredient}
        onClose={handleCloseModal}
      />

      <ReviewIngredientModal
        ingredient={reviewingIngredient}
        action={reviewAction}
        onClose={handleCloseModal}
      />
    </div>
  );
}
