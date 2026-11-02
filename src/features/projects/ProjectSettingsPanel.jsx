import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProject, deleteProject, removeProjectMember } from "@/features/workspace/workspaceSlice";
import { AddProjectMemberModal } from "./AddProjectMemberModal";
import { Avatar } from "@/shared/ui";
import { Save, Trash2, UserPlus, UserX, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export const ProjectSettingsPanel = ({ project }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "ACTIVE",
    priority: project?.priority || "MEDIUM",
    progress: project?.progress || 0,
    start_date: project?.start_date
      ? new Date(project.start_date).toISOString().split("T")[0]
      : "",
    end_date: project?.end_date
      ? new Date(project.end_date).toISOString().split("T")[0]
      : "",
  });

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Project name cannot be empty");
      return;
    }

    dispatch(
      updateProject({
        ...project,
        ...formData,
        progress: Number(formData.progress),
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        updatedAt: new Date().toISOString(),
      })
    );

    toast.success("Project settings updated successfully!");
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete "${project.name}" and all associated tasks?`
      )
    ) {
      dispatch(deleteProject({ projectId: project.id, workspaceId: project.workspaceId }));
      toast.success("Project deleted");
      navigate("/projects");
    }
  };

  const handleRemoveMember = (userId, memberName) => {
    if (window.confirm(`Remove ${memberName || "this member"} from project?`)) {
      dispatch(removeProjectMember({ projectId: project.id, userId }));
      toast.success("Team member removed from project");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Edit Form */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Project Configuration
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Update core metadata, delivery dates, and progression milestones.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Milestone Progress</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {formData.progress}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Target Deadline
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition"
            >
              <Save className="size-4" />
              Save Configuration
            </button>
          </div>
        </form>
      </div>

      {/* Right Column: Team Management & Danger Zone */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Assigned Team ({project.members?.length || 0})
              </h4>
            </div>
            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg hover:bg-indigo-100 transition"
            >
              <UserPlus className="size-3.5" />
              Add
            </button>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto no-scrollbar">
            {project.members?.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                No individual members assigned.
              </p>
            ) : (
              project.members?.map((m) => (
                <div
                  key={m.userId}
                  className="flex items-center justify-between p-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar user={m.user} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {m.user?.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{m.user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(m.userId, m.user?.name)}
                    className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    title="Remove from project"
                  >
                    <UserX className="size-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="size-4.5" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Danger Zone</h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Deleting this project will permanently remove all tasks, sprint records, comments, and
            associated analytics.
          </p>
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs transition"
          >
            <Trash2 className="size-4" />
            Delete Project Permanently
          </button>
        </div>
      </div>

      <AddProjectMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        project={project}
      />
    </div>
  );
};

