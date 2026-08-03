"use client";

import { Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import MetricCard from "./MetricCard";

type Props = {
  title: string;
  text: string;
  confidence: number;
  fluency: number;
  semantic: number;
  context: number;
};

export default function TranslatorCard({
  title,
  text,
  confidence,
  fluency,
  semantic,
  context,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div className="translator-card">
      <div className="card-header">
        <h2 style={{ fontSize: "2rem" }}>
  {title}
</h2>

        <button
          className="copy-btn"
          onClick={copyText}
        >
          {copied ? (
            <CheckCircle2 size={18} />
          ) : (
            <Copy size={18} />
          )}
        </button>
      </div>

      <p className="translation-text">
        {text}
      </p>

      <div className="metric-grid">
        <MetricCard
          title="Confidence"
          value={confidence}
        />

        <MetricCard
          title="Fluency"
          value={fluency}
        />

        <MetricCard
          title="Semantic"
          value={semantic}
        />

        <MetricCard
          title="Context"
          value={context}
        />
      </div>

      <div className="analysis-box">
        <h4>✨ AI Analysis</h4>

        <p>
          This translation preserves
          semantic meaning with{" "}
          <strong>{confidence}%</strong>{" "}
          confidence and maintains
          contextual accuracy.
        </p>
      </div>
    </div>
  );
}