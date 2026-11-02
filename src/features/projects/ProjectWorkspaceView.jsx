import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Kanban,
  Calendar,
  BarChart2,
  Settings,
  CheckCircle2,
  Clock,
  Users,
  Layers,
} from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/shared/ui";
import { TaskExecutionView } from "@/features/tasks/TaskExecutionView";
import { DeliveryCalendarView } from "@/features/calendar/DeliveryCalendarView";
import { ProjectAnalyticsDashboard } from "@/features/analytics/ProjectAnalyticsDashboard";
import { ProjectSettingsPanel } from "./ProjectSettingsPanel";
import { CreateTaskModal } from "@/features/tasks/CreateTaskModal";

export const ProjectWorkspaceView = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const id = searchParams.get("id");
  const tab = searchParams.get("tab") || "tasks";

  const { currentWorkspace } = useSelector((state) => state.workspace);
  const project = (currentWorkspace?.projects || []).find((p) => p.id === id);

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  if (!project) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-200">
          Project Not Found
        </h2>
        <p className="text-xs text-slate-400">
          This project may have been removed or does not exist in the current workspace.
        </p>
        <button
          onClick={() => navigate("/projects")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition"
        >
          <ArrowLeft className="size-4" />
          Back to Projects Portfolio
        </button>
      </div>
    );
  }

  const tasks = project.tasks || [];
  const completedCount = tasks.filter((t) => t.status === "DONE").length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "IN_PROGRESS" || t.status === "TODO"
  ).length;

  const tabs = [
    { key: "tasks", label: "Tasks & Board", icon: Kanban, count: tasks.length },
    { key: "calendar", label: "Calendar", icon: Calendar },
    { key: "analytics", label: "Analytics", icon: BarChart2 },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  const handleTabChange = (key) => {
    setSearchParams({ id, tab: key });
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/projects")}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Back to projects"
          >
            <ArrowLeft className="size-4.5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {project.name}
              </h1>
              <StatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
              {project.description || "Project overview and task operations"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateTaskOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs shadow-indigo-500/20 transition shrink-0"
        >
          <Plus className="size-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* 4 Mini Summary Metric Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total Tasks</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{tasks.length}</p>
          </div>
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
            <Layers className="size-4" />
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Completed</p>
            <p className="text-xl font-bold text-emerald-600">{completedCount}</p>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
            <CheckCircle2 className="size-4" />
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">In Progress</p>
            <p className="text-xl font-bold text-indigo-600">{inProgressCount}</p>
          </div>
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
            <Clock className="size-4" />
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Team Members</p>
            <p className="text-xl font-bold text-purple-600">
              {project.members?.length || 0}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600">
            <Users className="size-4" />
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((item) => {
          const isActive = tab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleTabChange(item.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                isActive
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span
                  className={`size-4.5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    isActive
                      ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div className="pt-2">
        {tab === "tasks" && <TaskExecutionView project={project} />}
        {tab === "calendar" && <DeliveryCalendarView tasks={tasks} />}
        {tab === "analytics" && <ProjectAnalyticsDashboard project={project} tasks={tasks} />}
        {tab === "settings" && <ProjectSettingsPanel project={project} />}
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        projectId={project.id}
      />
    </div>
  );
};

