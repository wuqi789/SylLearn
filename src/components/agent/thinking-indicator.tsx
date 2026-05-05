"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThinkingIndicatorProps {
  className?: string;
  text?: string;
}

export function ThinkingIndicator({
  className,
  text = "Agent 正在思考...",
}: ThinkingIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2.5 px-1 py-2", className)}>
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block size-1.5 rounded-full bg-primary/60"
            animate={{
              y: [0, -6, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}
