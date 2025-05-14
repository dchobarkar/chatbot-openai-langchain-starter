import { useEffect, useRef, useState } from "react";

import { getSessionId } from "./utils/session.ts";

function App() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = getSessionId();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/chat";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId }),
      });
      if (!res.ok) throw new Error("API failed");

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-4 space-y-4">
        <div className="overflow-y-auto h-96 border p-3 rounded">
          {messages.map((msg, i) => {
            const isUser = msg.sender === "user";
            const align = isUser ? "text-right" : "text-left";
            const bubble = isUser ? "bg-blue-200" : "bg-gray-200";
            return (
              <div key={i} className={`mb-2 ${align}`}>
                <span className={`inline-block px-3 py-2 rounded-lg ${bubble}`}>
                  {msg.text}
                </span>
              </div>
            );
          })}
          {loading && (
            <div className="text-left text-sm italic text-gray-500">
              Bot is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center gap-2">
          <input
            className="flex-1 border rounded px-3 py-2 text-gray-900"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>

        <button
          onClick={() => setMessages([])}
          className="text-sm text-red-500 ml-auto block mt-1"
        >
          Clear Chat
        </button>
      </div>
    </div>
  );
}

export default App;
