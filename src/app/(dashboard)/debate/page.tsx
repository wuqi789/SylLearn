"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Sparkles,
  Send,
  FileText,
  Loader2,
  MessageSquare,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAgent } from "@/hooks/use-agent";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DebatePanel } from "@/components/agent/debate-panel";
import { ChatBubble } from "@/components/agent/chat-bubble";

interface DebatePosition {
  id: string;
  role: string;
  stance: string;
  arguments: string[];
  evidence: string[];
  order: number;
}

interface DebateData {
  positions: DebatePosition[];
  controversy: string;
  summary?: string;
  status?: "active" | "concluded";
}

export default function DebatePage() {
  const { token } = useAuth();
  const { messages, loading: agentLoading, sendMessage, loadHistory, clearMessages, error, clearError } = useAgent();
  const { createSession } = useSession();

  const [topic, setTopic] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [debateData, setDebateData] = useState<DebateData | null>(null);
  const [initializing, setInitializing] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lastUserMessageRef = useRef("");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startDebate = async () => {
    if (!topic.trim() || !token) return;
    setInitializing(true);
    try {
      lastUserMessageRef.current = topic.trim();
      const session = await createSession(token, topic.trim());
      setSessionId(session.id);
      clearMessages();

      const res = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: session.id,
          content: topic.trim(),
          action: "debate",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errMsg = data?.error?.message || `请求失败 (${res.status})`;
        throw new Error(errMsg);
      }

      if (data.agentMessage) {
        try {
          const parsed = JSON.parse(data.agentMessage.content);
          if (parsed.positions) {
            setDebateData(parsed);
          } else if (parsed.pro || parsed.con) {
            const positions: DebatePosition[] = [];
            if (parsed.pro) {
              const items = Array.isArray(parsed.pro) ? parsed.pro : [parsed.pro];
              items.forEach((item: { point?: string; evidence?: string }, idx: number) => {
                positions.push({
                  id: `pos-pro-${idx}`,
                  role: "支持方",
                  stance: "支持",
                  arguments: [item.point || String(item)],
                  evidence: item.evidence ? [item.evidence] : [],
                  order: idx + 1,
                });
              });
            }
            if (parsed.con) {
              const items = Array.isArray(parsed.con) ? parsed.con : [parsed.con];
              items.forEach((item: { point?: string; evidence?: string }, idx: number) => {
                positions.push({
                  id: `pos-con-${idx}`,
                  role: "反对方",
                  stance: "反对",
                  arguments: [item.point || String(item)],
                  evidence: item.evidence ? [item.evidence] : [],
                  order: positions.length + idx + 1,
                });
              });
            }
            setDebateData({
              positions,
              controversy: parsed.controversy || topic.trim(),
              summary: parsed.summary,
            });
          } else {
            throw new Error("unexpected format");
          }
        } catch {
          const positions: DebatePosition[] = [
            {
              id: "pos-1",
              role: "支持方",
              stance: "支持",
              arguments: ["此方向具有明确的发展前景和现实意义"],
              evidence: ["相关领域已有成功案例验证"],
              order: 1,
            },
            {
              id: "pos-2",
              role: "反对方",
              stance: "反对",
              arguments: ["此方向存在较大的风险和不确定性"],
              evidence: ["过往经验表明需谨慎对待"],
              order: 2,
            },
          ];
          setDebateData({
            positions,
            controversy: topic.trim(),
          });
        }
      }

      await loadHistory(token, session.id);
    } catch (err) {
      console.error(err);
    } finally {
      setInitializing(false);
    }
  };

  const handleFollowUp = async () => {
    if (!followUp.trim() || !token || !sessionId) return;
    lastUserMessageRef.current = followUp.trim();
    await sendMessage(token, sessionId, followUp.trim(), "debate");
    setFollowUp("");
  };

  const handleQuestion = async (question: string) => {
    if (!token || !sessionId) return;
    lastUserMessageRef.current = question;
    await sendMessage(token, sessionId, question, "debate");
  };

  const handleSummarize = async () => {
    if (!token || !sessionId) return;
    setSummarizing(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          content: "请生成辩论总结",
          action: "debate",
        }),
      });
      const data = await res.json();
      if (res.ok && data.agentMessage) {
        let summaryText = data.agentMessage.content;
        try {
          const parsed = JSON.parse(summaryText);
          if (parsed.summary) summaryText = parsed.summary;
        } catch {
          // not JSON, use as-is
        }
        setDebateData((prev) =>
          prev
            ? { ...prev, summary: summaryText, status: "concluded" }
            : prev
        );
      }
    } catch (err) {
      console.error("Summarize error:", err);
    } finally {
      setSummarizing(false);
    }
  };

  const handleVote = (positionId: string) => {
    console.log("Voted for:", positionId);
  };

  if (!debateData) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <motion.div
          className="w-full max-w-xl space-y-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-3">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <Zap className="size-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              辩论学习
            </h1>
            <p className="text-muted-foreground">
              输入一个有争议的话题，AI 智能体将从多角度展开深度辩论
            </p>
          </div>

          <Card>
            <CardContent className="pt-4 space-y-4">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="输入辩论话题，如：远程办公是否应该成为主流？"
                className="h-11 text-base"
                onKeyDown={(e) => {
                  if (e.key === "Enter") startDebate();
                }}
                disabled={initializing}
              />
              <Button
                onClick={startDebate}
                disabled={!topic.trim() || initializing}
                className="w-full h-11 gap-2"
                size="lg"
              >
                {initializing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    正在生成辩论...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    开始辩论
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: "🔬", label: "科技伦理", topic: "AI 是否应该拥有自主决策权？" },
              { icon: "📚", label: "教育理念", topic: "传统考试制度是否应该被废除？" },
              { icon: "🌍", label: "社会发展", topic: "远程办公是否应该成为主流？" },
            ].map((example) => (
              <Card
                key={example.topic}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => {
                  setTopic(example.topic);
                }}
              >
                <CardContent className="flex items-center gap-3 pt-2 pb-2">
                  <span className="text-xl">{example.icon}</span>
                  <div className="text-left min-w-0">
                    <div className="text-xs text-muted-foreground">
                      {example.label}
                    </div>
                    <div className="truncate text-sm">{example.topic}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

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
            <Zap className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">辩论进行中</h1>
            <p className="text-sm text-muted-foreground">
              从多角度深入探讨
            </p>
          </div>
        </div>
        {debateData.status !== "concluded" && (
          <Button
            onClick={handleSummarize}
            disabled={summarizing}
            variant="outline"
            className="gap-2"
          >
            {summarizing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FileText className="size-4" />
            )}
            生成总结
          </Button>
        )}
      </div>

      <DebatePanel
        debateData={debateData}
        onVote={handleVote}
        onAsk={handleQuestion}
      />

      {messages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">讨论记录</CardTitle>
              <Badge variant="secondary" className="ml-auto">
                {messages.length} 条
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-96">
              <div className="space-y-3">
                {messages.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    content={msg.content}
                    isUser={msg.role === "user"}
                    agentRole={
                      msg.agentRole as
                        | "planner"
                        | "compiler"
                        | "tutor"
                        | "exam"
                        | "debate"
                        | "memory"
                        | undefined
                    }
                    timestamp={
                      msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString("zh-CN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : undefined
                    }
                  />
                ))}
                <div ref={chatEndRef} />
                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    <AlertTriangle className="size-4 shrink-0" />
                    <span className="flex-1">{error}</span>
                    <Button variant="outline" size="sm" onClick={() => { clearError(); sendMessage(token!, sessionId!, lastUserMessageRef.current, "debate"); }} className="gap-1 shrink-0">
                      <RefreshCw className="size-3" />
                      重试
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-2">
            <Input
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="输入追问，继续深入讨论..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleFollowUp();
              }}
              disabled={agentLoading}
            />
            <Button
              onClick={handleFollowUp}
              disabled={!followUp.trim() || agentLoading}
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
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
          onClick={() => {
            setDebateData(null);
            setSessionId(null);
            setTopic("");
            clearMessages();
          }}
        >
          <ArrowRight className="size-3.5" />
          开始新辩论
        </Button>
      </div>
    </motion.div>
  );
}
