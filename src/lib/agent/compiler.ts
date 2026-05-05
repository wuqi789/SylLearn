import { BaseAgent } from "./base-agent";
import type { ModelAdapter, CompilerOutput, AgentResponse } from "@/types/agent";
import type { AgentRole } from "@/types/index";

export class CompilerAgent extends BaseAgent {
  constructor(adapter: ModelAdapter) {
    super("compiler" as AgentRole, adapter);
  }

  async process(input: string, context?: Record<string, unknown>): Promise<AgentResponse> {
    const topic = input;
    const output = await this.compile(topic);
    this.act();
    const content = JSON.stringify(output);
    this.reflect();
    return this.buildResponse(content, { data: output, topic });
  }

  async compile(topic: string): Promise<CompilerOutput> {
    const output = await this.thinkStructured<CompilerOutput>(
      `请编译关于"${topic}"的完整教学内容，包括概念、前置知识、常见误解、示例、练习题和复习卡片`,
      "CompilerOutput",
      { topic }
    );
    return output;
  }
}
