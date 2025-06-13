import React, { useEffect, useRef, useState } from "react";
import type { ChatMsg } from "../models/ChatModels";


const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Connecting...");
  const ws = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onopen = () => setStatus("Connected");
    ws.current.onclose = () => setStatus("Disconnected");
    ws.current.onerror = () => setStatus("Connection error");
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "history") {
        setMessages(data.messages);
      } else if (data.type === "message") {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    return () => ws.current?.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !input.trim() ||
      !ws.current ||
      ws.current.readyState !== WebSocket.OPEN
    )
      return;
    ws.current.send(JSON.stringify({ type: "message", text: input }));
    setInput("");
  };

  return (
    <div className="flex flex-col h-full max-h-screen bg-white">
      <div className="text-center text-xs text-gray-500 py-2 border-b">
        {status}
      </div>
      <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
        {messages.map((msg, i) => (
          <div key={i} className="mb-1 text-sm">
            {msg.text}
            <span className="ml-2 text-xs text-gray-400">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} className="flex p-2 border-t gap-2">
        <input
          type="text"
          className="flex-1 px-2 py-1 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message…"
        />
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 rounded hover:bg-purple-600"
          disabled={!input.trim() || status !== "Connected"}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
