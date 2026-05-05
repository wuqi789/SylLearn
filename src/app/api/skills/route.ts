import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db/prisma";
import { verifyToken } from "@/lib/auth/jwt";

function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return verifyToken(authHeader.slice(7));
}

function generateMockSkillNodes(topicName: string) {
  return [
    {
      id: uuidv4(),
      type: "concept",
      title: `Core concepts of ${topicName}`,
      content: `Understanding the fundamental principles and key ideas behind ${topicName}.`,
      difficulty: 1,
      order: 0,
    },
    {
      id: uuidv4(),
      type: "example",
      title: `Practical example: ${topicName}`,
      content: `A real-world application demonstrating how ${topicName} works in practice.`,
      difficulty: 2,
      order: 1,
    },
    {
      id: uuidv4(),
      type: "analogy",
      title: `${topicName} explained simply`,
      content: `Think of ${topicName} like a well-organized library where each book represents a key concept.`,
      difficulty: 1,
      order: 2,
    },
    {
      id: uuidv4(),
      type: "exercise",
      title: `Practice: ${topicName}`,
      content: `Apply your knowledge of ${topicName} to solve this challenge.`,
      difficulty: 3,
      order: 3,
    },
    {
      id: uuidv4(),
      type: "review_card",
      title: `Review: ${topicName}`,
      content: `Quick review card for ${topicName} fundamentals.`,
      difficulty: 1,
      order: 4,
    },
  ];
}

export async function GET(request: NextRequest) {
  try {
    const payload = getAuthUser(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get("topicId");

    if (!topicId) {
      return NextResponse.json(
        { error: "topicId is required" },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.findFirst({
      where: { topicId },
      include: { skillNodes: true },
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ skill });
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

    const { topicId } = await request.json();
    if (!topicId) {
      return NextResponse.json(
        { error: "topicId is required" },
        { status: 400 }
      );
    }

    const topic = await prisma.topic.findUnique({ where: { id: topicId } });
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const existingSkill = await prisma.skill.findFirst({
      where: { topicId },
    });
    if (existingSkill) {
      const skillWithNodes = await prisma.skill.findUnique({
        where: { id: existingSkill.id },
        include: { skillNodes: true },
      });
      return NextResponse.json({ skill: skillWithNodes });
    }

    const skillNodes = generateMockSkillNodes(topic.name);
    const skillId = uuidv4();

    const skill = await prisma.skill.create({
      data: {
        id: skillId,
        topicId,
        concepts: JSON.stringify([skillNodes[0].id]),
        examples: JSON.stringify([skillNodes[1].id]),
        analogies: JSON.stringify([skillNodes[2].id]),
        exercises: JSON.stringify([skillNodes[3].id]),
        reviewCards: JSON.stringify([skillNodes[4].id]),
        assessmentCriteria: `Assessment criteria for ${topic.name}`,
        skillNodes: {
          create: skillNodes.map((node) => ({
            id: node.id,
            type: node.type,
            title: node.title,
            content: node.content,
            difficulty: node.difficulty,
            order: node.order,
          })),
        },
      },
      include: { skillNodes: true },
    });

    return NextResponse.json({ skill }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
