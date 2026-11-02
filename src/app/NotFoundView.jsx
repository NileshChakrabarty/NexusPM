import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";

export const NotFoundView = () => {
  return (
    <div className="py-24 text-center space-y-4 max-w-md mx-auto">
      <div className="size-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
        <Compass className="size-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
        404 — Page Not Found
      </h1>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        The route you are navigating to does not exist or has been relocated within the workspace.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition"
      >
        <ArrowLeft className="size-4" />
        Return to Dashboard
      </Link>
    </div>
  );
};

