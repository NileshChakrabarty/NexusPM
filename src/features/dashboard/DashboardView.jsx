import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Plus, Sparkles } from "lucide-react";
import { MetricGrid } from "./MetricGrid";
import { ProjectProgressList } from "./ProjectProgressList";
import { ActivityTimeline } from "./ActivityTimeline";
import { TaskRadar } from "./TaskRadar";
import { CreateProjectModal } from "@/features/projects/CreateProjectModal";
import { isBefore } from "date-fns";

export const DashboardView = () => {
  const { currentWorkspace, currentUser } = useSelector((state) => state.workspace);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const projects = currentWorkspace?.projects || [];
  const allTasks = projects.flatMap((p) => p.tasks || []);

  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === "COMPLETED").length;
  const myTasksCount = allTasks.filter(
    (t) => t.assigneeId === currentUser?.id || t.assignee?.id === currentUser?.id
  ).length;

  const now = new Date();
  const overdueCount = allTasks.filter(
    (t) => t.due_date && isBefore(new Date(t.due_date), now) && t.status !== "DONE"
  ).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {currentUser?.name?.split(" ")[0] || "Leader"}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Sparkles className="size-3" />
              {currentWorkspace?.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Overview of team velocity, sprint deliverables, and workspace roadmap.
          </p>
        </div>

        <button
          onClick={() => setIsCreateProjectOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs shadow-indigo-500/20 transition shrink-0"
        >
          <Plus className="size-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <MetricGrid
        totalProjects={totalProjects}
        completedProjects={completedProjects}
        myTasksCount={myTasksCount}
        overdueCount={overdueCount}
        workspaceName={currentWorkspace?.name}
      />

      {/* Grid Layout: Left 2 cols, Right 1 col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProjectProgressList
            projects={projects}
            onOpenCreateModal={() => setIsCreateProjectOpen(true)}
          />
          <ActivityTimeline projects={projects} />
        </div>

        <div>
          <TaskRadar projects={projects} currentUser={currentUser} />
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
      />
    </div>
  );
};

