"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  Activity,
  BookOpen,
  Brain,
  Target,
  Clock,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

const masteryDistribution = [
  { name: "已掌握", value: 128, color: "#22c55e" },
  { name: "模糊", value: 45, color: "#eab308" },
  { name: "错误", value: 18, color: "#ef4444" },
  { name: "待复习", value: 36, color: "#6366f1" },
];

const weeklyActivity = [
  { day: "周一", sessions: 4, minutes: 45 },
  { day: "周二", sessions: 3, minutes: 38 },
  { day: "周三", sessions: 6, minutes: 72 },
  { day: "周四", sessions: 2, minutes: 25 },
  { day: "周五", sessions: 5, minutes: 58 },
  { day: "周六", sessions: 7, minutes: 85 },
  { day: "周日", sessions: 4, minutes: 50 },
];

const domainBreakdown = [
  { domain: "前端开发", count: 85, color: "#6366f1" },
  { domain: "后端开发", count: 52, color: "#8b5cf6" },
  { domain: "算法", count: 38, color: "#a78bfa" },
  { domain: "数据库", count: 28, color: "#c4b5fd" },
  { domain: "网络", count: 15, color: "#ddd6fe" },
  { domain: "操作系统", count: 9, color: "#ede9fe" },
];

const progressOverTime = [
  { week: "第1周", mastered: 12, total: 20 },
  { week: "第2周", mastered: 28, total: 45 },
  { week: "第3周", mastered: 48, total: 72 },
  { week: "第4周", mastered: 65, total: 98 },
  { week: "第5周", mastered: 82, total: 130 },
  { week: "第6周", mastered: 98, total: 158 },
  { week: "第7周", mastered: 112, total: 186 },
  { week: "第8周", mastered: 128, total: 227 },
];

const recentActivity = [
  { date: "今天 08:30", action: "完成学习", topic: "React Hooks 深入理解", agent: "tutor" },
  { date: "今天 08:15", action: "通过测评", topic: "useEffect 清理函数", agent: "exam" },
  { date: "昨天 14:20", action: "开始学习", topic: "TypeScript 泛型编程", agent: "planner" },
  { date: "昨天 10:15", action: "完成复习", topic: "数据库索引优化", agent: "memory" },
  { date: "2天前", action: "辩论结束", topic: "函数式 vs 面向对象", agent: "debate" },
  { date: "2天前", action: "完成学习", topic: "二叉树遍历算法", agent: "tutor" },
  { date: "3天前", action: "通过测评", topic: "CSS Grid 布局", agent: "exam" },
  { date: "3天前", action: "完成复习", topic: "Promise 异步编程", agent: "memory" },
];

const statsCards = [
  { label: "总学习会话", value: "47", change: "+8 本周", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { label: "知识点总数", value: "227", change: "+32 本周", icon: Brain, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/30" },
  { label: "掌握率", value: "56.4%", change: "+4.2% 本周", icon: Target, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
  { label: "平均学习时长", value: "53 分钟", change: "每天", icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
];

const agentColors: Record<string, string> = {
  tutor: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  exam: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  planner: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  memory: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  debate: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};

const agentLabels: Record<string, string> = {
  tutor: "导师",
  exam: "测评",
  planner: "规划",
  memory: "记忆",
  debate: "辩论",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
      <div className="flex items-center gap-2">
        <div className="size-2.5 rounded-full" style={{ backgroundColor: item.payload.color }} />
        <span className="font-medium">{item.name}</span>
        <span className="text-muted-foreground">{item.value}</span>
      </div>
    </div>
  );
}

function CustomBarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-muted-foreground">{item.name === "sessions" ? "会话数" : "学习时长(分)"}:</span>
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function CustomLineTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-muted-foreground">{item.name === "mastered" ? "已掌握" : "总知识点"}:</span>
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [loading] = useState(false);

  const totalTopics = masteryDistribution.reduce((sum, d) => sum + d.value, 0);

  if (loading) {
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
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight">学习分析</h1>
        <p className="mt-1 text-muted-foreground">深入了解你的学习进度和知识掌握情况</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4">
              <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", stat.bg)}>
                <stat.icon className={cn("size-5", stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-0.5 text-xs text-green-600">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="size-4 text-primary" />
                知识掌握分布
              </CardTitle>
              <CardDescription>共 {totalTopics} 个知识点的掌握状态分布</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="h-52 w-52 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={masteryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {masteryDistribution.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {masteryDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium tabular-nums">{item.value}</span>
                        <span className="text-xs text-muted-foreground">
                          {((item.value / totalTopics) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-4 text-primary" />
                每周学习活动
              </CardTitle>
              <CardDescription>本周每日学习会话数和时长</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} className="text-muted-foreground" axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
                    <Bar dataKey="sessions" name="sessions" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-4 text-primary" />
                领域分布
              </CardTitle>
              <CardDescription>各学科领域的知识点数量</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domainBreakdown.map((domain) => {
                  const maxCount = Math.max(...domainBreakdown.map((d) => d.count));
                  const widthPercent = (domain.count / maxCount) * 100;
                  return (
                    <div key={domain.domain} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{domain.domain}</span>
                        <span className="text-sm tabular-nums text-muted-foreground">
                          {domain.count} 个知识点
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: domain.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${widthPercent}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                学习进度趋势
              </CardTitle>
              <CardDescription>过去 8 周的知识点掌握趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressOverTime}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} className="text-muted-foreground" axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomLineTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      iconSize={8}
                      formatter={(value: string) => (value === "mastered" ? "已掌握" : "总知识点")}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="total"
                      stroke="#c4b5fd"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#c4b5fd" }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mastered"
                      name="mastered"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#6366f1" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              最近活动
            </CardTitle>
            <CardDescription>你的学习活动时间线</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-0">
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
              {recentActivity.map((activity, index) => (
                <div key={index} className="relative flex items-start gap-4 py-3">
                  <div className={cn(
                    "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full ring-2 ring-background",
                    agentColors[activity.agent] || "bg-muted"
                  )}>
                    <span className="text-xs font-medium">
                      {agentLabels[activity.agent]?.[0] || activity.agent[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{activity.action}</span>
                      <Badge variant="outline" className="text-xs">
                        {activity.topic}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.date}</span>
                      <span>·</span>
                      <span>{agentLabels[activity.agent] || activity.agent}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
