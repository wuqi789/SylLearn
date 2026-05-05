import { prisma } from "@/lib/db/prisma";
import type { MemoryItem, ReviewPlan, MasteryLevel } from "@/types/index";
import { calculateNextReview } from "./spaced-repetition";

interface MemoryRecord {
  id: string;
  userId: string;
  topicId: string;
  content: string;
  type: string;
  mastery: string;
  metadata: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ReviewPlanRecord {
  id: string;
  userId: string;
  memoryItemId: string;
  nextReviewAt: Date;
  interval: number;
  easeFactor: number;
  repetitions: number;
  createdAt: Date;
}

interface ReviewPlanWithMemory extends ReviewPlanRecord {
  memoryItem: MemoryRecord;
}

export class MemoryStore {
  async save(data: {
    userId: string;
    topicId: string;
    content: string;
    type: string;
    mastery: MasteryLevel;
    metadata?: Record<string, unknown>;
  }): Promise<MemoryItem> {
    const record = await prisma.memoryItem.create({
      data: {
        userId: data.userId,
        topicId: data.topicId,
        content: data.content,
        type: data.type,
        mastery: data.mastery,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });

    return this.mapToMemoryItem(record as MemoryRecord);
  }

  async getByUser(userId: string): Promise<MemoryItem[]> {
    const records = await prisma.memoryItem.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    return (records as MemoryRecord[]).map((r) => this.mapToMemoryItem(r));
  }

  async getByTopic(userId: string, topicId: string): Promise<MemoryItem[]> {
    const records = await prisma.memoryItem.findMany({
      where: { userId, topicId },
      orderBy: { updatedAt: "desc" },
    });
    return (records as MemoryRecord[]).map((r) => this.mapToMemoryItem(r));
  }

  async getReviewDue(userId: string): Promise<(ReviewPlan & { memoryItem: MemoryItem })[]> {
    const now = new Date();
    const plans = await prisma.reviewPlan.findMany({
      where: {
        userId,
        nextReviewAt: { lte: now },
      },
      include: { memoryItem: true },
      orderBy: { nextReviewAt: "asc" },
    });

    return (plans as unknown as ReviewPlanWithMemory[]).map((p) => ({
      ...this.mapToReviewPlan(p),
      memoryItem: this.mapToMemoryItem(p.memoryItem),
    }));
  }

  async updateMastery(
    memoryItemId: string,
    quality: number
  ): Promise<{ memoryItem: MemoryItem; reviewPlan: ReviewPlan }> {
    const existingPlan = await prisma.reviewPlan.findFirst({
      where: { memoryItemId },
      orderBy: { createdAt: "desc" },
    });

    const currentInterval = (existingPlan as ReviewPlanRecord | null)?.interval ?? 1;
    const currentEaseFactor = (existingPlan as ReviewPlanRecord | null)?.easeFactor ?? 2.5;
    const currentRepetitions = (existingPlan as ReviewPlanRecord | null)?.repetitions ?? 0;

    const result = calculateNextReview(quality, currentRepetitions, currentEaseFactor, currentInterval);

    let mastery: MasteryLevel;
    if (quality >= 4) mastery = "mastered";
    else if (quality >= 3) mastery = "fuzzy";
    else if (quality >= 1) mastery = "wrong";
    else mastery = "needs_review";

    const updatedItem = await prisma.memoryItem.update({
      where: { id: memoryItemId },
      data: { mastery },
    });

    const newPlan = await prisma.reviewPlan.create({
      data: {
        userId: (updatedItem as MemoryRecord).userId,
        memoryItemId,
        nextReviewAt: result.nextReviewAt,
        interval: result.nextInterval,
        easeFactor: result.easeFactor,
        repetitions: result.repetitions,
      },
    });

    return {
      memoryItem: this.mapToMemoryItem(updatedItem as MemoryRecord),
      reviewPlan: this.mapToReviewPlan(newPlan as ReviewPlanRecord),
    };
  }

  async getById(id: string): Promise<MemoryItem | null> {
    const record = await prisma.memoryItem.findUnique({ where: { id } });
    return record ? this.mapToMemoryItem(record as MemoryRecord) : null;
  }

  private mapToMemoryItem(record: MemoryRecord): MemoryItem {
    return {
      id: record.id,
      userId: record.userId,
      topicId: record.topicId,
      content: record.content,
      type: record.type as MemoryItem["type"],
      mastery: record.mastery as MasteryLevel,
      metadata: record.metadata ? JSON.parse(record.metadata) : undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private mapToReviewPlan(record: ReviewPlanRecord): ReviewPlan {
    return {
      id: record.id,
      userId: record.userId,
      memoryItemId: record.memoryItemId,
      nextReviewAt: record.nextReviewAt,
      interval: record.interval,
      easeFactor: record.easeFactor,
      repetitions: record.repetitions,
      createdAt: record.createdAt,
    };
  }
}
