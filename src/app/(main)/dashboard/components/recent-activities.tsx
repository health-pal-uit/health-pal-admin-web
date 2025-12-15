import { AlertCircle } from "lucide-react";

interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Recent Activities</h2>
        <div className="mt-4 space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 pb-4 border-b border-base-200 last:border-0 last:pb-0"
            >
              <div
                className={`mt-1 p-2 rounded-full ${
                  activity.type === "warning" ? "bg-error/10" : "bg-success/10"
                }`}
              >
                {activity.type === "warning" ? (
                  <AlertCircle className="h-4 w-4 text-error" />
                ) : (
                  <div className="h-4 w-4 rounded-full bg-success" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-base-content">{activity.message}</p>
                <p className="text-sm text-base-content/60">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
