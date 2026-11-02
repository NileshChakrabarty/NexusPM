import React from "react";
import {
  CheckCircle2,
  Clock,
  CircleDot,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Bug,
  Sparkles,
  SquareCheck,
  GitBranch,
  Layers,
  ShieldCheck,
  User,
} from "lucide-react";

export const StatusBadge = ({ status }) => {
  switch (status) {
    case "DONE":
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="size-3" />
          {status === "DONE" ? "Done" : "Completed"}
        </span>
      );
    case "IN_PROGRESS":
    case "ACTIVE":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <Clock className="size-3" />
          {status === "IN_PROGRESS" ? "In Progress" : "Active"}
        </span>
      );
    case "PLANNING":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          <CircleDot className="size-3" />
          Planning
        </span>
      );
    case "ON_HOLD":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <AlertTriangle className="size-3" />
          On Hold
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <ShieldAlert className="size-3" />
          Cancelled
        </span>
      );
    case "TODO":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
          <CircleDot className="size-3" />
          To Do
        </span>
      );
  }
};

export const PriorityBadge = ({ priority }) => {
  switch (priority) {
    case "HIGH":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <Flame className="size-3 text-rose-500" />
          High
        </span>
      );
    case "MEDIUM":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <AlertTriangle className="size-3 text-amber-500" />
          Medium
        </span>
      );
    case "LOW":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
          Low
        </span>
      );
  }
};

export const TypeBadge = ({ type }) => {
  switch (type) {
    case "BUG":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <Bug className="size-3 text-rose-500" />
          Bug
        </span>
      );
    case "FEATURE":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <Sparkles className="size-3 text-indigo-500" />
          Feature
        </span>
      );
    case "IMPROVEMENT":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          <GitBranch className="size-3 text-purple-500" />
          Improvement
        </span>
      );
    case "OTHER":
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          <Layers className="size-3 text-sky-500" />
          Other
        </span>
      );
    case "TASK":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <SquareCheck className="size-3 text-emerald-500" />
          Task
        </span>
      );
  }
};

export const RoleBadge = ({ role }) => {
  const isAdmin = role === "ADMIN" || role === "Admin" || role === "OWNER";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isAdmin
          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
          : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20"
      }`}
    >
      {isAdmin ? <ShieldCheck className="size-3" /> : <User className="size-3" />}
      {isAdmin ? "Admin" : "Member"}
    </span>
  );
};

