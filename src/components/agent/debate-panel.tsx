"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ThumbsUp,
  MessageCircleQuestion,
  Shield,
  Swords,
  Scale,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Send,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

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

interface PositionStyle {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeVariant: "default" | "secondary" | "outline" | "destructive";
  gradient: string;
}

const positionStyles: PositionStyle[] = [
  {
    icon: Shield,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    badgeVariant: "default",
    gradient: "from-blue-500/10 to-transparent",
  },
  {
    icon: Swords,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    badgeVariant: "destructive",
    gradient: "from-red-500/10 to-transparent",
  },
  {
    icon: Scale,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    badgeVariant: "secondary",
    gradient: "from-amber-500/10 to-transparent",
  },
  {
    icon: BookOpen,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    badgeVariant: "outline",
    gradient: "from-emerald-500/10 to-transparent",
  },
];

interface DebatePanelProps {
  debateData: DebateData;
  onVote?: (positionId: string) => void;
  onAsk?: (question: string) => void;
}

export function DebatePanel({ debateData, onVote, onAsk }: DebatePanelProps) {
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [expandedArgs, setExpandedArgs] = useState<Record<string, boolean>>({});
  const [question, setQuestion] = useState("");
  const [askingQuestion, setAskingQuestion] = useState(false);

  const handleVote = (positionId: string) => {
    setVotes((prev) => ({
      ...prev,
      [positionId]: (prev[positionId] || 0) + 1,
    }));
    onVote?.(positionId);
  };

  const toggleArgs = (positionId: string) => {
    setExpandedArgs((prev) => ({
      ...prev,
      [positionId]: !prev[positionId],
    }));
  };

  const handleAsk = () => {
    if (!question.trim()) return;
    setAskingQuestion(true);
    onAsk?.(question.trim());
    setQuestion("");
    setTimeout(() => setAskingQuestion(false), 500);
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Badge variant="outline" className="gap-1">
                  <Swords className="size-3" />
                  辩论主题
                </Badge>
                <CardTitle className="text-lg leading-relaxed sm:text-xl">
                  {debateData.controversy}
                </CardTitle>
              </div>
              {debateData.status === "concluded" && (
                <Badge variant="secondary" className="gap-1 shrink-0">
                  <Trophy className="size-3" />
                  已总结
                </Badge>
              )}
            </div>
          </CardHeader>
          {debateData.summary && (
            <CardContent>
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="text-sm leading-relaxed text-muted-foreground markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{debateData.summary}</ReactMarkdown>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {debateData.positions.map((position, index) => {
          const style = positionStyles[index % positionStyles.length];
          const StyleIcon = style.icon;
          const isExpanded = expandedArgs[position.id] ?? true;
          const positionVotes = votes[position.id] || 0;
          const votePercent =
            totalVotes > 0
              ? Math.round((positionVotes / totalVotes) * 100)
              : 0;

          return (
            <motion.div
              key={position.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "relative overflow-hidden transition-shadow hover:shadow-md",
                  style.borderColor
                )}
              >
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
                    style.gradient
                  )}
                />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex size-8 items-center justify-center rounded-lg",
                          style.bgColor
                        )}
                      >
                        <StyleIcon className={cn("size-4", style.color)} />
                      </div>
                      <div>
                        <div className="font-medium">{position.role}</div>
                      </div>
                    </div>
                    <Badge variant={style.badgeVariant}>{position.stance}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <button
                      onClick={() => toggleArgs(position.id)}
                      className="flex w-full items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>论点与证据</span>
                      {isExpanded ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 space-y-3">
                            <div className="space-y-2">
                              {position.arguments.map((arg, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className={cn(
                                    "flex items-start gap-2 rounded-lg p-2.5 text-sm",
                                    style.bgColor
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                                      index === 0
                                        ? "bg-blue-500"
                                        : index === 1
                                          ? "bg-red-500"
                                          : index === 2
                                            ? "bg-amber-500"
                                            : "bg-emerald-500"
                                    )}
                                  >
                                    {i + 1}
                                  </span>
                                  <span className="leading-relaxed markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{arg}</ReactMarkdown></span>
                                </motion.div>
                              ))}
                            </div>

                            {position.evidence.length > 0 && (
                              <>
                                <Separator />
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                    <BookOpen className="size-3" />
                                    证据支撑
                                  </div>
                                  {position.evidence.map((ev, i) => (
                                    <div
                                      key={i}
                                      className="rounded-md border border-dashed p-2 text-xs leading-relaxed text-muted-foreground markdown-body"
                                    >
                                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{ev}</ReactMarkdown>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => handleVote(position.id)}
                      >
                        <ThumbsUp className="size-3.5" />
                        <span>{positionVotes}</span>
                      </Button>
                      {totalVotes > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {votePercent}%
                        </span>
                      )}
                    </div>
                    {totalVotes > 0 && (
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className={cn(
                            "h-full rounded-full",
                            index === 0
                              ? "bg-blue-500"
                              : index === 1
                                ? "bg-red-500"
                                : index === 2
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${votePercent}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircleQuestion className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">向辩论各方提问</span>
            </div>
            <div className="flex gap-2">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="输入你的问题，各方将从各自立场回答..."
                className="min-h-10 resize-none"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAsk();
                  }
                }}
              />
              <Button
                size="icon"
                onClick={handleAsk}
                disabled={!question.trim() || askingQuestion}
                className="shrink-0"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
