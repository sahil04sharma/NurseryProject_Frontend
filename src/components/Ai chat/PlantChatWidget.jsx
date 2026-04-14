import { useState, useEffect, useRef } from "react";
import { usePlantChat } from "../../hooks/usePlantChat";

function RetryCountdown({ seconds, onDone }) {
  const [count, setCount] = useState(seconds);
  useEffect(() => {
    if (count <= 0) { onDone(); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);
  return (
    <p className="text-xs text-center text-amber-600 py-1">
      🌿 Wait <strong>{count}s</strong> before sending again
    </p>
  );
}

export default function PlantChatWidget() {
  const [open,          setOpen]          = useState(false);
  const [input,         setInput]         = useState("");
  const [showCountdown, setShowCountdown] = useState(false);
  const messagesEndRef                    = useRef(null);

  const userName = "Guest"; // replace with useSelector if you have auth
  const { messages, loading, error, retryAfter, sendMessage } = usePlantChat(userName);

  // Auto-scroll on new message or loading state change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Show countdown whenever retryAfter is set
  useEffect(() => {
    if (retryAfter) setShowCountdown(true);
  }, [retryAfter]);

  // ✅ Block input during loading OR countdown
  const isBlocked = loading || showCountdown;

  const handleSend = () => {
    if (!input.trim() || isBlocked) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <>
      {/* ── Chat window ── */}
      {open && (
        <div
          className="fixed bottom-24 right-5 z-[9998] w-[340px] sm:w-[370px] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-green-100"
          style={{ height: "500px", background: "#fff" }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#1a3d2b" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
              style={{ background: "#2e6b47" }}>🌿</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-100">PlantCare Assistant</p>
              <p className="text-xs text-green-400">
                {loading ? "⏳ Thinking..." : "● Online"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-green-300 hover:text-white transition text-xl leading-none">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3"
            style={{ background: "#f6faf7" }}>

            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="flex gap-2 items-end">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: "#1a3d2b" }}>🌱</div>
                <div
                  className="text-sm px-3 py-2 rounded-2xl rounded-bl-sm max-w-[80%]"
                  style={{ background: "#fff", border: "1px solid #d1fae5" }}>
                  Namaste! 🌿 I'm your PlantCare Assistant. Ask me anything about plants, orders, or products!
                </div>
              </div>
            )}

            {/* Message bubbles */}
            {messages.map((msg, i) => (
              <div
                key={`${msg.role}-${i}-${msg.content.slice(0, 8)}`}
                className={`flex gap-2 items-end ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role === "assistant" && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: "#1a3d2b" }}>🌱</div>
                )}
                <div
                  className={`text-sm px-3 py-2 rounded-2xl max-w-[80%] whitespace-pre-wrap
                    ${msg.role === "user"
                      ? "text-green-50 rounded-br-sm"
                      : "rounded-bl-sm border border-green-100"}`}
                  style={msg.role === "user"
                    ? { background: "#1a3d2b" }
                    : { background: "#fff" }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2 items-end">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: "#1a3d2b" }}>🌱</div>
                <div
                  className="px-4 py-3 rounded-2xl rounded-bl-sm border border-green-100"
                  style={{ background: "#fff" }}>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error banner */}
          {error && !showCountdown && (
            <p className="text-xs text-center text-red-500 px-3 py-1 bg-red-50">
              {error}
            </p>
          )}

          {/* Retry countdown */}
          {showCountdown && retryAfter && (
            <RetryCountdown
              seconds={retryAfter}
              onDone={() => {
                setShowCountdown(false);
                
              }}
            />
          )}

          {/* Input area */}
          <div className="flex items-center gap-2 px-3 py-2 border-t border-green-100 bg-white">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              disabled={isBlocked}
              placeholder={
                loading        ? "Thinking..." :
                showCountdown  ? "Please wait..." :
                                 "Ask about plants..."
              }
              className="flex-1 text-sm px-3 py-2 rounded-full outline-none border border-green-200
                focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            />
            <button
              onClick={handleSend}
              disabled={isBlocked}
              className="w-9 h-9 rounded-full flex items-center justify-center text-green-100
                transition hover:opacity-80 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "#1a3d2b" }}>
              {loading
                ? <span className="w-3 h-3 border-2 border-green-300 border-t-transparent rounded-full animate-spin" />
                : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )
              }
            </button>
          </div>
        </div>
      )}

      {/* ── Floating toggle button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-5 z-[9999] w-14 h-14 rounded-full shadow-lg
          flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ background: "#1a3d2b" }}
        aria-label="Open PlantCare AI Chat">
        {open
          ? <span className="text-green-200 text-xl">✕</span>
          : <span className="text-2xl">🌿</span>}
      </button>
    </>
  );
}