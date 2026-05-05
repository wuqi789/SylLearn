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

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return NextResponse.json(
        { error: "用户不存在，请重新登录" },
        { status: 401 }
      );
    }

    const sessions = await prisma.session.findMany({
      where: { userId: payload.userId },
      include: { topic: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("GET /api/sessions error:", error);
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

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return NextResponse.json(
        { error: "用户不存在，请重新登录" },
        { status: 401 }
      );
    }

    const { topic } = await request.json();
    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    let existingTopic = await prisma.topic.findFirst({
      where: { name: topic },
    });

    if (!existingTopic) {
      existingTopic = await prisma.topic.create({
        data: {
          id: uuidv4(),
          name: topic,
          domain: "general",
          difficulty: 1,
        },
      });
    }

    const session = await prisma.session.create({
      data: {
        id: uuidv4(),
        userId: payload.userId,
        topicId: existingTopic.id,
        title: topic,
        status: "active",
      },
      include: { topic: true },
    });

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    console.error("POST /api/sessions error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
