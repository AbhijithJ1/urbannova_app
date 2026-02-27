"use client";

import { useState } from "react";
import { updateIssueStatus } from "@/actions/issue.actions";
import { useRouter } from "next/navigation";
import { IssueStatus } from "@/types";
import { Loader2, ChevronDown } from "lucide-react";

export default function AdminIssueActions({
  issueId,
  currentStatus,
}: {
  issueId: string;
  currentStatus: IssueStatus;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [showBlockModal, setShowBlockModal] = useState(false);

  async function handleChange(status: "INPROGRESS" | "COMPLETED" | "BLOCKED") {
    if (status === "BLOCKED") {
      setShowBlockModal(true);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const result = await updateIssueStatus(issueId, status);
      if (result.error) {
        alert(result.error);
      } else {
        router.refresh();
      }
    } catch {
      alert("Failed to update status");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  async function handleBlock() {
    if (!blockReason.trim()) return;
    setLoading(true);
    try {
      const result = await updateIssueStatus(issueId, "BLOCKED", blockReason);
      if (result.error) {
        alert(result.error);
      } else {
        setShowBlockModal(false);
        router.refresh();
      }
    } catch {
      alert("Failed to block issue");
    } finally {
      setLoading(false);
    }
  }

  const options: { label: string; value: "INPROGRESS" | "COMPLETED" | "BLOCKED" }[] = [];
  if (currentStatus !== "INPROGRESS") options.push({ label: "In Progress", value: "INPROGRESS" });
  if (currentStatus !== "COMPLETED") options.push({ label: "Completed", value: "COMPLETED" });
  if (currentStatus !== "BLOCKED") options.push({ label: "Blocked", value: "BLOCKED" });

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-indigo-200 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Status"}
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white border border-slate-100 rounded-xl shadow-lg z-50 py-1 min-w-35 overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleChange(opt.value)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}

      {showBlockModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Block Reason</h3>
            <p className="text-sm text-slate-500 mb-4">
              Citizens will see this reason on the issue detail page.
            </p>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 resize-none"
              placeholder="e.g., Pending budget allocation..."
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowBlockModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button
                onClick={handleBlock}
                disabled={loading || !blockReason.trim()}
                className="px-4 py-2 bg-slate-700 text-white text-sm font-medium rounded-xl hover:bg-slate-800 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
              >
                {loading && <Loader2 className="w-3 h-3 animate-spin" />} Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
