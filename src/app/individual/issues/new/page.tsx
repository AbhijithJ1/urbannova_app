"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createIssue } from "@/actions/issue.actions";
import ScoreSlider from "@/components/ScoreSlider";
import { Loader2, Send, Trash2, Droplets, Zap, Wind } from "lucide-react";

const LABELS = [
  { value: "WASTE", icon: Trash2, name: "Waste", desc: "Garbage, dumping, e-waste", color: "text-orange-600 bg-orange-50 border-orange-200" },
  { value: "WATER", icon: Droplets, name: "Water", desc: "Leakage, shortage, sewage", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { value: "ENERGY", icon: Zap, name: "Energy", desc: "Streetlights, power hazards", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  { value: "POLLUTION", icon: Wind, name: "Pollution", desc: "Air, noise, emissions", color: "text-purple-600 bg-purple-50 border-purple-200" },
] as const;

export default function NewIssuePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [landmark, setLandmark] = useState("");
  const [label, setLabel] = useState<string>("");
  const [score, setScore] = useState(50);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label) {
      setError("Please select an issue category");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await createIssue({
        title,
        description,
        landmark,
        label: label as "WASTE" | "WATER" | "ENERGY" | "POLLUTION",
        score,
      });
      router.push("/individual/issues");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create issue");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Report an Issue</h1>
      <p className="text-slate-500 mb-8">Describe a sustainability issue in your ward</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Issue Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            placeholder="e.g., Overflowing garbage bins near 5th block"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white"
            placeholder="Describe the issue in detail — what, where, how bad..."
          />
        </div>

        {/* Landmark */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Landmark / Location</label>
          <input
            type="text"
            required
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            placeholder="e.g., Near Sony Signal, opposite City Mall"
          />
        </div>

        {/* Label Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Issue Category</label>
          <div className="grid grid-cols-2 gap-3">
            {LABELS.map((l) => {
              const Icon = l.icon;
              return (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setLabel(l.value)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    label === l.value
                      ? "border-indigo-500 bg-indigo-50 shadow-sm"
                      : "border-slate-100 hover:border-slate-200 bg-white"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${label === l.value ? "bg-indigo-100 text-indigo-600" : l.color}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="font-semibold text-sm text-slate-900">{l.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{l.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Score Slider */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <ScoreSlider value={score} onChange={setScore} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Submit Issue
        </button>
      </form>
    </div>
  );
}
