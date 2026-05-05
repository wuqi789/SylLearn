import { prisma } from "@/lib/db/prisma";
import type { ReviewPlan } from "@/types/index";
import { calculateNextReview } from "./spaced-repetition";

export class ReviewScheduler {
  async scheduleReview(userId: string, memoryItemId: string): Promise<ReviewPlan> {
    const result = calculateNextReview(3, 0, 2.5, 1);

    const plan = await prisma.reviewPlan.create({
      data: {
        userId,
        memoryItemId,
        nextReviewAt: result.nextReviewAt,
        interval: result.nextInterval,
        easeFactor: result.easeFactor,
        repetitions: result.repetitions,
      },
    });

    return this.mapToReviewPlan(plan);
  }

  async getDueReviews(userId: string): Promise<ReviewPlan[]> {
    const now = new Date();
    const plans = await prisma.reviewPlan.findMany({
      where: {
        userId,
        nextReviewAt: { lte: now },
      },
      orderBy: { nextReviewAt: "asc" },
    });

    return plans.map(this.mapToReviewPlan);
  }

  async completeReview(reviewId: string, quality: number): Promise<ReviewPlan> {
    const existing = await prisma.reviewPlan.findUnique({
      where: { id: reviewId },
    });

    if (!existing) {
      throw new Error(`Review plan ${reviewId} not found`);
    }

    const result = calculateNextReview(
      quality,
      existing.repetitions,
      existing.easeFactor,
      existing.interval
    );

    const updated = await prisma.reviewPlan.update({
      where: { id: reviewId },
      data: {
        nextReviewAt: result.nextReviewAt,
        interval: result.nextInterval,
        easeFactor: result.easeFactor,
        repetitions: result.repetitions,
      },
    });

    return this.mapToReviewPlan(updated);
  }

  async getUpcomingReviews(userId: string, days: number = 7): Promise<ReviewPlan[]> {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + days);

    const plans = await prisma.reviewPlan.findMany({
      where: {
        userId,
        nextReviewAt: {
          gte: now,
          lte: endDate,
        },
      },
      orderBy: { nextReviewAt: "asc" },
    });

    return plans.map(this.mapToReviewPlan);
  }

  async cancelReview(reviewId: string): Promise<void> {
    await prisma.reviewPlan.delete({ where: { id: reviewId } });
  }

  private mapToReviewPlan(record: {
    id: string;
    userId: string;
    memoryItemId: string;
    nextReviewAt: Date;
    interval: number;
    easeFactor: number;
    repetitions: number;
    createdAt: Date;
  }): ReviewPlan {
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
