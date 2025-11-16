import type { NextPage } from "next";
import {
  Users,
  UtensilsCrossed,
  MessageSquare,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

const stats = [
  {
    label: "Total Users",
    value: "12,345",
    change: "+12%",
    icon: Users,
    color: "bg-success text-success-content",
  },
  {
    label: "Pending Recipes",
    value: "23",
    change: "+5",
    icon: UtensilsCrossed,
    color: "bg-warning text-warning-content",
  },
  {
    label: "Pending Posts",
    value: "8",
    change: "-2",
    icon: MessageSquare,
    color: "bg-info text-info-content",
  },
  {
    label: "Active Users",
    value: "8,234",
    change: "+18%",
    icon: TrendingUp,
    color: "bg-primary text-primary-content",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "user",
    message: "New user: John Smith registered",
    time: "5 minutes ago",
  },
  {
    id: 2,
    type: "recipe",
    message: "New recipe: Avocado Shrimp Salad pending approval",
    time: "15 minutes ago",
  },
  {
    id: 3,
    type: "community",
    message: "New community post from @user123",
    time: "30 minutes ago",
  },
  {
    id: 4,
    type: "warning",
    message: "Warning: User @fitgirl99 overtraining detected",
    time: "1 hour ago",
  },
  {
    id: 5,
    type: "recipe",
    message: "Recipe: Green Smoothie has been approved",
    time: "2 hours ago",
  },
];

const pendingItems = [
  {
    id: 1,
    title: "Avocado Shrimp Salad",
    type: "Recipe",
    user: "Chef Mai",
    calories: "350 kcal",
  },
  {
    id: 2,
    title: "Strawberry Smoothie",
    type: "Recipe",
    user: "Healthy Cook",
    calories: "180 kcal",
  },
  {
    id: 3,
    title: "My 10kg Weight Loss Journey",
    type: "Post",
    user: "@fitjourney",
    calories: "-",
  },
];

const DashboardPage: NextPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-base-content">
          System Overview
        </h1>
        <p className="text-base-content/70">
          Welcome back! Here&#39;s an overview of your system activity.
        </p>
      </div>

      <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat">
              <div className={`stat-figure ${stat.color} rounded-lg p-3`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="stat-title">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-desc text-success">{stat.change}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Activities</h2>
            <div className="mt-4 space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-4 border-b border-base-200 last:border-0 last:pb-0"
                >
                  <div
                    className={`mt-1 p-2 rounded-full ${
                      activity.type === "warning"
                        ? "bg-error/10"
                        : "bg-success/10"
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
                    <p className="text-sm text-base-content/60">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Pending Approvals</h2>

            <div className="overflow-x-auto mt-4">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingItems.map((item) => (
                    <tr key={item.id} className="hover">
                      <td>
                        <div className="font-bold">{item.title}</div>
                        <div className="text-sm text-base-content/60">
                          by {item.user}
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-outline">{item.type}</div>
                      </td>
                      <td>{item.calories}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
