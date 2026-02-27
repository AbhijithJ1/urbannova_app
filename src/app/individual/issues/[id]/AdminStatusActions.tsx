"use client";

import { useState } from "react";
import { updateIssueStatus } from "@/actions/issue.actions";
import { useRouter } from "next/navigation";
import { IssueStatus } from "@/types";
import { Loader2 } from "lucide-react";

export default function AdminStatusActions({
  issueId,
  currentStatus,
}: {
  issueId: string;
  currentStatus: IssueStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [showBlockModal, setShowBlockModal] = useState(false);

  async function handleStatusChange(status: "INPROGRESS" | "COMPLETED" | "BLOCKED") {
    if (status === "BLOCKED") {
      setShowBlockModal(true);
      return;
    }
    setLoading(true);
    try {
      await updateIssueStatus(issueId, status);
      router.refresh();
    } catch {
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  async function handleBlock() {
    if (!blockReason.trim()) return;
    setLoading(true);
    try {
      await updateIssueStatus(issueId, "BLOCKED", blockReason);
      setShowBlockModal(false);
      router.refresh();
    } catch {
      alert("Failed to block issue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="font-medium text-slate-900 mb-3">Update Status</h3>
      <div className="flex flex-wrap gap-2">
        {currentStatus !== "INPROGRESS" && (
          <button
            onClick={() => handleStatusChange("INPROGRESS")}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
            Mark In Progress
          </button>
        )}
        {currentStatus !== "COMPLETED" && (
          <button
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
            Mark Completed
          </button>
        )}
        {currentStatus !== "BLOCKED" && (
          <button
            onClick={() => handleStatusChange("BLOCKED")}
            disabled={loading}
            className="px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Mark Blocked
          </button>
        )}
      </div>

      {/* Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Block Reason</h3>
            <p className="text-sm text-slate-500 mb-4">
              Provide a reason why this issue is blocked. Citizens will see this.
            </p>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 resize-none"
              placeholder="e.g., Pending budget allocation..."
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowBlockModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBlock}
                disabled={loading || !blockReason.trim()}
                className="px-4 py-2 bg-slate-700 text-white text-sm font-medium rounded-xl hover:bg-slate-800 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
              >
                {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                Confirm Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
