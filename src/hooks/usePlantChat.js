import { useState, useCallback, useRef } from "react";
import backend from "../network/backend";

const RPM_LIMIT = 3;
const RPD_LIMIT = 200;

export function usePlantChat(userName) {
  const [messages,   setMessages]   = useState([]);
  const [history,    setHistory]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [retryAfter, setRetryAfter] = useState(null);

  const minuteLog = useRef([]);
  const dayLog    = useRef([]);

  const checkLimits = useCallback(() => {
    const now = Date.now();
    minuteLog.current = minuteLog.current.filter(t => t > now - 60_000);
    dayLog.current    = dayLog.current.filter(t => t > now - 86_400_000);

    if (dayLog.current.length >= RPD_LIMIT) {
      return {
        blocked: true,
        reason: "Daily limit of 200 messages reached. Please come back tomorrow 🌱",
      };
    }

    if (minuteLog.current.length >= RPM_LIMIT) {
      const wait = Math.ceil((minuteLog.current[0] + 60_000 - now) / 1000);
      return {
        blocked: true,
        reason: `Too many messages! Please wait ${wait}s 🌿`,
        retryAfter: wait,
      };
    }

    return { blocked: false };
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;

    setError(null);
    setRetryAfter(null);

    const limit = checkLimits();
    if (limit.blocked) {
      setError(limit.reason);
      if (limit.retryAfter) setRetryAfter(limit.retryAfter);
      return;
    }

    const userMsg    = { role: "user", content: text };
    const newHistory = [...history, userMsg];

    setMessages(prev => [...prev, userMsg]);
    setHistory(newHistory);
    setLoading(true);

    try {
      const { data } = await backend.post("/chat", {
        messages: newHistory,
        user: userName,
      }, {
        timeout: 60000, // ✅ 60s for AI responses
      });

      const assistantMsg = { role: "assistant", content: data.reply };
      setMessages(prev => [...prev, assistantMsg]);
      setHistory(prev => [...prev, assistantMsg]);
      setRetryAfter(null);
      setError(null);

      const now = Date.now();
      minuteLog.current.push(now);
      dayLog.current.push(now);

    } catch (err) {
      const status = err?.response?.status;

      // ✅ Timeout
      if (err.code === "ECONNABORTED") {
        setError("Response is taking too long 🌿 Please try again.");
      }
      // ✅ Rate limit
      else if (status === 429) {
        const wait = err?.response?.data?.retryAfter || 20;
        setError(`Assistant is busy 🌿 Please wait ${wait}s and try again.`);
        setRetryAfter(wait);
      }
      // ✅ Everything else
      else {
        setError(err?.response?.data?.message || "Something went wrong. Please try again.");
      }

      // Rollback optimistic updates
      setMessages(prev => prev.slice(0, -1));
      setHistory(prev => prev.slice(0, -1));

    } finally {
      setLoading(false);
    }
  }, [history, loading, userName, checkLimits]);

  return { messages, loading, error, retryAfter, sendMessage };
}