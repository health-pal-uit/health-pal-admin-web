"use client";

import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Apple,
  Award,
  Trophy,
  MessageSquare,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  { id: "users", label: "Users", icon: Users, href: "/users" },
  {
    id: "recipes",
    label: "Recipes & Meals",
    icon: UtensilsCrossed,
    href: "/recipes",
  },
  {
    id: "ingredients",
    label: "Ingredients",
    icon: Apple,
    href: "/ingredients",
  },
  { id: "medals", label: "Medals", icon: Award, href: "/medals" },
  {
    id: "challenges",
    label: "Challenges",
    icon: Trophy,
    href: "/challenges",
  },
  {
    id: "community",
    label: "Community",
    icon: MessageSquare,
    href: "/community",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <aside className="menu flex w-64 flex-col bg-base-100 p-4 shadow-xl">
      <div className="mb-4 border-b border-base-300 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="/image/health-pal-logo.png"
            alt="Health Pal"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <div>
            <h1 className="text-xl font-semibold text-primary">Health Pal</h1>
            <p className="text-xs text-base-content/60">Admin Panel</p>
          </div>
        </Link>
      </div>

      <ul className="flex-1 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <li key={item.id}>
              <Link href={item.href} className={isActive ? "active" : ""}>
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto border-t border-base-300 pt-4">
        <button
          onClick={handleLogout}
          className="btn btn-ghost w-full justify-start"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
