import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  FolderKanban,
  ExternalLink,
} from "lucide-react";
import { addComment, updateTask } from "@/features/workspace/workspaceSlice";
import { StatusBadge, PriorityBadge, TypeBadge, Avatar } from "@/shared/ui";
import { TaskDiscussionThread } from "./TaskDiscussionThread";
import toast from "react-hot-toast";

export const TaskInspectorView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const projectId = searchParams.get("projectId");
  const taskId = searchParams.get("taskId");

  const { currentWorkspace, currentUser } = useSelector((state) => state.workspace);

  const project = (currentWorkspace?.projects || []).find((p) => p.id === projectId);
  const task = (project?.tasks || []).find((t) => t.id === taskId);

  if (!task || !project) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-200">
          Task Not Found
        </h2>
        <p className="text-xs text-slate-400">
          The requested task may have been removed or moved to another sprint.
        </p>
        <button
          onClick={() => navigate(projectId ? `/projectsDetail?id=${projectId}` : "/projects")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition"
        >
          <ArrowLeft className="size-4" />
          Back to Project
        </button>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    dispatch(
      updateTask({
        ...task,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      })
    );
    toast.success(`Task status changed to ${newStatus.replace("_", " ")}`);
  };

  const handleAddComment = (content) => {
    dispatch(
      addComment({
        projectId: project.id,
        taskId: task.id,
        comment: {
          userId: currentUser?.id || "user_1",
          user: currentUser,
          content,
        },
      })
    );
    toast.success("Comment posted");
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/projectsDetail?id=${project.id}&tab=tasks`)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Back to project tasks"
          >
            <ArrowLeft className="size-4.5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Link
                to={`/projectsDetail?id=${project.id}&tab=tasks`}
                className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                {project.name}
              </Link>
              <span>/</span>
              <span className="font-mono text-slate-500">TASK-{task.id.slice(-4).toUpperCase()}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              {task.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      {/* Main Grid: Discussion on Left 2/3, Task & Project Info on Right 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Discussion & Activity Log */}
        <div className="lg:col-span-2 space-y-6">
          <TaskDiscussionThread
            comments={task.comments || []}
            currentUser={currentUser}
            onAddComment={handleAddComment}
          />
        </div>

        {/* Right Column: Task Specs & Project Info */}
        <div className="space-y-6">
          {/* Task Specs Card */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Task Specifications
            </h3>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">Description</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {task.description || "No detailed description provided."}
              </p>
            </div>

            {/* Status Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-semibold text-slate-400">Status State</label>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            {/* Type & Priority */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Type</span>
                <TypeBadge type={task.type} />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Priority</span>
                <PriorityBadge priority={task.priority} />
              </div>
            </div>

            {/* Assignee */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">Assignee</span>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <Avatar user={task.assignee} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {task.assignee?.name || "Unassigned"}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {task.assignee?.email || "No email"}
                  </p>
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">Target Delivery</span>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Calendar className="size-4 text-indigo-500" />
                <span>
                  {task.due_date ? format(new Date(task.due_date), "MMMM d, yyyy") : "Not set"}
                </span>
              </div>
            </div>
          </div>

          {/* Project Context Card */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                <FolderKanban className="size-4 text-indigo-500" />
                <span>Parent Project</span>
              </div>
              <Link
                to={`/projectsDetail?id=${project.id}&tab=tasks`}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View</span>
                <ExternalLink className="size-3" />
              </Link>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {project.name}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                {project.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Progress</span>
                <span>{project.progress || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

