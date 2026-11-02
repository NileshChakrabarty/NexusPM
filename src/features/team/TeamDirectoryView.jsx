import React, { useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import {
  Users2,
  Search,
  UserPlus,
  Shield,
  Activity,
} from "lucide-react";
import { RoleBadge, Avatar } from "@/shared/ui";
import { InviteMemberModal } from "./InviteMemberModal";

export const TeamDirectoryView = () => {
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const members = currentWorkspace?.members || [];
  const projects = currentWorkspace?.projects || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const filteredMembers = members.filter((m) => {
    const term = searchTerm.toLowerCase();
    const name = m.user?.name?.toLowerCase() || "";
    const email = m.user?.email?.toLowerCase() || "";
    return name.includes(term) || email.includes(term);
  });

  const allTasksCount = projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
  const activeProjectsCount = projects.filter(
    (p) => p.status !== "CANCELLED" && p.status !== "COMPLETED"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Team & Access Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage collaborators, roles, and project assignments in {currentWorkspace?.name}
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs shadow-indigo-500/20 transition shrink-0"
        >
          <UserPlus className="size-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Members
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {members.length}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
            <Users2 className="size-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Projects
            </p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {activeProjectsCount}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
            <Activity className="size-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Tasks
            </p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {allTasksCount}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
            <Shield className="size-5" />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter members by name or email..."
          className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Directory Table */}
      <div className="border border-slate-200/90 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#111827] overflow-hidden shadow-xs">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Member</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined Workspace</th>
                <th className="py-3 px-4">Active Projects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No members match your search query.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => {
                  const assignedProjects = projects.filter((p) =>
                    (p.members || []).some((pm) => pm.userId === m.userId)
                  );

                  return (
                    <tr
                      key={m.id || m.userId}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <Avatar user={m.user} size="sm" />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {m.user?.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {m.user?.role || "Engineering"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {m.user?.email}
                      </td>

                      <td className="py-3.5 px-4">
                        <RoleBadge role={m.role} />
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {m.user?.createdAt
                          ? format(new Date(m.user.createdAt), "MMM d, yyyy")
                          : "Active"}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {assignedProjects.length} project
                          {assignedProjects.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredMembers.map((m) => (
            <div key={m.id || m.userId} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar user={m.user} size="md" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {m.user?.name}
                    </h4>
                    <p className="text-xs text-slate-400">{m.user?.email}</p>
                  </div>
                </div>
                <RoleBadge role={m.role} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <InviteMemberModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
};

