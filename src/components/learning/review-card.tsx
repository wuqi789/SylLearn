"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, ThumbsUp, ThumbsDown, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type MasteryLevel = "mastered" | "fuzzy" | "wrong" | "needs_review";

interface ReviewCardData {
  id: string;
  front: string;
  back: string;
  mastery: MasteryLevel;
  topicName?: string;
}

interface ReviewCardProps {
  card: ReviewCardData;
  onKnow?: (id: string) => void;
  onDontKnow?: (id: string) => void;
  className?: string;
}

const masteryConfig: Record<
  MasteryLevel,
  { label: string; color: string; bg: string }
> = {
  mastered: {
    label: "已掌握",
    color: "text-emerald-600",
    bg: "bg-emerald-100 dark:bg-emerald-950",
  },
  fuzzy: {
    label: "模糊",
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-950",
  },
  wrong: {
    label: "错误",
    color: "text-rose-600",
    bg: "bg-rose-100 dark:bg-rose-950",
  },
  needs_review: {
    label: "待复习",
    color: "text-sky-600",
    bg: "bg-sky-100 dark:bg-sky-950",
  },
};

export function ReviewCard({
  card,
  onKnow,
  onDontKnow,
  className,
}: ReviewCardProps) {
  const [flipped, setFlipped] = useState(false);
  const mastery = masteryConfig[card.mastery];

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div
        className="relative h-64 w-full cursor-pointer"
        style={{ perspective: 1000 }}
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          className="absolute inset-0 size-full"
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border bg-card p-6 shadow-sm"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="absolute right-3 top-3 flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  mastery.bg,
                  mastery.color
                )}
              >
                <Brain className="size-3" />
                {mastery.label}
              </span>
            </div>
            {card.topicName && (
              <span className="mb-3 text-xs text-muted-foreground">
                {card.topicName}
              </span>
            )}
            <p className="text-center text-base font-medium leading-relaxed">
              {card.front}
            </p>
            <span className="mt-4 flex items-center gap-1 text-xs text-muted-foreground/50">
              <RotateCcw className="size-3" />
              点击翻转查看答案
            </span>
          </div>

          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border bg-primary/5 p-6 shadow-sm"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-center text-sm leading-relaxed text-foreground/80">
              {card.back}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex w-full gap-3">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => onDontKnow?.(card.id)}
        >
          <ThumbsDown className="size-4 text-rose-500" />
          不认识
        </Button>
        <Button className="flex-1 gap-2" onClick={() => onKnow?.(card.id)}>
          <ThumbsUp className="size-4" />
          认识
        </Button>
      </div>
    </div>
  );
}
