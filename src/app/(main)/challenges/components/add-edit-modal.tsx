"use client";

import { useState, useEffect, useRef } from "react";
import { Challenge, Difficulty } from "../type";
import { Upload, X } from "lucide-react";
import Image from "next/image";

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
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (challenge) {
      setName(challenge.name || "");
      setNote(challenge.note || "");
      setDifficulty(challenge.difficulty || "easy");
      setImageFile(null);
      const imgUrl =
        typeof challenge.image_url === "string"
          ? challenge.image_url
          : challenge.image_url?.url || null;
      setImagePreview(imgUrl);
    } else {
      setName("");
      setNote("");
      setDifficulty("easy");
      setImageFile(null);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [challenge]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
        ...(imageFile && { image: imageFile }),
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
            <label className="text-sm font-medium">
              Challenge Image <span className="text-error">*</span>
            </label>
            {imagePreview ? (
              <div className="relative w-full h-48 border-2 border-base-300 rounded-xl overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Challenge preview"
                  fill
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 btn btn-sm btn-circle btn-error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                className="p-6 border-2 border-dashed border-base-300 rounded-xl flex flex-col items-center text-center gap-2 cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-6 h-6 opacity-50" />
                <span className="text-base-content/60 text-sm">
                  Click to upload image
                </span>
                <span className="text-base-content/40 text-xs">
                  PNG, JPG up to 5MB
                </span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
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
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Saving...
                </>
              ) : challenge ? (
                "Update Challenge"
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
