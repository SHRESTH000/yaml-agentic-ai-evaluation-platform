"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchYamlConfig, runEvaluation } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  FileCode,
  Play,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Download,
  RefreshCw,
  Settings,
  Layers,
  Wrench,
  FileText,
} from "lucide-react";

// Lazy load Monaco Editor
const MonacoEditor = React.lazy(() =>
  import("@monaco-editor/react").then((mod) => ({ default: mod.Editor }))
);

type ConfigType = "tasks" | "agents" | "tools" | "evaluation";

interface ConfigTab {
  id: ConfigType;
  label: string;
  description: string;
  icon: React.ElementType;
}

const CONFIG_TABS: ConfigTab[] = [
  {
    id: "tasks",
    label: "Tasks",
    description: "Evaluation task definitions",
    icon: FileText,
  },
  {
    id: "agents",
    label: "Agents",
    description: "AI agent configurations",
    icon: Settings,
  },
  {
    id: "tools",
    label: "Tools",
    description: "Available tool definitions",
    icon: Wrench,
  },
  {
    id: "evaluation",
    label: "Evaluation",
    description: "Scoring and metrics config",
    icon: Layers,
  },
];

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<ConfigType>("tasks");
  const [yamlContent, setYamlContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    loadConfig(activeTab);
  }, [activeTab]);

  async function loadConfig(configType: ConfigType) {
    try {
      setIsLoading(true);
      setValidationResult(null);
      const content = await fetchYamlConfig(configType);
      setYamlContent(content);
    } catch (error) {
      console.error("Failed to load config:", error);
      setYamlContent("# Failed to load configuration");
    } finally {
      setIsLoading(false);
    }
  }

  const handleValidate = () => {
    setIsValidating(true);
    // Simulate YAML validation
    setTimeout(() => {
      try {
        // Basic YAML structure validation (in real app, use a proper YAML parser)
        const lines = yamlContent.split("\n");
        const hasContent = lines.some((line) => line.trim() && !line.trim().startsWith("#"));
        const hasValidStructure = yamlContent.includes(":") && !yamlContent.includes("\t");

        if (hasContent && hasValidStructure) {
          setValidationResult({
            valid: true,
            message: "YAML structure is valid",
          });
        } else {
          setValidationResult({
            valid: false,
            message: "Invalid YAML structure detected",
          });
        }
      } catch {
        setValidationResult({
          valid: false,
          message: "Failed to parse YAML",
        });
      }
      setIsValidating(false);
    }, 500);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yamlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleRunEvaluation = async () => {
    setIsRunning(true);
    try {
      // Placeholder - in real implementation, this would trigger backend evaluation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Evaluation triggered! (This is a placeholder - backend integration required)");
    } catch (error) {
      console.error("Failed to run evaluation:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([yamlContent], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Config Type Tabs */}
      <Card>
        <CardContent className="p-2">
          <div className="flex gap-1 overflow-x-auto">
            {CONFIG_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "flex-shrink-0 gap-2 h-auto py-3 px-4",
                    isActive && "bg-slate-100"
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-slate-700" : "text-slate-500")} />
                  <div className="text-left">
                    <p className={cn("font-medium", isActive ? "text-slate-900" : "text-slate-700")}>
                      {tab.label}
                    </p>
                    <p className="text-xs text-slate-500 font-normal">{tab.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Editor Section */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Editor */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <FileCode className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {CONFIG_TABS.find((t) => t.id === activeTab)?.label} Configuration
                    </CardTitle>
                    <CardDescription>
                      {CONFIG_TABS.find((t) => t.id === activeTab)?.description} (Read-only)
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => loadConfig(activeTab)}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Reload
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                {isLoading ? (
                  <div className="h-[500px] flex items-center justify-center bg-slate-50">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-slate-400 mx-auto" />
                      <p className="mt-2 text-sm text-slate-500">Loading configuration...</p>
                    </div>
                  </div>
                ) : (
                  <Suspense
                    fallback={
                      <div className="h-[500px] flex items-center justify-center bg-slate-50">
                        <p className="text-slate-500">Loading editor...</p>
                      </div>
                    }
                  >
                    <MonacoEditor
                      height="500px"
                      language="yaml"
                      value={yamlContent}
                      theme="vs"
                      options={{
                        readOnly: true,
                        minimap: { enabled: true },
                        fontSize: 13,
                        fontFamily: "JetBrains Mono, Menlo, Monaco, monospace",
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        automaticLayout: true,
                        padding: { top: 16, bottom: 16 },
                        renderLineHighlight: "line",
                        scrollbar: {
                          vertical: "auto",
                          horizontal: "auto",
                          verticalScrollbarSize: 10,
                          horizontalScrollbarSize: 10,
                        },
                      }}
                    />
                  </Suspense>
                )}
              </div>

              {/* Validation Result */}
              {validationResult && (
                <div
                  className={cn(
                    "mt-4 rounded-lg border p-4 flex items-start gap-3",
                    validationResult.valid
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50"
                  )}
                >
                  {validationResult.valid ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                  )}
                  <div>
                    <p
                      className={cn(
                        "font-medium",
                        validationResult.valid ? "text-emerald-800" : "text-red-800"
                      )}
                    >
                      {validationResult.valid ? "Validation Passed" : "Validation Failed"}
                    </p>
                    <p
                      className={cn(
                        "text-sm mt-1",
                        validationResult.valid ? "text-emerald-700" : "text-red-700"
                      )}
                    >
                      {validationResult.message}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Actions</CardTitle>
              <CardDescription>Validate and run evaluations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleValidate}
                disabled={isValidating || isLoading}
              >
                {isValidating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Validate YAML
              </Button>
              <Separator />
              <Button
                variant="default"
                className="w-full justify-start gap-2"
                onClick={handleRunEvaluation}
                disabled={isRunning || isLoading}
              >
                {isRunning ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Run Evaluation
              </Button>
              <p className="text-xs text-slate-500">
                Triggers backend evaluation pipeline with current configuration.
              </p>
            </CardContent>
          </Card>

          {/* Config Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Configuration Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">File Type</span>
                  <Badge variant="secondary">YAML</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Config</span>
                  <span className="font-medium text-slate-700">{activeTab}.yaml</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Mode</span>
                  <Badge variant="outline">Read-only</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Lines</span>
                  <span className="font-mono text-slate-700">
                    {yamlContent.split("\n").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">YAML Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  This configuration defines how the AI evaluation system processes tasks.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <span className="font-medium">Tasks:</span> User messages & expected intents
                  </li>
                  <li>
                    <span className="font-medium">Agents:</span> AI model configurations
                  </li>
                  <li>
                    <span className="font-medium">Tools:</span> Available processing tools
                  </li>
                  <li>
                    <span className="font-medium">Evaluation:</span> Scoring metrics
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
