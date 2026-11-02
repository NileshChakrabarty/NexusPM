import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, ChevronRight } from "lucide-react";
import { StatusBadge, PriorityBadge, TypeBadge, Avatar } from "@/shared/ui";

export const TaskTableView = ({
  tasks,
  selectedTaskIds,
  onToggleSelectAll,
  onToggleSelectTask,
  onStatusChange,
}) => {
  const navigate = useNavigate();
  const allSelected = tasks.length > 0 && selectedTaskIds.length === tasks.length;

  return (
    <div className="border border-slate-200/90 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#111827] overflow-hidden shadow-xs">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="rounded text-indigo-600 focus:ring-indigo-500 size-3.5"
                />
              </th>
              <th className="py-3 px-3">Title & Task</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Assignee</th>
              <th className="py-3 px-3">Due Date</th>
              <th className="py-3 pr-4 pl-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  No tasks found matching your filter criteria.
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const isChecked = selectedTaskIds.includes(task.id);
                return (
                  <tr
                    key={task.id}
                    onClick={() =>
                      navigate(`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`)
                    }
                    className={`group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      isChecked ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                    }`}
                  >
                    <td
                      className="py-3.5 pl-4 pr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleSelectTask(task.id)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 size-3.5"
                      />
                    </td>

                    <td className="py-3.5 px-3 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {task.title}
                      </div>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <TypeBadge type={task.type} />
                    </td>

                    <td className="py-3.5 px-3">
                      <PriorityBadge priority={task.priority} />
                    </td>

                    <td
                      className="py-3.5 px-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={task.status}
                        onChange={(e) => onStatusChange(task.id, e.target.value)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <Avatar user={task.assignee} size="xs" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[120px]">
                          {task.assignee?.name || "Unassigned"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-slate-400" />
                        <span>
                          {task.due_date ? format(new Date(task.due_date), "MMM d") : "No date"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 pr-4 pl-2 text-right">
                      <ChevronRight className="size-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
            No tasks found.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() =>
                navigate(`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`)
              }
              className="p-4 space-y-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={selectedTaskIds.includes(task.id)}
                    onChange={() => onToggleSelectTask(task.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 rounded text-indigo-600 focus:ring-indigo-500 size-3.5"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {task.description}
                    </p>
                  </div>
                </div>
                <PriorityBadge priority={task.priority} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <TypeBadge type={task.type} />
                  <StatusBadge status={task.status} />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Avatar user={task.assignee} size="xs" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {task.assignee?.name?.split(" ")[0] || "Unassigned"}
                    </span>
                  </div>
                  <span className="text-slate-400">
                    {task.due_date ? format(new Date(task.due_date), "MMM d") : ""}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

