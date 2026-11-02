import React, { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  FolderKanban,
  Users2,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Kanban,
  Calendar,
  BarChart2,
  Settings,
  X,
} from "lucide-react";
import { WorkspacePicker } from "./WorkspacePicker";

export const NavigationSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { currentWorkspace, currentUser } = useSelector((state) => state.workspace);

  const [isMyTasksOpen, setIsMyTasksOpen] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState(new Set());

  const myTasks =
    currentWorkspace?.projects?.flatMap((p) =>
      (p.tasks || [])
        .filter((t) => t.assigneeId === currentUser?.id || t.assignee?.id === currentUser?.id)
        .map((t) => ({ ...t, projectName: p.name }))
    ) || [];

  const toggleProject = (projectId) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  };

  const navLinks = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Projects", href: "/projects", icon: FolderKanban },
    { label: "Team & Access", href: "/team", icon: Users2 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-[#0f1422] border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header / Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white">
            <img src="/logo.svg" alt="Nexus Logo" className="size-8" />
            <div className="flex flex-col">
              <span className="text-base tracking-tight leading-tight">Nexus PM</span>
              <span className="text-[10px] text-slate-400 font-normal leading-none">
                Workspace Hub
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Workspace Selector */}
        <WorkspacePicker />

        {/* Nav Links & Accordions */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 no-scrollbar">
          {/* Main Links */}
          <div className="space-y-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xs shadow-indigo-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                  }`
                }
              >
                <item.icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* My Tasks Section */}
          <div className="space-y-1.5">
            <button
              onClick={() => setIsMyTasksOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300 transition"
            >
              <span className="flex items-center gap-2">
                <CheckSquare className="size-3.5 text-indigo-500" />
                My Tasks
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {myTasks.length}
                </span>
                {isMyTasksOpen ? (
                  <ChevronDown className="size-3.5" />
                ) : (
                  <ChevronRight className="size-3.5" />
                )}
              </div>
            </button>

            {isMyTasksOpen && (
              <div className="space-y-1 pl-2">
                {myTasks.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500 italic">
                    No active tasks assigned
                  </p>
                ) : (
                  myTasks.slice(0, 5).map((t) => (
                    <Link
                      key={t.id}
                      to={`/taskDetails?projectId=${t.projectId}&taskId=${t.id}`}
                      onClick={() => window.innerWidth < 1024 && onClose()}
                      className="group flex items-start gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition"
                    >
                      <span
                        className={`size-2 rounded-full mt-1.5 shrink-0 ${
                          t.status === "DONE"
                            ? "bg-emerald-500"
                            : t.status === "IN_PROGRESS"
                            ? "bg-indigo-500"
                            : "bg-slate-400"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {t.title}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                          {t.projectName}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Active Projects Tree Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-3 py-1.5">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Projects ({currentWorkspace?.projects?.length || 0})
              </span>
              <Link
                to="/projects"
                onClick={() => window.innerWidth < 1024 && onClose()}
                className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-1 pl-1">
              {currentWorkspace?.projects?.map((proj) => {
                const isExpanded = expandedProjects.has(proj.id);
                const subTabs = [
                  { key: "tasks", label: "Tasks", icon: Kanban },
                  { key: "calendar", label: "Calendar", icon: Calendar },
                  { key: "analytics", label: "Analytics", icon: BarChart2 },
                  { key: "settings", label: "Settings", icon: Settings },
                ];

                return (
                  <div key={proj.id} className="space-y-1">
                    <button
                      onClick={() => toggleProject(proj.id)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="size-2 rounded-full bg-indigo-500 shrink-0" />
                        <span className="truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {proj.name}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronRight className="size-3.5 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="pl-6 space-y-0.5 border-l border-slate-200 dark:border-slate-800 ml-3">
                        {subTabs.map((sub) => {
                          const isActive =
                            location.pathname === "/projectsDetail" &&
                            new URLSearchParams(location.search).get("id") === proj.id &&
                            (new URLSearchParams(location.search).get("tab") === sub.key ||
                              (!new URLSearchParams(location.search).get("tab") &&
                                sub.key === "tasks"));

                          return (
                            <Link
                              key={sub.key}
                              to={`/projectsDetail?id=${proj.id}&tab=${sub.key}`}
                              onClick={() => window.innerWidth < 1024 && onClose()}
                              className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                                isActive
                                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold"
                                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                              }`}
                            >
                              <sub.icon className="size-3 shrink-0" />
                              <span>{sub.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info box */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131b2e] border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Workspace Health</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">98% Opt</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "98%" }} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

