import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

function normalizeEndpoint(endpoint: string): string {
  let url = endpoint.replace(/\/$/, "");
  url = url.replace(/\/v1\/(chat\/completions|completions|models|embeddings)$/, "");
  return url.replace(/\/v1$/, "");
}

async function testOpenAI(endpoint: string, apiKey: string, modelId: string) {
  const url = normalizeEndpoint(endpoint) + "/v1/models";
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text.substring(0, 200)}`);
  }
  return { success: true, message: "连接成功" };
}

async function testDeepSeek(endpoint: string, apiKey: string, modelId: string) {
  const url = normalizeEndpoint(endpoint) + "/v1/models";
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text.substring(0, 200)}`);
  }
  return { success: true, message: "连接成功" };
}

async function testXiaomiMimo(endpoint: string, apiKey: string, modelId: string) {
  const url = normalizeEndpoint(endpoint) + "/v1/models";
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text.substring(0, 200)}`);
  }
  return { success: true, message: "连接成功" };
}

const TEST_HANDLERS: Record<string, (endpoint: string, apiKey: string, modelId: string) => Promise<{ success: boolean; message: string }>> = {
  openai: testOpenAI,
  deepseek: testDeepSeek,
  "xiaomi-mimo": testXiaomiMimo,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "配置 ID 不能为空" }, { status: 400 });
    }

    const config = await prisma.apiConfig.findUnique({ where: { id } });
    if (!config) {
      return NextResponse.json({ error: "配置不存在" }, { status: 404 });
    }

    const handler = TEST_HANDLERS[config.provider];
    if (!handler) {
      return NextResponse.json({ error: `不支持的服务商: ${config.provider}` }, { status: 400 });
    }

    const result = await handler(config.endpoint, config.apiKey, config.modelId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("ApiConfig test error:", error);
    const message = error instanceof Error ? error.message : "连接测试失败";
    return NextResponse.json({ success: false, message }, { status: 200 });
  }
}
