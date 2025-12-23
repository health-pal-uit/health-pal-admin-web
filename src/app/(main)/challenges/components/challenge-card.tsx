"use client";

import { MoreVertical, Pencil, Trash2, Target, Activity } from "lucide-react";
import Image from "next/image";
import { Challenge, difficultyColors, difficultyLabels } from "../type";

interface ChallengeCardProps {
  challenge: Challenge;
  onEdit: (challenge: Challenge) => void;
}

export function ChallengeCard({ challenge, onEdit }: ChallengeCardProps) {
  const getImageUrl = (img: Challenge["image_url"]): string | null => {
    if (!img) return null;
    if (typeof img === "string") return img;
    if (typeof img === "object" && "url" in img)
      return (img as { url: string }).url;
    return null;
  };

  const imgUrl = getImageUrl(challenge.image_url);
  const activityCount = challenge.activity_records?.length || 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-16 h-16 rounded-lg bg-base-200 flex items-center justify-center flex-shrink-0">
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt={challenge.name}
                  width={64}
                  height={64}
                  className="rounded-lg object-cover"
                />
              ) : (
                <Target className="h-8 w-8 text-base-content/30" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="card-title text-base-content truncate">
                  {challenge.name}
                </h3>
                <div
                  className={`badge ${difficultyColors[challenge.difficulty]} badge-sm`}
                >
                  {difficultyLabels[challenge.difficulty]}
                </div>
              </div>
              {challenge.note && (
                <p className="text-base-content/70 line-clamp-2 text-sm">
                  {challenge.note}
                </p>
              )}
            </div>
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

        <div className="flex items-center justify-between w-full mt-4 pt-4 border-t border-base-200">
          <p className="text-base-content/60 text-xs">
            Created {formatDate(challenge.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
