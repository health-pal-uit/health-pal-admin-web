"use client";
import { Medal } from "../type";
import { Upload } from "lucide-react";

interface AddEditModalProps {
  medal: Medal | null;
  onClose: () => void;
}

export function AddEditMedalModal({ medal, onClose }: AddEditModalProps) {
  const formKey = medal ? `edit-${medal.id}` : "add-new";

  return (
    <dialog id="add_edit_medal_modal" className="modal modal-middle">
      <div className="modal-box rounded-xl p-6 bg-base-100">
        <h3 className="font-semibold text-xl">
          {medal ? "Edit Medal" : "Add New Medal"}
        </h3>
        <p className="mt-1 text-base-content/70">Fill in medal information</p>

        <form key={formKey} className="mt-6 space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium">Medal Name</label>
            <input
              type="text"
              placeholder="e.g., Beginner"
              defaultValue={medal?.name}
              className="input input-bordered w-full rounded-lg bg-base-200/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Tier</label>
            <select
              defaultValue={medal?.tier || "Bronze"}
              className="select select-bordered w-full rounded-lg bg-base-200/50"
            >
              <option>Bronze</option>
              <option>Silver</option>
              <option>Gold</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder="e.g., Complete 7 days in a row"
              defaultValue={medal?.description}
              className="textarea textarea-bordered w-full rounded-lg bg-base-200/50 h-24"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Medal Image</label>
            <div className="p-6 border-2 border-dashed border-base-300 rounded-xl flex flex-col items-center text-center gap-2">
              <Upload className="w-6 h-6 opacity-50" />
              <span className="text-base-content/60 text-sm">Upload image</span>
              <input type="file" className="file-input file-input-sm" />
            </div>
          </div>
        </form>

        <div className="modal-action flex justify-end gap-2 mt-4">
          <button className="btn btn-sm rounded-lg" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-sm btn-primary rounded-lg"
            onClick={onClose}
          >
            {medal ? "Update" : "Add Medal"}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
