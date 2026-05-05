"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  CheckCircle2,
  Circle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeNode {
  id: string;
  label: string;
  mastered: boolean;
  children?: TreeNode[];
  difficulty?: number;
}

interface KnowledgeTreeProps {
  nodes: TreeNode[];
  title?: string;
  onNodeClick?: (node: TreeNode) => void;
  className?: string;
}

function TreeNodeComponent({
  node,
  depth = 0,
  onNodeClick,
}: {
  node: TreeNode;
  depth?: number;
  onNodeClick?: (node: TreeNode) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5" style={{ paddingLeft: depth * 20 }}>
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex shrink-0 items-center justify-center rounded p-0.5 transition-colors hover:bg-muted"
          >
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.15 }}
            >
              <ChevronRight className="size-3 text-muted-foreground" />
            </motion.div>
          </button>
        ) : (
          <span className="size-4" />
        )}
        <button
          onClick={() => onNodeClick?.(node)}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all hover:bg-muted/70",
            node.mastered ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {node.mastered ? (
            <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
          ) : (
            <Circle className="size-4 shrink-0 text-muted-foreground/40" />
          )}
          <span className={cn(node.mastered && "font-medium")}>
            {node.label}
          </span>
          {node.difficulty != null && (
            <span className="ml-auto text-xs text-muted-foreground/50">
              Lv.{node.difficulty}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {hasChildren && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="relative ml-5 border-l border-border/40">
              {node.children!.map((child) => (
                <TreeNodeComponent
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  onNodeClick={onNodeClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function KnowledgeTree({
  nodes,
  title = "知识图谱",
  onNodeClick,
  className,
}: KnowledgeTreeProps) {
  const totalNodes = (function count(arr: TreeNode[]): number {
    return arr.reduce((s, n) => s + 1 + (n.children ? count(n.children) : 0), 0);
  })(nodes);

  const masteredCount = (function countMastered(arr: TreeNode[]): number {
    return arr.reduce(
      (s, n) => s + (n.mastered ? 1 : 0) + (n.children ? countMastered(n.children) : 0),
      0
    );
  })(nodes);

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <GitBranch className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {masteredCount}/{totalNodes} 已掌握
        </span>
      </div>
      <div className="flex flex-col gap-0.5 overflow-y-auto p-3">
        {nodes.map((node) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            onNodeClick={onNodeClick}
          />
        ))}
      </div>
    </div>
  );
}
