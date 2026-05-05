"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Plus,
  RefreshCw,
  BarChart3,
  ArrowRight,
  Brain,
  Target,
  Calendar,
  Sparkles,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SessionData {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  topic?: { name: string; domain: string };
}

interface ReviewItem {
  id: string;
  memoryItem?: { content: string; mastery: string };
  nextReviewAt: string;
}

interface MemoryItem {
  id: string;
  content: string;
  mastery: string;
  type: string;
  topicId: string;
  updatedAt: string;
}

const mockSessions: SessionData[] = [
  { id: "1", title: "React Hooks 深入理解", status: "completed", createdAt: "2026-05-05T08:30:00Z", topic: { name: "React Hooks", domain: "前端开发" } },
  { id: "2", title: "TypeScript 泛型编程", status: "active", createdAt: "2026-05-04T14:20:00Z", topic: { name: "TypeScript", domain: "前端开发" } },
  { id: "3", title: "数据库索引优化", status: "completed", createdAt: "2026-05-04T10:15:00Z", topic: { name: "数据库优化", domain: "后端开发" } },
  { id: "4", title: "二叉树遍历算法", status: "completed", createdAt: "2026-05-03T16:45:00Z", topic: { name: "数据结构", domain: "算法" } },
  { id: "5", title: "CSS Grid 布局实战", status: "completed", createdAt: "2026-05-03T09:00:00Z", topic: { name: "CSS Grid", domain: "前端开发" } },
];

const mockTodayTasks = [
  { id: "t1", title: "复习 React useEffect 清理函数", domain: "前端开发", type: "review", urgency: "high" },
  { id: "t2", title: "学习 TypeScript 条件类型", domain: "前端开发", type: "learn", urgency: "medium" },
  { id: "t3", title: "复习 SQL JOIN 操作", domain: "数据库", type: "review", urgency: "high" },
  { id: "t4", title: "继续二叉树平衡算法", domain: "算法", type: "continue", urgency: "low" },
  { id: "t5", title: "复习 Promise 链式调用", domain: "前端开发", type: "review", urgency: "medium" },
];

const mockPaths = [
  { id: "p1", title: "React 高级模式", topics: 8, progress: 62, domain: "前端开发" },
  { id: "p2", title: "系统设计入门", topics: 12, progress: 25, domain: "后端开发" },
  { id: "p3", title: "算法与数据结构", topics: 15, progress: 40, domain: "算法" },
];

const mockReviewItems = [
  { id: "r1", content: "闭包的定义和应用场景", mastery: "fuzzy", domain: "JavaScript" },
  { id: "r2", content: "虚拟 DOM 的 diff 算法", mastery: "needs_review", domain: "React" },
  { id: "r3", content: "数据库事务的 ACID 特性", mastery: "wrong", domain: "数据库" },
  { id: "r4", content: "TCP 三次握手过程", mastery: "fuzzy", domain: "网络" },
];

const masteryColors: Record<string, string> = {
  mastered: "text-green-600 bg-green-50 dark:bg-green-950/30",
  fuzzy: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30",
  wrong: "text-red-600 bg-red-50 dark:bg-red-950/30",
  needs_review: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
};

