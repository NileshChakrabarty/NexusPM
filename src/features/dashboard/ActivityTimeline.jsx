import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Activity } from "lucide-react";
import { TypeBadge, StatusBadge, Avatar } from "@/shared/ui";

export const ActivityTimeline = ({ projects = [] }) => {
  const allTasks = projects.flatMap((p) =>
    (p.tasks || []).map((t) => ({ ...t, projectName: p.name }))
  );

  const sortedTasks = [...allTasks]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Activity</h3>
        </div>
        <span className="text-xs text-slate-400">Recent updates</span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {sortedTasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No recent activity recorded.
          </div>
        ) : (
          sortedTasks.map((t) => {
            const timeStr = t.updatedAt || t.createdAt;
            const formatted = timeStr ? format(new Date(timeStr), "MMM d, h:mm a") : "";

            return (
              <Link
                key={t.id}
                to={`/taskDetails?projectId=${t.projectId}&taskId=${t.id}`}
                className="group p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition block"
              >
                <Avatar user={t.assignee} size="sm" className="mt-0.5" />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                      {t.title}
                    </p>
                    <StatusBadge status={t.status} />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      {t.projectName}
                    </span>
                    <span>•</span>
                    <TypeBadge type={t.type} />
                    <span>•</span>
                    <span>{formatted}</span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

