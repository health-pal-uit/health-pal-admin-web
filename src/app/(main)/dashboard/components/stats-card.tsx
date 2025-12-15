import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

interface StatsCardProps {
  stats: StatItem[];
}

export const StatsCard = ({ stats }: StatsCardProps) => {
  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow-xl bg-base-100">
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
  );
};
