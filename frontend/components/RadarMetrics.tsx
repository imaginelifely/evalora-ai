"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend
} from "recharts";

type Props = {
  google: any;
  deepl: any;
};

export default function RadarMetrics({
  google,
  deepl,
}: Props) {
  const data = [
    {
      metric: "Confidence",
      google: google.confidence,
      deepl: deepl.confidence,
    },

    {
      metric: "Fluency",
      google: google.fluency,
      deepl: deepl.fluency,
    },

    {
      metric: "Semantic",
      google: google.semantic,
      deepl: deepl.semantic,
    },

    {
      metric: "Context",
      google: google.context,
      deepl: deepl.context,
    },
  ];

  return (
    <div className="radar-card">
      <h2>📈 Analytics</h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <RadarChart data={data}>
  <PolarGrid />

  <PolarAngleAxis dataKey="metric" />

  <Radar
    name="Google"
    dataKey="google"
    stroke="#60a5fa"
    fill="#60a5fa"
    fillOpacity={0.45}
  />

  <Radar
    name="DeepL"
    dataKey="deepl"
    stroke="#22c55e"
    fill="#22c55e"
    fillOpacity={0.45}
  />
  <Legend />
</RadarChart>
      </ResponsiveContainer>
    </div>
  );
}