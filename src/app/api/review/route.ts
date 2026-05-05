import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db/prisma";
import { verifyToken } from "@/lib/auth/jwt";

function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return verifyToken(authHeader.slice(7));
}

function calculateNextReview(
  quality: number,
  repetitions: number,
  easeFactor: number,
  interval: number
) {
  let newRepetitions = repetitions;
  let newEaseFactor = easeFactor;
  let newInterval = interval;

  if (quality < 3) {
    newRepetitions = 0;
    newInterval = 1;
  } else {
    newRepetitions = repetitions + 1;
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
  }

  newEaseFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  return {
    repetitions: newRepetitions,
    easeFactor: newEaseFactor,
    interval: newInterval,
    nextReviewAt: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000),
  };
}

export async function GET(request: NextRequest) {
  try {
    const payload = getAuthUser(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dueReviews = await prisma.reviewPlan.findMany({
      where: {
        userId: payload.userId,
        nextReviewAt: { lte: new Date() },
      },
      include: { memoryItem: true },
      orderBy: { nextReviewAt: "asc" },
    });

    return NextResponse.json({ reviews: dueReviews });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getAuthUser(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reviewId, quality } = await request.json();

    if (!reviewId || quality === undefined) {
      return NextResponse.json(
        { error: "reviewId and quality are required" },
        { status: 400 }
      );
    }

    if (quality < 0 || quality > 5) {
      return NextResponse.json(
        { error: "quality must be between 0 and 5" },
        { status: 400 }
      );
    }

    const reviewPlan = await prisma.reviewPlan.findFirst({
      where: { id: reviewId, userId: payload.userId },
    });

    if (!reviewPlan) {
      return NextResponse.json(
        { error: "Review plan not found" },
        { status: 404 }
      );
    }

    const { repetitions, easeFactor, interval, nextReviewAt } =
      calculateNextReview(
        quality,
        reviewPlan.repetitions,
        reviewPlan.easeFactor,
        reviewPlan.interval
      );

    const updated = await prisma.reviewPlan.update({
      where: { id: reviewId },
      data: {
        repetitions,
        easeFactor,
        interval,
        nextReviewAt,
      },
      include: { memoryItem: true },
    });

    let mastery: string;
    if (quality >= 4) {
      mastery = "mastered";
    } else if (quality >= 3) {
      mastery = "fuzzy";
    } else {
      mastery = "wrong";
    }

    await prisma.memoryItem.update({
      where: { id: reviewPlan.memoryItemId },
      data: { mastery },
    });

    return NextResponse.json({ reviewPlan: updated });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
