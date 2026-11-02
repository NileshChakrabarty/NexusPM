import React from "react";
import { AppLayout } from "@/layout";
import { DashboardView } from "@/features/dashboard";
import { ProjectsPortfolioView, ProjectWorkspaceView } from "@/features/projects";
import { TaskInspectorView } from "@/features/tasks";
import { TeamDirectoryView } from "@/features/team";
import { NotFoundView } from "./NotFoundView";

export const routes = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardView /> },
      { path: "projects", element: <ProjectsPortfolioView /> },
      { path: "projectsDetail", element: <ProjectWorkspaceView /> },
      { path: "taskDetails", element: <TaskInspectorView /> },
      { path: "team", element: <TeamDirectoryView /> },
      { path: "*", element: <NotFoundView /> },
    ],
  },
];

