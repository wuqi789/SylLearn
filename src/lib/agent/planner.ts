import { randomUUID } from "crypto";
import { BaseAgent } from "./base-agent";
import type { ModelAdapter, AgentResponse } from "@/types/agent";
import type { AgentRole } from "@/types/index";
import type { LearningPath } from "@/types/learning";

interface PlannerPathResponse {
  learningPath: {
    name: string;
    topics: { topicId: string; order: number; completed: boolean; name: string }[];
    estimatedHours: number;
    difficulty: number;
  };
  recommendations: string[];
}

interface PrerequisiteChain {
  topic: string;
  prerequisites: { name: string; importance: "required" | "recommended" | "optional" }[];
  depth: number;
}

export class PlannerAgent extends BaseAgent {
  constructor(adapter: ModelAdapter) {
    super("planner" as AgentRole, adapter);
  }

  async process(input: string, context?: Record<string, unknown>): Promise<AgentResponse> {
    const action = context?.action as string || "plan";
    let result: unknown;

    if (action === "recommend") {
      result = await this.recommendNext(context?.userId as string || "anonymous");
    } else if (action === "prerequisites") {
      result = await this.analyzePrerequisites(input);
    } else {
      const goals = context?.goals as string[] || [input];
      result = await this.planLearningPath(context?.userId as string || "anonymous", goals);
    }

    this.act();
    this.reflect();
    return this.buildResponse(JSON.stringify(result), { data: result });
  }

  async planLearningPath(userId: string, goals: string[]): Promise<LearningPath> {
    const goalsStr = goals.join("、");
    const response = await this.thinkStructured<PlannerPathResponse>(
      `为用户${userId}规划学习路径，目标是掌握：${goalsStr}。请提供结构化的学习计划和建议。`,
      "LearningPath",
      { topic: goalsStr }
    );

    return {
      id: randomUUID(),
      name: response.learningPath.name,
      topics: response.learningPath.topics.map((t, i) => ({
        topicId: t.topicId,
        order: t.order || i + 1,
        completed: t.completed,
      })),
      progress: 0,
    };
  }

  async recommendNext(userId: string): Promise<{
    recommended: { topicId: string; reason: string; priority: number }[];
  }> {
    const response = await this.think(
      `基于用户${userId}的学习历史，推荐下一步应该学习的内容`,
      { topic: "学习推荐" }
    );

    return {
      recommended: [
        { topicId: "next-1", reason: "基础前置知识，建议优先学习", priority: 1 },
        { topicId: "next-2", reason: "当前领域的核心内容", priority: 2 },
        { topicId: "next-3", reason: "进阶拓展，加深理解", priority: 3 },
      ],
    };
  }

  async analyzePrerequisites(topic: string): Promise<PrerequisiteChain> {
    const response = await this.thinkStructured<PrerequisiteChain>(
      `分析"${topic}"的前置知识链，包括必须掌握的、建议了解的和可选的前置知识`,
      "PrerequisiteChain",
      { topic }
    );
    return response;
  }
}
