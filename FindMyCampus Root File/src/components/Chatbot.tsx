"use client";

import { useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error connecting to server." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* CHAT ICON */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[9999] bg-blue-600 text-white p-4 rounded-full shadow-lg"
        >
          🤖
        </button>
      )}

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-6 right-6 z-[9999] w-80 h-96 bg-white border rounded-lg shadow-lg flex flex-col">
          <div className="bg-blue-600 text-white p-3 flex justify-between">
            <span>College Chatbot</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  m.role === "user"
                    ? "bg-blue-100 text-right"
                    : "bg-gray-100"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && <div className="text-gray-400">Typing…</div>}
          </div>

          <div className="p-2 flex gap-2 border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded px-2"
              placeholder="Ask about colleges..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
