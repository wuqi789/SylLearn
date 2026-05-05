import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scene = searchParams.get("scene");

    const where = scene ? { scene } : {};
    const templates = await prisma.promptTemplate.findMany({
      where,
      orderBy: [{ scene: "asc" }, { action: "asc" }],
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("PromptTemplate GET error:", error);
    return NextResponse.json({ error: "获取提示词模板失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.action || typeof body.action !== "string" || body.action.trim() === "") {
      return NextResponse.json({ error: "动作类型不能为空" }, { status: 400 });
    }
    if (!body.systemPrompt || typeof body.systemPrompt !== "string" || body.systemPrompt.trim() === "") {
      return NextResponse.json({ error: "系统提示词不能为空" }, { status: 400 });
    }
    if (!["tutor", "debate"].includes(body.scene)) {
      return NextResponse.json({ error: "场景必须为 tutor 或 debate" }, { status: 400 });
    }

    const template = await prisma.promptTemplate.create({
      data: {
        id: uuidv4(),
        action: body.action,
        scene: body.scene,
        systemPrompt: body.systemPrompt,
        description: body.description || "",
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("PromptTemplate POST error:", error);
    return NextResponse.json({ error: "创建提示词模板失败" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "模板 ID 不能为空" }, { status: 400 });
    }

    const existing = await prisma.promptTemplate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "模板不存在" }, { status: 404 });
    }

    const template = await prisma.promptTemplate.update({
      where: { id },
      data: {
        ...(updateData.action !== undefined && { action: updateData.action }),
        ...(updateData.scene !== undefined && { scene: updateData.scene }),
        ...(updateData.systemPrompt !== undefined && { systemPrompt: updateData.systemPrompt }),
        ...(updateData.description !== undefined && { description: updateData.description }),
        ...(updateData.isActive !== undefined && { isActive: updateData.isActive }),
      },
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error("PromptTemplate PUT error:", error);
    return NextResponse.json({ error: "更新提示词模板失败" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "模板 ID 不能为空" }, { status: 400 });
    }

    const existing = await prisma.promptTemplate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "模板不存在" }, { status: 404 });
    }

    await prisma.promptTemplate.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PromptTemplate DELETE error:", error);
    return NextResponse.json({ error: "删除提示词模板失败" }, { status: 500 });
  }
}
