"use client";

import Image from "next/image";
import { MoreVertical, Eye, UserCheck, UserX } from "lucide-react";
import { User } from "../type";

interface UserTableProps {
  users: User[];
  onViewDetails: (user: User) => void;
}

export function UserTable({ users, onViewDetails }: UserTableProps) {
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
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <Image
                            src={user.avatar}
                            alt={user.name || "User Avatar"}
                            width={48}
                            height={48}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{user.name}</div>
                        <div className="text-sm opacity-50">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
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
                          <a onClick={() => onViewDetails(user)}>
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
  );
}
