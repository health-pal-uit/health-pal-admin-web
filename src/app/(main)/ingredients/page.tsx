"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, CheckCircle, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  ApprovedIngredient,
  IngredientStatus,
  PendingIngredient,
} from "./type";
import { ApprovedTable } from "./components/approved-table";
import { PendingTable } from "./components/pending-table";
import { AddEditIngredientModal } from "./components/add-edit-modal";
import { ReviewIngredientModal } from "./components/review-modal";

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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<IngredientStatus>("approved");
  const [editingIngredient, setEditingIngredient] =
    useState<ApprovedIngredient | null>(null);
  const [reviewingIngredient, setReviewingIngredient] =
    useState<PendingIngredient | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null,
  );

  const [approvedIngredients, setApprovedIngredients] = useState<
    ApprovedIngredient[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalIngredients, setTotalIngredients] = useState(0);
  const [limit] = useState(10);

  useEffect(() => {
    if (activeTab !== "approved") return;

    const fetchIngredients = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/ingredients?page=${currentPage}&limit=${limit}`,
        );

        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          router.push("/login");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to fetch ingredients");
          return;
        }

        const ingredientsList = Array.isArray(data.data.data)
          ? data.data.data
          : [];
        setApprovedIngredients(ingredientsList);
        setTotalIngredients(data.data.total || 0);
        setTotalPages(Math.ceil((data.data.total || 0) / limit));
      } catch (error) {
        toast.error("An error occurred while fetching ingredients.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIngredients();
  }, [currentPage, limit, activeTab, router]);

  const filteredApproved = approvedIngredients.filter((ing) =>
    ing.name?.toLowerCase().includes(searchQuery.toLowerCase()),
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

  const handleOpenEditModal = (ingredient: ApprovedIngredient) => {
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

  const handleIngredientSuccess = () => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch(
          `/api/ingredients?page=${currentPage}&limit=${limit}`,
        );
        if (res.ok) {
          const data = await res.json();
          const ingredientsList = Array.isArray(data.data.data)
            ? data.data.data
            : [];
          setApprovedIngredients(ingredientsList);
        }
      } catch (error) {
        console.error("Error refetching ingredients:", error);
      }
    };
    fetchIngredients();
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
        <>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <ApprovedTable
              data={filteredApproved}
              onEdit={handleOpenEditModal}
            />
          )}
        </>
      )}

      {activeTab === "pending" && (
        <PendingTable data={filteredPending} onReview={handleOpenReviewModal} />
      )}

      {activeTab === "approved" && !isLoading && totalPages > 1 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div className="text-sm text-base-content/70">
                Showing {(currentPage - 1) * limit + 1} to{" "}
                {Math.min(currentPage * limit, totalIngredients)} of{" "}
                {totalIngredients} ingredients
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

      <AddEditIngredientModal
        ingredient={editingIngredient}
        onClose={handleCloseModal}
        onSuccess={handleIngredientSuccess}
      />

      <ReviewIngredientModal
        ingredient={reviewingIngredient}
        action={reviewAction}
        onClose={handleCloseModal}
      />
    </div>
  );
}
