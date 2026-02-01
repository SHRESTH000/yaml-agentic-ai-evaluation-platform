"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskRow } from "./TaskRow";
import { TaskListItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FileQuestion } from "lucide-react";

interface TaskTableProps {
  tasks: TaskListItem[];
  isLoading?: boolean;
  onSelectTask?: (taskId: string) => void;
  title?: string;
  description?: string;
  showHeader?: boolean;
  className?: string;
}

export function TaskTable({
  tasks,
  isLoading = false,
  onSelectTask,
  title = "Evaluation Tasks",
  description = "All tasks evaluated by the AI system",
  showHeader = true,
  className,
}: TaskTableProps) {
  if (isLoading) {
    return <TaskTableSkeleton showHeader={showHeader} title={title} description={description} />;
  }

  if (tasks.length === 0) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-slate-100 p-4">
              <FileQuestion className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-slate-900">No tasks found</h3>
            <p className="mt-1 text-sm text-slate-500">
              No evaluation tasks have been processed yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      {showHeader && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="text-sm text-slate-500">
              {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className={cn(!showHeader && "pt-6")}>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-semibold">Task ID</TableHead>
                <TableHead className="font-semibold">Domain</TableHead>
                <TableHead className="font-semibold">Score</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TaskRow
                  key={task.task_id}
                  task={task}
                  onSelect={onSelectTask}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

interface TaskTableSkeletonProps {
  showHeader?: boolean;
  title?: string;
  description?: string;
  rows?: number;
}

export function TaskTableSkeleton({
  showHeader = true,
  title = "Evaluation Tasks",
  description = "All tasks evaluated by the AI system",
  rows = 5,
}: TaskTableSkeletonProps) {
  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent className={cn(!showHeader && "pt-6")}>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-semibold">Task ID</TableHead>
                <TableHead className="font-semibold">Domain</TableHead>
                <TableHead className="font-semibold">Score</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rows }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default TaskTable;
