import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db/prisma";
import { getModelAdapter } from "@/lib/agent/model-adapter";

const TIMEOUT_MS = 30000;

const actionToRole: Record<string, string> = {
  teach: "tutor",
  explain: "tutor",
  example: "tutor",
  simplify: "tutor",
  quiz: "exam",
  review: "memory",
  debate: "debate",
};

const defaultPrompts: Record<string, string> = {
  teach: "你是一位专业的AI导师，请根据主题进行深入浅出的中文教学讲解。",
  explain: "你是一位善于解释概念的AI导师，请用通俗易懂的中文解释以下概念。",
  example: "你是一位注重实践的AI导师，请为以下主题提供具体的中文示例。",
  simplify: "你是一位擅长化繁为简的AI导师，请将以下内容简化为易于理解的中文形式。",
  quiz: "你是一位经验丰富的AI出题教师，请根据以下主题生成中文测验题目。",
  review: "你是一位负责的AI学习助手，请对以下内容进行中文复习总结。",
  debate: "你是一位专业的AI辩论导师，请围绕以下辩题进行中文辩论分析，以JSON格式返回。",
};

async function callAI(action: string, content: string, topic?: string): Promise<string> {
  const adapter = await getModelAdapter();
  const prompt = await prisma.promptTemplate.findFirst({
    where: { action, isActive: true },
  });

  const systemPrompt = prompt?.systemPrompt || defaultPrompts[action] || defaultPrompts.teach;
  const userMessage = topic ? `主题：${topic}\n\n用户问题：${content}` : content;

  if (action === "debate") {
    const structuredPrompt = `${systemPrompt}\n\n请严格以JSON格式返回，格式如下：\n{"pro": [{"point": "论点", "evidence": "证据"}], "con": [{"point": "论点", "evidence": "证据"}], "summary": "总结评价"}`;
    
    const result = await Promise.race([
      adapter.generateStructured<{ pro: Array<{ point: string; evidence: string }>; con: Array<{ point: string; evidence: string }>; summary: string }>(
        userMessage,
        structuredPrompt,
        { systemPrompt }
      ),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("AI响应超时")), TIMEOUT_MS)),
    ]);
    
    return JSON.stringify(result);
  }

  const result = await Promise.race([
    adapter.generate(userMessage, { systemPrompt }),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("AI响应超时")), TIMEOUT_MS)),
  ]);

  return result;
}

function generateFallbackResponse(action: string, content: string): string {
  const fallbacks: Record<string, string> = {
    teach: `## ${content} 的教学讲解\n\n### 核心概念\n${content}是一个重要的知识点。让我们从基础开始理解：\n\n**定义**：${content}指的是...\n\n**关键要点**：\n- 理解基础原理\n- 掌握实际应用\n- 了解常见误区\n\n建议你先理解基本概念，然后通过实践加深理解。有什么不清楚的地方可以继续提问！`,
    explain: `## ${content} 详解\n\n简单来说，${content}可以从以下几个维度来理解：\n\n1. **基本含义**：...\n2. **工作原理**：...\n3. **实际意义**：...\n\n建议你通过实际例子来加深理解，需要我提供更多例子吗？`,
    example: `## ${content} 的实际示例\n\n### 示例 1：基础应用\n...\n\n### 示例 2：进阶应用\n...\n\n建议你尝试自己动手实践这些示例，有问题随时提问！`,
    simplify: `## ${content} 简化版\n\n**一句话概括**：...\n\n**核心要点**：\n1. ...\n2. ...\n3. ...\n\n需要我进一步解释某个要点吗？`,
    quiz: `## 关于 ${content} 的测验\n\n**第1题**：以下哪个选项正确描述了${content}的核心概念？\nA. ...\nB. ...\nC. ...\nD. ...\n\n**答案**：B\n**解析**：...\n\n准备好继续下一题了吗？`,
    review: `## ${content} 复习总结\n\n### 核心知识点回顾\n1. ...\n2. ...\n3. ...\n\n### 重点难点\n- ...\n\n### 建议复习方向\n- ...\n\n复习完成！建议你继续练习巩固。`,
    debate: `{"pro":[{"point":"支持${content}的理由一","evidence":"相关数据和研究表明..."}],"con":[{"point":"反对${content}的理由一","evidence":"从另一个角度来看..."}],"summary":"这是一个值得深入讨论的话题，双方都有合理的论据。建议你思考：在什么条件下支持方更有道理？在什么条件下反对方更有道理？"}`,
  };
  return fallbacks[action] || fallbacks.teach;
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "sessionId 不能为空" } },
        { status: 400 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "会话不存在" } },
        { status: 404 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role,
        agentRole: m.agentRole || undefined,
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Agent history error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "获取历史消息失败" } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, content, action = "teach", topic } = body;

    if (!sessionId || !content) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "sessionId 和 content 不能为空" } },
        { status: 400 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { topic: true },
    });

    if (!session) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "会话不存在" } },
        { status: 404 }
      );
    }

    const agentRole = actionToRole[action] || "tutor";

    const userMessage = await prisma.message.create({
      data: {
        id: uuidv4(),
        sessionId,
        role: "user",
        content,
      },
    });

    let agentResponse: string;
    let isAI = false;

    try {
      agentResponse = await callAI(action, content, topic || session.topic?.name);
      isAI = true;
    } catch (aiError) {
      const errorMessage = aiError instanceof Error ? aiError.message : "AI调用失败";
      
      if (errorMessage.includes("超时")) {
        return NextResponse.json(
          { error: { code: "AI_TIMEOUT", message: "AI响应超时，请稍后重试" } },
          { status: 504 }
        );
      }

      agentResponse = generateFallbackResponse(action, content);
    }

    const agentMessage = await prisma.message.create({
      data: {
        id: uuidv4(),
        sessionId,
        role: "agent",
        agentRole,
        content: agentResponse,
      },
    });

    return NextResponse.json({
      userMessage: {
        id: userMessage.id,
        role: "user",
        content: userMessage.content,
        createdAt: userMessage.createdAt.toISOString(),
      },
      agentMessage: {
        id: agentMessage.id,
        role: "agent",
        agentRole,
        content: agentMessage.content,
        createdAt: agentMessage.createdAt.toISOString(),
      },
      isAI,
    });
  } catch (error) {
    console.error("Agent interaction error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "处理请求时发生错误，请重试" } },
      { status: 500 }
    );
  }
}
