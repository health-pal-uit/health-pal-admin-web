"use client";
import { Medal } from "../type";
import { Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface AddEditModalProps {
  medal: Medal | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddEditMedalModal({
  medal,
  onClose,
  onSuccess,
}: AddEditModalProps) {
  const [name, setName] = useState(medal?.name || "");
  const [tier, setTier] = useState(medal?.tier || "bronze");
  const [note, setNote] = useState(medal?.note || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    medal?.image_url
      ? typeof medal.image_url === "string"
        ? medal.image_url
        : medal.image_url.url
      : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
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

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter medal name");
      return;
    }
    if (!tier) {
      toast.error("Please select tier");
      return;
    }
    if (!imageFile && !medal) {
      toast.error("Please upload an image");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("tier", tier);
      formData.append("note", note);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/api/medals", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save medal");
      }

      toast.success(`Medal ${medal ? "updated" : "created"} successfully`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving medal:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save medal",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog id="add_edit_medal_modal" className="modal modal-middle">
      <div className="modal-box rounded-xl p-6 bg-base-100">
        <h3 className="font-semibold text-xl">
          {medal ? "Edit Medal" : "Add New Medal"}
        </h3>
        <p className="mt-1 text-base-content/70">Fill in medal information</p>

        <div className="mt-6 space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Medal Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Gold Medal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full rounded-lg bg-base-200/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Tier <span className="text-error">*</span>
            </label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as Medal["tier"])}
              className="select select-bordered w-full rounded-lg bg-base-200/50"
            >
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Note</label>
            <textarea
              placeholder="e.g., Awarded for completing advanced challenges"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="textarea textarea-bordered w-full rounded-lg bg-base-200/50 h-24"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Medal Image <span className="text-error">*</span>
            </label>
            {imagePreview ? (
              <div className="relative w-full h-48 border-2 border-base-300 rounded-xl overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Medal preview"
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
        </div>

        <div className="modal-action flex justify-end gap-2 mt-4">
          <button
            className="btn btn-sm rounded-lg"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-primary rounded-lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Saving...
              </>
            ) : medal ? (
              "Update"
            ) : (
              "Add Medal"
            )}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
