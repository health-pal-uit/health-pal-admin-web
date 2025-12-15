import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <label className="input input-bordered flex items-center gap-2 rounded-full">
      <Search className="h-5 w-5 text-base-content/60" />
      <input
        type="text"
        className="grow"
        placeholder="Search recipes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
};
