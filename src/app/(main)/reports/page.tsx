"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, FileText, Calendar, Trophy } from "lucide-react";

interface TimeSeriesData {
  bucket: string;
  value: number;
}

interface ReportData {
  range: {
    start: string;
    end: string;
    segment: string;
  };
  metrics: string[];
  totals: {
    users: number;
    posts: number;
    daily_logs: number;
    ingredients: number;
    meals: number;
    challenges: number;
    premium_packages?: number;
  };
  timeseries: {
    users: TimeSeriesData[];
    posts: TimeSeriesData[];
    daily_logs: TimeSeriesData[];
    challenges: TimeSeriesData[];
    premium_packages?: TimeSeriesData[];
  };
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [segment, setSegment] = useState<string>("day");

  useEffect(() => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 9);

    setStartDate(weekAgo.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchReportData();
    }
  }, [startDate, endDate, segment]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const url = `/api/reports?metric=overview&segment=${segment}&start_date=${startDate}&end_date=${endDate}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch report data");
      }

      const result = await response.json();
      if (result.data) {
        setReportData(result.data);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Failed to load report data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatChartData = (timeseries: TimeSeriesData[]) => {
    return timeseries.map((item) => ({
      date: formatDate(item.bucket),
      value: item.value,
    }));
  };

  const statCards = [
    {
      label: "Total Users",
      value: reportData?.totals.users || 0,
      icon: Users,
      color: "bg-primary",
    },
    {
      label: "Posts",
      value: reportData?.totals.posts || 0,
      icon: FileText,
      color: "bg-secondary",
    },
    {
      label: "Daily Logs",
      value: reportData?.totals.daily_logs || 0,
      icon: Calendar,
      color: "bg-accent",
    },
    {
      label: "Challenges",
      value: reportData?.totals.challenges || 0,
      icon: Trophy,
      color: "bg-success",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-base-content/70 mt-1">
            Analytics and insights overview
          </p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="form-control flex-1 min-w-[200px]">
              <label className="label">
                <span className="label-text font-semibold">Start Date</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control flex-1 min-w-[200px]">
              <label className="label">
                <span className="label-text font-semibold">End Date</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control flex-1 min-w-[200px]">
              <label className="label">
                <span className="label-text font-semibold">Segment</span>
              </label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            <button
              onClick={fetchReportData}
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Apply"
              )}
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : reportData ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="card bg-base-100 shadow-sm">
                  <div className="card-body">
                    <div className="flex items-center gap-4">
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-base-content/70">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold">
                          {stat.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Posts Chart */}
            {reportData.timeseries.posts &&
              reportData.timeseries.posts.length > 0 && (
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body">
                    <h2 className="card-title">Posts Activity</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={formatChartData(reportData.timeseries.posts)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          name="Posts"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

            {/* Daily Logs Chart */}
            {reportData.timeseries.daily_logs &&
              reportData.timeseries.daily_logs.length > 0 && (
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body">
                    <h2 className="card-title">Daily Logs</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={formatChartData(reportData.timeseries.daily_logs)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#f97316" name="Daily Logs" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

            {/* Users Chart */}
            {reportData.timeseries.users &&
              reportData.timeseries.users.length > 0 && (
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body">
                    <h2 className="card-title">User Growth</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={formatChartData(reportData.timeseries.users)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="Users"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

            {/* Challenges Chart */}
            {reportData.timeseries.challenges &&
              reportData.timeseries.challenges.length > 0 && (
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body">
                    <h2 className="card-title">Challenges Created</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={formatChartData(reportData.timeseries.challenges)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#10b981" name="Challenges" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title">Additional Metrics</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">
                      Total Ingredients
                    </span>
                    <span className="font-bold text-lg">
                      {reportData.totals.ingredients.toLocaleString()}
                    </span>
                  </div>
                  <div className="divider my-0"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Total Meals</span>
                    <span className="font-bold text-lg">
                      {reportData.totals.meals.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title">Date Range</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Start Date</span>
                    <span className="font-bold">
                      {new Date(reportData.range.start).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="divider my-0"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">End Date</span>
                    <span className="font-bold">
                      {new Date(reportData.range.end).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="divider my-0"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Segment</span>
                    <span className="font-bold capitalize">
                      {reportData.range.segment}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-base-content/70">No data available</p>
        </div>
      )}
    </div>
  );
}
