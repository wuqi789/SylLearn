import { MockAdapter } from "./mock-adapter";
import { CompilerAgent } from "./compiler";
import { TutorAgent } from "./tutor";
import { ExamAgent } from "./exam";
import { DebateAgent } from "./debate";
import { MemoryAgent } from "./memory";
import { PlannerAgent } from "./planner";
import type { ModelAdapter, CompilerOutput, TutorResponse, ExamOutput, DebateOutput, AgentResponse } from "@/types/agent";
import type { MemoryItem, MasteryLevel } from "@/types/index";
import type { LearningPath } from "@/types/learning";

interface LearningPathResponse {
  recommended: { topicId: string; reason: string; priority: number }[];
}

export class AgentOrchestrator {
  private compiler: CompilerAgent;
  private tutor: TutorAgent;
  private exam: ExamAgent;
  private debate: DebateAgent;
  private memory: MemoryAgent;
  private planner: PlannerAgent;
  private adapter: ModelAdapter;

  constructor(adapter?: ModelAdapter) {
    this.adapter = adapter || new MockAdapter();
    this.compiler = new CompilerAgent(this.adapter);
    this.tutor = new TutorAgent(this.adapter);
    this.exam = new ExamAgent(this.adapter);
    this.debate = new DebateAgent(this.adapter);
    this.memory = new MemoryAgent(this.adapter);
    this.planner = new PlannerAgent(this.adapter);
  }

  async compileTopic(topic: string): Promise<CompilerOutput> {
    const response = await this.compiler.process(topic, { topic });
    return response.data as CompilerOutput;
  }

  async startTeaching(
    sessionId: string,
    skill: string,
    userMessage: string = "我想学习这个主题"
  ): Promise<TutorResponse> {
    const response = await this.tutor.process(userMessage, {
      skill,
      sessionId,
      history: this.tutor.getHistory(),
    });
    return response.data as TutorResponse;
  }

  async generateQuiz(
    sessionId: string,
    skill: string,
    difficulty: number = 3,
    count: number = 5
  ): Promise<ExamOutput> {
    const response = await this.exam.process(skill, {
      sessionId,
      difficulty,
      count,
    });
    return response.data as ExamOutput;
  }

  async startDebate(sessionId: string, topic: string): Promise<DebateOutput> {
    const response = await this.debate.process(topic, { sessionId });
    return response.data as DebateOutput;
  }

  async recordMemory(
    userId: string,
    topicId: string,
    mastery: MasteryLevel,
    content: string
  ): Promise<MemoryItem> {
    const response = await this.memory.process(content, {
      action: "record",
      userId,
      topicId,
      mastery,
    });
    return response.data as MemoryItem;
  }

  async planPath(userId: string, goals: string[]): Promise<LearningPath> {
    const response = await this.planner.process(goals.join("、"), {
      action: "plan",
      userId,
      goals,
    });
    return response.data as LearningPath;
  }

  async recommendNext(userId: string): Promise<LearningPathResponse> {
    const response = await this.planner.process("推荐学习内容", {
      action: "recommend",
      userId,
    });
    return response.data as LearningPathResponse;
  }

  async analyzeMemory(userId: string, topic: string): Promise<unknown> {
    const response = await this.memory.process(topic, {
      action: "analyze",
      userId,
    });
    return response.data;
  }

  async gradeAnswer(
    question: string,
    userAnswer: string,
    correctAnswer: string,
    explanation: string
  ): Promise<AgentResponse> {
    return this.exam.process(question, {
      action: "grade",
      question,
      answer: userAnswer,
      correctAnswer,
      explanation,
    });
  }

  async generateDebateResponse(
    thread: { role: string; content: string }[],
    userQuestion: string
  ): Promise<string> {
    const messages = thread.map((m) => ({
      id: "",
      role: "agent" as const,
      content: m.content,
      timestamp: new Date(),
      metadata: { role: m.role },
    }));
    const response = await this.debate.process(userQuestion, {
      action: "respond",
      thread: messages,
    });
    return response.message.content;
  }

  async summarizeDebate(thread: { role: string; content: string }[]): Promise<string> {
    const messages = thread.map((m) => ({
      id: "",
      role: "agent" as const,
      content: m.content,
      timestamp: new Date(),
      metadata: { role: m.role },
    }));
    const response = await this.debate.process("总结辩论", {
      action: "summary",
      thread: messages,
    });
    return response.message.content;
  }
}
