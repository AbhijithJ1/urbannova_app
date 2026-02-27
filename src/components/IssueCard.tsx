import Link from "next/link";
import StatusBadge from "./StatusBadge";
import LabelBadge from "./LabelBadge";
import { getScoreHex, formatDate } from "@/lib/utils";
import { Issue } from "@/types";
import { MapPin, Clock } from "lucide-react";

export default function IssueCard({ issue }: { issue: Issue }) {
  const color = getScoreHex(issue.score);

  return (
    <Link href={`/individual/issues/${issue.id}`}>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <LabelBadge label={issue.label} />
              <StatusBadge status={issue.status} />
            </div>
            <h3 className="font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{issue.title}</h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{issue.description}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {issue.landmark}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {formatDate(issue.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center shrink-0">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
              style={{ backgroundColor: color }}
            >
              {issue.score}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 font-medium">score</span>
          </div>
        </div>
        {issue.status === "BLOCKED" && issue.blockReason && (
          <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800">
            <strong>Blocked:</strong> {issue.blockReason}
          </div>
        )}
      </div>
    </Link>
  );
}
