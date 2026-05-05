import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db/prisma";
import { verifyToken } from "@/lib/auth/jwt";

function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return verifyToken(authHeader.slice(7));
}

export async function GET(request: NextRequest) {
  try {
    const payload = getAuthUser(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reviewDue = searchParams.get("reviewDue");

    if (reviewDue === "true") {
      const dueItems = await prisma.reviewPlan.findMany({
        where: {
          userId: payload.userId,
          nextReviewAt: { lte: new Date() },
        },
        include: { memoryItem: true },
        orderBy: { nextReviewAt: "asc" },
      });

      return NextResponse.json({ reviewItems: dueItems });
    }

    const memoryItems = await prisma.memoryItem.findMany({
      where: { userId: payload.userId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ memoryItems });
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

    const { topicId, content, type, mastery } = await request.json();

    if (!topicId || !content || !type) {
      return NextResponse.json(
        { error: "topicId, content, and type are required" },
        { status: 400 }
      );
    }

    const memoryItem = await prisma.memoryItem.create({
      data: {
        id: uuidv4(),
        userId: payload.userId,
        topicId,
        content,
        type,
        mastery: mastery || "needs_review",
      },
    });

    return NextResponse.json({ memoryItem }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = getAuthUser(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, mastery } = await request.json();

    if (!id || !mastery) {
      return NextResponse.json(
        { error: "id and mastery are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.memoryItem.findFirst({
      where: { id, userId: payload.userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Memory item not found" },
        { status: 404 }
      );
    }

    const memoryItem = await prisma.memoryItem.update({
      where: { id },
      data: { mastery },
    });

    return NextResponse.json({ memoryItem });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
