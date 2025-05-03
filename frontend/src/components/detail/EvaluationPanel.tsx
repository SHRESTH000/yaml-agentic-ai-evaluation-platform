"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, IntentMatchIndicator } from "@/components/tasks/StatusBadge";
import { Evaluation, ExpectedIntent, Constraint, TaskStatus } from "@/lib/types";
import { cn, formatScore, getScoreColor, getTaskStatus } from "@/lib/utils";
import {
  Target,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface EvaluationPanelProps {
  evaluation?: Evaluation;
  expectedIntent: ExpectedIntent;
  constraints: Constraint[];
  isLoading?: boolean;
  className?: string;
}

export function EvaluationPanel({
  evaluation,
  expectedIntent,
  constraints,
  isLoading = false,
  className,
}: EvaluationPanelProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Evaluation Results</CardTitle>
          <CardDescription>Analysis of AI response quality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const status: TaskStatus = evaluation
    ? getTaskStatus(evaluation.score, evaluation.intent_match)
    : "pending";

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-purple-100 p-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Evaluation Results</CardTitle>
            <CardDescription>Analysis of AI response against expected intent</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Section */}
        {evaluation && (
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">Overall Score</p>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-4xl font-bold tabular-nums",
                      getScoreColor(evaluation.score)
                    )}
                  >
                    {formatScore(evaluation.score)}
                  </span>
                  <StatusBadge status={status} size="lg" />
                </div>
              </div>
              <div
                className={cn(
                  "rounded-full p-4",
                  status === "pass"
                    ? "bg-emerald-100"
                    : status === "partial"
                    ? "bg-amber-100"
                    : "bg-red-100"
                )}
              >
                <TrendingUp
                  className={cn(
                    "h-8 w-8",
                    status === "pass"
                      ? "text-emerald-600"
                      : status === "partial"
                      ? "text-amber-600"
                      : "text-red-600"
                  )}
                />
              </div>
            </div>

            {/* Score Bar */}
            <div className="mt-4">
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    evaluation.score >= 0.8
                      ? "bg-emerald-500"
                      : evaluation.score >= 0.5
                      ? "bg-amber-500"
                      : "bg-red-500"
                  )}
                  style={{ width: `${Math.round(evaluation.score * 100)}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        )}

        {/* Intent Match Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">Intent Match</span>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Expected Primary Intent</p>
                <p className="mt-1 font-mono text-sm font-medium text-slate-900">
                  {expectedIntent.primary}
                </p>
              </div>
              {evaluation && (
                <IntentMatchIndicator match={evaluation.intent_match} />
              )}
            </div>
            {expectedIntent.secondary && expectedIntent.secondary.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-2">Secondary Intents</p>
                <div className="flex flex-wrap gap-1.5">
                  {expectedIntent.secondary.map((intent, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {intent}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Constraints Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">Constraints</span>
            <Badge variant="secondary" className="text-xs">
              {constraints.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {constraints.length > 0 ? (
              constraints.map((constraint, index) => {
                const isViolated = evaluation?.constraint_violations?.includes(constraint);
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-3",
                      isViolated
                        ? "border-red-200 bg-red-50/50"
                        : "border-slate-200 bg-slate-50/50"
                    )}
                  >
                    {isViolated ? (
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        isViolated ? "text-red-700" : "text-slate-700"
                      )}
                    >
                      {constraint}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 text-center">
                <p className="text-sm text-slate-500">No constraints defined for this task</p>
              </div>
            )}
          </div>
        </div>

        {/* Explanation Section */}
        {evaluation?.explanation && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">Explanation</span>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-4">
                <p className="text-sm leading-relaxed text-slate-700">
                  {evaluation.explanation}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Constraint Violations Alert */}
        {evaluation?.constraint_violations && evaluation.constraint_violations.length > 0 && (
          <>
            <Separator />
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Constraint Violations Detected
                  </p>
                  <ul className="mt-2 space-y-1">
                    {evaluation.constraint_violations.map((violation, index) => (
                      <li key={index} className="text-sm text-amber-700">
                        • {violation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default EvaluationPanel;
