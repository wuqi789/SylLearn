import { BaseAgent } from "./base-agent";
import type { ModelAdapter, TutorResponse, AgentResponse, AgentMessage } from "@/types/agent";
import type { AgentRole } from "@/types/index";

export class TutorAgent extends BaseAgent {
  constructor(adapter: ModelAdapter) {
    super("tutor" as AgentRole, adapter);
  }

  async process(input: string, context?: Record<string, unknown>): Promise<AgentResponse> {
    const { skill, userMessage, history } = this.parseInput(input, context);
    const response = await this.teach(skill, userMessage, history);
    this.act();
    const content = response.content;
    this.reflect();
    return this.buildResponse(content, { data: response });
  }

  async teach(
    skill: string,
    userMessage: string,
    history?: AgentMessage[]
  ): Promise<TutorResponse> {
    const historyContext = history
      ?.slice(-5)
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n") || "";

    const prompt = [
      `你是一位苏格拉底式的导师，正在教授"${skill}"。`,
      historyContext ? `对话历史：\n${historyContext}` : "",
      `学生说：${userMessage}`,
      `请根据学生的情况选择合适的教学策略：`,
      `- 如果学生表现出困惑，用更简单的方式解释`,
      `- 如果学生理解了，用挑战性问题深入`,
      `- 如果学生有误解，用苏格拉底式提问引导`,
      `返回JSON格式：{ content, action, followUp }`,
    ].filter(Boolean).join("\n");

    const response = await this.thinkStructured<TutorResponse>(prompt, "TutorResponse", {
      topic: skill,
    });

    return response;
  }

  private parseInput(
    input: string,
    context?: Record<string, unknown>
  ): { skill: string; userMessage: string; history?: AgentMessage[] } {
    return {
      skill: (context?.skill as string) || this.state.context.topic as string || input,
      userMessage: input,
      history: (context?.history as AgentMessage[]) || this.state.history.slice(-10),
    };
  }
}
