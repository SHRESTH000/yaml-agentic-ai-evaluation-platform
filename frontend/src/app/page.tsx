"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskSummaryChart, PassFailChart } from "@/components/dashboard/TaskSummaryChart";
import { TaskTable } from "@/components/tasks/TaskTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDashboardStats, fetchScoreData, fetchTaskList } from "@/lib/api";
import { DashboardStats, ScoreDataPoint, TaskListItem } from "@/lib/types";
import { formatScore } from "@/lib/utils";
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  Activity,
  Cpu,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [scoreData, setScoreData] = useState<ScoreDataPoint[]>([]);
  const [recentTasks, setRecentTasks] = useState<TaskListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        const [statsData, scores, tasks] = await Promise.all([
          fetchDashboardStats(),
          fetchScoreData(),
          fetchTaskList(),
        ]);
        setStats(statsData);
        setScoreData(scores);
        setRecentTasks(tasks.slice(0, 5)); // Show only recent 5 tasks
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const partialRate = stats ? 100 - stats.passRate - stats.failRate : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks Evaluated"
          value={stats?.totalTasks ?? 0}
          subtitle="All time evaluations"
          icon={BarChart3}
          variant="default"
        />
        <StatCard
          title="Average Intent Score"
          value={formatScore(stats?.averageScore ?? 0)}
          subtitle="Across all tasks"
          icon={TrendingUp}
          variant={
            (stats?.averageScore ?? 0) >= 0.8
              ? "success"
              : (stats?.averageScore ?? 0) >= 0.5
              ? "warning"
              : "error"
          }
        />
        <StatCard
          title="Pass Rate"
          value={`${Math.round(stats?.passRate ?? 0)}%`}
          subtitle="Intent matched successfully"
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Active Model"
          value={stats?.activeModel ?? "N/A"}
          subtitle="Current evaluation model"
          icon={Cpu}
          variant="default"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TaskSummaryChart
            data={scoreData}
            chartType="bar"
            title="Evaluation Scores by Task"
            description="Individual task scores showing evaluation quality"
          />
        </div>
        <div>
          <PassFailChart
            passRate={stats?.passRate ?? 0}
            failRate={stats?.failRate ?? 0}
            partialRate={partialRate > 0 ? partialRate : undefined}
          />
        </div>
      </div>

      {/* System Status & Recent Tasks */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* System Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">System Status</CardTitle>
                <CardDescription>Current evaluation pipeline health</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-slate-700">Pipeline Status</span>
              </div>
              <span className="text-sm font-semibold text-emerald-600">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">Model</span>
              </div>
              <span className="text-sm font-mono text-slate-600">
                {stats?.activeModel ?? "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">Last Updated</span>
              </div>
              <span className="text-sm text-slate-600">
                {stats?.lastUpdated
                  ? new Date(stats.lastUpdated).toLocaleTimeString()
                  : "N/A"}
              </span>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Evaluation Method</span>
                  <span className="font-medium text-slate-900">YAML-Driven</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Intent Matching</span>
                  <span className="font-medium text-slate-900">Semantic</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Recent Evaluations</CardTitle>
                  <CardDescription>Latest tasks processed by the system</CardDescription>
                </div>
                <Link href="/tasks">
                  <Button variant="outline" size="sm" className="gap-1">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <TaskTable
                tasks={recentTasks}
                showHeader={false}
                className="border-0 shadow-none"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          <CardDescription>Common tasks and navigation shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/tasks">
              <div className="group rounded-lg border border-slate-200 p-4 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2 group-hover:bg-slate-200 transition-colors">
                    <BarChart3 className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">View All Tasks</p>
                    <p className="text-sm text-slate-500">Browse evaluations</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/editor">
              <div className="group rounded-lg border border-slate-200 p-4 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 group-hover:bg-blue-200 transition-colors">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">YAML Editor</p>
                    <p className="text-sm text-slate-500">View configuration</p>
                  </div>
                </div>
              </div>
            </Link>
            <div className="rounded-lg border border-slate-200 p-4 opacity-60">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Run Evaluation</p>
                  <p className="text-sm text-slate-500">Coming soon</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 opacity-60">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2">
                  <XCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Export Results</p>
                  <p className="text-sm text-slate-500">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
