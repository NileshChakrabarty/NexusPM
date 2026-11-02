import React from "react";
import { FolderKanban, CheckCircle2, Users, AlertTriangle, ArrowUpRight } from "lucide-react";

export const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  const colorStyles = {
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      text: "text-indigo-600 dark:text-indigo-400",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/40",
      text: "text-purple-600 dark:text-purple-400",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-600 dark:text-amber-400",
    },
  };

  const style = colorStyles[color] || colorStyles.indigo;

  return (
    <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 rounded-xl ${style.bg} ${style.text}`}>
          <Icon className="size-4.5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {value}
        </h3>
        {trend && (
          <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {trend}
            <ArrowUpRight className="size-3.5" />
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export const MetricGrid = ({ totalProjects, completedProjects, myTasksCount, overdueCount, workspaceName }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Projects"
        value={totalProjects}
        subtitle={`In ${workspaceName || "workspace"}`}
        icon={FolderKanban}
        color="indigo"
        trend="+2 this month"
      />
      <MetricCard
        title="Completed"
        value={completedProjects}
        subtitle={`of ${totalProjects} total projects`}
        icon={CheckCircle2}
        color="emerald"
        trend="100% On Time"
      />
      <MetricCard
        title="Assigned To Me"
        value={myTasksCount}
        subtitle="Active deliverables"
        icon={Users}
        color="purple"
      />
      <MetricCard
        title="Overdue Tasks"
        value={overdueCount}
        subtitle={overdueCount > 0 ? "Requires review" : "All clean!"}
        icon={AlertTriangle}
        color="amber"
      />
    </div>
  );
};

