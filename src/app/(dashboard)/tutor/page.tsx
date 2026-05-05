"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  HelpCircle,
  Lightbulb,
  RefreshCw,
  ClipboardList,
  BookmarkPlus,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useAgent } from "@/hooks/use-agent";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ChatBubble } from "@/components/agent/chat-bubble";
import { ThinkingIndicator } from "@/components/agent/thinking-indicator";
import { SkillCard } from "@/components/learning/skill-card";
import { KnowledgeTree } from "@/components/learning/knowledge-tree";
import { MasteryChart } from "@/components/learning/mastery-chart";

interface SkillNodeData {
  id: string;
  type: string;
  title: string;
  content: string;
  difficulty: number;
  order: number;
}

interface SkillData {
  id: string;
  topicId: string;
  skillNodes: SkillNodeData[];
  assessmentCriteria?: string;
}

interface SessionData {
  id: string;
  title: string;
  topicId?: string;
  status: string;
  createdAt: string;
}

const actionButtons = [
  { label: "我不懂", action: "simplify", icon: HelpCircle, variant: "outline" as const },
  { label: "再举一个例子", action: "example", icon: Lightbulb, variant: "outline" as const },
  { label: "换个角度解释", action: "explain", icon: RefreshCw, variant: "outline" as const },
  { label: "生成测验", action: "quiz", icon: ClipboardList, variant: "outline" as const },
  { label: "加入复习计划", action: "review", icon: BookmarkPlus, variant: "secondary" as const },
];

const defaultMasteryData = [
  { dimension: "概念", value: 0 },
  { dimension: "示例", value: 0 },
  { dimension: "练习", value: 0 },
  { dimension: "复习", value: 0 },
  { dimension: "综合", value: 0 },
];

