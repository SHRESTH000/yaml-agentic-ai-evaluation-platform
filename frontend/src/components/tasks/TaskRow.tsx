"use client";

import React from "react";
import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { TaskListItem } from "@/lib/types";
import { formatScore, cn, getScoreColor } from "@/lib/utils";
import { Eye, ChevronRight } from "lucide-react";

interface TaskRowProps {
  task: TaskListItem;
  onSelect?: (taskId: string) => void;
  className?: string;
}

export function TaskRow({ task, onSelect, className }: TaskRowProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(task.task_id);
    }
  };

  return (
    <TableRow
      className={cn(
        "cursor-pointer transition-colors hover:bg-slate-50",
        className
      )}
      onClick={handleClick}
    >
      <TableCell className="font-mono text-sm font-medium text-slate-900">
        {task.task_id}
      </TableCell>
      <TableCell>
        {task.domain ? (
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
            {task.domain}
          </span>
        ) : (
          <span className="text-sm text-slate-400">—</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100">
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
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              getScoreColor(task.score)
            )}
          >
            {formatScore(task.score)}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={task.status} size="sm" />
      </TableCell>
      <TableCell className="text-right">
        <Link href={`/tasks/${task.task_id}`} onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Eye className="h-4 w-4" />
            View
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}

export default TaskRow;
