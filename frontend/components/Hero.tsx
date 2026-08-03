import { BookOpen } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-icon">
        <BookOpen size={50} />
      </div>

      <h1>Evalora</h1>

      <h3>Where languages meet meaning.</h3>

      <p>
        Translate • Compare • Interpret
      </p>
    </section>
  );
}