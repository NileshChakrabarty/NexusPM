import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
} from "lucide-react";

const TYPE_COLORS = {
  FEATURE: "#6366f1", // Indigo
  BUG: "#f43f5e",     // Rose
  TASK: "#10b981",    // Emerald
  IMPROVEMENT: "#8b5cf6", // Purple
  OTHER: "#0ea5e9",   // Sky
};

export const ProjectAnalyticsDashboard = ({ project, tasks = [] }) => {
  const { metrics, statusChartData, typeChartData, priorityData } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "DONE").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const todo = tasks.filter((t) => t.status === "TODO").length;

    const now = new Date();
    const overdue = tasks.filter(
      (t) => t.due_date && new Date(t.due_date) < now && t.status !== "DONE"
    ).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const statusChartData = [
      { name: "To Do", count: todo },
      { name: "In Progress", count: inProgress },
      { name: "Done", count: completed },
    ];

    const typeCounts = { FEATURE: 0, BUG: 0, TASK: 0, IMPROVEMENT: 0, OTHER: 0 };
    tasks.forEach((t) => {
      if (typeCounts[t.type] !== undefined) {
        typeCounts[t.type]++;
      } else {
        typeCounts.OTHER++;
      }
    });

    const typeChartData = Object.entries(typeCounts)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({
        name: name.charAt(0) + name.slice(1).toLowerCase(),
        value,
        color: TYPE_COLORS[name] || "#6366f1",
      }));

    const priorityCounts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    tasks.forEach((t) => {
      if (priorityCounts[t.priority] !== undefined) {
        priorityCounts[t.priority]++;
      }
    });

    const priorityData = [
      {
        priority: "High Priority",
        count: priorityCounts.HIGH,
        percent: total > 0 ? Math.round((priorityCounts.HIGH / total) * 100) : 0,
        color: "bg-rose-500",
      },
      {
        priority: "Medium Priority",
        count: priorityCounts.MEDIUM,
        percent: total > 0 ? Math.round((priorityCounts.MEDIUM / total) * 100) : 0,
        color: "bg-amber-500",
      },
      {
        priority: "Low Priority",
        count: priorityCounts.LOW,
        percent: total > 0 ? Math.round((priorityCounts.LOW / total) * 100) : 0,
        color: "bg-slate-400",
      },
    ];

    return {
      metrics: {
        total,
        completed,
        inProgress,
        overdue,
        completionRate,
        teamSize: project?.members?.length || 0,
      },
      statusChartData,
      typeChartData,
      priorityData,
    };
  }, [project, tasks]);

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completion Rate */}
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Completion Rate
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {metrics.completionRate}%
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {metrics.completed} of {metrics.total} tasks resolved
          </p>
        </div>

        {/* In Progress */}
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Tasks
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Clock className="size-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {metrics.inProgress}
          </p>
          <p className="text-xs text-slate-400 mt-1">Currently in development</p>
        </div>

        {/* Overdue */}
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Overdue Tasks
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="size-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            {metrics.overdue}
          </p>
          <p className="text-xs text-slate-400 mt-1">Requiring immediate priority</p>
        </div>

        {/* Team Members */}
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Team Capacity
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Users className="size-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {metrics.teamSize}
          </p>
          <p className="text-xs text-slate-400 mt-1">Engineers & Designers assigned</p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Task Status Distribution
            </h4>
            <span className="text-xs text-slate-400">Total: {metrics.total}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Type Breakdown */}
        <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Deliverables by Type
            </h4>
            <span className="text-xs text-slate-400">Features vs Bugs</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {typeChartData.length === 0 ? (
              <p className="text-xs text-slate-400">No task types recorded</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {typeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                      color: "#f8fafc",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(val) => <span className="text-xs text-slate-600 dark:text-slate-300">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Priority Allocation Breakdown */}
      <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
          Priority Allocation & Risk Spectrum
        </h4>
        <div className="space-y-4">
          {priorityData.map((item) => (
            <div key={item.priority} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {item.priority}
                </span>
                <span className="text-slate-500 font-medium">
                  {item.count} tasks ({item.percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-300`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

