"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UtensilsCrossed,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { DashboardHeader } from "./components/dashboard-header";
import { StatsCard } from "./components/stats-card";
import { RecentActivities } from "./components/recent-activities";
import { PendingApprovals } from "./components/pending-approvals";

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

export default function DashboardPage() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users?page=1&limit=1");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();

      if (data.data) {
        const total = data.data.total || 0;
        setTotalUsers(total);
        const estimatedActive = Math.floor(total * 0.7);
        setActiveUsers(estimatedActive);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load user statistics");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Users",
      value: isLoading ? "..." : totalUsers.toLocaleString(),
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
      value: isLoading ? "..." : activeUsers.toLocaleString(),
      change: "+18%",
      icon: TrendingUp,
      color: "bg-primary text-primary-content",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader />
      <StatsCard stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities activities={recentActivities} />
        <PendingApprovals items={pendingItems} />
      </div>
    </div>
  );
}
