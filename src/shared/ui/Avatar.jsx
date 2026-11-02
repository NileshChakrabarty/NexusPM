import React, { useState } from "react";

export const Avatar = ({ user, size = "md", className = "" }) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: "size-5 text-[10px]",
    sm: "size-7 text-xs",
    md: "size-8 text-sm",
    lg: "size-10 text-base font-semibold",
    xl: "size-14 text-xl font-bold",
  };

  const name = user?.name || user?.user?.name || "User";
  const avatarUrl = user?.avatar || user?.user?.avatar || user?.image || user?.user?.image;
  const initials =
    user?.initials ||
    user?.user?.initials ||
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  const userColor = user?.color || user?.user?.color || "#6366f1";

  if (avatarUrl && !imageError) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        onError={() => setImageError(true)}
        className={`rounded-full object-cover ring-2 ring-white dark:ring-slate-900 ${sizeClasses[size] || sizeClasses.md} ${className}`}
      />
    );
  }

  return (
    <div
      style={{ backgroundColor: userColor }}
      className={`rounded-full flex items-center justify-center font-medium text-white shadow-xs ring-2 ring-white dark:ring-slate-900 shrink-0 ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
};

export const AvatarGroup = ({ members = [], max = 4, size = "sm" }) => {
  const visible = members.slice(0, max);
  const remaining = members.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((m, idx) => (
        <Avatar key={m.id || m.userId || idx} user={m.user || m} size={size} />
      ))}
      {remaining > 0 && (
        <div className="size-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shrink-0">
          +{remaining}
        </div>
      )}
    </div>
  );
};

