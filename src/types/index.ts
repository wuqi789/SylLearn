export type AgentRole = "planner" | "compiler" | "tutor" | "exam" | "debate" | "memory";

export type MasteryLevel = "mastered" | "fuzzy" | "wrong" | "needs_review";

export type SessionStatus = "active" | "completed" | "archived";

export interface User {
  id: string;
  email: string;
  name: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  topicId: string;
  status: SessionStatus;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  id: string;
  name: string;
  domain: string;
  difficulty: number;
  prerequisites: string[];
  misconceptions: string[];
  learningObjectives: string[];
  createdAt: Date;
}

export interface Skill {
  id: string;
  topicId: string;
  concepts: SkillNode[];
  examples: SkillNode[];
  analogies: SkillNode[];
  exercises: SkillNode[];
  reviewCards: SkillNode[];
  assessmentCriteria: string;
  createdAt: Date;
}

export interface SkillNode {
  id: string;
  skillId: string;
  type: "concept" | "example" | "analogy" | "exercise" | "review_card" | "prerequisite" | "misconception";
  title: string;
  content: string;
  difficulty: number;
  order: number;
}

export interface Message {
  id: string;
  sessionId: string;
  role: "user" | "agent";
  agentRole?: AgentRole;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface Assessment {
  id: string;
  sessionId: string;
  userId: string;
  skillNodeId: string;
  question: string;
  answer: string;
  userAnswer: string;
  isCorrect: boolean;
  feedback: string;
  mastery: MasteryLevel;
  createdAt: Date;
}

export interface MemoryItem {
  id: string;
  userId: string;
  topicId: string;
  content: string;
  type: "preference" | "error_pattern" | "mastery" | "note";
  mastery: MasteryLevel;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewPlan {
  id: string;
  userId: string;
  memoryItemId: string;
  nextReviewAt: Date;
  interval: number;
  easeFactor: number;
  repetitions: number;
  createdAt: Date;
}

export interface DebateThread {
  id: string;
  sessionId: string;
  topicId: string;
  title: string;
  status: "active" | "concluded";
  summary?: string;
  createdAt: Date;
}

export interface DebatePosition {
  id: string;
  threadId: string;
  role: string;
  stance: string;
  arguments: string[];
  evidence: string[];
  order: number;
}

export interface MarketplacePackage {
  id: string;
  title: string;
  description: string;
  author: string;
  domain: string;
  difficulty: number;
  tags: string[];
  prerequisites: string[];
  objectives: string[];
  downloads: number;
  rating: number;
  createdAt: Date;
}
