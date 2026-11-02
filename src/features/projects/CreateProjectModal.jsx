import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "@/shared/ui";
import { addProject } from "@/features/workspace/workspaceSlice";
import toast from "react-hot-toast";

export const CreateProjectModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { currentWorkspace, currentUser } = useSelector((state) => state.workspace);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "ACTIVE",
    priority: "MEDIUM",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    team_lead: currentUser?.id || "",
    selectedMemberIds: [currentUser?.id || ""],
    progress: 0,
  });

  const workspaceMembers = currentWorkspace?.members || [];

  const handleMemberToggle = (userId) => {
    setFormData((prev) => {
      const exists = prev.selectedMemberIds.includes(userId);
      return {
        ...prev,
        selectedMemberIds: exists
          ? prev.selectedMemberIds.filter((id) => id !== userId)
          : [...prev.selectedMemberIds, userId],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    const projectId = `proj_${Date.now()}`;
    const projectMembers = formData.selectedMemberIds.map((uid) => {
      const found = workspaceMembers.find((m) => m.userId === uid);
      return {
        id: `pm_${Date.now()}_${uid}`,
        userId: uid,
        user: found?.user || currentUser,
      };
    });

    const newProject = {
      id: projectId,
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
      team_lead: formData.team_lead || currentUser?.id || "user_1",
      workspaceId: currentWorkspace?.id,
      progress: Number(formData.progress) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: projectMembers,
      tasks: [],
    };

    dispatch(addProject(newProject));
    toast.success(`Project "${newProject.name}" created!`);
    onClose();

    setFormData({
      name: "",
      description: "",
      status: "ACTIVE",
      priority: "MEDIUM",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      team_lead: currentUser?.id || "",
      selectedMemberIds: [currentUser?.id || ""],
      progress: 0,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      description={`Add a new initiative to ${currentWorkspace?.name || "your workspace"}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Project Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Design System V2, Mobile iOS Release"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Key goals, deliverables, and architecture considerations..."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="PLANNING">Planning</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Target Deadline
            </label>
            <input
              type="date"
              min={formData.start_date}
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Assign Team Members ({formData.selectedMemberIds.length} selected)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            {workspaceMembers.map((m) => {
              const isChecked = formData.selectedMemberIds.includes(m.userId);
              return (
                <label
                  key={m.userId}
                  className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer text-xs transition ${
                    isChecked
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleMemberToggle(m.userId)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="truncate">{m.user?.name || m.user?.email}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition"
          >
            Create Project
          </button>
        </div>
      </form>
    </Modal>
  );
};

