"use client";

import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { Recipe } from "../type";

interface EditMealModalProps {
  meal: Recipe | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditMealModal = ({
  meal,
  onClose,
  onSuccess,
}: EditMealModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    kcal_per_100gr: "",
    protein_per_100gr: "",
    fat_per_100gr: "",
    carbs_per_100gr: "",
    fiber_per_100gr: "",
    rating: "",
    tags: "",
    notes: "",
    image_url: "",
  });

  useEffect(() => {
    if (meal) {
      setFormData({
        name: meal.title,
        kcal_per_100gr: meal.calories.toString(),
        protein_per_100gr: meal.protein.toString(),
        fat_per_100gr: meal.fat.toString(),
        carbs_per_100gr: meal.carbs.toString(),
        fiber_per_100gr: meal.fiber?.toString() || "",
        rating: meal.rating?.toString() || "",
        tags: meal.tags.join(", "),
        notes: meal.notes || "",
        image_url: meal.imageUrl || "",
      });
      setImagePreview(meal.imageUrl);
    }
  }, [meal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meal) return;

    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();

      // Add required fields
      submitFormData.append("name", formData.name);
      submitFormData.append("kcal_per_100gr", formData.kcal_per_100gr);
      submitFormData.append("protein_per_100gr", formData.protein_per_100gr);
      submitFormData.append("fat_per_100gr", formData.fat_per_100gr);
      submitFormData.append("carbs_per_100gr", formData.carbs_per_100gr);

      // Add optional fields
      if (formData.fiber_per_100gr) {
        submitFormData.append("fiber_per_100gr", formData.fiber_per_100gr);
      }
      if (formData.rating) {
        submitFormData.append("rating", formData.rating);
      }
      if (formData.notes) {
        submitFormData.append("notes", formData.notes);
      }

      // Add tags as JSON string
      if (formData.tags) {
        const tagsArray = formData.tags.split(",").map((t) => t.trim());
        submitFormData.append("tags", JSON.stringify(tagsArray));
      }

      // Add image file if selected
      if (selectedImage) {
        submitFormData.append("image", selectedImage);
      } else if (formData.image_url) {
        submitFormData.append("image_url", formData.image_url);
      }

      const response = await fetch(`/api/meals/${meal.id}`, {
        method: "PATCH",
        body: submitFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update meal");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating meal:", error);
      alert(error instanceof Error ? error.message : "Failed to update meal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image_url: "" }));
  };

  if (!meal) return null;

  return (
    <dialog id="edit_meal_modal" className="modal">
      <div className="modal-box max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Edit Meal</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Meal Name *</span>
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                placeholder="e.g., Chicken Salad"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Calories per 100g *</span>
              </label>
              <input
                type="number"
                name="kcal_per_100gr"
                className="input input-bordered"
                placeholder="e.g., 250"
                value={formData.kcal_per_100gr}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Protein per 100g *</span>
              </label>
              <input
                type="number"
                name="protein_per_100gr"
                className="input input-bordered"
                placeholder="e.g., 30"
                value={formData.protein_per_100gr}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Fat per 100g *</span>
              </label>
              <input
                type="number"
                name="fat_per_100gr"
                className="input input-bordered"
                placeholder="e.g., 10"
                value={formData.fat_per_100gr}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Carbs per 100g *</span>
              </label>
              <input
                type="number"
                name="carbs_per_100gr"
                className="input input-bordered"
                placeholder="e.g., 40"
                value={formData.carbs_per_100gr}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Fiber per 100g</span>
              </label>
              <input
                type="number"
                name="fiber_per_100gr"
                className="input input-bordered"
                placeholder="e.g., 5"
                value={formData.fiber_per_100gr}
                onChange={handleChange}
                step="0.01"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Rating (1-5)</span>
              </label>
              <input
                type="number"
                name="rating"
                className="input input-bordered"
                placeholder="e.g., 4.5"
                value={formData.rating}
                onChange={handleChange}
                step="0.1"
                min="1"
                max="5"
              />
            </div>

            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Tags (comma separated)</span>
              </label>
              <input
                type="text"
                name="tags"
                className="input input-bordered w-full"
                placeholder="e.g., meat, healthy, high-protein"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            {/* Image Upload Section */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Meal Image</span>
              </label>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative mb-4 w-full h-48 border-2 border-dashed border-base-300 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Upload Button */}
              {!imagePreview && (
                <label className="cursor-pointer">
                  <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-base-300 rounded-lg hover:border-primary transition-colors">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-base-content/50" />
                      <span className="mt-2 block text-sm text-base-content/70">
                        Click to upload image
                      </span>
                      <span className="mt-1 block text-xs text-base-content/50">
                        PNG, JPG, GIF up to 10MB
                      </span>
                    </div>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {/* Optional Image URL */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Or enter Image URL</span>
              </label>
              <input
                type="url"
                name="image_url"
                className="input input-bordered w-full"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={handleChange}
              />
            </div>

            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Notes</span>
              </label>
              <textarea
                name="notes"
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Additional notes about the meal..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Updating...
                </>
              ) : (
                "Update Meal"
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
};
