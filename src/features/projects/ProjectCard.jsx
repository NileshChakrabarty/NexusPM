import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, ListTodo } from "lucide-react";
import { StatusBadge, PriorityBadge, AvatarGroup } from "@/shared/ui";

export const ProjectCard = ({ project }) => {
  const tasks = project.tasks || [];
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const totalTasks = tasks.length;
  const progress =
    project.progress !== undefined
      ? project.progress
      : totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const formattedDate = project.end_date
    ? format(new Date(project.end_date), "MMM d, yyyy")
    : "No deadline";

  return (
    <Link
      to={`/projectsDetail?id=${project.id}&tab=tasks`}
      className="group block p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 shadow-xs hover:shadow-md"
    >
      {/* Top Header: Status & Priority */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <StatusBadge status={project.status} />
        <PriorityBadge priority={project.priority} />
      </div>

      {/* Name and Description */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {project.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {project.description || "No project description provided."}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-slate-500 dark:text-slate-400">Progress</span>
          <span className="text-slate-900 dark:text-white font-semibold">{progress}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              progress === 100
                ? "bg-emerald-500"
                : progress > 50
                ? "bg-indigo-600"
                : "bg-indigo-400"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <ListTodo className="size-3.5 text-indigo-500" />
          <span>
            {completedTasks}/{totalTasks} tasks
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar className="size-3.5 text-slate-400" />
          <span>{formattedDate}</span>
        </div>

        <AvatarGroup members={project.members || []} max={3} size="xs" />
      </div>
    </Link>
  );
};

