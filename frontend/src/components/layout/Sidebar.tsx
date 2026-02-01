"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  ListTodo,
  FileCode,
  Settings,
  Brain,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  description?: string;
}

const mainNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "System overview",
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: ListTodo,
    description: "Evaluation tasks",
  },
  {
    label: "YAML Editor",
    href: "/editor",
    icon: FileCode,
    description: "Configuration",
  },
];

const secondaryNavItems: NavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "System settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900">AI Eval</h1>
            <p className="text-xs text-slate-500">Evaluation Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-11",
                      active
                        ? "bg-slate-100 text-slate-900 font-medium"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        active ? "text-slate-900" : "text-slate-500"
                      )}
                    />
                    <span className="flex-1 text-left">{item.label}</span>
                    {active && (
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          <Separator className="my-4" />

          <div className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-10",
                      active
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <Icon className="h-4 w-4 text-slate-500" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-slate-700">System Active</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Model: gpt-4.1-mini
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
