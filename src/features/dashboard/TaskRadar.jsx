import React from "react";
import { Link } from "react-router-dom";
import { format, isBefore } from "date-fns";
import { CheckSquare } from "lucide-react";
import { PriorityBadge } from "@/shared/ui";

export const TaskRadar = ({ projects = [], currentUser }) => {
  const allTasks = projects.flatMap((p) =>
    (p.tasks || []).map((t) => ({ ...t, projectName: p.name }))
  );

  const myTasks = allTasks.filter(
    (t) => t.assigneeId === currentUser?.id || t.assignee?.id === currentUser?.id
  );

  const now = new Date();
  const overdueCount = myTasks.filter(
    (t) => t.due_date && isBefore(new Date(t.due_date), now) && t.status !== "DONE"
  ).length;

  const inProgressCount = myTasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completedCount = myTasks.filter((t) => t.status === "DONE").length;

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs p-5 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <CheckSquare className="size-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Task Radar</h3>
        </div>
        <span className="text-xs font-semibold text-slate-500">My Queue</span>
      </div>

      {/* Mini metric chips */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">In Progress</p>
          <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
            {inProgressCount}
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Overdue</p>
          <p className="text-lg font-extrabold text-rose-500">{overdueCount}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Done</p>
          <p className="text-lg font-extrabold text-emerald-500">{completedCount}</p>
        </div>
      </div>

      {/* My Upcoming Tasks List */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Action Items
        </p>

        {myTasks.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">No assigned tasks.</p>
        ) : (
          myTasks
            .filter((t) => t.status !== "DONE")
            .slice(0, 4)
            .map((t) => (
              <Link
                key={t.id}
                to={`/taskDetails?projectId=${t.projectId}&taskId=${t.id}`}
                className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-xs"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <p className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {t.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {t.projectName} • {t.due_date ? format(new Date(t.due_date), "MMM d") : ""}
                  </p>
                </div>
                <PriorityBadge priority={t.priority} />
              </Link>
            ))
        )}
      </div>
    </div>
  );
};

