import { randomUUID } from "crypto";
import type { AgentRole } from "@/types/index";
import type { AgentMessage, AgentState, AgentResponse, ModelAdapter } from "@/types/agent";

export abstract class BaseAgent {
  readonly id: string;
  readonly role: AgentRole;
  protected adapter: ModelAdapter;
  protected state: AgentState;

  constructor(role: AgentRole, adapter: ModelAdapter) {
    this.id = randomUUID();
    this.role = role;
    this.adapter = adapter;
    this.state = {
      id: this.id,
      role,
      status: "idle",
      context: {},
      history: [],
    };
  }

  abstract process(input: string, context?: Record<string, unknown>): Promise<AgentResponse>;

  protected async think(prompt: string, context?: Record<string, unknown>): Promise<string> {
    this.state.status = "thinking";
    const result = await this.adapter.generate(prompt, {
      agentRole: this.role,
      ...this.state.context,
      ...context,
    });
    return result;
  }

  protected async thinkStructured<T>(
    prompt: string,
    schema: string,
    context?: Record<string, unknown>
  ): Promise<T> {
    this.state.status = "thinking";
    const result = await this.adapter.generateStructured<T>(prompt, schema, {
      agentRole: this.role,
      ...this.state.context,
      ...context,
    });
    return result;
  }

  protected act(): void {
    this.state.status = "acting";
  }

  protected reflect(): void {
    this.state.status = "reflecting";
  }

  protected settle(): void {
    this.state.status = "idle";
  }

  addToHistory(message: AgentMessage): void {
    this.state.history.push(message);
    if (this.state.history.length > 100) {
      this.state.history = this.state.history.slice(-100);
    }
  }

  getContext(): Record<string, unknown> {
    return { ...this.state.context };
  }

  setContext(context: Record<string, unknown>): void {
    this.state.context = { ...this.state.context, ...context };
  }

  getHistory(): AgentMessage[] {
    return [...this.state.history];
  }

  getStatus(): AgentState["status"] {
    return this.state.status;
  }

  reset(): void {
    this.state = {
      id: this.id,
      role: this.role,
      status: "idle",
      context: {},
      history: [],
    };
  }

  protected buildAgentMessage(content: string, metadata?: Record<string, unknown>): AgentMessage {
    return {
      id: randomUUID(),
      role: this.role,
      content,
      timestamp: new Date(),
      metadata,
    };
  }

  protected buildResponse(content: string, metadata?: Record<string, unknown>): AgentResponse {
    const message = this.buildAgentMessage(content, metadata);
    this.addToHistory(message);
    this.settle();
    return {
      message,
      data: metadata?.data,
    };
  }
}
