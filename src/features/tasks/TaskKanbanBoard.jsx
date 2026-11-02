import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { PriorityBadge, TypeBadge, Avatar } from "@/shared/ui";

export const TaskKanbanBoard = ({ tasks, onStatusChange, onOpenCreateModal }) => {
  const navigate = useNavigate();

  const columns = [
    {
      key: "TODO",
      title: "To Do",
      icon: CircleDot,
      color: "text-slate-500",
      bgHeader: "bg-slate-100 dark:bg-slate-800/60",
    },
    {
      key: "IN_PROGRESS",
      title: "In Progress",
      icon: Clock,
      color: "text-indigo-500",
      bgHeader: "bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
      key: "DONE",
      title: "Completed",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgHeader: "bg-emerald-50 dark:bg-emerald-950/40",
    },
  ];

  const getNextStatus = (current) => {
    if (current === "TODO") return "IN_PROGRESS";
    if (current === "IN_PROGRESS") return "DONE";
    return null;
  };

  const getPrevStatus = (current) => {
    if (current === "DONE") return "IN_PROGRESS";
    if (current === "IN_PROGRESS") return "TODO";
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);

        return (
          <div
            key={col.key}
            className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0c101d] overflow-hidden min-h-[500px]"
          >
            {/* Column Header */}
            <div
              className={`p-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between ${col.bgHeader}`}
            >
              <div className="flex items-center gap-2">
                <col.icon className={`size-4 ${col.color}`} />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  {col.title}
                </h4>
                <span className="size-5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] flex items-center justify-center shadow-xs">
                  {colTasks.length}
                </span>
              </div>

              {col.key === "TODO" && (
                <button
                  onClick={onOpenCreateModal}
                  className="p-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 transition"
                  title="Add Task"
                >
                  <Plus className="size-4" />
                </button>
              )}
            </div>

            {/* Column Tasks */}
            <div className="p-3 space-y-3 flex-1 overflow-y-auto no-scrollbar">
              {colTasks.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400">
                  No tasks in this lane
                </div>
              ) : (
                colTasks.map((task) => {
                  const next = getNextStatus(task.status);
                  const prev = getPrevStatus(task.status);

                  return (
                    <div
                      key={task.id}
                      onClick={() =>
                        navigate(`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`)
                      }
                      className="group p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-indigo-400 dark:hover:border-indigo-600 transition shadow-xs hover:shadow-md cursor-pointer space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <TypeBadge type={task.type} />
                        <PriorityBadge priority={task.priority} />
                      </div>

                      <h5 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {task.title}
                      </h5>

                      {task.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Avatar user={task.assignee} size="xs" />
                          <span className="truncate max-w-[90px]">
                            {task.assignee?.name?.split(" ")[0] || "Unassigned"}
                          </span>
                        </div>

                        {/* Quick Status Shift Controls */}
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {prev && (
                            <button
                              onClick={() => onStatusChange(task.id, prev)}
                              title={`Move back to ${prev}`}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                              <ChevronLeft className="size-3.5" />
                            </button>
                          )}
                          {next && (
                            <button
                              onClick={() => onStatusChange(task.id, next)}
                              title={`Advance to ${next}`}
                              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                              <ChevronRight className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

