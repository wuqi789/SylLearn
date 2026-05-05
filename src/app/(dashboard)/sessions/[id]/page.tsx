"use client";

import { useState, useEffect, useRef, use } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Loader2,
  BookOpen,
  Clock,
  User,
  Bot,
  Zap,
  CheckCircle2,
  Archive,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useAgent } from "@/hooks/use-agent";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  active: { label: "进行中", variant: "default" },
  completed: { label: "已完成", variant: "secondary" },
  archived: { label: "已归档", variant: "outline" },
};

const roleLabels: Record<string, string> = {
  teach: "导师",
  quiz: "测验",
  debate: "辩论",
  explain: "讲解",
  example: "示例",
  simplify: "简化",
  review: "复习",
};

export default function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { token } = useAuth();
  const {
    messages,
    loading: agentLoading,
    sendMessage,
    loadHistory,
  } = useAgent();

  const [input, setInput] = useState("");
  const [sessionInfo, setSessionInfo] = useState<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    topicId?: string;
  } | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!token || !id) return;

    const loadSession = async () => {
      setLoadingSession(true);
      try {
        const res = await fetch("/api/sessions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const session = data.sessions?.find(
            (s: { id: string }) => s.id === id
          );
          if (session) setSessionInfo(session);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSession(false);
      }
    };

    loadSession();
    loadHistory(token, id);
  }, [token, id, loadHistory]);

  const handleSend = async () => {
    if (!input.trim() || !token || !id) return;
    await sendMessage(token, id, input.trim(), "teach");
    setInput("");
  };

  const status = sessionInfo?.status ?? "active";
  const statusInfo = statusConfig[status] ?? statusConfig.active;

  return (
    <motion.div
      className="flex gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/sessions" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
              <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold">
              {loadingSession ? "加载中..." : sessionInfo?.title ?? "学习会话"}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant={statusInfo.variant} className="gap-1">
                {status === "active" && <Zap className="size-3" />}
                {status === "completed" && <CheckCircle2 className="size-3" />}
                {status === "archived" && <Archive className="size-3" />}
                {statusInfo.label}
              </Badge>
              {sessionInfo?.createdAt && (
                <span className="flex items-center gap-1 text-xs">
                  <Clock className="size-3" />
                  {new Date(sessionInfo.createdAt).toLocaleDateString("zh-CN")}
                </span>
              )}
            </div>
          </div>
        </div>

        <Card className="flex-1 flex flex-col min-h-0">
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            <ScrollArea className="flex-1 p-4" style={{ height: "calc(100vh - 280px)" }}>
              {messages.length === 0 && !loadingSession ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                    <BookOpen className="size-7 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">开始对话</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      输入你想学习的内容，AI 导师将为你解答
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={cn(
                        "flex gap-3",
                        msg.role === "user" ? "flex-row-reverse" : ""
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {msg.role === "user" ? (
                          <User className="size-4" />
                        ) : (
                          <Bot className="size-4" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "max-w-[80%] space-y-1",
                          msg.role === "user" ? "text-right" : ""
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {msg.role !== "user" && msg.agentRole && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {roleLabels[msg.agentRole] ?? msg.agentRole}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {msg.role === "user" ? "你" : "AI 导师"}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {agentLoading && (
                    <div className="flex gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Bot className="size-4" />
                      </div>
                      <div className="rounded-xl bg-muted px-4 py-2.5">
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </ScrollArea>

            <Separator />

            <div className="p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入你想学习的内容..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={agentLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || agentLoading}
                  className="shrink-0 gap-1.5"
                >
                  {agentLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="size-4" />
                      发送
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="hidden w-72 shrink-0 lg:block">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">会话信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingSession ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : sessionInfo ? (
              <>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">
                      标题
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      {sessionInfo.title}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">
                      状态
                    </div>
                    <div className="mt-1">
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">
                      创建时间
                    </div>
                    <div className="mt-1 text-sm">
                      {new Date(sessionInfo.createdAt).toLocaleString("zh-CN")}
                    </div>
                  </div>
                  {sessionInfo.topicId && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-xs font-medium text-muted-foreground">
                          主题
                        </div>
                        <div className="mt-1 text-sm">{sessionInfo.topicId}</div>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">
                      消息数
                    </div>
                    <div className="mt-1 text-sm">{messages.length}</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    学习模式
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {["teach", "quiz", "explain", "example"].map((mode) => (
                      <Button
                        key={mode}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          if (token && id) {
                            sendMessage(token, id, `请使用${roleLabels[mode]}模式`, mode);
                          }
                        }}
                      >
                        {roleLabels[mode]}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                未找到会话信息
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
