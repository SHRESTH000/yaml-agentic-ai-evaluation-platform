"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { TaskStatus } from "@/lib/types";
import { cn, getStatusDotColor } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: TaskStatus;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusConfig: Record<
  TaskStatus,
  {
    label: string;
    variant: "success" | "error" | "warning" | "secondary";
    icon: typeof CheckCircle2;
  }
> = {
  pass: {
    label: "Pass",
    variant: "success",
    icon: CheckCircle2,
  },
  fail: {
    label: "Fail",
    variant: "error",
    icon: XCircle,
  },
  partial: {
    label: "Partial",
    variant: "warning",
    icon: AlertCircle,
  },
  pending: {
    label: "Pending",
    variant: "secondary",
    icon: Clock,
  },
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-0.5",
  lg: "text-sm px-3 py-1",
};

export function StatusBadge({
  status,
  showIcon = true,
  size = "md",
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "inline-flex items-center gap-1.5 font-medium",
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {config.label}
    </Badge>
  );
}

interface StatusDotProps {
  status: TaskStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
  pulse?: boolean;
}

const dotSizes = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

export function StatusDot({
  status,
  size = "md",
  className,
  pulse = false,
}: StatusDotProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full",
        dotSizes[size],
        getStatusDotColor(status),
        pulse && "animate-pulse",
        className
      )}
    />
  );
}

interface IntentMatchIndicatorProps {
  match: boolean;
  className?: string;
}

export function IntentMatchIndicator({
  match,
  className,
}: IntentMatchIndicatorProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium",
        match ? "text-emerald-600" : "text-red-600",
        className
      )}
    >
      {match ? (
        <>
          <CheckCircle2 className="h-4 w-4" />
          <span>Match</span>
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4" />
          <span>No Match</span>
        </>
      )}
    </div>
  );
}

export default StatusBadge;
