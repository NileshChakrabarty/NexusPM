import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { NavigationSidebar } from "./NavigationSidebar";
import { Header } from "./Header";

export const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 flex transition-colors">
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "!bg-white dark:!bg-[#111827] !text-slate-900 dark:!text-white !border !border-slate-200 dark:!border-slate-800 !shadow-xl !rounded-xl !text-xs !font-medium",
        }}
      />

      {/* Main Navigation Sidebar */}
      <NavigationSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

