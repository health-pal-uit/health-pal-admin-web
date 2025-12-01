"use client";

import { useState, useEffect } from "react";
import { Challenge, Difficulty } from "../type";

interface AddEditModalProps {
  challenge: Challenge | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    note: string;
    difficulty: Difficulty;
    image?: File;
  }) => Promise<void>;
}

export function AddEditChallengeModal({
  challenge,
  onClose,
  onSave,
}: AddEditModalProps) {
  const [name, setName] = useState(challenge?.name || "");
  const [note, setNote] = useState(challenge?.note || "");
  const [difficulty, setDifficulty] = useState<Difficulty>(
    challenge?.difficulty || "easy",
  );
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const formKey = challenge ? `edit-${challenge.id}` : "add-new";

  // Reset form when challenge changes
  useEffect(() => {
    setName(challenge?.name || "");
    setNote(challenge?.note || "");
    setDifficulty(challenge?.difficulty || "easy");
    setImage(null);
    setHasChanges(false);
  }, [challenge]);

  // Track changes
  useEffect(() => {
    if (!challenge) {
      setHasChanges(name.trim().length > 0);
      return;
    }

    const nameChanged = name.trim() !== challenge.name;
    const noteChanged = (note.trim() || "") !== (challenge.note || "");
    const difficultyChanged = difficulty !== challenge.difficulty;
    const imageChanged = image !== null;

    setHasChanges(
      nameChanged || noteChanged || difficultyChanged || imageChanged,
    );
  }, [name, note, difficulty, image, challenge]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        note: note.trim() || "",
        difficulty,
        ...(image && { image }),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog id="add_edit_challenge_modal" className="modal modal-middle">
      <div className="modal-box rounded-xl p-6 bg-base-100 max-w-lg">
        <h3 className="font-semibold text-xl">
          {challenge ? "Edit Challenge" : "Create New Challenge"}
        </h3>
        <p className="mt-1 text-base-content/70">Fill in challenge details</p>

        <form key={formKey} onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium">Challenge Name *</label>
            <input
              type="text"
              placeholder="e.g., 7-Day Water Challenge"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full rounded-lg bg-base-200/50"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder="Detailed description of the challenge..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="textarea textarea-bordered w-full rounded-lg bg-base-200/50 h-24"
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Difficulty *</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="select select-bordered w-full rounded-lg bg-base-200/50"
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Challenge Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="file-input file-input-bordered w-full rounded-lg bg-base-200/50"
            />
          </div>

          <div className="modal-action flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-sm rounded-lg"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-primary rounded-lg"
              disabled={isSubmitting || !name.trim() || !hasChanges}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : challenge ? (
                "Update"
              ) : (
                "Create Challenge"
              )}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
