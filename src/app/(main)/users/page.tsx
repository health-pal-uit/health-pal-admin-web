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

  const avatar =
    user.avatar_url ||
    `https://placehold.co/100/E8F5F1/2D8B6E?text=${user.fullname.charAt(0)}`;

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/users");
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to fetch users");
          return;
        }

        const processedUsers = (data.data as ApiUser[]).map(processApiUser);
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

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    (
      document.getElementById("user_details_modal") as HTMLDialogElement
    )?.showModal();
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
        <UserTable users={filteredUsers} onViewDetails={handleViewDetails} />
      )}

      <UserDetailModal user={selectedUser} onClose={handleCloseModal} />
    </div>
  );
}
