import { MasteryLevel } from "./index";

export interface LearningPath {
  id: string;
  name: string;
  topics: { topicId: string; order: number; completed: boolean }[];
  progress: number;
}

export interface ReviewCard {
  id: string;
  front: string;
  back: string;
  mastery: MasteryLevel;
  nextReview: Date;
  topicName: string;
}

export interface DashboardStats {
  totalSessions: number;
  totalTopics: number;
  masteredCount: number;
  reviewDueCount: number;
  streakDays: number;
  todayMinutes: number;
}

export interface AnalyticsData {
  masteryDistribution: { name: string; value: number }[];
  weeklyProgress: { day: string; sessions: number; minutes: number }[];
  domainBreakdown: { domain: string; count: number }[];
  recentActivity: { date: string; action: string; topic: string }[];
}
