"use client";

import { Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

type Props = {
  title: string;
  text: string;
  score: number | null;
};

export default function TranslatorCard({
  title,
  text,
  score,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  const displayScore =
    score !== null
      ? `${(score * 100).toFixed(1)}%`
      : "Unavailable";

  return (
    <div className="translator-card">

      <div className="section-title">
        <CheckCircle2 size={22} />

        <h2>{title}</h2>
      </div>


      <div className="translation-output">
        {text}
      </div>


      <div className="translator-footer">

        <div className="metric-card">
          <h4>COMET Score</h4>

          <h2>
            {displayScore}
          </h2>
        </div>


        <button
          type="button"
          className="copy-button"
          onClick={copyText}
          disabled={!text || text === "Unavailable"}
        >
          {copied ? (
            <>
              <CheckCircle2 size={16} />
              Copied
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy
            </>
          )}
        </button>

      </div>

    </div>
  );
}