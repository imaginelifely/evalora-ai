"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input || !ref) return;

    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input }
    ]);

    const res = await axios.post("http://127.0.0.1:8000/analyze", {
      src: input,
      ref: ref
    });

    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        data: res.data
      }
    ]);

    setInput("");
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white">

      {/* Sidebar */}
      <div className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6">
        <h1 className="text-xl font-semibold">Evalora AI</h1>
        <p className="text-sm opacity-60 mt-1">
          Meaning, Measured Right.
        </p>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-2xl p-4 rounded-2xl ${
                msg.role === "user"
                  ? "bg-indigo-600 ml-auto"
                  : "bg-white/10 backdrop-blur-lg"
              }`}
            >
              {msg.role === "user" && msg.text}

              {msg.role === "ai" && (
                <div className="space-y-3">

                  <div>
                    <p className="text-sm opacity-60">Google</p>
                    <p>{msg.data.google.text}</p>
                    <p className="text-indigo-400 font-semibold">
                      {msg.data.google.score.toFixed(4)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm opacity-60">DeepL</p>
                    <p>{msg.data.deepl?.text || "Error"}</p>
                    <p className="text-violet-400 font-semibold">
                      {msg.data.deepl?.score?.toFixed(4) || "N/A"}
                    </p>
                  </div>

                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/10 p-4 rounded-xl w-fit"
            >
              Thinking...
            </motion.div>
          )}

        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 flex gap-2">

          <input
            className="flex-1 p-3 rounded-xl bg-white/10 outline-none"
            placeholder="Enter source text..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <input
            className="flex-1 p-3 rounded-xl bg-white/10 outline-none"
            placeholder="Reference translation..."
            value={ref}
            onChange={(e) => setRef(e.target.value)}
          />

          <button
            onClick={send}
            className="px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500"
          >
            Send
          </button>

        </div>

      </div>
    </div>
  );
}