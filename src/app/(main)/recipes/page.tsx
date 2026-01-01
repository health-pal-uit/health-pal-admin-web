"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Header from "@/src/components/shared/Header";
import { Recipe, RecipeStatus } from "./type";
import { processApiMeal } from "./utils/process-api-meal";
import { RecipeTabs } from "./components/recipe-tabs";
import { SearchBar } from "./components/search-bar";
import { RecipeList } from "./components/recipe-list";
import { PaginationControls } from "./components/pagination-controls";
import { RecipeDetailModal } from "./components/recipe-detail";
import { ReviewModal } from "./components/review-modal";
import { AddMealModal } from "./components/add-meal-modal";
import { EditMealModal } from "./components/edit-meal-modal";
import { RejectModal } from "./components/reject-modal";
import { Plus } from "lucide-react";

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<RecipeStatus>("pending");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null,
  );
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [recipeToReject, setRecipeToReject] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const limit = 10;

  useEffect(() => {
    fetchRecipes();
  }, [currentPage, activeTab]);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);

      let endpoint: string;
      if (activeTab === "pending") {
        endpoint = `/api/meals/pending?page=${currentPage}&limit=${limit}`;
      } else if (activeTab === "rejected") {
        endpoint = `/api/meals/rejected?page=${currentPage}&limit=${limit}`;
      } else {
        endpoint = `/api/meals?page=${currentPage}&limit=${limit}`;
      }

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const result = await response.json();

      if (result.data && Array.isArray(result.data.data)) {
        const processedRecipes = result.data.data.map(processApiMeal);

        // For pending and rejected endpoints, all recipes match the tab
        // For admin endpoint, filter by activeTab
        const filteredByTab =
          activeTab === "pending" || activeTab === "rejected"
            ? processedRecipes
            : processedRecipes.filter((r: Recipe) => r.status === activeTab);

        setRecipes(filteredByTab);
        setTotalRecipes(result.data.total || 0);

        // Only update pending count when in pending tab
        if (activeTab === "pending") {
          setPendingCount(result.data.total || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast.error("Failed to load recipes");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenReviewModal = (
    recipe: Recipe,
    action: "approve" | "reject",
  ) => {
    setSelectedRecipe(recipe);
    setReviewAction(action);
    (document.getElementById("review_modal") as HTMLDialogElement)?.showModal();
  };

  const handleOpenDetailModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    (
      document.getElementById("recipe_detail_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleCloseModal = () => {
    (
      document.getElementById("recipe_detail_modal") as HTMLDialogElement
    )?.close();
    (document.getElementById("review_modal") as HTMLDialogElement)?.close();
    setTimeout(() => {
      setSelectedRecipe(null);
      setReviewAction(null);
    }, 300);
  };

  const handleApproveRecipe = async (recipe: Recipe) => {
    try {
      const response = await fetch(`/api/meals/${recipe.id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to approve recipe");
      }

      toast.success("Recipe approved successfully");
      setCurrentPage(1);
      fetchRecipes();
    } catch (error) {
      console.error("Error approving recipe:", error);
      toast.error("Failed to approve recipe");
    }
  };

  const handleRejectRecipe = (recipe: Recipe) => {
    setRecipeToReject(recipe);
    (document.getElementById("reject_modal") as HTMLDialogElement)?.showModal();
  };

  const handleRejectSubmit = async (reason: string) => {
    if (!recipeToReject) return;

    try {
      const response = await fetch(`/api/meals/${recipeToReject.id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject recipe");
      }

      toast.success("Recipe rejected successfully");
      handleCloseRejectModal();
      setCurrentPage(1);
      fetchRecipes();
    } catch (error) {
      console.error("Error rejecting recipe:", error);
      toast.error("Failed to reject recipe");
    }
  };

  const handleCloseRejectModal = () => {
    (document.getElementById("reject_modal") as HTMLDialogElement)?.close();
    setTimeout(() => {
      setRecipeToReject(null);
    }, 300);
  };

  const handleReviewSubmit = async () => {
    if (!selectedRecipe || !reviewAction) return;

    try {
      const response = await fetch(`/api/meals/${selectedRecipe.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_verified: reviewAction === "approve",
          deleted_at:
            reviewAction === "reject" ? new Date().toISOString() : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update recipe");
      }

      toast.success(
        `Recipe ${reviewAction === "approve" ? "approved" : "rejected"} successfully`,
      );
      handleCloseModal();
      setCurrentPage(1);
      fetchRecipes();
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Failed to update recipe");
    }
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    (
      document.getElementById("add_meal_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    (document.getElementById("add_meal_modal") as HTMLDialogElement)?.close();
  };

  const handleAddSuccess = () => {
    toast.success("Meal created successfully!");
    fetchRecipes();
  };

  const handleOpenEditModal = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    (
      document.getElementById("edit_meal_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleCloseEditModal = () => {
    (document.getElementById("edit_meal_modal") as HTMLDialogElement)?.close();
    setTimeout(() => {
      setEditingRecipe(null);
    }, 300);
  };

  const handleEditSuccess = () => {
    toast.success("Meal updated successfully!");
    fetchRecipes();
  };

  return (
    <div className="flex flex-col gap-6">
      <Header
        tabName="Recipe & Meal Moderation"
        description="Review and approve user-contributed recipes"
        buttonName="Meals With Recipes"
        onAddClick={() => {}}
      >
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus className="h-4 w-4" />
          Add Meals
        </button>
      </Header>

      <RecipeTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={pendingCount}
      />

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <RecipeList
        recipes={filteredRecipes}
        isLoading={isLoading}
        onViewDetails={handleOpenDetailModal}
        onApprove={handleApproveRecipe}
        onReject={handleRejectRecipe}
        onEdit={handleOpenEditModal}
      />

      {!isLoading && filteredRecipes.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalItems={totalRecipes}
          itemsPerPage={limit}
          onPageChange={setCurrentPage}
        />
      )}

      <RecipeDetailModal recipe={selectedRecipe} onClose={handleCloseModal} />

      <ReviewModal
        recipe={selectedRecipe}
        action={reviewAction}
        onClose={handleCloseModal}
        onSubmit={handleReviewSubmit}
      />

      <RejectModal
        recipe={recipeToReject}
        onClose={handleCloseRejectModal}
        onSubmit={handleRejectSubmit}
      />

      <AddMealModal
        onClose={handleCloseAddModal}
        onSuccess={handleAddSuccess}
      />

      <EditMealModal
        meal={editingRecipe}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
