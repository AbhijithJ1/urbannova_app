"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface WardData {
  name: string;
  avgScore: number;
}

export default function WardPriorityBar({ wards }: { wards: WardData[] }) {
  const sorted = [...wards].sort((a, b) => b.avgScore - a.avgScore);

  const data = {
    labels: sorted.map((w) => w.name),
    datasets: [
      {
        label: "Avg Issue Score",
        data: sorted.map((w) => Math.round(w.avgScore)),
        backgroundColor: sorted.map((w) =>
          w.avgScore > 66 ? "#ef4444" : w.avgScore > 33 ? "#f59e0b" : "#10b981"
        ),
        borderRadius: 8,
        barThickness: 24,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { max: 100, grid: { color: "#f1f5f9" } },
      y: { grid: { display: false } },
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-slate-900 mb-5">Ward Priority (by Avg Score)</h3>
      <div style={{ height: Math.max(200, sorted.length * 40 + 40) }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
