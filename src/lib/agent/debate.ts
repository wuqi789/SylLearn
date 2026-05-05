import { BaseAgent } from "./base-agent";
import type { ModelAdapter, DebateOutput, AgentResponse, AgentMessage } from "@/types/agent";
import type { AgentRole } from "@/types/index";

export class DebateAgent extends BaseAgent {
  constructor(adapter: ModelAdapter) {
    super("debate" as AgentRole, adapter);
  }

  async process(input: string, context?: Record<string, unknown>): Promise<AgentResponse> {
    const action = context?.action as string || "generateDebate";
    if (action === "respond") {
      const response = await this.generateResponse(
        context?.thread as AgentMessage[] || [],
        input
      );
      return this.buildResponse(response, { data: { type: "response" } });
    }
    if (action === "summary") {
      const summary = await this.generateSummary(
        context?.thread as AgentMessage[] || []
      );
      return this.buildResponse(summary, { data: { type: "summary" } });
    }
    const output = await this.generateDebate(input);
    this.act();
    this.reflect();
    return this.buildResponse(JSON.stringify(output), { data: output });
  }

  async generateDebate(topic: string): Promise<DebateOutput> {
    const output = await this.thinkStructured<DebateOutput>(
      `为"${topic}"生成一个包含多个视角的辩论框架，每个角色要有明确的立场、论点和证据`,
      "DebateOutput",
      { topic }
    );
    return output;
  }

  async generateResponse(thread: AgentMessage[], userQuestion: string): Promise<string> {
    const threadContext = thread
      .slice(-6)
      .map((m) => `[${m.metadata?.role || m.role}]: ${m.content}`)
      .join("\n");

    const response = await this.think(
      `辩论进行中。\n历史讨论：\n${threadContext}\n\n用户提问：${userQuestion}\n\n请从多个角色角度回应，保持各角色立场的一致性和论点的深度。`,
      { topic: userQuestion }
    );
    return response;
  }

  async generateSummary(thread: AgentMessage[]): Promise<string> {
    const threadContent = thread
      .map((m) => `[${m.metadata?.role || m.role}]: ${m.content}`)
      .join("\n");

    const summary = await this.think(
      `请总结以下辩论的核心分歧、各方最有说服力的论点以及可能的共识：\n${threadContent}`,
      { topic: "辩论总结" }
    );
    return summary;
  }
}
