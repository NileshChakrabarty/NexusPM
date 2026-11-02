import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  format,
  isSameDay,
  isBefore,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { PriorityBadge, TypeBadge, StatusBadge, Avatar } from "@/shared/ui";

export const DeliveryCalendarView = ({ tasks = [] }) => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getTasksForDate = (date) =>
    tasks.filter((t) => t.due_date && isSameDay(new Date(t.due_date), date));

  const selectedDateTasks = getTasksForDate(selectedDate);

  const now = new Date();
  const overdueTasks = tasks.filter(
    (t) => t.due_date && isBefore(new Date(t.due_date), now) && t.status !== "DONE"
  );

  const upcomingTasks = tasks
    .filter(
      (t) => t.due_date && !isBefore(new Date(t.due_date), now) && t.status !== "DONE"
    )
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid Card */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <CalendarIcon className="size-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <p className="text-xs text-slate-400">Select a date to inspect scheduled deliverables</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => {
                setCurrentMonth(new Date());
                setSelectedDate(new Date());
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              aria-label="Next month"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Matrix */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
            <div key={`blank-${i}`} className="h-16 rounded-xl bg-slate-50/40 dark:bg-slate-900/20 opacity-30" />
          ))}

          {days.map((day) => {
            const dayTasks = getTasksForDate(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrDay = isToday(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`h-16 p-1.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20"
                    : isCurrDay
                    ? "border-indigo-300 dark:border-indigo-700 bg-slate-50/80 dark:bg-slate-900/60"
                    : "border-slate-200/60 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#111827]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      isCurrDay
                        ? "text-indigo-600 dark:text-indigo-400 font-bold"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="size-4 rounded-full bg-indigo-500 text-white font-bold text-[9px] flex items-center justify-center">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5 overflow-hidden">
                  {dayTasks.slice(0, 1).map((t) => (
                    <div
                      key={t.id}
                      className="text-[9px] truncate px-1 py-0.5 rounded bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium"
                    >
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > 1 && (
                    <p className="text-[9px] text-slate-400 font-medium">
                      +{dayTasks.length - 1} more
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Agenda Details Panel */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {format(selectedDate, "MMMM d, yyyy")}
            </h4>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {selectedDateTasks.length} tasks
            </span>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto no-scrollbar">
            {selectedDateTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No tasks scheduled for this day.
              </p>
            ) : (
              selectedDateTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() =>
                    navigate(`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`)
                  }
                  className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer transition space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <TypeBadge type={task.type} />
                    <StatusBadge status={task.status} />
                  </div>
                  <h5 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {task.title}
                  </h5>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                    <div className="flex items-center gap-1.5">
                      <Avatar user={task.assignee} size="xs" />
                      <span>{task.assignee?.name || "Unassigned"}</span>
                    </div>
                    <PriorityBadge priority={task.priority} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Overdue Section */}
        {overdueTasks.length > 0 && (
          <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 p-4">
            <div className="flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="size-4 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Overdue Tasks ({overdueTasks.length})
              </h4>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
              {overdueTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() =>
                    navigate(`/taskDetails?projectId=${t.projectId}&taskId=${t.id}`)
                  }
                  className="text-xs flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#111827] border border-rose-200/60 dark:border-rose-900/40 hover:border-rose-400 cursor-pointer transition"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">
                    {t.title}
                  </span>
                  <span className="text-[10px] text-rose-600 font-semibold shrink-0">
                    {format(new Date(t.due_date), "MMM d")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Section */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3 text-slate-800 dark:text-slate-200">
            <Clock className="size-4 text-indigo-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Upcoming Deadlines
            </h4>
          </div>

          <div className="space-y-2">
            {upcomingTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-2 text-center">No upcoming tasks.</p>
            ) : (
              upcomingTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() =>
                    navigate(`/taskDetails?projectId=${t.projectId}&taskId=${t.id}`)
                  }
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition text-xs"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {t.title}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Due {format(new Date(t.due_date), "MMM d, yyyy")}
                    </p>
                  </div>
                  <ArrowRight className="size-3.5 text-slate-400" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

