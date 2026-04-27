"use client";

import Image from "next/image";
import { MoreVertical, Check, X } from "lucide-react";
import { Expert } from "../type";

interface ExpertTableProps {
  experts: Expert[];
  isLoading: boolean;
  onApprove: (expert: Expert) => void;
  onReject: (expert: Expert) => void;
  onViewProfile: (expert: Expert) => void;
}

export const ExpertTable = ({
  experts,
  isLoading,
  onApprove,
  onReject,
  onViewProfile,
}: ExpertTableProps) => {
  const getStatusBadge = (status: Expert["status"]) => {
    switch (status) {
      case "pending":
        return "badge-warning";
      case "verified":
        return "badge-success";
      default:
        return "badge-ghost";
    }
  };

  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  if (experts.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-lg font-semibold text-base-content/70">
              No experts found
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Expert</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Applied</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {experts.map((expert) => (
                <tr
                  key={expert.id}
                  className="hover cursor-pointer"
                  onClick={() => onViewProfile(expert)}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          {expert.avatar ? (
                            <Image
                              src={expert.avatar}
                              alt={expert.name}
                              width={48}
                              height={48}
                            />
                          ) : (
                            <div className="w-full h-full bg-base-300 flex items-center justify-center font-bold text-sm">
                              {expert.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{expert.name}</div>
                        <div className="text-sm opacity-50">
                          {expert.canDoVideo && "Video Available"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{expert.email}</td>
                  <td>
                    <span className="badge badge-outline">
                      {expert.specialization}
                    </span>
                  </td>
                  <td>
                    {expert.rating.count > 0 ? (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">
                          {expert.rating.avg.toFixed(1)}★
                        </span>
                        <span className="text-sm opacity-60">
                          ({expert.rating.count})
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm opacity-60">No ratings</span>
                    )}
                  </td>
                  <td>
                    <div className={`badge ${getStatusBadge(expert.status)}`}>
                      {expert.status}
                    </div>
                  </td>
                  <td>
                    {new Date(expert.application_date).toLocaleDateString()}
                  </td>
                  <td>
                    {expert.status === "pending" && (
                      <div className="dropdown dropdown-end">
                        <button
                          tabIndex={0}
                          className="btn btn-ghost btn-circle btn-sm"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-56 z-10"
                        >
                          <li>
                            <a onClick={() => onApprove(expert)}>
                              <Check className="h-4 w-4 text-success" /> Approve
                            </a>
                          </li>
                          <li>
                            <a
                              className="text-error"
                              onClick={() => onReject(expert)}
                            >
                              <X className="h-4 w-4" /> Reject
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
