"use client";

import { getScoreHex } from "@/lib/utils";

interface ScoreSliderProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export default function ScoreSlider({ value, onChange, readonly = false }: ScoreSliderProps) {
  const color = getScoreHex(value);
  const percentage = ((value - 1) / 99) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-700">Issue Severity Score</span>
        <span
          className="text-lg font-bold px-3 py-0.5 rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          {value}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={100}
        value={value}
        onChange={(e) => onChange?.(parseInt(e.target.value))}
        disabled={readonly}
        className="score-slider w-full"
        style={{
          background: `linear-gradient(to right, #16a34a 0%, #ca8a04 50%, #dc2626 100%)`,
        }}
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>1 — Minor</span>
        <span>50 — Moderate</span>
        <span>100 — Critical</span>
      </div>
      {/* Visual indicator bar */}
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
