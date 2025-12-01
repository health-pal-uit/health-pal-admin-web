"use client";

import { MoreVertical, Pencil, Trash2, Award } from "lucide-react";
import Image from "next/image";
import { Medal, tierColors, tierLabels } from "../type";

interface MedalCardProps {
  medal: Medal;
  onEdit: (medal: Medal) => void;
}

export function MedalCard({ medal, onEdit }: MedalCardProps) {
  const getImageUrl = (img: Medal["image_url"]): string | null => {
    if (!img) return null;
    if (typeof img === "string") return img;
    if (typeof img === "object" && "url" in img)
      return (img as { url: string }).url;
    return null;
  };

  const imgUrl = getImageUrl(medal.image_url);
  const challengeCount = medal.challenges_medals?.length || 0;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 rounded-lg bg-base-200 flex items-center justify-center">
            {imgUrl ? (
              <Image
                src={imgUrl}
                alt={medal.name}
                width={64}
                height={64}
                className="rounded-lg object-cover"
              />
            ) : (
              <Award className="h-8 w-8 text-base-content/30" />
            )}
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

        {medal.note && (
          <p className="text-base-content/70 mb-4 line-clamp-2">{medal.note}</p>
        )}

        <div className="card-actions justify-between items-center">
          <div className={`badge ${tierColors[medal.tier]}`}>
            {tierLabels[medal.tier]}
          </div>
          {challengeCount > 0 && (
            <div className="text-xs text-base-content/50">
              {challengeCount}{" "}
              {challengeCount === 1 ? "challenge" : "challenges"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
