import { useState } from "react";

import { getSessionId } from "./utils/session.js";

function App() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = getSessionId();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/chat";

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
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
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 ${
                msg.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-lg ${
                  msg.sender === "user" ? "bg-blue-200" : "bg-gray-200"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
          {loading && (
            <div className="text-left text-sm italic text-gray-500">
              Bot is typing...
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            className="flex-1 border rounded px-3 py-2 text-black"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>

        <button
          onClick={() => setMessages([])}
          className="text-sm text-red-500 underline ml-auto block mt-1"
        >
          Clear Chat
        </button>
      </div>
    </div>
  );
}

export default App;
