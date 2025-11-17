"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Medal, tierColors } from "../type";

interface MedalCardProps {
  medal: Medal;
  onEdit: (medal: Medal) => void;
}

export function MedalCard({ medal, onEdit }: MedalCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-start justify-between mb-4">
          <div className="text-5xl">{medal.icon}</div>

          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle btn-sm">
              <MoreVertical className="h-4 w-4" />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10"
            >
              <li>
                <a onClick={() => onEdit(medal)}>
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

        <h3 className="card-title text-base-content mb-2">{medal.name}</h3>
        <p className="text-base-content/70 mb-4">{medal.description}</p>

        <div className="card-actions justify-start">
          <div className={`badge ${tierColors[medal.tier]}`}>{medal.tier}</div>
        </div>
      </div>
    </div>
  );
}
