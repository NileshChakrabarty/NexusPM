import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "@/shared/ui";
import { inviteMember } from "@/features/workspace/workspaceSlice";
import { Mail, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export const InviteMemberModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { currentWorkspace } = useSelector((state) => state.workspace);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    dispatch(
      inviteMember({
        email: email.trim().toLowerCase(),
        role,
      })
    );

    toast.success(`Invitation sent to ${email}!`);
    setEmail("");
    setRole("MEMBER");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Team Member"
      description={`Add a new collaborator to ${currentWorkspace?.name || "your workspace"}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Workspace Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                role === "MEMBER"
                  ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="MEMBER"
                checked={role === "MEMBER"}
                onChange={() => setRole("MEMBER")}
                className="mt-0.5 text-indigo-600"
              />
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Member</p>
                <p className="text-[10px] text-slate-400">Can view & edit assigned tasks</p>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                role === "ADMIN"
                  ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="ADMIN"
                checked={role === "ADMIN"}
                onChange={() => setRole("ADMIN")}
                className="mt-0.5 text-indigo-600"
              />
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Admin</p>
                <p className="text-[10px] text-slate-400">Full workspace & project controls</p>
              </div>
            </label>
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
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition"
          >
            <UserPlus className="size-3.5" />
            Send Invitation
          </button>
        </div>
      </form>
    </Modal>
  );
};

