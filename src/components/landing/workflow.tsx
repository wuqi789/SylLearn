"use client";

import { motion } from "framer-motion";
import {
  FileInput,
  Cpu,
  BookOpen,
  ClipboardCheck,
  RotateCcw,
} from "lucide-react";

const steps = [
  { icon: FileInput, label: "输入知识", description: "提交任意知识点或主题" },
  { icon: Cpu, label: "系统编译", description: "AI 自动结构化知识体系" },
  { icon: BookOpen, label: "Agent 教学", description: "多智能体协作教学" },
  {
    icon: ClipboardCheck,
    label: "测评反馈",
    description: "自适应测评与即时反馈",
  },
  { icon: RotateCcw, label: "间隔复习", description: "长期记忆巩固复习" },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const step = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Workflow() {
  return (
    <section id="workflow" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <motion.h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            学习工作流
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            从输入到掌握，全自动 Agent 协作流水线
          </motion.p>
        </div>

        <motion.div
          className="relative"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="hidden sm:block absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border" />

          <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.label}
                variants={step}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex size-14 items-center justify-center rounded-full border-2 border-primary/20 bg-background shadow-sm">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <s.icon className="size-5" />
                  </div>
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-sm font-semibold">{s.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {s.description}
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute -right-4 top-7 hidden text-muted-foreground sm:block">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-primary/40"
                    >
                      <path
                        d="M6 3l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
