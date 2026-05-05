"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { AgentAvatar } from "@/components/agent/agent-avatar";

type AgentRole = "planner" | "compiler" | "tutor" | "exam" | "debate" | "memory";

interface ChatBubbleProps {
  content: string;
  isUser: boolean;
  agentRole?: AgentRole;
  timestamp?: string;
  className?: string;
}

export function ChatBubble({
  content,
  isUser,
  agentRole,
  timestamp,
  className,
}: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      <div className="mt-0.5 shrink-0">
        {isUser ? (
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
            <User className="size-4 text-primary" />
          </div>
        ) : (
          <AgentAvatar role={agentRole || "tutor"} size="md" />
        )}
      </div>

      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md"
          )}
        >
          <div
            className={cn(
              !isUser && "chat-scrollbar"
            )}
          >
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            ) : (
              <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
        {timestamp && (
          <span className="px-1 text-xs text-muted-foreground/60">
            {timestamp}
          </span>
        )}
      </div>
    </motion.div>
  );
}
