"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { Expert, ExpertStatus } from "./type";
import { ExpertTable } from "./components/expert-table";
import { ReviewExpertModal } from "./components/review-modal";
import { ExpertProfileModal } from "./components/expert-profile-modal";

export default function ExpertsPage() {
  const modalRef = useRef<HTMLDialogElement>(null);
  const profileModalRef = useRef<HTMLDialogElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ExpertStatus | "all">("pending");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [profileExpert, setProfileExpert] = useState<Expert | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null,
  );

  const [experts, setExperts] = useState<Expert[]>([]);
  const [allExperts, setAllExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Fetch all experts on initial load and when search changes
  useEffect(() => {
    const fetchAllExperts = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          search: searchQuery,
          status: "all",
        });

        const res = await fetch(`/api/experts?${params}`);
        if (!res.ok) throw new Error("Failed to fetch experts");

        const data = await res.json();
        const allExpertsData = data.data || [];
        setAllExperts(allExpertsData);

        // Filter for current tab
        filterExpertsByTab(allExpertsData, activeTab);
      } catch (error) {
        console.error("Error fetching experts:", error);
        toast.error("Failed to load experts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllExperts();
  }, [searchQuery]);

  // Filter experts when tab changes
  useEffect(() => {
    filterExpertsByTab(allExperts, activeTab);
  }, [activeTab, allExperts]);

  const filterExpertsByTab = (data: Expert[], tab: ExpertStatus | "all") => {
    if (tab === "all") {
      setExperts(data);
    } else {
      setExperts(data.filter((e) => e.status === tab));
    }
  };

  const handleExpertClick = (expert: Expert, action: "approve" | "reject") => {
    setSelectedExpert(expert);
    setReviewAction(action);
    modalRef.current?.showModal();
  };

  const handleSubmit = async (reason?: string) => {
    if (!selectedExpert) return;

    try {
      setIsActionLoading(true);
      const endpoint =
        reviewAction === "approve"
          ? `/api/experts/${selectedExpert.id}/approve`
          : `/api/experts/${selectedExpert.id}/reject`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:
          reviewAction === "reject" ? JSON.stringify({ reason }) : undefined,
      });

      if (!res.ok) throw new Error(`Failed to ${reviewAction} expert`);

      toast.success(`Expert ${reviewAction}d successfully`);
      handleCloseModal();

      setExperts(experts.filter((e) => e.id !== selectedExpert.id));
    } catch (error) {
      console.error(`Error ${reviewAction} expert:`, error);
      toast.error(`Failed to ${reviewAction} expert`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCloseModal = () => {
    modalRef.current?.close();
    setSelectedExpert(null);
    setReviewAction(null);
  };

  const handleViewProfile = (expert: Expert) => {
    setProfileExpert(expert);
    profileModalRef.current?.showModal();
  };

  const handleCloseProfileModal = () => {
    profileModalRef.current?.close();
    setProfileExpert(null);
  };

  const getPendingCount = () => {
    return allExperts.filter((e) => e.status === "pending").length;
  };

  const getVerifiedCount = () => {
    return allExperts.filter((e) => e.status === "verified").length;
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-base-content">
          Expert Management
        </h1>
        <p className="text-base-content/70">
          Review and manage experts in the system
        </p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body flex-row items-center gap-4 p-4">
          <label className="input input-bordered flex items-center gap-2 flex-grow">
            <Search className="h-5 w-5 text-base-content/60" />
            <input
              type="text"
              className="grow"
              placeholder="Search experts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-lifted">
        <button
          onClick={() => setActiveTab("pending")}
          className={`tab ${activeTab === "pending" ? "tab-active" : ""}`}
        >
          Pending{" "}
          <span className="badge badge-warning ml-2">{getPendingCount()}</span>
        </button>
        <button
          onClick={() => setActiveTab("verified")}
          className={`tab ${activeTab === "verified" ? "tab-active" : ""}`}
        >
          Verified <span className="badge ml-2">{getVerifiedCount()}</span>
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
        >
          All
        </button>
      </div>

      {/* Table */}
      <ExpertTable
        experts={experts}
        isLoading={isLoading}
        onApprove={(expert) => handleExpertClick(expert, "approve")}
        onReject={(expert) => handleExpertClick(expert, "reject")}
        onViewProfile={handleViewProfile}
      />

      {/* Review Modal */}
      <ReviewExpertModal
        ref={modalRef}
        expert={selectedExpert}
        action={reviewAction}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={isActionLoading}
      />

      {/* Profile Modal */}
      <ExpertProfileModal
        ref={profileModalRef}
        expert={profileExpert}
        onClose={handleCloseProfileModal}
      />
    </div>
  );
}