const masteryLabels: Record<string, string> = {
  mastered: "已掌握",
  fuzzy: "模糊",
  wrong: "错误",
  needs_review: "待复习",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "刚刚";
  if (diffHours < 24) return `${diffHours} 小时前`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays} 天前`;
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setDataLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const [sessionsRes, reviewRes, memoryRes] = await Promise.allSettled([
          fetch("/api/sessions", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/review", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/memory", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (sessionsRes.status === "fulfilled" && sessionsRes.value.ok) {
          const data = await sessionsRes.value.json();
          if (data.sessions?.length > 0) setSessions(data.sessions);
        }
        if (reviewRes.status === "fulfilled" && reviewRes.value.ok) {
          const data = await reviewRes.value.json();
          if (data.reviews?.length > 0) setReviewItems(data.reviews);
        }
        if (memoryRes.status === "fulfilled" && memoryRes.value.ok) {
          const data = await memoryRes.value.json();
          if (data.memoryItems?.length > 0) setMemoryItems(data.memoryItems);
        }
      } finally {
        setDataLoading(false);
      }
    }

    fetchData();
  }, [token]);

  const displaySessions = sessions.length > 0 ? sessions.slice(0, 5) : mockSessions;
  const masteredCount = memoryItems.filter((m) => m.mastery === "mastered").length;
  const reviewDueCount = reviewItems.length || mockReviewItems.length;

  const stats = [
    { label: "学习会话数", value: sessions.length || 47, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "已掌握知识点", value: masteredCount || 128, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
    { label: "待复习数量", value: reviewDueCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
    { label: "连续学习天数", value: 12, icon: Flame, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/30" },
  ];

  if (authLoading || dataLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            欢迎回来，{user?.name || "学习者"} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            继续你的学习旅程，今天也要加油哦
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button render={<Link href="/sessions" />} className="gap-1.5">
            <Plus className="size-4" />
            新建学习
          </Button>
          <Button variant="outline" render={<Link href="/review" />} className="gap-1.5">
            <RefreshCw className="size-4" />
            开始复习
          </Button>
          <Button variant="outline" render={<Link href="/analytics" />} className="gap-1.5">
            <BarChart3 className="size-4" />
            查看分析
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4">
              <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", stat.bg)}>
                <stat.icon className={cn("size-5", stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="size-4 text-primary" />
                    今日学习任务
                  </CardTitle>
                  <CardDescription>完成今日任务保持学习节奏</CardDescription>
                </div>
                <Badge variant="secondary">{mockTodayTasks.length} 项任务</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTodayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full",
                        task.type === "review"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30"
                          : task.type === "learn"
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30"
                            : "bg-purple-50 text-purple-600 dark:bg-purple-950/30"
                      )}
                    >
                      {task.type === "review" ? (
                        <RefreshCw className="size-4" />
                      ) : task.type === "learn" ? (
                        <BookOpen className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.domain}</p>
                    </div>
                    <Badge
                      variant={
                        task.urgency === "high"
                          ? "destructive"
                          : task.urgency === "medium"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {task.urgency === "high" ? "紧急" : task.urgency === "medium" ? "一般" : "低"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="size-4 text-primary" />
                    最近会话
                  </CardTitle>
                  <CardDescription>你最近的学习记录</CardDescription>
                </div>
                <Button variant="ghost" size="sm" render={<Link href="/sessions" />}>
                  查看全部
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {displaySessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      session.status === "active"
                        ? "bg-green-50 text-green-600 dark:bg-green-950/30"
                        : "bg-muted text-muted-foreground"
                    )}>
                      <BookOpen className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.topic?.domain || "通用"} · {formatDate(session.createdAt)}
                      </p>
                    </div>
                    <Badge variant={session.status === "active" ? "default" : "secondary"}>
                      {session.status === "active" ? "进行中" : "已完成"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                推荐学习路径
              </CardTitle>
              <CardDescription>基于你的学习进度推荐</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPaths.map((path) => (
                  <div key={path.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{path.title}</p>
                      <span className="text-xs text-muted-foreground">{path.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${path.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {path.domain} · {path.topics} 个知识点
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="size-4 text-primary" />
                    需要复习的知识
                  </CardTitle>
                  <CardDescription>这些知识点需要及时复习</CardDescription>
                </div>
                <Badge variant="destructive">{(reviewItems.length || mockReviewItems.length)} 项</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(reviewItems.length > 0
                  ? reviewItems.slice(0, 4).map((item) => ({
                      id: item.id,
                      content: item.memoryItem?.content || "待复习知识点",
                      mastery: item.memoryItem?.mastery || "needs_review",
                      domain: "通用",
                    }))
                  : mockReviewItems
                ).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className={cn("mt-0.5 size-2 shrink-0 rounded-full", {
                      "bg-green-500": item.mastery === "mastered",
                      "bg-yellow-500": item.mastery === "fuzzy",
                      "bg-red-500": item.mastery === "wrong",
                      "bg-blue-500": item.mastery === "needs_review",
                    })} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{item.content}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn("text-xs", masteryColors[item.mastery])}
                        >
                          {masteryLabels[item.mastery]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{item.domain}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <Button variant="ghost" size="sm" className="w-full" render={<Link href="/review" />}>
                查看全部复习项
                <ArrowRight className="size-3.5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
