"use client";

import { useState, useCallback } from "react";

interface SessionData {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  topicId?: string;
}

export function useSession() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAuthError = useCallback((status: number) => {
    if (status === 401) {
      localStorage.removeItem("syllearn_token");
      localStorage.removeItem("syllearn_user");
      window.location.href = "/login";
    }
  }, []);

  const fetchSessions = useCallback(async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        handleAuthError(401);
        return;
      }
      const data = await res.json();
      if (res.ok) setSessions(data.sessions ?? []);
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  const createSession = useCallback(async (token: string, topic: string) => {
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ topic }),
    });
    if (res.status === 401) {
      handleAuthError(401);
      throw new Error("登录已过期，请重新登录");
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.session;
  }, [handleAuthError]);

  return { sessions, loading, fetchSessions, createSession };
}
