"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Lightbulb,
  Dumbbell,
  Layers,
  ChevronDown,
  Star,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface SkillCardProps {
  skill: SkillData;
  topicName: string;
  domain?: string;
  className?: string;
}

const sectionConfig: Record<
  string,
  { icon: typeof BookOpen; label: string; color: string }
> = {
  concept: { icon: BookOpen, label: "核心概念", color: "text-sky-600" },
  example: { icon: Lightbulb, label: "示例讲解", color: "text-amber-600" },
  analogy: { icon: Layers, label: "类比理解", color: "text-violet-600" },
  exercise: { icon: Dumbbell, label: "练习题", color: "text-emerald-600" },
  review_card: { icon: Star, label: "复习卡片", color: "text-rose-600" },
};

function DifficultyIndicator({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "size-1.5 rounded-full transition-colors",
            i <= level ? "bg-primary" : "bg-muted-foreground/20"
          )}
        />
      ))}
    </div>
  );
}

function SkillSection({
  nodes,
  type,
}: {
  nodes: SkillNodeData[];
  type: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const config = sectionConfig[type];
  if (!config || nodes.length === 0) return null;
  const Icon = config.icon;

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-2.5">
          <Icon className={cn("size-4", config.color)} />
          <span className="text-sm font-medium">{config.label}</span>
          <Badge variant="secondary" className="text-xs">
            {nodes.length}
          </Badge>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="size-4 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 px-4 pb-3">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className="rounded-lg bg-muted/40 p-3 transition-colors hover:bg-muted/60"
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <h4 className="text-sm font-medium">{node.title}</h4>
                    <DifficultyIndicator level={node.difficulty} />
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {node.content}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SkillCard({
  skill,
  topicName,
  domain = "通用",
  className,
}: SkillCardProps) {
  const grouped = skill.skillNodes.reduce<Record<string, SkillNodeData[]>>(
    (acc, node) => {
      if (!acc[node.type]) acc[node.type] = [];
      acc[node.type].push(node);
      return acc;
    },
    {}
  );

  const totalNodes = skill.skillNodes.length;
  const avgDifficulty =
    totalNodes > 0
      ? Math.round(
          (skill.skillNodes.reduce((s, n) => s + n.difficulty, 0) / totalNodes) *
            10
        ) / 10
      : 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="border-b border-border/50 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{topicName}</CardTitle>
            <div className="mt-1.5 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {domain}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowRight className="size-3" />
                {totalNodes} 个知识节点
              </span>
              <DifficultyIndicator level={Math.round(avgDifficulty)} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {Object.entries(sectionConfig).map(([type]) => (
          <SkillSection
            key={type}
            nodes={grouped[type] || []}
            type={type}
          />
        ))}
      </CardContent>
    </Card>
  );
}
