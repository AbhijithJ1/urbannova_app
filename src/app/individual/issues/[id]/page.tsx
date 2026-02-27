import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import LabelBadge from "@/components/LabelBadge";
import { getScoreHex, formatDate, getStatusLabel } from "@/lib/utils";
import { IssueStatus } from "@/types";
import { MapPin, Clock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AdminStatusActions from "./AdminStatusActions";

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;

  const issue = await db.issue.findUnique({
    where: { id },
    include: {
      ward: true,
      user: { select: { id: true, name: true, email: true } },
      statusLogs: {
        include: { changedBy: { select: { id: true, name: true } } },
        orderBy: { changedAt: "asc" },
      },
    },
  });

  if (!issue) notFound();

  const color = getScoreHex(issue.score);
  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href={isAdmin ? "/admin/issues" : "/individual/issues"}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Issues
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <LabelBadge label={issue.label} />
            <StatusBadge status={issue.status as IssueStatus} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-3">{issue.title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-400" /> {issue.landmark}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" /> {formatDate(issue.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-400" /> {issue.user.name}
            </span>
          </div>
        </div>

        {/* Score + Description */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm"
              style={{ backgroundColor: color }}
            >
              {issue.score}
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">Severity Score</p>
              <p className="text-sm text-slate-500 mb-2">
                {issue.score <= 33 ? "Low" : issue.score <= 66 ? "Moderate" : "Critical"} severity
              </p>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${issue.score}%`, backgroundColor: color }}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-slate-900 mb-2">Description</h3>
            <p className="text-slate-600 leading-relaxed">{issue.description}</p>
          </div>

          <div>
            <h3 className="font-medium text-slate-900 mb-2">Ward</h3>
            <p className="text-slate-600">{issue.ward.name}</p>
          </div>

          {/* Block reason */}
          {issue.status === "BLOCKED" && issue.blockReason && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <h3 className="font-medium text-amber-800 mb-1">Blocked Reason</h3>
              <p className="text-amber-700 text-sm">{issue.blockReason}</p>
            </div>
          )}
        </div>

        {/* Status Timeline */}
        <div className="border-t border-slate-100 p-6">
          <h3 className="font-medium text-slate-900 mb-4">Status Timeline</h3>
          <div className="space-y-4">
            {issue.statusLogs.map((log, i) => (
              <div key={log.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${
                    log.status === "COMPLETED" ? "bg-emerald-500" :
                    log.status === "BLOCKED" ? "bg-slate-400" :
                    log.status === "INPROGRESS" ? "bg-indigo-500" : "bg-red-500"
                  }`} />
                  {i < issue.statusLogs.length - 1 && (
                    <div className="w-px h-full bg-slate-200 min-h-6" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-slate-900">
                    {getStatusLabel(log.status as IssueStatus)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(log.changedAt)} — by {log.changedBy.name}
                  </p>
                  {log.blockReason && (
                    <p className="text-xs text-amber-600 mt-1">Reason: {log.blockReason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="border-t border-slate-100 p-6">
            <AdminStatusActions issueId={issue.id} currentStatus={issue.status as IssueStatus} />
          </div>
        )}
      </div>
    </div>
  );
}
