import { Clock, CheckCircle, XCircle } from "lucide-react";
import { RecipeStatus } from "../type";

interface RecipeTabsProps {
  activeTab: RecipeStatus;
  onTabChange: (tab: RecipeStatus) => void;
  pendingCount: number;
}

export const RecipeTabs = ({
  activeTab,
  onTabChange,
  pendingCount,
}: RecipeTabsProps) => {
  return (
    <div className="flex w-fit items-center gap-2 p-1 rounded-full bg-base-300">
      <button
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition
          ${activeTab === "pending" ? "bg-base-100 font-medium shadow-sm" : "opacity-70 hover:opacity-100"}
        `}
        onClick={() => onTabChange("pending")}
      >
        <Clock className="h-4 w-4" />
        <span>Pending</span>
        {pendingCount > 0 && (
          <span className="badge badge-sm bg-base-200 border-none">
            {pendingCount}
          </span>
        )}
      </button>

      <button
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition
          ${activeTab === "approved" ? "bg-base-100 font-medium shadow-sm" : "opacity-70 hover:opacity-100"}
        `}
        onClick={() => onTabChange("approved")}
      >
        <CheckCircle className="h-4 w-4" />
        <span>Approved</span>
      </button>

      <button
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition
          ${activeTab === "rejected" ? "bg-base-100 font-medium shadow-sm" : "opacity-70 hover:opacity-100"}
        `}
        onClick={() => onTabChange("rejected")}
      >
        <XCircle className="h-4 w-4" />
        <span>Rejected</span>
      </button>
    </div>
  );
};
