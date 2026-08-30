"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  BookOpen,
  Compass,
  Layers3,
  PenTool,
  ScrollText,
  Sparkles,
  X,
} from "lucide-react";

import TranslatorCard from "@/components/TranslatorCard";
import WinnerCard from "@/components/WinnerCard";
import SummaryCard from "@/components/SummaryCard";

type TranslationResult = {
  google: {
    text: string;
    score: number | null;
  };
  deepl: {
    text: string;
    score: number | null;
  };
  winner: {
    engine: string;
    reason: string;
  };
};

export default function Home() {
  const [text, setText] = useState("");
  const [target, setTarget] = useState("en");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isFabOpen, setIsFabOpen] = useState(false);

  async function analyze() {
    if (!text.trim()) {
      alert("Please enter some text.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          src: text,
          source_lang: "de",
          target_lang: target,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error:", errorText);
        throw new Error(`Backend returned ${res.status}`);
      }

      const data: TranslationResult = await res.json();

      console.log("Analysis result:", data);

      setResult(data);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to analyze the translation. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="library-shell">

      {/* HERO */}
      <section className="hero-grid">

        <motion.article
          className="hero-card about-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="eyebrow">
            Research • Translation • Meaning
          </p>

          <h1>
            Where Languages Meet Meaning.
          </h1>

          <p>
            Evalora is an AI-powered multilingual evaluation platform
            that compares, analyzes, and recommends translations by
            preserving meaning, context, and cultural nuances.
          </p>

          <div className="hero-points">

            <div className="point-item">
              <BookOpen size={18} />
              <span>
                Compares multiple translation engines with academic rigor.
              </span>
            </div>

            <div className="point-item">
              <Compass size={18} />
              <span>
                Measures translation quality and semantic fidelity.
              </span>
            </div>

            <div className="point-item">
              <Sparkles size={18} />
              <span>
                Recommends the strongest translation automatically.
              </span>
            </div>

          </div>
        </motion.article>


        <motion.article
          className="hero-card brand-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <div className="brand-mark">
            <BookOpen size={28} />
          </div>

          <p className="brand-kicker">
            Evalora
          </p>

          <h2>
            An AI-Powered Multilingual Evaluation Platform
          </h2>

          <div className="brand-badge">
            Old library • modern intelligence
          </div>

          <div className="brand-stats">

            <div className="stat-pill">
              <strong>12+</strong>
              <span>Languages</span>
            </div>

            <div className="stat-pill">
              <strong>3</strong>
              <span>Core Metrics</span>
            </div>

          </div>
        </motion.article>

      </section>


      {/* FEATURES */}
      <section className="catalog-grid">

        <article className="catalog-card">
          <div className="section-icon">
            <Layers3 size={18} />
          </div>

          <h3>
            Translation Comparison
          </h3>

          <p>
            View multiple outputs side by side and compare how each
            engine handles meaning and intent.
          </p>
        </article>


        <article className="catalog-card">
          <div className="section-icon">
            <BadgeCheck size={18} />
          </div>

          <h3>
            Evaluation Metrics
          </h3>

          <p>
            Compare translation quality using COMET-based
            semantic evaluation.
          </p>
        </article>


        <article className="catalog-card">
          <div className="section-icon">
            <ScrollText size={18} />
          </div>

          <h3>
            Recommended Engine
          </h3>

          <p>
            Evalora recommends the engine with the strongest
            evaluation score.
          </p>
        </article>

      </section>


      {/* RESEARCH */}
      <section className="research-grid">

        <article className="research-card">

          <div className="section-heading">

            <div className="section-icon">
              <BookOpen size={18} />
            </div>

            <div>
              <p className="eyebrow">
                Research Foundation
              </p>

              <h3>
                Designed like a scholarly review of meaning.
              </h3>
            </div>

          </div>

          <p>
            The platform combines machine translation with automated
            quality evaluation to make translation comparison
            transparent and interpretable.
          </p>

        </article>


        <article className="progress-card">

          <div className="section-heading">

            <div className="section-icon">
              <Compass size={18} />
            </div>

            <div>
              <p className="eyebrow">
                Features Under Progress
              </p>

              <h3>
                Curated expansions on the horizon.
              </h3>
            </div>

          </div>

          <ul>
            <li>Expanded multilingual benchmarks</li>
            <li>Context-aware cultural scoring</li>
            <li>Deeper editorial annotations</li>
          </ul>

        </article>

      </section>


      {/* TRANSLATION STUDIO */}
      <motion.section
        className="input-section"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >

        <div className="section-heading">

          <div className="section-icon">
            <Compass size={18} />
          </div>

          <div>
            <p className="eyebrow">
              Translation Studio
            </p>

            <h2>
              Compare and evaluate new passages
            </h2>
          </div>

        </div>


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
            onChange={(e) => setTarget(e.target.value)}
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
            type="button"
            className="action-button"
            onClick={analyze}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "✨ Analyze"}
          </button>

        </div>

      </motion.section>


      {/* RESULTS */}
      {result && (
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >

          <div className="top-grid">

            <SummaryCard
              detected="Automatic"
              winner={result.winner?.engine || "Unavailable"}
            />


            <WinnerCard
              engine={result.winner?.engine || "Unavailable"}
              reason={
                result.winner?.reason ||
                "No recommendation available."
              }
            />

          </div>


          <div className="grid">

            <TranslatorCard
              title="Google Translate"
              text={result.google?.text || "Unavailable"}
              score={result.google?.score ?? null}
            />


            <TranslatorCard
              title="DeepL"
              text={result.deepl?.text || "Unavailable"}
              score={result.deepl?.score ?? null}
            />

          </div>


          <motion.div
            className="explanation-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >

            <h2>
              🧠 AI Explanation
            </h2>

            <p>
              {result.winner?.reason ||
                "The system could not generate a recommendation."}
            </p>

          </motion.div>

        </motion.section>
      )}


      {/* FLOATING BUTTON */}
      <motion.button
        type="button"
        className="fab"
        onClick={() => setIsFabOpen(true)}
        whileHover={{
          scale: 1.04,
          y: -2,
        }}
        whileTap={{
          scale: 0.96,
        }}
        aria-label="Open feature details"
      >
        <PenTool size={20} />
      </motion.button>


      {/* MODAL */}
      <AnimatePresence>

        {isFabOpen && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFabOpen(false)}
          >

            <motion.div
              className="modal-card"
              initial={{
                y: 24,
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              exit={{
                y: 16,
                opacity: 0,
                scale: 0.97,
              }}
              transition={{
                duration: 0.2,
              }}
              onClick={(e) => e.stopPropagation()}
            >

              <button
                type="button"
                className="modal-close"
                onClick={() => setIsFabOpen(false)}
              >
                <X size={16} />
              </button>


              <div className="modal-icon">
                <ScrollText size={22} />
              </div>


              <h3>
                🚧 Feature Under Construction
              </h3>


              <p>
                This feature is currently under development and
                will be available in future updates.
              </p>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

    </main>
  );
}