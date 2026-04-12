import { useState, useEffect, useRef } from "react";
import backend from "../../network/backend";
import { Leaf } from "lucide-react";
import useProfile from "../../hooks/useProfile";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const { userProfile } = useProfile();

  // Auto scroll to bottom when new message appears
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: "user", content: input }];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await backend.post("/chat", {
        messages: updatedMessages,
        user: userProfile.name,
      });
      const botReply = res?.data?.reply || "Sorry, I didn’t get that.";
      simulateTyping(botReply);
    } catch (err) {
      simulateTyping("Oops! Something went wrong. Please try again.");
    }
  };

  // Typing simulation for assistant messages
  const simulateTyping = (text) => {
    let index = 0;
    let displayedText = "";
    const tempMessage = { role: "assistant", content: "" };

    setMessages((prev) => [...prev, tempMessage]);

    const interval = setInterval(() => {
      if (index < text.length) {
        displayedText += text[index];
        index++;
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: displayedText } : m
          )
        );
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20);
  };

  return (
    <div className="w-full h-full border shadow-lg bg-green-50 flex flex-col">
      {/* Header */}
      <div className="p-3 bg-green-700 text-white font-semibold text-lg flex justify-between items-center">
        🌿 PlantCare AI Assistant
      </div>

      {/* Chat messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-3 py-2 lg:min-h-[60vh] lg:max-h-[80vh] bg-white scroll-smooth"
      >
        {messages.length > 0 ? (
          messages.map((msg, i) => (
            <div
              key={i}
              data-testid="chat-message"
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 my-1 rounded-2xl text-sm shadow-sm transition-all duration-200 ${
                  msg.role === "user"
                    ? "bg-green-200 text-green-900 rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 pt-10">
            <Leaf className="w-10 h-10 mx-auto mb-3 text-green-600 animate-bounce" />
            <p className="text-sm sm:text-base">
              Start your chat — we’re here to help 🌱
            </p>
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div
            data-testid="typing-indicator"
            className="flex items-center gap-2 mt-2"
          >
            <div className="bg-green-600 w-6 h-6 flex justify-center items-center rounded-full text-white text-xs">
              🤖 <span className="hidden">assistant</span>
            </div>
            <div className="flex gap-1 px-3 py-2 bg-gray-200 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-green-600 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-green-600 animate-bounce delay-150"></span>
              <span className="w-2 h-2 rounded-full bg-green-600 animate-bounce delay-300"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex gap-2 p-3 border-t bg-green-50">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ask about plants..."
        />
        <button
          onClick={sendMessage}
          disabled={isTyping}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-70"
        >
          Send
        </button>
      </div>
    </div>
  );
}
