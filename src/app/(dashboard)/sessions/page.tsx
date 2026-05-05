"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Plus,
  Search,
  Loader2,
  ArrowRight,
  BookOpen,
  Zap,
  Clock,
  CheckCircle2,
  Archive,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<
  string,
  { label: string; icon: React.ElementType; variant: "default" | "secondary" | "outline" | "destructive"; color: string }
> = {
  active: {
    label: "进行中",
    icon: Zap,
    variant: "default",
    color: "text-primary",
  },
  completed: {
    label: "已完成",
    icon: CheckCircle2,
    variant: "secondary",
    color: "text-emerald-600",
  },
  archived: {
    label: "已归档",
    icon: Archive,
    variant: "outline",
    color: "text-muted-foreground",
  },
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "刚刚";
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 7) return `${diffDays} 天前`;
  return date.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
  });
}

export default function SessionsPage() {
  const { token } = useAuth();
  const { sessions, loading, fetchSessions } = useSession();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (token) fetchSessions(token);
  }, [token, fetchSessions]);

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const matchesSearch =
        !search ||
        s.title?.toLowerCase().includes(search.toLowerCase()) ||
        s.topicId?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || s.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [sessions, search, filterStatus]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <MessageSquare className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">学习会话</h1>
            <p className="text-sm text-muted-foreground">
              管理你的学习记录
            </p>
          </div>
        </div>
        <Link
          href="/tutor"
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <Plus className="size-4" />
          新建学习
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索会话标题..."
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "completed", "archived"].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className="gap-1"
            >
              {status === "all" ? (
                "全部"
              ) : (
                <>
                  {status === "active" && <Zap className="size-3" />}
                  {status === "completed" && <CheckCircle2 className="size-3" />}
                  {status === "archived" && <Archive className="size-3" />}
                  {statusConfig[status]?.label}
                </>
              )}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((session, index) => {
            const statusInfo = statusConfig[session.status] ?? statusConfig.active;
            const StatusIcon = statusInfo.icon;

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link href={`/sessions/${session.id}`}>
                  <Card className="transition-all hover:shadow-md hover:border-primary/20 cursor-pointer">
                    <CardContent className="pt-2 pb-2">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-xl",
                            session.status === "active"
                              ? "bg-primary/10"
                              : session.status === "completed"
                                ? "bg-emerald-50 dark:bg-emerald-950/30"
                                : "bg-muted"
                          )}
                        >
                          <BookOpen
                            className={cn("size-5", statusInfo.color)}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate font-medium">
                              {session.title ?? "未命名会话"}
                            </h3>
                            <Badge
                              variant={statusInfo.variant}
                              className="shrink-0 gap-1"
                            >
                              <StatusIcon className="size-3" />
                              {statusInfo.label}
                            </Badge>
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {formatDate(session.createdAt)}
                            </span>
                            {session.topicId && (
                              <span className="flex items-center gap-1">
                                <BookOpen className="size-3" />
                                {session.topicId}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
                <MessageSquare className="size-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">
                  {search || filterStatus !== "all"
                    ? "没有找到匹配的会话"
                    : "还没有学习会话"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {search || filterStatus !== "all"
                    ? "尝试调整搜索条件或筛选状态"
                    : "开始你的第一次学习吧，AI 智能体将为你编译知识"}
                </p>
              </div>
              {!search && filterStatus === "all" && (
                <Link
                  href="/tutor"
                  className={cn(buttonVariants(), "gap-1.5")}
                >
                  <Plus className="size-4" />
                  开始学习
                </Link>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
