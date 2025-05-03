"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TaskTable } from "@/components/tasks/TaskTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchTaskList } from "@/lib/api";
import { TaskListItem, TaskStatus } from "@/lib/types";
import { cn, getTaskStatus } from "@/lib/utils";
import {
  Filter,
  Search,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LayoutGrid,
  List,
} from "lucide-react";

type FilterStatus = TaskStatus | "all";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  useEffect(() => {
    async function loadTasks() {
      try {
        setIsLoading(true);
        const data = await fetchTaskList();
        setTasks(data);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        task.task_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.domain?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  const statusCounts = useMemo(() => {
    return {
      all: tasks.length,
      pass: tasks.filter((t) => t.status === "pass").length,
      partial: tasks.filter((t) => t.status === "partial").length,
      fail: tasks.filter((t) => t.status === "fail").length,
      pending: tasks.filter((t) => t.status === "pending").length,
    };
  }, [tasks]);

  const handleSelectTask = (taskId: string) => {
    router.push(`/tasks/${taskId}`);
  };

  const filterButtons: { status: FilterStatus; label: string; icon: React.ElementType; color: string }[] = [
    { status: "all", label: "All", icon: BarChart3, color: "bg-slate-100 text-slate-700" },
    { status: "pass", label: "Pass", icon: CheckCircle2, color: "bg-emerald-100 text-emerald-700" },
    { status: "partial", label: "Partial", icon: AlertCircle, color: "bg-amber-100 text-amber-700" },
    { status: "fail", label: "Fail", icon: XCircle, color: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters & Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Task ID or Domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <div className="flex gap-1">
                {filterButtons.map((btn) => {
                  const Icon = btn.icon;
                  const isActive = statusFilter === btn.status;
                  const count = statusCounts[btn.status];

                  return (
                    <Button
                      key={btn.status}
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setStatusFilter(btn.status)}
                      className={cn(
                        "gap-1.5 transition-all",
                        isActive && btn.color
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {btn.label}
                      <Badge
                        variant={isActive ? "default" : "secondary"}
                        className={cn(
                          "ml-1 text-xs",
                          isActive ? "bg-white/20" : ""
                        )}
                      >
                        {count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{filteredTasks.length}</span> of{" "}
          <span className="font-medium text-slate-700">{tasks.length}</span> tasks
        </p>
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery("")}
            className="text-slate-500"
          >
            Clear search
          </Button>
        )}
      </div>

      {/* Task Display */}
      {viewMode === "table" ? (
        <TaskTable
          tasks={filteredTasks}
          isLoading={isLoading}
          onSelectTask={handleSelectTask}
          title="All Evaluation Tasks"
          description={`${filteredTasks.length} tasks matching current filters`}
        />
      ) : (
        <TaskGrid tasks={filteredTasks} isLoading={isLoading} />
      )}
    </div>
  );
}

interface TaskGridProps {
  tasks: TaskListItem[];
  isLoading: boolean;
}

function TaskGrid({ tasks, isLoading }: TaskGridProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="h-5 w-24 rounded bg-slate-200" />
                <div className="h-4 w-16 rounded bg-slate-200" />
                <div className="h-8 w-full rounded bg-slate-200" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-medium text-slate-900">No tasks found</h3>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your filters or search query.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tasks.map((task) => (
        <Card
          key={task.task_id}
          className="cursor-pointer transition-all hover:border-slate-300 hover:shadow-md"
          onClick={() => router.push(`/tasks/${task.task_id}`)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-sm font-semibold text-slate-900">
                  {task.task_id}
                </p>
                {task.domain && (
                  <p className="mt-1 text-xs text-slate-500">{task.domain}</p>
                )}
              </div>
              <Badge
                variant={
                  task.status === "pass"
                    ? "success"
                    : task.status === "fail"
                    ? "error"
                    : "warning"
                }
              >
                {task.status}
              </Badge>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Score</span>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    task.score >= 0.8
                      ? "text-emerald-600"
                      : task.score >= 0.5
                      ? "text-amber-600"
                      : "text-red-600"
                  )}
                >
                  {Math.round(task.score * 100)}%
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    task.score >= 0.8
                      ? "bg-emerald-500"
                      : task.score >= 0.5
                      ? "bg-amber-500"
                      : "bg-red-500"
                  )}
                  style={{ width: `${Math.round(task.score * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
