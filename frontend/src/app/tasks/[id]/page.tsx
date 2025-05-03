"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { YamlViewer } from "@/components/detail/YamlViewer";
import { ResponsePanel } from "@/components/detail/ResponsePanel";
import { EvaluationPanel } from "@/components/detail/EvaluationPanel";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { fetchTaskById } from "@/lib/api";
import { Task } from "@/lib/types";
import { getTaskStatus, formatScore, cn } from "@/lib/utils";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Target,
  FileText,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadTask() {
      if (!taskId) return;

      try {
        setIsLoading(true);
        const data = await fetchTaskById(taskId);
        setTask(data);
      } catch (error) {
        console.error("Failed to load task:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTask();
  }, [taskId]);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(taskId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Generate YAML representation of task config
  const generateTaskYaml = (task: Task): string => {
    return `task:
  id: ${task.task_id}
  user_message: >
    ${task.user_message.trim().replace(/\n/g, "\n    ")}
  expected_intent:
    primary: ${task.expected_intent.primary}${
      task.expected_intent.secondary && task.expected_intent.secondary.length > 0
        ? `\n    secondary:\n${task.expected_intent.secondary.map((s) => `      - ${s}`).join("\n")}`
        : ""
    }
  constraints:
${task.constraints.map((c) => `    - ${c}`).join("\n")}${
      task.domain ? `\n  domain: ${task.domain}` : ""
    }`;
  };

  if (isLoading) {
    return <TaskDetailSkeleton />;
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-slate-100 p-4">
          <FileText className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-slate-900">Task Not Found</h2>
        <p className="mt-2 text-slate-500">
          The task with ID &quot;{taskId}&quot; could not be found.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => router.push("/tasks")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Button>
      </div>
    );
  }

  const status = task.evaluation
    ? getTaskStatus(task.evaluation.score, task.evaluation.intent_match)
    : "pending";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb & Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-slate-500">
            <Link href="/tasks" className="hover:text-slate-700 transition-colors">
              Tasks
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-slate-700">{task.task_id}</span>
          </nav>

          {/* Title */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{task.task_id}</h1>
            <StatusBadge status={status} size="lg" />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-slate-500"
              onClick={handleCopyId}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy ID
                </>
              )}
            </Button>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-slate-500">
            {task.domain && (
              <div className="flex items-center gap-1.5">
                <Target className="h-4 w-4" />
                <span>Domain: {task.domain}</span>
              </div>
            )}
            {task.created_at && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/tasks")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-slate-500">Score</p>
            <p
              className={cn(
                "text-2xl font-bold tabular-nums",
                task.evaluation
                  ? task.evaluation.score >= 0.8
                    ? "text-emerald-600"
                    : task.evaluation.score >= 0.5
                    ? "text-amber-600"
                    : "text-red-600"
                  : "text-slate-400"
              )}
            >
              {task.evaluation ? formatScore(task.evaluation.score) : "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-slate-500">Intent Match</p>
            <p
              className={cn(
                "text-2xl font-bold",
                task.evaluation?.intent_match ? "text-emerald-600" : "text-red-600"
              )}
            >
              {task.evaluation?.intent_match ? "Yes" : "No"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-slate-500">Primary Intent</p>
            <p className="text-lg font-semibold text-slate-900 font-mono truncate">
              {task.expected_intent.primary}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-slate-500">Constraints</p>
            <p className="text-2xl font-bold text-slate-900">{task.constraints.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Input & YAML */}
        <div className="space-y-6">
          {/* User Message & Expected Intent */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <FileText className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Task Input</CardTitle>
                  <CardDescription>User message and expected intent</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Message */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-700">User Message</h4>
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                  <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {task.user_message}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Expected Intent */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-700">Expected Intent</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Primary:</span>
                    <Badge variant="default" className="font-mono">
                      {task.expected_intent.primary}
                    </Badge>
                  </div>
                  {task.expected_intent.secondary && task.expected_intent.secondary.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-slate-500">Secondary:</span>
                      {task.expected_intent.secondary.map((intent, index) => (
                        <Badge key={index} variant="secondary" className="font-mono text-xs">
                          {intent}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Constraints */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-700">
                  Constraints
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {task.constraints.length}
                  </Badge>
                </h4>
                <ul className="space-y-2">
                  {task.constraints.map((constraint, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* YAML Configuration */}
          <YamlViewer
            yaml={generateTaskYaml(task)}
            title="Task Configuration"
            description="YAML representation of this task"
            height="300px"
          />
        </div>

        {/* Right Column: Response & Evaluation */}
        <div className="space-y-6">
          {/* Response Panel */}
          <ResponsePanel
            userMessage={task.user_message}
            aiResponse={task.response}
          />

          {/* Evaluation Panel */}
          <EvaluationPanel
            evaluation={task.evaluation}
            expectedIntent={task.expected_intent}
            constraints={task.constraints}
          />
        </div>
      </div>
    </div>
  );
}

function TaskDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[400px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
