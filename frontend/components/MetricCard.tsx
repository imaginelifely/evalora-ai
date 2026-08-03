type Props = {
  title: string;
  value: number;
};

export default function MetricCard({
  title,
  value,
}: Props) {
  return (
    <div className="metric-card">
      <h4>{title}</h4>
      <h2>{value}%</h2>
    </div>
  );
}