export default function TutorPage() {
  const { user, token } = useAuth();
  const { messages, loading: agentLoading, sendMessage, loadHistory, clearMessages, error, clearError } = useAgent();
  const { createSession } = useSession();

  const [inputValue, setInputValue] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null);
  const [currentSkill, setCurrentSkill] = useState<SkillData | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [recentTopics, setRecentTopics] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastUserMessageRef = useRef("");

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleStartLearning = async () => {
    if (!topicInput.trim() || !token) return;
    const topic = topicInput.trim();
    setTopicInput("");
    clearMessages();
    setCurrentSkill(null);

    try {
      const session = await createSession(token, topic);
      setCurrentSession(session);

      setRecentTopics((prev) => {
        const updated = [topic, ...prev.filter((t) => t !== topic)].slice(0, 8);
        return updated;
      });

      setIsCompiling(true);
      const skillRes = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topicId: session.topicId }),
      });
      const skillData = await skillRes.json();
      if (skillRes.ok) {
        setCurrentSkill(skillData.skill);
      }
      setIsCompiling(false);

      lastUserMessageRef.current = `请教我学习：${topic}`;
      await sendMessage(token, session.id, `请教我学习：${topic}`, "teach");
    } catch (err) {
      setIsCompiling(false);
      console.error(err);
    }
  };

  const handleSend = async (content?: string, action?: string) => {
    const text = content || inputValue.trim();
    if (!text || !token || !currentSession) return;
    setInputValue("");
    lastUserMessageRef.current = text;
    await sendMessage(token, currentSession.id, text, action || "teach");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTopicKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleStartLearning();
    }
  };

  const skillTreeNodes = currentSkill
    ? [
        {
          id: currentSkill.id,
          label: currentSession?.title || "当前主题",
          mastered: false,
          difficulty: 1,
          children: currentSkill.skillNodes.map((n) => ({
            id: n.id,
            label: n.title,
            mastered: false,
            difficulty: n.difficulty,
          })),
        },
      ]
    : [];

  const agentRole = (messages.length > 0
    ? messages[messages.length - 1]?.agentRole
    : "tutor") as "planner" | "compiler" | "tutor" | "exam" | "debate" | "memory";

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-xl border bg-card">
      <AnimatePresence initial={false}>
        {!leftCollapsed && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex shrink-0 flex-col overflow-hidden border-r"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Layers className="size-4 text-primary" />
                学习面板
              </h3>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setLeftCollapsed(true)}
              >
                <ChevronLeft className="size-3.5" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 p-4">
                <div>
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    快速选择
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {recentTopics.length > 0 ? (
                      recentTopics.map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setTopicInput(t);
                            handleStartLearning();
                          }}
                          className="rounded-full bg-muted px-3 py-1 text-xs font-medium transition-colors hover:bg-muted/80"
                        >
                          {t}
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground/50">
                        还没有学习记录
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {currentSkill && (
                  <>
                    <div>
                      <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        知识结构
                      </h4>
                      <KnowledgeTree
                        nodes={skillTreeNodes}
                        title={currentSession?.title || "知识图谱"}
                      />
                    </div>
                    <Separator />
                  </>
                )}

                {currentSkill && (
                  <div>
                    <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      掌握度
                    </h4>
                    <MasteryChart data={defaultMasteryData} />
                  </div>
                )}
              </div>
            </ScrollArea>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b px-4 py-3">
          {leftCollapsed && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setLeftCollapsed(false)}
            >
              <ChevronRight className="size-3.5" />
            </Button>
          )}

          <div className="flex flex-1 items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
              <GraduationCap className="size-4 text-primary" />
              <span className="text-sm font-medium">
                {currentSession ? currentSession.title : "导师教学"}
              </span>
            </div>
            {currentSession && (
              <Badge variant="secondary" className="text-xs">
                学习中
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setRightCollapsed(!rightCollapsed)}
          >
            <Layers className="size-3.5" />
          </Button>
        </div>

        {!currentSession ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                <Sparkles className="size-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  开始学习
                </h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  输入你想学习的主题，AI 导师将为你编译知识、生成课程，并提供个性化的教学体验
                </p>
              </div>
            </motion.div>

            <div className="flex w-full max-w-lg items-center gap-2">
              <Textarea
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={handleTopicKeyDown}
                placeholder="输入学习主题，例如：量子力学、机器学习基础、数据结构..."
                className="min-h-12 flex-1 resize-none"
                rows={1}
              />
              <Button
                onClick={handleStartLearning}
                disabled={!topicInput.trim() || !token}
                className="h-12 gap-2 self-end px-6"
              >
                <Sparkles className="size-4" />
                开始
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>热门主题：</span>
              {["Python 基础", "React Hooks", "微积分", "机器学习", "经济学原理"].map(
                (t) => (
                  <button
                    key={t}
                    onClick={() => setTopicInput(t)}
                    className="rounded-full bg-muted px-3 py-1 transition-colors hover:bg-muted/80"
                  >
                    {t}
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 p-4">
                {currentSkill && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SkillCard
                      skill={currentSkill}
                      topicName={currentSession.title}
                    />
                  </motion.div>
                )}

                {isCompiling && (
                  <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="size-4" />
                    </motion.div>
                    正在编译知识...
                  </div>
                )}

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

                {agentLoading && <ThinkingIndicator />}

                <div ref={messagesEndRef} />

                {error && (
                  <div className="mx-auto max-w-2xl px-4 pb-2">
                    <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      <AlertTriangle className="size-4 shrink-0" />
                      <span className="flex-1">{error}</span>
                      <Button variant="outline" size="sm" onClick={() => { clearError(); sendMessage(token!, currentSession!.id, lastUserMessageRef.current, "teach"); }} className="gap-1 shrink-0">
                        <RefreshCw className="size-3" />
                        重试
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t">
              <div className="flex flex-wrap gap-1.5 border-b px-4 py-2">
                {actionButtons.map((btn) => {
                  const Icon = btn.icon;
                  return (
                    <Button
                      key={btn.action}
                      variant={btn.variant}
                      size="sm"
                      className="gap-1.5 text-xs"
                      disabled={agentLoading || !token}
                      onClick={() => handleSend(btn.label, btn.action)}
                    >
                      <Icon className="size-3.5" />
                      {btn.label}
                    </Button>
                  );
                })}
              </div>

              <div className="flex items-end gap-2 p-3">
                <Textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入你的问题... (Enter 发送, Shift+Enter 换行)"
                  className="min-h-10 flex-1 resize-none"
                  rows={1}
                  disabled={agentLoading}
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || agentLoading || !token}
                  size="icon"
                  className="shrink-0"
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <AnimatePresence initial={false}>
        {!rightCollapsed && currentSession && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex shrink-0 flex-col overflow-hidden border-l"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Layers className="size-4 text-primary" />
                学习上下文
              </h3>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setRightCollapsed(true)}
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-5 p-4">
                {currentSkill && (
                  <div>
                    <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      知识节点
                    </h4>
                    <div className="flex flex-col gap-2">
                      {currentSkill.skillNodes.map((node) => {
                        const typeLabels: Record<string, string> = {
                          concept: "概念",
                          example: "示例",
                          analogy: "类比",
                          exercise: "练习",
                          review_card: "复习",
                        };
                        return (
                          <div
                            key={node.id}
                            className="rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{node.title}</span>
                              <Badge variant="secondary" className="text-xs">
                                {typeLabels[node.type] || node.type}
                              </Badge>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                              {node.content}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {currentSkill && <MasteryChart data={defaultMasteryData} />}

                {currentSkill && (
                  <div>
                    <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      评估标准
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {currentSkill.assessmentCriteria || "完成所有知识节点的学习和练习即可达到掌握标准。"}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    学习统计
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-muted/40 p-3 text-center">
                      <p className="text-lg font-bold text-primary">
                        {messages.filter((m) => m.role === "user").length}
                      </p>
                      <p className="text-xs text-muted-foreground">提问次数</p>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-3 text-center">
                      <p className="text-lg font-bold text-primary">
                        {currentSkill?.skillNodes.length || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">知识节点</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
