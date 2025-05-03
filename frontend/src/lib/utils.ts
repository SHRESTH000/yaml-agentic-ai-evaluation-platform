import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TaskStatus } from "./types";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Determine task status based on evaluation score and intent match
 */
export function getTaskStatus(score: number, intentMatch: boolean): TaskStatus {
  if (!intentMatch) return "fail";
  if (score >= 0.8) return "pass";
  if (score >= 0.5) return "partial";
  return "fail";
}

/**
 * Format score as percentage
 */
export function formatScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

/**
 * Format score with decimal precision
 */
export function formatScoreDecimal(score: number, decimals: number = 2): string {
  return score.toFixed(decimals);
}

/**
 * Format date string to readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Get status color classes for Tailwind
 */
export function getStatusColorClass(status: TaskStatus): string {
  const colorMap: Record<TaskStatus, string> = {
    pass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    fail: "bg-red-100 text-red-800 border-red-200",
    partial: "bg-amber-100 text-amber-800 border-amber-200",
    pending: "bg-slate-100 text-slate-800 border-slate-200",
  };
  return colorMap[status];
}

/**
 * Get status dot color for indicators
 */
export function getStatusDotColor(status: TaskStatus): string {
  const colorMap: Record<TaskStatus, string> = {
    pass: "bg-emerald-500",
    fail: "bg-red-500",
    partial: "bg-amber-500",
    pending: "bg-slate-400",
  };
  return colorMap[status];
}

/**
 * Get score color based on value
 */
export function getScoreColor(score: number): string {
  if (score >= 0.8) return "text-emerald-600";
  if (score >= 0.5) return "text-amber-600";
  return "text-red-600";
}

/**
 * Get score background color for charts
 */
export function getScoreBackgroundColor(score: number): string {
  if (score >= 0.8) return "#10b981"; // emerald-500
  if (score >= 0.5) return "#f59e0b"; // amber-500
  return "#ef4444"; // red-500
}

/**
 * Parse YAML-style user message (handle multiline)
 */
export function parseUserMessage(message: string): string {
  return message.trim().replace(/\n\s+/g, " ");
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate statistics from task data
 */
export function calculateStats(tasks: { score: number; intent_match: boolean }[]): {
  averageScore: number;
  passRate: number;
  failRate: number;
} {
  if (tasks.length === 0) {
    return { averageScore: 0, passRate: 0, failRate: 0 };
  }

  const totalScore = tasks.reduce((sum, task) => sum + task.score, 0);
  const passCount = tasks.filter((task) => task.intent_match && task.score >= 0.8).length;
  const failCount = tasks.filter((task) => !task.intent_match || task.score < 0.5).length;

  return {
    averageScore: totalScore / tasks.length,
    passRate: (passCount / tasks.length) * 100,
    failRate: (failCount / tasks.length) * 100,
  };
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
