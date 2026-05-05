export type { ModelAdapter } from "@/types/agent";

import { MockAdapter } from "./mock-adapter";
import type { ModelAdapter } from "@/types/agent";

let cachedAdapter: ModelAdapter | null = null;
let cachedConfigId: string | null = null;

function normalizeEndpoint(endpoint: string): string {
  let url = endpoint.replace(/\/$/, "");
  url = url.replace(/\/v1\/(chat\/completions|completions|models|embeddings)$/, "");
  return url.replace(/\/v1$/, "");
}

function createProviderAdapter(provider: string, endpoint: string, apiKey: string, modelId: string, maxTokens: number, temperature: number): ModelAdapter {
  const baseUrl = normalizeEndpoint(endpoint);
  return {
    async generate(prompt: string, context?: Record<string, unknown>): Promise<string> {
      const url = baseUrl + "/v1/chat/completions";
      const body = {
        model: modelId,
        messages: [
          ...(context?.systemPrompt ? [{ role: "system", content: String(context.systemPrompt) }] : []),
          { role: "user", content: prompt },
        ],
        max_tokens: maxTokens,
        temperature,
      };
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`AI API error ${res.status}: ${text.substring(0, 200)}`);
      }
      const data = await res.json();
      return data.choices?.[0]?.message?.content ?? "";
    },
    async generateStructured<T>(prompt: string, schema: string, context?: Record<string, unknown>): Promise<T> {
      const text = await this.generate(
        `${prompt}\n\n请以 JSON 格式返回，严格遵循以下 schema 描述：${schema}`,
        context
      );
      const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("无法从 AI 响应中提取 JSON");
      return JSON.parse(jsonMatch[0]) as T;
    },
  };
}

export async function getModelAdapter(): Promise<ModelAdapter> {
  try {
    const { prisma } = await import("@/lib/db/prisma");
    const config = await prisma.apiConfig.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    if (!config) {
      cachedAdapter = null;
      cachedConfigId = null;
      return new MockAdapter();
    }

    if (cachedAdapter && cachedConfigId === config.id) {
      return cachedAdapter;
    }

    const adapter = createProviderAdapter(
      config.provider,
      config.endpoint,
      config.apiKey,
      config.modelId,
      config.maxTokens,
      config.temperature
    );
    cachedAdapter = adapter;
    cachedConfigId = config.id;
    return adapter;
  } catch {
    return new MockAdapter();
  }
}

export function clearAdapterCache(): void {
  cachedAdapter = null;
  cachedConfigId = null;
}
