import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Check,
  Plus,
  Layers,
  Server,
  Briefcase,
} from "lucide-react";
import { setCurrentWorkspace, addWorkspace } from "@/features/workspace/workspaceSlice";
import { Modal } from "@/shared/ui";
import toast from "react-hot-toast";

const workspaceIcons = {
  Layers: Layers,
  Server: Server,
  Briefcase: Briefcase,
};

export const WorkspacePicker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { workspaces, currentWorkspace, currentUser } = useSelector((state) => state.workspace);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newWsName, setNewWsName] = useState("");
  const [newWsDescription, setNewWsDescription] = useState("");
  const [newWsColor, setNewWsColor] = useState("#6366f1");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (workspaceId) => {
    dispatch(setCurrentWorkspace(workspaceId));
    setIsOpen(false);
    navigate("/");
    toast.success("Workspace switched");
  };

  const handleCreateWorkspace = (e) => {
    e.preventDefault();
    if (!newWsName.trim()) return;

    const slug = newWsName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newWs = {
      id: `ws_${Date.now()}`,
      name: newWsName.trim(),
      slug,
      description: newWsDescription.trim() || "Workspace for team projects and collaboration.",
      icon: "Layers",
      color: newWsColor,
      ownerId: currentUser?.id || "user_1",
      createdAt: new Date().toISOString(),
      members: [
        {
          id: `wm_${Date.now()}`,
          userId: currentUser?.id || "user_1",
          role: "ADMIN",
          user: currentUser,
        },
      ],
      projects: [],
    };

    dispatch(addWorkspace(newWs));
    setNewWsName("");
    setNewWsDescription("");
    setIsCreateModalOpen(false);
    setIsOpen(false);
    navigate("/");
    toast.success(`Created "${newWs.name}" workspace!`);
  };

  const IconComponent =
    currentWorkspace?.icon && workspaceIcons[currentWorkspace.icon]
      ? workspaceIcons[currentWorkspace.icon]
      : Layers;

  return (
    <div className="relative p-3" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-slate-300 dark:hover:border-slate-700 transition shadow-xs group text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            style={{ backgroundColor: currentWorkspace?.color || "#4f46e5" }}
            className="size-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
          >
            <IconComponent className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {currentWorkspace?.name || "Select Workspace"}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {currentWorkspace?.members?.length || 0} team member
              {(currentWorkspace?.members?.length || 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`size-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-3 right-3 mt-1.5 z-50 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800/80">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1">
              Workspaces ({workspaces.length})
            </p>
            <div className="space-y-1 mt-1">
              {workspaces.map((ws) => {
                const ItemIcon =
                  ws.icon && workspaceIcons[ws.icon] ? workspaceIcons[ws.icon] : Layers;
                const isSelected = currentWorkspace?.id === ws.id;

                return (
                  <button
                    key={ws.id}
                    onClick={() => handleSelect(ws.id)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                      isSelected
                        ? "bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div
                      style={{ backgroundColor: ws.color || "#6366f1" }}
                      className="size-7 rounded-md flex items-center justify-center text-white shrink-0"
                    >
                      <ItemIcon className="size-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{ws.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {ws.projects?.length || 0} project
                        {(ws.projects?.length || 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {isSelected && <Check className="size-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-1.5 bg-slate-50/60 dark:bg-slate-900/40">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsCreateModalOpen(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
            >
              <Plus className="size-4" /> Create Workspace
            </button>
          </div>
        </div>
      )}

      {/* Create Workspace Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Workspace"
        description="Workspaces group projects, tasks, and teams under a shared workspace environment."
      >
        <form onSubmit={handleCreateWorkspace} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Workspace Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newWsName}
              onChange={(e) => setNewWsName(e.target.value)}
              placeholder="e.g. Design Systems, Mobile Apps"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={newWsDescription}
              onChange={(e) => setNewWsDescription(e.target.value)}
              placeholder="What does this workspace focus on?"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Theme Accent
            </label>
            <div className="flex items-center gap-3">
              {["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"].map(
                (color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewWsColor(color)}
                    style={{ backgroundColor: color }}
                    className={`size-7 rounded-full flex items-center justify-center transition-transform ${
                      newWsColor === color ? "ring-2 ring-offset-2 ring-indigo-500 scale-110" : "hover:scale-105"
                    }`}
                  >
                    {newWsColor === color && <Check className="size-3.5 text-white" />}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

