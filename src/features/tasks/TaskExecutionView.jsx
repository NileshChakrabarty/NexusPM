import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  Search,
  RotateCcw,
  Trash2,
  Plus,
  LayoutGrid,
  List,
} from "lucide-react";
import { updateTask, deleteTasks } from "@/features/workspace/workspaceSlice";
import { TaskTableView } from "./TaskTableView";
import { TaskKanbanBoard } from "./TaskKanbanBoard";
import { CreateTaskModal } from "./CreateTaskModal";
import toast from "react-hot-toast";

export const TaskExecutionView = ({ project }) => {
  const dispatch = useDispatch();
  const tasks = project?.tasks || [];

  const [viewMode, setViewMode] = useState("table"); // 'table' | 'kanban'
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedPriority, setSelectedPriority] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedAssignee, setSelectedAssignee] = useState("ALL");
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const assignees = useMemo(() => {
    const names = new Set();
    tasks.forEach((t) => {
      if (t.assignee?.name) names.add(t.assignee.name);
    });
    return Array.from(names);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        search === "" ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = selectedStatus === "ALL" || t.status === selectedStatus;
      const matchesPriority = selectedPriority === "ALL" || t.priority === selectedPriority;
      const matchesType = selectedType === "ALL" || t.type === selectedType;
      const matchesAssignee =
        selectedAssignee === "ALL" || t.assignee?.name === selectedAssignee;

      return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesAssignee;
    });
  }, [tasks, search, selectedStatus, selectedPriority, selectedType, selectedAssignee]);

  const handleStatusChange = (taskId, newStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    dispatch(
      updateTask({
        ...task,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      })
    );
    toast.success(`Task moved to ${newStatus.replace("_", " ")}`);
  };

  const handleToggleSelectAll = () => {
    if (selectedTaskIds.length === filteredTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map((t) => t.id));
    }
  };

  const handleToggleSelectTask = (id) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedTaskIds.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedTaskIds.length} selected task(s)?`
      )
    ) {
      dispatch(
        deleteTasks({
          projectId: project.id,
          taskIds: selectedTaskIds,
        })
      );
      setSelectedTaskIds([]);
      toast.success("Tasks deleted successfully");
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedStatus("ALL");
    setSelectedPriority("ALL");
    setSelectedType("ALL");
    setSelectedAssignee("ALL");
  };

  const hasActiveFilters =
    search !== "" ||
    selectedStatus !== "ALL" ||
    selectedPriority !== "ALL" ||
    selectedType !== "ALL" ||
    selectedAssignee !== "ALL";

  return (
    <div className="space-y-4">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col xl:flex-row gap-3 xl:items-center justify-between">
        {/* Left: Search & Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Types</option>
            <option value="FEATURE">Feature</option>
            <option value="BUG">Bug</option>
            <option value="TASK">Task</option>
            <option value="IMPROVEMENT">Improvement</option>
            <option value="OTHER">Other</option>
          </select>

          {assignees.length > 0 && (
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Assignees</option>
              {assignees.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition"
            >
              <RotateCcw className="size-3" />
              Reset
            </button>
          )}

          {selectedTaskIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition"
            >
              <Trash2 className="size-3" />
              Delete ({selectedTaskIds.length})
            </button>
          )}
        </div>

        {/* Right: View Mode Toggle & New Task Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                viewMode === "table"
                  ? "bg-white dark:bg-[#111827] text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <List className="size-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                viewMode === "kanban"
                  ? "bg-white dark:bg-[#111827] text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <LayoutGrid className="size-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="size-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Main View: Table or Kanban */}
      {viewMode === "table" ? (
        <TaskTableView
          tasks={filteredTasks}
          selectedTaskIds={selectedTaskIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectTask={handleToggleSelectTask}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <TaskKanbanBoard
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={project?.id}
      />
    </div>
  );
};

