import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "@/shared/ui";
import { addTask } from "@/features/workspace/workspaceSlice";
import toast from "react-hot-toast";

export const CreateTaskModal = ({ isOpen, onClose, projectId }) => {
  const dispatch = useDispatch();
  const { currentWorkspace, currentUser } = useSelector((state) => state.workspace);

  const project = currentWorkspace?.projects?.find((p) => p.id === projectId);
  const eligibleAssignees =
    project?.members?.length > 0
      ? project.members.map((m) => m.user)
      : currentWorkspace?.members?.map((m) => m.user) || [];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "TODO",
    assigneeId: eligibleAssignees[0]?.id || currentUser?.id || "",
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    const assignedUser = eligibleAssignees.find((u) => u.id === formData.assigneeId) || currentUser;

    const newTask = {
      id: `task_${Date.now()}`,
      projectId: projectId || project?.id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      priority: formData.priority,
      status: formData.status,
      assigneeId: formData.assigneeId,
      assignee: assignedUser,
      due_date: new Date(formData.due_date).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };

    dispatch(addTask(newTask));
    toast.success("Task created successfully!");
    onClose();

    setFormData({
      title: "",
      description: "",
      type: "FEATURE",
      priority: "MEDIUM",
      status: "TODO",
      assigneeId: eligibleAssignees[0]?.id || currentUser?.id || "",
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      description={`Add task to "${project?.name || "Project"}"`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Task Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Implement OAuth 2.0 PKCE flow"
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
            placeholder="Technical details, acceptance criteria, reproduction steps..."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Task Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="FEATURE">Feature</option>
              <option value="BUG">Bug</option>
              <option value="TASK">Task</option>
              <option value="IMPROVEMENT">Improvement</option>
              <option value="OTHER">Other</option>
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
              Initial Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Assignee
            </label>
            <select
              value={formData.assigneeId}
              onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="">Unassigned</option>
              {eligibleAssignees.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role || user.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Due Date
          </label>
          <input
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
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
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  );
};

