import { X } from "lucide-react";

interface UserFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  filters: {
    gender: string;
    status: string;
    ageMin: string;
    ageMax: string;
  };
  setFilters: {
    setGender: (val: string) => void;
    setStatus: (val: string) => void;
    setAgeMin: (val: string) => void;
    setAgeMax: (val: string) => void;
  };
}

export function UserFilterModal({
  isOpen,
  onClose,
  onApply,
  onClear,
  filters,
  setFilters,
}: UserFilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Filter Users</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Gender</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={filters.gender}
              onChange={(e) => setFilters.setGender(e.target.value)}
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Status</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={filters.status}
              onChange={(e) => setFilters.setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Age Range</span>
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Min age"
                  className="input input-bordered w-full"
                  value={filters.ageMin}
                  onChange={(e) => setFilters.setAgeMin(e.target.value)}
                  min="0"
                  max="150"
                />
              </div>
              <div className="flex items-center">
                <span className="text-base-content/70">to</span>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Max age"
                  className="input input-bordered w-full"
                  value={filters.ageMax}
                  onChange={(e) => setFilters.setAgeMax(e.target.value)}
                  min="0"
                  max="150"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClear}>
            Clear All
          </button>
          <button className="btn btn-primary" onClick={onApply}>
            Apply Filters
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}
