import { ScrollText } from "lucide-react";

type Props = {
  detected: string;
  winner: string;
};

export default function SummaryCard({
  detected,
  winner,
}: Props) {
  return (
    <div className="summary-card">
      <div className="section-title">
        <ScrollText size={22} />

        <h2>Translation Summary</h2>
      </div>

      <p>
        <strong>Language:</strong> {detected}
      </p>

      <p>
        <strong>Best Engine:</strong> {winner}
      </p>

      <p>
        Translation completed successfully.
      </p>
    </div>
  );
}