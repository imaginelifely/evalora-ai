type Props = {
  label: string;
  value: number;
};

export default function ScoreBar({
  label,
  value,
}: Props) {
  return (
    <div className="scorebar">
      <div className="scorebar-header">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="score-track">
        <div
          className="score-fill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}