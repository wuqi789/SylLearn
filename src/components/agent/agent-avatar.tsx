"use client";

import {
  Route,
  Cpu,
  GraduationCap,
  FileCheck,
  MessageSquare,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AgentRole = "planner" | "compiler" | "tutor" | "exam" | "debate" | "memory";

const roleConfig: Record<
  AgentRole,
  { icon: typeof Route; bg: string; text: string; label: string }
> = {
  planner: {
    icon: Route,
    bg: "bg-violet-100 dark:bg-violet-950",
    text: "text-violet-600 dark:text-violet-400",
    label: "规划师",
  },
  compiler: {
    icon: Cpu,
    bg: "bg-sky-100 dark:bg-sky-950",
    text: "text-sky-600 dark:text-sky-400",
    label: "编译器",
  },
  tutor: {
    icon: GraduationCap,
    bg: "bg-emerald-100 dark:bg-emerald-950",
    text: "text-emerald-600 dark:text-emerald-400",
    label: "导师",
  },
  exam: {
    icon: FileCheck,
    bg: "bg-amber-100 dark:bg-amber-950",
    text: "text-amber-600 dark:text-amber-400",
    label: "考官",
  },
  debate: {
    icon: MessageSquare,
    bg: "bg-rose-100 dark:bg-rose-950",
    text: "text-rose-600 dark:text-rose-400",
    label: "辩手",
  },
  memory: {
    icon: Brain,
    bg: "bg-indigo-100 dark:bg-indigo-950",
    text: "text-indigo-600 dark:text-indigo-400",
    label: "记忆",
  },
};

interface AgentAvatarProps {
  role: AgentRole;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "size-7",
  md: "size-9",
  lg: "size-11",
};

const iconSizeMap = {
  sm: "size-3.5",
  md: "size-4.5",
  lg: "size-5.5",
};

const fallbackConfig = {
  icon: GraduationCap,
  bg: "bg-muted",
  text: "text-muted-foreground",
  label: "助手",
};

export function AgentAvatar({
  role,
  size = "md",
  showLabel = false,
  className,
}: AgentAvatarProps) {
  const config = roleConfig[role] || fallbackConfig;
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full",
          sizeMap[size],
          config.bg
        )}
      >
        <Icon className={cn(iconSizeMap[size], config.text)} />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-foreground/80">
          {config.label}
        </span>
      )}
    </div>
  );
}
