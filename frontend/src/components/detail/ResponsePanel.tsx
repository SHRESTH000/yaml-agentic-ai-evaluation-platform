"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { MessageSquare, User, Bot, AlertTriangle } from "lucide-react";

interface ResponsePanelProps {
  userMessage: string;
  aiResponse?: string;
  isLoading?: boolean;
  className?: string;
}

export function ResponsePanel({
  userMessage,
  aiResponse,
  isLoading = false,
  className,
}: ResponsePanelProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Response Analysis</CardTitle>
          <CardDescription>User input and AI-generated response</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Response Analysis</CardTitle>
            <CardDescription>User input and AI-generated response</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {/* User Message Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-slate-100 p-1.5">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">User Message</span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {userMessage}
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* AI Response Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-emerald-100 p-1.5">
                  <Bot className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">AI Response</span>
              </div>
              {aiResponse ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4">
                  <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {aiResponse}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-amber-200 bg-amber-50/30 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">No Response Available</p>
                      <p className="text-sm text-amber-700 mt-1">
                        The AI response has not been generated yet for this task.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface MessageBubbleProps {
  type: "user" | "ai";
  message: string;
  className?: string;
}

export function MessageBubble({ type, message, className }: MessageBubbleProps) {
  const isUser = type === "user";

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "flex-row" : "flex-row-reverse",
        className
      )}
    >
      <div
        className={cn(
          "shrink-0 rounded-full p-2",
          isUser ? "bg-slate-100" : "bg-emerald-100"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-slate-600" />
        ) : (
          <Bot className="h-4 w-4 text-emerald-600" />
        )}
      </div>
      <div
        className={cn(
          "rounded-xl p-4 max-w-[85%]",
          isUser
            ? "bg-slate-100 text-slate-700"
            : "bg-emerald-50 text-slate-700 border border-emerald-200"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
}

export default ResponsePanel;
