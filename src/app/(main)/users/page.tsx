"use client";

import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";

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
  };
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/users?page=${currentPage}&limit=${limit}`,
        );
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to fetch users");
          return;
        }

        const usersList = Array.isArray(data.data.data) ? data.data.data : [];
        const processedUsers = (usersList as ApiUser[]).map(processApiUser);
        setAllUsers(processedUsers);
        setTotalUsers(data.data.total || 0);
        setTotalPages(Math.ceil((data.data.total || 0) / limit));
      } catch (error) {
        toast.error("An error occurred while fetching users.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, limit]);

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

      // Refresh the user list
      setAllUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
      setTotalUsers((prev) => prev - 1);

      // Recalculate total pages
      const newTotalPages = Math.ceil((totalUsers - 1) / limit);
      setTotalPages(newTotalPages);

      // If current page is now empty and not the first page, go to previous page
      if (allUsers.length === 1 && currentPage > 1) {
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
          <button className="btn btn-outline">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <UserTable
          users={allUsers}
          onViewDetails={handleViewDetails}
          onDeleteUser={handleDeleteUser}
        />
      )}

      {!isLoading && totalPages > 1 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div className="text-sm text-base-content/70">
                Showing {(currentPage - 1) * limit + 1} to{" "}
                {Math.min(currentPage * limit, totalUsers)} of {totalUsers}{" "}
                users
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

      <UserDetailModal user={selectedUser} onClose={handleCloseModal} />
    </div>
  );
}
