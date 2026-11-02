import React, { useState } from "react";
import { format } from "date-fns";
import { MessageSquare, Send } from "lucide-react";
import { Avatar } from "@/shared/ui";
import toast from "react-hot-toast";

export const TaskDiscussionThread = ({ comments = [], currentUser, onAddComment }) => {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    onAddComment(commentText.trim());
    setCommentText("");
    setIsSubmitting(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 sm:p-6 shadow-xs flex flex-col min-h-[500px]">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4.5 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Engineering Discussion & Notes
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {comments.length} comment{comments.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Comments List */}
      <div className="flex-1 space-y-4 overflow-y-auto mb-6 pr-1 no-scrollbar">
        {comments.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No comments yet on this deliverable. Start the conversation!
          </div>
        ) : (
          comments.map((c) => {
            const isMine = c.userId === currentUser?.id || c.user?.id === currentUser?.id;
            const commentDate = c.createdAt
              ? format(new Date(c.createdAt), "MMM d, yyyy • h:mm a")
              : "";

            return (
              <div
                key={c.id}
                className={`flex gap-3 p-3.5 rounded-2xl border transition ${
                  isMine
                    ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40"
                    : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800"
                }`}
              >
                <Avatar user={c.user} size="sm" className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {c.user?.name || "Collaborator"}
                    </p>
                    <span className="text-[10px] text-slate-400">{commentDate}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {c.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="relative">
          <textarea
            rows={3}
            required
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share updates, links, reproduction steps, or ask questions..."
            className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
          />
        </div>

        <div className="flex justify-between items-center pt-1">
          <span className="text-[11px] text-slate-400">Markdown formatting supported</span>
          <button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs disabled:opacity-50 transition"
          >
            <Send className="size-3.5" />
            <span>Post Note</span>
          </button>
        </div>
      </form>
    </div>
  );
};

