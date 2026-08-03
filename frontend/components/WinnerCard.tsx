import { Trophy } from "lucide-react";

type Props = {
  engine: string;
  reason: string;
};

export default function WinnerCard({
  engine,
  reason,
}: Props) {
  return (
    <div className="winner-card">
      <div className="section-title">
        <Trophy size={22} />

        <h2>Recommended Engine</h2>
      </div>

      <h1>{engine}</h1>

      <p>{reason}</p>
    </div>
  );
}