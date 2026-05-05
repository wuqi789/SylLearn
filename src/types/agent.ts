import { AgentRole } from "./index";

export interface AgentMessage {
  id: string;
  role: AgentRole;
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface AgentState {
  id: string;
  role: AgentRole;
  status: "idle" | "thinking" | "acting" | "reflecting";
  context: Record<string, unknown>;
  history: AgentMessage[];
}

export interface ModelAdapter {
  generate(prompt: string, context?: Record<string, unknown>): Promise<string>;
  generateStructured<T>(prompt: string, schema: string, context?: Record<string, unknown>): Promise<T>;
}

export interface CompilerOutput {
  topicName: string;
  domain: string;
  difficulty: number;
  concepts: { title: string; content: string }[];
  prerequisites: { title: string; content: string }[];
  misconceptions: { title: string; content: string }[];
  examples: { title: string; content: string }[];
  exercises: { question: string; type: string; options?: string[]; answer: string }[];
  reviewCards: { front: string; back: string }[];
  assessmentCriteria: string;
}

export interface TutorResponse {
  content: string;
  action?: "explain" | "question" | "example" | "simplify" | "challenge";
  followUp?: string;
}

export interface ExamOutput {
  questions: {
    question: string;
    type: "multiple_choice" | "true_false" | "open_ended";
    options?: string[];
    answer: string;
    explanation: string;
  }[];
}

export interface DebateOutput {
  positions: {
    role: string;
    stance: string;
    arguments: string[];
    evidence: string[];
  }[];
  controversy: string;
  summary?: string;
}

export interface AgentResponse {
  message: AgentMessage;
  data?: unknown;
}
