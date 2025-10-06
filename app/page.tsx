"use client";
import { FormEvent, useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSummary("");
    setLoading(true);

    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      setSummary("Error: " + (await res.text()));
      setLoading(false);
      return;
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader!.read();
      done = doneReading;
      if (value) {
        const chunkText = decoder.decode(value);
        setSummary((prev) => prev + chunkText);
      }
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 flex flex-col items-center justify-center px-6 py-12">
      {/* Card container */}
      <div className="w-full max-w-2xl bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          ✨ AI Blog Summarizer
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <input
            type="url"
            required
            placeholder="Paste blog URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            disabled={loading || !url}
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              loading || !url
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-400 to-cyan-400 hover:opacity-90 text-gray-900"
            }`}
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>
        </form>

        <section className="border-t border-gray-700 pt-4">
          <h2 className="text-lg font-semibold text-emerald-300 mb-2">
            Summary
          </h2>

          <div className="bg-gray-900/60 rounded-xl border border-gray-700 p-4 min-h-[150px] whitespace-pre-wrap text-sm leading-relaxed text-gray-200">
            {summary ||
              (loading ? "⏳ Waiting for model response..." : "No summary yet.")}
          </div>
        </section>
      </div>

      <footer className="mt-6 text-xs text-gray-500">
        Built by <span className="text-emerald-400 font-semibold">Sadaf Shahab</span> 💚
      </footer>
    </main>
  );
}
