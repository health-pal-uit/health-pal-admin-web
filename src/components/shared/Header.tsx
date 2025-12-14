import { Plus } from "lucide-react";

interface HeaderProps {
  tabName?: string;
  description?: string;
  buttonName?: string;
  onAddClick?: () => void;
}

const Header = ({
  tabName = "Tab",
  description = "Description",
  buttonName = "Button",
  onAddClick,
}: HeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-base-content">{tabName}</h1>
        <p className="text-base-content/70">{description}</p>
      </div>
      <button className="btn btn-primary" onClick={onAddClick}>
        <Plus className="h-4 w-4" />
        Add {buttonName}
      </button>
    </div>
  );
};
export default Header;
