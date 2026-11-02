import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  Search,
  Sun,
  Moon,
  RotateCcw,
  Bell,
  Command,
} from "lucide-react";
import { toggleTheme } from "@/features/theme/themeSlice";
import { setSearchQuery, resetToDefaultData } from "@/features/workspace/workspaceSlice";
import { Avatar } from "@/shared/ui";
import toast from "react-hot-toast";

export const Header = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { searchQuery, currentUser } = useSelector((state) => state.workspace);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleResetData = () => {
    if (window.confirm("Reset all workspaces, projects, and tasks to default demo data?")) {
      dispatch(resetToDefaultData());
      toast.success("Workspace state restored to initial sample data");
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Open sidebar"
        >
          <Menu className="size-5" />
        </button>

        {/* Search input with keyboard hint */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search projects, tasks, or team..."
            className="w-full pl-9 pr-12 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111827] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-200/60 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700/60">
            <Command className="size-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reset Demo Data Button */}
        <button
          onClick={handleResetData}
          title="Reset workspace demo data"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs flex items-center gap-1.5 font-medium"
        >
          <RotateCcw className="size-4" />
          <span className="hidden md:inline">Reset Demo</span>
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Notifications"
          >
            <Bell className="size-4.5" />
            <span className="absolute top-1.5 right-1.5 size-2 bg-indigo-500 rounded-full ring-2 ring-white dark:ring-[#0b0f19]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  Notifications
                </h4>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                  2 unread
                </span>
              </div>
              <div className="space-y-3 py-2 text-xs">
                <div className="flex gap-2.5 items-start">
                  <div className="size-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      Vector Indexing completed
                    </p>
                    <p className="text-slate-400 text-[11px]">Sentinel AI Copilot • 15m ago</p>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <div className="size-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      Marcus assigned you a task
                    </p>
                    <p className="text-slate-400 text-[11px]">Nebula Architecture • 2h ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle theme"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun className="size-4.5 text-amber-400" />
          ) : (
            <Moon className="size-4.5 text-slate-700" />
          )}
        </button>

        {/* User Profile Info */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <Avatar user={currentUser} size="sm" />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
              {currentUser?.name || "Elena Rostova"}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              {currentUser?.role || "Product Lead"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

