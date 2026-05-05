"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface QuestionData {
  question: string;
  type: "multiple_choice" | "true_false" | "open_ended";
  options?: string[];
  answer: string;
  explanation: string;
}

interface QuestionCardProps {
  question: QuestionData;
  onAnswer?: (correct: boolean, userAnswer: string) => void;
  className?: string;
}

export function QuestionCard({ question, onAnswer, className }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [openAnswer, setOpenAnswer] = useState("");

  const isCorrect =
    question.type === "open_ended"
      ? false
      : selected?.toLowerCase() === question.answer.toLowerCase();

  const handleSubmit = () => {
    const userAnswer =
      question.type === "open_ended" ? openAnswer || "" : selected || "";
    if (!userAnswer) return;
    setSubmitted(true);
    onAnswer?.(isCorrect, userAnswer);
  };

  const getOptions = (): string[] => {
    if (question.options && question.options.length > 0) return question.options;
    if (question.type === "true_false") return ["True", "False"];
    return [];
  };

  const options = getOptions();

  return (
    <div className={cn("flex flex-col gap-4 rounded-xl border bg-card p-5", className)}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <HelpCircle className="size-4 text-primary" />
        </div>
        <p className="text-sm font-medium leading-relaxed">{question.question}</p>
      </div>

      {question.type === "multiple_choice" || question.type === "true_false" ? (
        <div className="flex flex-col gap-2">
          {options.map((option, i) => {
            const optionLetter = String.fromCharCode(65 + i);
            const isSelected = selected === option;
            const isAnswer = option.toLowerCase() === question.answer.toLowerCase();

            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => setSelected(option)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all",
                  !submitted && !isSelected && "hover:border-primary/40 hover:bg-muted/50",
                  !submitted && isSelected && "border-primary bg-primary/5",
                  submitted && isAnswer && "border-emerald-400 bg-emerald-50 dark:bg-emerald-950",
                  submitted && isSelected && !isAnswer && "border-rose-400 bg-rose-50 dark:bg-rose-950",
                  submitted && !isSelected && !isAnswer && "opacity-50"
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                    !submitted && isSelected && "border-primary bg-primary text-primary-foreground",
                    submitted && isAnswer && "border-emerald-500 bg-emerald-500 text-white",
                    submitted && isSelected && !isAnswer && "border-rose-500 bg-rose-500 text-white"
                  )}
                >
                  {submitted && isAnswer ? (
                    <CheckCircle2 className="size-4" />
                  ) : submitted && isSelected && !isAnswer ? (
                    <XCircle className="size-4" />
                  ) : (
                    optionLetter
                  )}
                </span>
                <span className="flex-1">{option}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <Textarea
          placeholder="输入你的答案..."
          value={openAnswer}
          onChange={(e) => setOpenAnswer(e.target.value)}
          disabled={submitted}
          className="min-h-24 resize-none"
        />
      )}

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "rounded-lg p-3",
                isCorrect
                  ? "bg-emerald-50 dark:bg-emerald-950/50"
                  : "bg-amber-50 dark:bg-amber-950/50"
              )}
            >
              <p className="mb-1 text-sm font-medium">
                {isCorrect ? "✅ 回答正确！" : "💡 正确答案："}
              </p>
              {!isCorrect && question.type !== "open_ended" && (
                <p className="mb-1 text-sm font-semibold text-primary">
                  {question.answer}
                </p>
              )}
              <p className="text-xs leading-relaxed text-muted-foreground">
                {question.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={
            question.type === "open_ended"
              ? !openAnswer.trim()
              : !selected
          }
          className="w-full"
        >
          提交答案
        </Button>
      )}
    </div>
  );
}
