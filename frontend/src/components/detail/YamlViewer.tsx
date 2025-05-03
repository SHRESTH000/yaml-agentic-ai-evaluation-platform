"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FileCode, Copy, Check, Maximize2 } from "lucide-react";

interface YamlViewerProps {
  yaml: string;
  title?: string;
  description?: string;
  isLoading?: boolean;
  readOnly?: boolean;
  height?: string;
  className?: string;
  onValidate?: () => void;
}

// Lazy load Monaco Editor for better performance
const MonacoEditor = React.lazy(() =>
  import("@monaco-editor/react").then((mod) => ({ default: mod.Editor }))
);

export function YamlViewer({
  yaml,
  title = "YAML Configuration",
  description = "Task configuration in YAML format",
  isLoading = false,
  readOnly = true,
  height = "400px",
  className,
  onValidate,
}: YamlViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const editorContent = (
    <div
      className={cn(
        "rounded-lg border border-slate-200 overflow-hidden bg-slate-50",
        isFullscreen && "fixed inset-4 z-50 rounded-xl shadow-2xl"
      )}
    >
      {mounted ? (
        <React.Suspense
          fallback={
            <div className="flex items-center justify-center h-[400px] bg-slate-50">
              <div className="text-slate-500">Loading editor...</div>
            </div>
          }
        >
          <MonacoEditor
            height={isFullscreen ? "calc(100vh - 200px)" : height}
            language="yaml"
            value={yaml}
            theme="vs"
            options={{
              readOnly: readOnly,
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "JetBrains Mono, Menlo, Monaco, monospace",
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              renderLineHighlight: "none",
              overviewRulerBorder: false,
              scrollbar: {
                vertical: "auto",
                horizontal: "auto",
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
            }}
          />
        </React.Suspense>
      ) : (
        <div className="flex items-center justify-center h-[400px] bg-slate-50">
          <div className="text-slate-500">Loading editor...</div>
        </div>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleFullscreen}
        />
        <div className="fixed inset-4 z-50 flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <FileCode className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500">{description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                Exit Fullscreen
              </Button>
            </div>
          </div>
          <div className="flex-1 p-4">{editorContent}</div>
        </div>
      </>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2">
              <FileCode className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            {onValidate && (
              <Button variant="secondary" size="sm" onClick={onValidate}>
                Validate
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>{editorContent}</CardContent>
    </Card>
  );
}

export default YamlViewer;
