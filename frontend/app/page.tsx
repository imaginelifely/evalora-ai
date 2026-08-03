"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import Hero from "@/components/Hero";
import TranslatorCard from "@/components/TranslatorCard";
import WinnerCard from "@/components/WinnerCard";
import SummaryCard from "@/components/SummaryCard";
import RadarMetrics from "@/components/RadarMetrics";

export default function Home() {
  const [text, setText] = useState("");
  const [target, setTarget] = useState("en");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function analyze() {
    if (!text.trim()) {
      alert("Please enter some text.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            src: text,
            target_lang: target,
          }),
        }
      );

      const data = await res.json();

      setResult(data);
    } catch (error) {
      console.error(error);

      alert(
        "Failed to connect to backend."
      );
    }

    setLoading(false);
  }

  return (
    <main className="container">
      <Hero />

      {/* INPUT SECTION */}

      <motion.div
        className="input-section"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <textarea
  className="input-box"
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="Paste a sentence, a poem, or a paragraph..."
  spellCheck={false}
  autoCorrect="off"
  autoCapitalize="off"
  autoComplete="off"
/>
        <div className="controls">
          <select
            value={target}
            onChange={(e) =>
              setTarget(e.target.value)
            }
          >
            <option value="en">
              English
            </option>

            <option value="de">
              German
            </option>

            <option value="fr">
              French
            </option>

            <option value="hi">
              Hindi
            </option>

            <option value="es">
              Spanish
            </option>
          </select>

          <button
            onClick={analyze}
            disabled={loading}
          >
            {loading
              ? "Analyzing..."
              : "✨ Analyze"}
          </button>
        </div>
      </motion.div>

      {/* RESULTS */}

      {result && (
        <>
          {/* SUMMARY */}

          <div className="top-grid">
            <SummaryCard
              detected={
                result.detected_language
              }
              winner={
                result.winner.engine
              }
            />

            <WinnerCard
              engine={
                result.winner.engine
              }
              reason={
                result.winner.reason
              }
            />
          </div>

          {/* TRANSLATION CARDS */}

          <div className="grid">
            <TranslatorCard
              title="Google Translate"
              text={result.google.text}
              confidence={
                result.google.metrics
                  .confidence
              }
              fluency={
                result.google.metrics
                  .fluency
              }
              semantic={
                result.google.metrics
                  .semantic
              }
              context={
                result.google.metrics
                  .context
              }
            />

            <TranslatorCard
              title="DeepL"
              text={result.deepl.text}
              confidence={
                result.deepl.metrics
                  .confidence
              }
              fluency={
                result.deepl.metrics
                  .fluency
              }
              semantic={
                result.deepl.metrics
                  .semantic
              }
              context={
                result.deepl.metrics
                  .context
              }
            />
          </div>

          {/* CHART */}

          <RadarMetrics
            google={
              result.google.metrics
            }
            deepl={
              result.deepl.metrics
            }
          />

          {/* EXPLANATION */}

          <motion.div
            className="explanation-card"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
          >
            <h2>
              🧠 AI Explanation
            </h2>

            <p>
              {result.winner.reason}
            </p>
          </motion.div>
        </>
      )}
    </main>
  );
}