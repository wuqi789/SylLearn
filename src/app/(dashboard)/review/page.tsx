"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Brain,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  BarChart3,
  Play,
  RotateCcw,
  ChevronRight,
  Loader2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ReviewItem {
  id: string;
  memoryItemId: string;
  memoryItem: {
    id: string;
    content: string;
    type: string;
    mastery: string;
  };
  nextReviewAt: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
}

interface MasteryPoint {
  date: string;
  mastery: number;
}

export default function ReviewPage() {
  const { token } = useAuth();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [masteryHistory, setMasteryHistory] = useState<MasteryPoint[]>([]);

  const fetchReviews = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/review", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews ?? []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    const generateMasteryCurve = () => {
      const days = 14;
      const data: MasteryPoint[] = [];
      const now = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const mastery = Math.min(
          100,
          Math.max(20, 40 + Math.floor(Math.random() * 10) + (days - i) * 3 + reviewedCount)
        );
        data.push({
          date: `${date.getMonth() + 1}/${date.getDate()}`,
          mastery,
        });
      }
      return data;
    };
    setMasteryHistory(generateMasteryCurve());
  }, [reviewedCount]);

  const startReview = () => {
    if (reviews.length === 0) return;
    setReviewing(true);
    setCurrentIndex(0);
    setFlipped(false);
    setLastAnswerCorrect(null);
  };

  const handleAnswer = async (known: boolean) => {
    if (!token || submitting) return;
    setSubmitting(true);
    setLastAnswerCorrect(known);

    const current = reviews[currentIndex];
    const quality = known ? 4 : 1;

    try {
      await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewId: current.id,
          quality,
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setReviewedCount((c) => c + 1);
      if (known) {
        setStreak((s) => s + 1);
      } else {
        setStreak(0);
      }
      setSubmitting(false);

      setTimeout(() => {
        if (currentIndex < reviews.length - 1) {
          setCurrentIndex((i) => i + 1);
          setFlipped(false);
          setLastAnswerCorrect(null);
        } else {
          setReviewing(false);
        }
      }, 1000);
    }
  };

  const dueToday = reviews.length;
  const currentCard = reviews[currentIndex];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <RefreshCw className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">复习计划</h1>
          <p className="text-sm text-muted-foreground">
            间隔重复，巩固记忆
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30">
                <Clock className="size-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{dueToday}</div>
                <div className="text-xs text-muted-foreground">今日待复习</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/30">
                <Flame className="size-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{streak}</div>
                <div className="text-xs text-muted-foreground">连续掌握</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                <CheckCircle2 className="size-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{reviewedCount}</div>
                <div className="text-xs text-muted-foreground">已复习</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence mode="wait">
        {!reviewing ? (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
              <CardContent className="relative flex flex-col items-center gap-6 py-10 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Brain className="size-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">
                    {dueToday > 0
                      ? `${dueToday} 张卡片等待复习`
                      : "暂无待复习卡片"}
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {dueToday > 0
                      ? "通过间隔重复算法，帮助你高效巩固记忆，提升长期掌握率"
                      : "所有卡片已复习完成，新的复习将在卡片到期时出现"}
                  </p>
                </div>
                {dueToday > 0 && (
                  <Button
                    onClick={startReview}
                    size="lg"
                    className="h-12 gap-2 px-8 text-base"
                  >
                    <Play className="size-5" />
                    开始 10 分钟复习
                  </Button>
                )}
                {dueToday === 0 && reviewedCount > 0 && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <Sparkles className="size-4" />
                    太棒了！本次已复习 {reviewedCount} 张卡片
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="reviewing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="gap-1">
                <BookOpen className="size-3" />
                {currentIndex + 1} / {reviews.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReviewing(false)}
                className="gap-1 text-muted-foreground"
              >
                结束复习
              </Button>
            </div>

            <div className="mx-auto max-w-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCard?.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="perspective-1000"
                >
                  <div
                    className={cn(
                      "relative cursor-pointer rounded-xl border bg-card p-8 shadow-sm transition-transform duration-500 min-h-[280px] flex flex-col items-center justify-center text-center",
                      flipped && "[transform:rotateY(180deg)]"
                    )}
                    style={{ transformStyle: "preserve-3d" }}
                    onClick={() => !flipped && setFlipped(true)}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden",
                        flipped && "invisible"
                      )}
                    >
                      <Badge variant="outline" className="mb-4">
                        问题
                      </Badge>
                      <p className="text-lg font-medium leading-relaxed">
                        {currentCard?.memoryItem?.content ?? ""}
                      </p>
                      <p className="mt-6 text-sm text-muted-foreground">
                        点击卡片查看答案
                      </p>
                    </div>

                    <div
                      className={cn(
                        "absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden [transform:rotateY(180deg)]",
                        !flipped && "invisible"
                      )}
                    >
                      <Badge variant="secondary" className="mb-4">
                        答案
                      </Badge>
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {currentCard?.memoryItem?.content
                          ? `${currentCard.memoryItem.content} 的详细解答与解析`
                          : ""}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence>
                {lastAnswerCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "mt-4 flex items-center justify-center gap-2 rounded-lg p-3 text-sm font-medium",
                      lastAnswerCorrect
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                        : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                    )}
                  >
                    {lastAnswerCorrect ? (
                      <>
                        <CheckCircle2 className="size-4" />
                        掌握良好！间隔将延长
                      </>
                    ) : (
                      <>
                        <XCircle className="size-4" />
                        别担心，很快会再次复习
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {flipped && lastAnswerCorrect === null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex items-center justify-center gap-4"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleAnswer(false)}
                    disabled={submitting}
                    className="h-12 gap-2 px-8 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-950/30"
                  >
                    {submitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <XCircle className="size-5 text-red-500" />
                    )}
                    不认识
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => handleAnswer(true)}
                    disabled={submitting}
                    className="h-12 gap-2 px-8 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {submitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="size-5" />
                    )}
                    认识
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">掌握曲线</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {masteryHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={masteryHistory}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    domain={[0, 100]}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [`${value}%`, "掌握度"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="mastery"
                    stroke="oklch(0.45 0.24 264)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                暂无数据
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">今日复习列表</CardTitle>
              <Badge variant="secondary" className="ml-auto">
                {reviews.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[200px] items-center justify-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                        review.memoryItem?.mastery === "mastered"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : review.memoryItem?.mastery === "fuzzy"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                            : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm">
                        {review.memoryItem?.content ?? "待复习卡片"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          {review.memoryItem?.type ?? "review"}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                <RotateCcw className="size-8 opacity-30" />
                <p>暂无待复习卡片</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
