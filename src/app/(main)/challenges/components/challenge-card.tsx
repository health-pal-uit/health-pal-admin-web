"use client";

import { MoreVertical, Pencil, Trash2, Calendar, Users } from "lucide-react";
import { Challenge, statusColors } from "../type";

interface ChallengeCardProps {
  challenge: Challenge;
  onEdit: (challenge: Challenge) => void;
}

export function ChallengeCard({ challenge, onEdit }: ChallengeCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="card-title text-base-content">
                {challenge.title}
              </h3>
              <div className={`badge ${statusColors[challenge.status]}`}>
                {challenge.status === "active" ? "Active" : "Upcoming"}
              </div>
            </div>
            <p className="text-base-content/70">{challenge.description}</p>
          </div>
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle btn-sm">
              <MoreVertical className="h-4 w-4" />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10"
            >
              <li>
                <a onClick={() => onEdit(challenge)}>
                  <Pencil className="h-4 w-4" /> Edit
                </a>
              </li>
              <li>
                <a className="text-error">
                  <Trash2 className="h-4 w-4" /> Delete
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-6 text-base-content/70 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{challenge.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{challenge.participants} participants</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-base-200">
          <p className="text-base-content/60 text-sm">
            {challenge.startDate} - {challenge.endDate}
          </p>
        </div>
      </div>
    </div>
  );
}
