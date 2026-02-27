"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  open: number;
  inProgress: number;
  completed: number;
  blocked: number;
}

export default function IssueStatusDonut({ open, inProgress, completed, blocked }: Props) {
  const data = {
    labels: ["Open", "In Progress", "Completed", "Blocked"],
    datasets: [
      {
        data: [open, inProgress, completed, blocked],
        backgroundColor: ["#ef4444", "#6366f1", "#10b981", "#94a3b8"],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { padding: 20, usePointStyle: true, pointStyleWidth: 8, font: { size: 12 } },
      },
    },
    cutout: "68%",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-slate-900 mb-5">Issue Status</h3>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
