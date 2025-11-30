"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, X } from "lucide-react";

import { toast } from "react-hot-toast";
import { ApiUser, User } from "./type";
import { UserTable } from "./components/user-table";
import { UserDetailModal } from "./components/user-detail-modal";

function processApiUser(user: ApiUser): User {
  let status: User["status"] = "inactive";
  if (user.deactivated_at) {
    status = "suspended";
  } else if (user.isVerified) {
    status = "active";
  }

  const joinedDate = new Date(user.created_at).toLocaleDateString("vi-VN");
  const birthDate = user.birth_date
    ? new Date(user.birth_date).toLocaleDateString("vi-VN")
    : "N/A";

  const avatar = user.avatar_url || "/image/health-pal-logo.png";

  return {
    id: user.id,
    name: user.fullname,
    email: user.email,
    status: status,
    joined: joinedDate,
    avatar: avatar,
    username: user.username,
    phone: user.phone,
    gender: user.gender ? "Male" : "Female",
    birthDate: birthDate,
    birthDateRaw: user.birth_date,
  };
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [allUsers, setAllUsers] = useState<User[]>([]); // All users from API
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterGender, setFilterGender] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterAgeMin, setFilterAgeMin] = useState<string>("");
  const [filterAgeMax, setFilterAgeMax] = useState<string>("");
  const [appliedFilters, setAppliedFilters] = useState({
    gender: "",
    status: "",
    ageMin: "",
    ageMax: "",
  });

  // Fetch all users from API (no search/filter params)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // Fetch with high limit to get all users for client-side filtering
        const res = await fetch(`/api/users?page=1&limit=1000`);
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to fetch users");
          return;
        }

        const usersList = Array.isArray(data.data.data) ? data.data.data : [];
        const processedUsers = (usersList as ApiUser[]).map(processApiUser);
        setAllUsers(processedUsers);
      } catch (error) {
        toast.error("An error occurred while fetching users.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Calculate age from birthdate
  const calculateAge = (
    birthDate: string | null | undefined,
  ): number | null => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Client-side filtering
  const filteredUsers = allUsers.filter((user) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        (user.name?.toLowerCase() || "").includes(query) ||
        (user.email?.toLowerCase() || "").includes(query) ||
        (user.username?.toLowerCase() || "").includes(query) ||
        (user.phone?.toLowerCase() || "").includes(query);

      if (!matchesSearch) return false;
    }

    // Gender filter
    if (appliedFilters.gender) {
      const userGender = user.gender?.toLowerCase() || "";
      if (userGender !== appliedFilters.gender.toLowerCase()) return false;
    }

    // Status filter
    if (appliedFilters.status) {
      if (user.status !== appliedFilters.status) return false;
    }

    // Age range filter
    if (appliedFilters.ageMin || appliedFilters.ageMax) {
      const age = calculateAge(user.birthDateRaw);
      if (age === null) return false;

      if (appliedFilters.ageMin && age < parseInt(appliedFilters.ageMin)) {
        return false;
      }
      if (appliedFilters.ageMax && age > parseInt(appliedFilters.ageMax)) {
        return false;
      }
    }

    return true;
  });

  // Pagination for filtered results
  const totalFilteredUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalFilteredUsers / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when search query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      gender: filterGender,
      status: filterStatus,
      ageMin: filterAgeMin,
      ageMax: filterAgeMax,
    });
    setCurrentPage(1); // Reset to first page when applying filters
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    setFilterGender("");
    setFilterStatus("");
    setFilterAgeMin("");
    setFilterAgeMax("");
    setAppliedFilters({
      gender: "",
      status: "",
      ageMin: "",
      ageMax: "",
    });
    setCurrentPage(1);
  };

  const hasActiveFilters =
    appliedFilters.gender ||
    appliedFilters.status ||
    appliedFilters.ageMin ||
    appliedFilters.ageMax;

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    (
      document.getElementById("user_details_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleDeleteUser = async (user: User) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete user "${user.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete user");
        return;
      }

      toast.success("User deleted successfully");

      // Remove user from local state
      setAllUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));

      // If current page becomes empty after deletion and not the first page, go to previous page
      if (paginatedUsers.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the user.");
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    (
      document.getElementById("user_details_modal") as HTMLDialogElement
    )?.close();
    setTimeout(() => {
      setSelectedUser(null);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-base-content">
          User Management
        </h1>
        <p className="text-base-content/70">
          Manage and track user information in the system
        </p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body flex-row items-center gap-4 p-4">
          <label className="input input-bordered flex items-center gap-2 flex-grow">
            <Search className="h-5 w-5 text-base-content/60" />
            <input
              type="text"
              className="grow"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
          <button
            className={`btn btn-outline ${hasActiveFilters ? "btn-primary" : ""}`}
            onClick={() => setShowFilterModal(true)}
          >
            <Filter className="h-4 w-4" />
            Filter
            {hasActiveFilters && (
              <span className="badge badge-sm ml-1">
                {Object.values(appliedFilters).filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <UserTable
          users={paginatedUsers}
          onViewDetails={handleViewDetails}
          onDeleteUser={handleDeleteUser}
        />
      )}

      {!isLoading && totalPages > 1 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div className="text-sm text-base-content/70">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, totalFilteredUsers)} of {totalFilteredUsers}{" "}
                {searchQuery || hasActiveFilters ? "filtered " : ""}users
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

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Filter Users</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setShowFilterModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Gender Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Gender</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                >
                  <option value="">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Status</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* Age Range Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Age Range</span>
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Min age"
                      className="input input-bordered w-full"
                      value={filterAgeMin}
                      onChange={(e) => setFilterAgeMin(e.target.value)}
                      min="0"
                      max="150"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-base-content/70">to</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Max age"
                      className="input input-bordered w-full"
                      value={filterAgeMax}
                      onChange={(e) => setFilterAgeMax(e.target.value)}
                      min="0"
                      max="150"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={handleClearFilters}>
                Clear All
              </button>
              <button className="btn btn-primary" onClick={handleApplyFilters}>
                Apply Filters
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowFilterModal(false)}
          />
        </div>
      )}

      <UserDetailModal user={selectedUser} onClose={handleCloseModal} />
    </div>
  );
}
