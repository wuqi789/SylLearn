"use client";

import { useState, useCallback } from "react";

interface AgentMessage {
  id: string;
  role: "user" | "agent";
  agentRole?: string;
  content: string;
  createdAt: string;
}

function handleAuthError(status: number) {
  if (status === 401) {
    localStorage.removeItem("syllearn_token");
    localStorage.removeItem("syllearn_user");
    window.location.href = "/login";
  }
}

export function useAgent() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clearError = useCallback(() => setError(null), []);

  const sendMessage = useCallback(
    async (token: string, sessionId: string, content: string, action?: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/agents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId, content, action }),
        });
        if (res.status === 401) {
          handleAuthError(401);
          throw new Error("登录已过期，请重新登录");
        }
        const data = await res.json();
        if (!res.ok) {
          const errMsg = data?.error?.message || `请求失败 (${res.status})`;
          throw new Error(errMsg);
        }
        setMessages((prev) => [...prev, data.userMessage, data.agentMessage]);
        return data;
      } catch (err) {
        console.error("Agent interaction error:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("与 AI 通信失败，请检查网络后重试");
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadHistory = useCallback(async (token: string, sessionId: string) => {
    const res = await fetch(`/api/agents?sessionId=${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      handleAuthError(401);
      return;
    }
    const data = await res.json();
    if (res.ok) setMessages(data.messages ?? []);
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, loading, sendMessage, loadHistory, clearMessages, error, clearError };
}
