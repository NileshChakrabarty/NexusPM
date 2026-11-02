import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FolderKanban, Plus } from "lucide-react";
import { StatusBadge, AvatarGroup } from "@/shared/ui";

export const ProjectProgressList = ({ projects = [], onOpenCreateModal }) => {
  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Projects</h3>
          <p className="text-xs text-slate-400 mt-0.5">High priority workspace initiatives</p>
        </div>
        <Link
          to="/projects"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 transition"
        >
          <span>View all</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {projects.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <FolderKanban className="size-6" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">No projects created yet.</p>
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition"
            >
              <Plus className="size-3.5" />
              Create First Project
            </button>
          </div>
        ) : (
          projects.slice(0, 4).map((p) => {
            const completed = (p.tasks || []).filter((t) => t.status === "DONE").length;
            const total = (p.tasks || []).length;
            const progress =
              p.progress !== undefined
                ? p.progress
                : total > 0
                ? Math.round((completed / total) * 100)
                : 0;

            return (
              <Link
                key={p.id}
                to={`/projectsDetail?id=${p.id}&tab=tasks`}
                className="group p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate">
                      {p.name}
                    </h4>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {p.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center gap-4 sm:justify-end shrink-0">
                  <div className="w-28 space-y-1 hidden sm:block">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Progress</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <AvatarGroup members={p.members || []} max={3} size="xs" />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

