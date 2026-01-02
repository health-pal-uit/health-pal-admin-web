"use client";

import { useState, useEffect } from "react";
import { X, Target } from "lucide-react";
import { toast } from "react-hot-toast";
import { Medal } from "../type";
import Image from "next/image";

interface Challenge {
  id: string;
  name: string;
  note: string | null;
  image_url: string | { url: string } | null;
  difficulty: "easy" | "medium" | "hard";
  created_at: string;
  deleted_at: string | null;
}

interface LinkChallengeModalProps {
  medal: Medal | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const LinkChallengeModal = ({
  medal,
  onClose,
  onSuccess,
}: LinkChallengeModalProps) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (medal) {
      fetchChallenges();
    }
  }, [medal]);

  const fetchChallenges = async () => {
    try {
      setIsLoadingChallenges(true);
      const res = await fetch("/api/challenges?page=1&limit=1000");

      if (!res.ok) {
        throw new Error("Failed to fetch challenges");
      }

      const data = await res.json();
      const challengesList = Array.isArray(data.data) ? data.data : [];

      // Filter only active challenges
      const activeChallenges = challengesList.filter(
        (challenge: Challenge) => !challenge.deleted_at,
      );

      setChallenges(activeChallenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast.error("Failed to load challenges");
    } finally {
      setIsLoadingChallenges(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medal || !selectedChallengeId) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/challenges-medals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challenge_id: selectedChallengeId,
          medal_id: medal.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to link medal with challenge");
      }

      toast.success("Medal linked to challenge successfully!");
      onSuccess();
      onClose();

      // Reset form
      setSelectedChallengeId("");
    } catch (error) {
      console.error("Error linking medal with challenge:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to link medal with challenge",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedChallengeId("");
    onClose();
  };

  const getImageUrl = (img: Challenge["image_url"]): string | null => {
    if (!img) return null;
    if (typeof img === "string") return img;
    if (typeof img === "object" && "url" in img)
      return (img as { url: string }).url;
    return null;
  };

  if (!medal) return null;

  return (
    <dialog id="link_challenge_modal" className="modal">
      <div className="modal-box">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">Link Medal to Challenge</h3>
            <p className="text-sm text-base-content/70 mt-1">{medal.name}</p>
          </div>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handleClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Select Challenge *</span>
            </label>
            {isLoadingChallenges ? (
              <div className="flex items-center justify-center h-12">
                <span className="loading loading-spinner loading-sm"></span>
              </div>
            ) : (
              <select
                className="select select-bordered w-full"
                value={selectedChallengeId}
                onChange={(e) => setSelectedChallengeId(e.target.value)}
                required
              >
                <option value="">Choose a challenge...</option>
                {challenges.map((challenge) => {
                  const imgUrl = getImageUrl(challenge.image_url);
                  return (
                    <option key={challenge.id} value={challenge.id}>
                      {challenge.name} ({challenge.difficulty})
                    </option>
                  );
                })}
              </select>
            )}
            {challenges.length === 0 && !isLoadingChallenges && (
              <label className="label">
                <span className="label-text-alt text-warning">
                  No challenges available
                </span>
              </label>
            )}
          </div>

          {/* Challenge Preview */}
          {selectedChallengeId && (
            <div className="p-4 bg-base-200 rounded-lg">
              {(() => {
                const selectedChallenge = challenges.find(
                  (c) => c.id === selectedChallengeId,
                );
                if (!selectedChallenge) return null;
                const imgUrl = getImageUrl(selectedChallenge.image_url);

                return (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-base-300 flex items-center justify-center flex-shrink-0">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={selectedChallenge.name}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <Target className="h-6 w-6 text-base-content/30" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{selectedChallenge.name}</p>
                      <p className="text-xs text-base-content/60 capitalize">
                        {selectedChallenge.difficulty} difficulty
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !selectedChallengeId}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Linking...
                </>
              ) : (
                "Link to Challenge"
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose} type="button">
          close
        </button>
      </form>
    </dialog>
  );
};
