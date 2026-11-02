import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "@/shared/ui";
import { addProjectMember } from "@/features/workspace/workspaceSlice";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export const AddProjectMemberModal = ({ isOpen, onClose, project }) => {
  const dispatch = useDispatch();
  const { currentWorkspace } = useSelector((state) => state.workspace);

  const existingUserIds = (project?.members || []).map((m) => m.userId || m.user?.id);
  const eligibleMembers = (currentWorkspace?.members || []).filter(
    (m) => !existingUserIds.includes(m.userId)
  );

  const [selectedUserId, setSelectedUserId] = useState(eligibleMembers[0]?.userId || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error("Please select a team member");
      return;
    }

    const memberRecord = eligibleMembers.find((m) => m.userId === selectedUserId);
    if (!memberRecord) return;

    const newProjectMember = {
      id: `pm_${Date.now()}`,
      userId: selectedUserId,
      user: memberRecord.user,
    };

    dispatch(
      addProjectMember({
        projectId: project.id,
        member: newProjectMember,
      })
    );

    toast.success(`Added ${memberRecord.user?.name || "member"} to project!`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Member to Project"
      description={`Assign team members from "${currentWorkspace?.name}" to "${project?.name}"`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {eligibleMembers.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            All team members from this workspace are already assigned to this project.
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Select Team Member
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {eligibleMembers.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.user?.name} — {m.user?.email} ({m.role || "Member"})
                </option>
              ))}
            </select>
          </div>
        )}

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
            disabled={eligibleMembers.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition"
          >
            <UserPlus className="size-3.5" />
            Add to Project
          </button>
        </div>
      </form>
    </Modal>
  );
};

