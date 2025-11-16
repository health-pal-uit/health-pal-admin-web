"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Eye,
} from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  goal: string;
  weight: string;
  status: "active" | "inactive" | "suspended";
  joined: string;
};

const mockUsers: User[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    goal: "Weight Loss",
    weight: "75kg",
    status: "active",
    joined: "15/10/2024",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    goal: "Build Muscle",
    weight: "60kg",
    status: "active",
    joined: "20/10/2024",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "mchen@email.com",
    goal: "Maintain",
    weight: "70kg",
    status: "inactive",
    joined: "01/11/2024",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@email.com",
    goal: "Weight Loss",
    weight: "68kg",
    status: "active",
    joined: "05/11/2024",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "dwilson@email.com",
    goal: "Build Muscle",
    weight: "80kg",
    status: "suspended",
    joined: "10/11/2024",
  },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = mockUsers.filter(
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
    setSelectedUser(null);
    (
      document.getElementById("user_details_modal") as HTMLDialogElement
    )?.close();
  };

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "badge-success";
      case "suspended":
        return "badge-error";
      case "inactive":
      default:
        return "badge-ghost";
    }
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

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Goal</th>
                  <th>Weight</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary/10 text-primary rounded-full w-12">
                            <span>{user.name.charAt(0)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <div className="badge badge-outline">{user.goal}</div>
                    </td>
                    <td>{user.weight}</td>
                    <td>
                      <div className={`badge ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </div>
                    </td>
                    <td>{user.joined}</td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <button
                          tabIndex={0}
                          className="btn btn-ghost btn-circle btn-sm"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10"
                        >
                          <li>
                            <a onClick={() => handleViewDetails(user)}>
                              <Eye className="h-4 w-4" /> View Details
                            </a>
                          </li>
                          <li>
                            <a>
                              <UserCheck className="h-4 w-4" /> Activate
                            </a>
                          </li>
                          <li>
                            <a className="text-error">
                              <UserX className="h-4 w-4" /> Suspend
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <dialog id="user_details_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">User Details</h3>
          {selectedUser && (
            <div className="py-4">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Goal:</strong> {selectedUser.goal}
              </p>
              <p>
                <strong>Weight:</strong> {selectedUser.weight}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.status}
              </p>
              <p>
                <strong>Joined:</strong> {selectedUser.joined}
              </p>
            </div>
          )}
          <div className="modal-action">
            <button className="btn" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleCloseModal}>close</button>
        </form>
      </dialog>
    </div>
  );
}
