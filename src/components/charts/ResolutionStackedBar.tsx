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

interface WardResolution {
  name: string;
  resolved: number;
  open: number;
}

export default function ResolutionStackedBar({ wards }: { wards: WardResolution[] }) {
  const data = {
    labels: wards.map((w) => w.name),
    datasets: [
      {
        label: "Resolved",
        data: wards.map((w) => w.resolved),
        backgroundColor: "#10b981",
        borderRadius: 4,
      },
      {
        label: "Open / In Progress",
        data: wards.map((w) => w.open),
        backgroundColor: "#6366f1",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { usePointStyle: true, padding: 20, font: { size: 12 } },
      },
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#f1f5f9" } },
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-slate-900 mb-5">Resolution by Ward</h3>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
