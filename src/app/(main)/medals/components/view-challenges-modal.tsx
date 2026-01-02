"use client";

import { X, Target } from "lucide-react";
import { Medal } from "../type";
import Image from "next/image";

interface ViewChallengesModalProps {
  medal: Medal | null;
  onClose: () => void;
}

export const ViewChallengesModal = ({
  medal,
  onClose,
}: ViewChallengesModalProps) => {
  if (!medal) return null;

  const getImageUrl = (img: string | { url: string } | null): string | null => {
    if (!img) return null;
    if (typeof img === "string") return img;
    if (typeof img === "object" && "url" in img)
      return (img as { url: string }).url;
    return null;
  };

  const difficultyColors = {
    easy: "badge-success",
    medium: "badge-warning",
    hard: "badge-error",
  };

  const difficultyLabels = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
  };

  return (
    <dialog id="view_challenges_modal" className="modal">
      <div className="modal-box max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">Linked Challenges</h3>
            <p className="text-sm text-base-content/70 mt-1">{medal.name}</p>
          </div>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-base-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {medal.challenges_medals.length}{" "}
                {medal.challenges_medals.length === 1
                  ? "Challenge"
                  : "Challenges"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {medal.challenges_medals.length === 0 ? (
            <div className="text-center py-8 text-base-content/50">
              No challenges linked yet
            </div>
          ) : (
            medal.challenges_medals.map((challengeMedal, index) => {
              const imgUrl = getImageUrl(challengeMedal.challenge.image_url);
              return (
                <div
                  key={challengeMedal.id}
                  className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-base-300 flex items-center justify-center flex-shrink-0">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={challengeMedal.challenge.name}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <Target className="h-6 w-6 text-base-content/30" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {challengeMedal.challenge.name}
                        </span>
                        <span className="badge badge-sm badge-ghost">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`badge badge-sm ${
                            difficultyColors[
                              challengeMedal.challenge
                                .difficulty as keyof typeof difficultyColors
                            ]
                          }`}
                        >
                          {
                            difficultyLabels[
                              challengeMedal.challenge
                                .difficulty as keyof typeof difficultyLabels
                            ]
                          }
                        </span>
                        <p className="text-xs text-base-content/60">
                          {new Date(
                            challengeMedal.challenge.created_at,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose} type="button">
          close
        </button>
      </form>
    </dialog>
  );
};
