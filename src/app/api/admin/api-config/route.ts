import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db/prisma";

const VALID_PROVIDERS = ["openai", "deepseek", "xiaomi-mimo"];

function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validateConfig(data: Record<string, unknown>): string | null {
  if (!data.apiKey || typeof data.apiKey !== "string" || data.apiKey.trim() === "") {
    return "API 密钥不能为空";
  }
  if (!data.endpoint || typeof data.endpoint !== "string" || !validateUrl(data.endpoint)) {
    return "请求地址必须为合法 URL";
  }
  if (data.temperature !== undefined) {
    const temp = Number(data.temperature);
    if (isNaN(temp) || temp < 0 || temp > 2) {
      return "Temperature 必须在 0-2 范围内";
    }
  }
  if (data.maxTokens !== undefined) {
    const tokens = Number(data.maxTokens);
    if (isNaN(tokens) || tokens <= 0 || !Number.isInteger(tokens)) {
      return "Max Tokens 必须为正整数";
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider");

    const where = provider ? { provider } : {};
    const configs = await prisma.apiConfig.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ configs });
  } catch (error) {
    console.error("ApiConfig GET error:", error);
    return NextResponse.json({ error: "获取配置失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationError = validateConfig(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (!VALID_PROVIDERS.includes(body.provider)) {
      return NextResponse.json({ error: "不支持的服务商" }, { status: 400 });
    }

    if (body.isActive) {
      await prisma.apiConfig.updateMany({
        where: { provider: body.provider, isActive: true },
        data: { isActive: false },
      });
    }

    const config = await prisma.apiConfig.create({
      data: {
        id: uuidv4(),
        provider: body.provider,
        apiKey: body.apiKey,
        modelId: body.modelId || "",
        endpoint: body.endpoint,
        maxTokens: body.maxTokens ?? 4096,
        temperature: body.temperature ?? 0.7,
        extraParams: body.extraParams ? JSON.stringify(body.extraParams) : "{}",
        isActive: body.isActive ?? false,
      },
    });

    return NextResponse.json({ config }, { status: 201 });
  } catch (error) {
    console.error("ApiConfig POST error:", error);
    return NextResponse.json({ error: "创建配置失败" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "配置 ID 不能为空" }, { status: 400 });
    }

    const existing = await prisma.apiConfig.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "配置不存在" }, { status: 404 });
    }

    const merged = { ...existing, ...updateData };
    const validationError = validateConfig(merged);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (updateData.isActive) {
      await prisma.apiConfig.updateMany({
        where: { provider: existing.provider, isActive: true, id: { not: id } },
        data: { isActive: false },
      });
    }

    const config = await prisma.apiConfig.update({
      where: { id },
      data: {
        ...(updateData.apiKey !== undefined && { apiKey: updateData.apiKey }),
        ...(updateData.modelId !== undefined && { modelId: updateData.modelId }),
        ...(updateData.endpoint !== undefined && { endpoint: updateData.endpoint }),
        ...(updateData.maxTokens !== undefined && { maxTokens: Number(updateData.maxTokens) }),
        ...(updateData.temperature !== undefined && { temperature: Number(updateData.temperature) }),
        ...(updateData.extraParams !== undefined && { extraParams: typeof updateData.extraParams === "string" ? updateData.extraParams : JSON.stringify(updateData.extraParams) }),
        ...(updateData.isActive !== undefined && { isActive: updateData.isActive }),
      },
    });

    return NextResponse.json({ config });
  } catch (error) {
    console.error("ApiConfig PUT error:", error);
    return NextResponse.json({ error: "更新配置失败" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "配置 ID 不能为空" }, { status: 400 });
    }

    const existing = await prisma.apiConfig.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "配置不存在" }, { status: 404 });
    }

    await prisma.apiConfig.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ApiConfig DELETE error:", error);
    return NextResponse.json({ error: "删除配置失败" }, { status: 500 });
  }
}
