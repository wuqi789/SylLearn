import { BaseAgent } from "./base-agent";
import type { ModelAdapter, ExamOutput, AgentResponse } from "@/types/agent";
import type { AgentRole, MasteryLevel } from "@/types/index";

interface AssessmentResult {
  isCorrect: boolean;
  feedback: string;
  mastery: MasteryLevel;
  score: number;
}

export class ExamAgent extends BaseAgent {
  constructor(adapter: ModelAdapter) {
    super("exam" as AgentRole, adapter);
  }

  async process(input: string, context?: Record<string, unknown>): Promise<AgentResponse> {
    const action = context?.action as string || "generateQuiz";
    if (action === "grade") {
      const result = await this.gradeAnswer(
        context?.question as string || input,
        context?.answer as string || "",
        context?.correctAnswer as string || "",
        context?.explanation as string || ""
      );
      return this.buildResponse(JSON.stringify(result), { data: result });
    }
    const output = await this.generateQuiz(
      input,
      context?.difficulty as number || 3,
      context?.count as number || 5
    );
    this.act();
    this.reflect();
    return this.buildResponse(JSON.stringify(output), { data: output });
  }

  async generateQuiz(skill: string, difficulty: number, count: number): Promise<ExamOutput> {
    const output = await this.thinkStructured<ExamOutput>(
      `为"${skill}"生成${count}道难度为${difficulty}/5的测验题，包含选择题、判断题和开放题`,
      "ExamOutput",
      { topic: skill, difficulty, count }
    );
    return output;
  }

  async gradeAnswer(
    question: string,
    userAnswer: string,
    correctAnswer: string,
    explanation: string
  ): Promise<AssessmentResult> {
    const raw = await this.think(
      `评估学生答案。\n题目：${question}\n正确答案：${correctAnswer}\n学生答案：${userAnswer}\n解释：${explanation}`,
      { topic: question }
    );

    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = correctAnswer.trim().toLowerCase();
    const exactMatch = normalizedUser === normalizedCorrect;
    const containsMatch = normalizedCorrect.includes(normalizedUser) ||
      normalizedUser.includes(normalizedCorrect);

    let isCorrect: boolean;
    let score: number;
    let mastery: MasteryLevel;

    if (exactMatch) {
      isCorrect = true;
      score = 100;
      mastery = "mastered";
    } else if (containsMatch) {
      isCorrect = true;
      score = 75;
      mastery = "fuzzy";
    } else {
      isCorrect = false;
      score = 0;
      mastery = "wrong";
    }

    const feedback = isCorrect
      ? `✅ 正确！${explanation}`
      : `❌ 不正确。正确答案是：${correctAnswer}。${explanation}`;

    return { isCorrect, feedback, mastery, score };
  }
}
