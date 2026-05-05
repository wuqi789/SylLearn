import { randomUUID } from "crypto";
import { BaseAgent } from "./base-agent";
import type { ModelAdapter, AgentResponse } from "@/types/agent";
import type { AgentRole, MemoryItem, ReviewPlan, MasteryLevel } from "@/types/index";
import { calculateNextReview } from "@/lib/memory/spaced-repetition";

interface MasteryAssessment {
  level: MasteryLevel;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
}

interface ReviewSuggestion {
  priority: "high" | "medium" | "low";
  recommendedAction: string;
  nextReviewDays: number;
}

interface MemoryAnalysis {
  masteryAssessment: MasteryAssessment;
  reviewSuggestion: ReviewSuggestion;
}

interface ErrorPattern {
  topic: string;
  frequency: number;
  description: string;
  suggestion: string;
}

export class MemoryAgent extends BaseAgent {
  constructor(adapter: ModelAdapter) {
    super("memory" as AgentRole, adapter);
  }

  async process(input: string, context?: Record<string, unknown>): Promise<AgentResponse> {
    const action = context?.action as string || "analyze";
    let result: unknown;

    if (action === "record") {
      const item = await this.recordLearning(
        context?.userId as string || "anonymous",
        context?.topicId as string || "general",
        context?.mastery as MasteryLevel || "needs_review",
        input
      );
      result = item;
    } else if (action === "getReviewDue") {
      const reviews = await this.getReviewDue(context?.userId as string || "anonymous");
      result = reviews;
    } else if (action === "updateMastery") {
      const updated = await this.updateMastery(
        context?.memoryItemId as string || "",
        context?.quality as number || 3
      );
      result = updated;
    } else if (action === "analyzePatterns") {
      const patterns = await this.analyzePatterns(context?.userId as string || "anonymous");
      result = patterns;
    } else {
      const analysis = await this.thinkStructured<MemoryAnalysis>(
        `分析用户在"${input}"上的学习状态，评估掌握程度并给出复习建议`,
        "mastery",
        { topic: input }
      );
      result = analysis;
    }

    this.act();
    this.reflect();
    return this.buildResponse(JSON.stringify(result), { data: result });
  }

  async recordLearning(
    userId: string,
    topicId: string,
    mastery: MasteryLevel,
    content: string
  ): Promise<MemoryItem> {
    const now = new Date();
    const item: MemoryItem = {
      id: randomUUID(),
      userId,
      topicId,
      content,
      type: "mastery",
      mastery,
      createdAt: now,
      updatedAt: now,
    };
    return item;
  }

  async getReviewDue(userId: string): Promise<ReviewPlan[]> {
    const now = new Date();
    const mockPlans: ReviewPlan[] = [
      {
        id: randomUUID(),
        userId,
        memoryItemId: randomUUID(),
        nextReviewAt: now,
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        createdAt: now,
      },
    ];
    return mockPlans;
  }

  async updateMastery(memoryItemId: string, quality: number): Promise<{
    memoryItemId: string;
    reviewPlan: { nextInterval: number; easeFactor: number; repetitions: number; nextReviewAt: Date };
    mastery: MasteryLevel;
  }> {
    const result = calculateNextReview(quality, 0, 2.5, 1);
    let mastery: MasteryLevel;
    if (quality >= 4) {
      mastery = "mastered";
    } else if (quality >= 3) {
      mastery = "fuzzy";
    } else if (quality >= 1) {
      mastery = "wrong";
    } else {
      mastery = "needs_review";
    }
    return { memoryItemId, reviewPlan: result, mastery };
  }

  async analyzePatterns(userId: string): Promise<ErrorPattern[]> {
    const patterns = await this.think(
      `分析用户${userId}的学习错误模式，识别高频错误类型和改进建议`,
      { topic: "错误模式分析" }
    );

    return [
      {
        topic: "概念混淆",
        frequency: 3,
        description: "用户容易混淆相似概念的定义和应用场景",
        suggestion: "建议使用对比表格梳理相似概念的异同",
      },
      {
        topic: "应用困难",
        frequency: 2,
        description: "用户理解理论但难以应用到实际问题",
        suggestion: "建议增加案例练习，从具体场景出发理解抽象概念",
      },
    ];
  }
}
