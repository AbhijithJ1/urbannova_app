import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { formatDate, getScoreHex, getStatusLabel } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import LabelBadge from "@/components/LabelBadge";
import { IssueStatus, IssueLabel } from "@/types";
import Link from "next/link";
import { Filter, ExternalLink, FileWarning } from "lucide-react";
import AdminIssueActions from "./AdminIssueActions";

export default async function AdminIssuesPage({
  searchParams,
}: {
  searchParams: Promise<{ ward?: string; status?: string; label?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/individual/dashboard");

  const params = await searchParams;

  const where: Record<string, unknown> = {};
  if (params.ward) where.wardId = params.ward;
  if (params.status) where.status = params.status;
  if (params.label) where.label = params.label;

  const [issues, wards] = await Promise.all([
    db.issue.findMany({
      where,
      include: {
        ward: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.ward.findMany({ orderBy: { name: "asc" } }),
  ]);

  const labels = ["WASTE", "WATER", "ENERGY", "POLLUTION"];
  const statuses = ["OPEN", "INPROGRESS", "COMPLETED", "BLOCKED"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">All Issues</h1>
        <p className="text-slate-500 mt-1">{issues.length} issue(s) found</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-medium text-slate-700">Filters</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <Link
            href="/admin/issues"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              !params.ward && !params.status && !params.label ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            All
          </Link>
          <div className="w-px h-6 bg-slate-200 mx-0.5" />
          {wards.map((w) => (
            <Link
              key={w.id}
              href={`/admin/issues?ward=${w.id}${params.status ? `&status=${params.status}` : ""}${params.label ? `&label=${params.label}` : ""}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                params.ward === w.id ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {w.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {labels.map((l) => (
            <Link
              key={l}
              href={`/admin/issues?label=${l}${params.ward ? `&ward=${params.ward}` : ""}${params.status ? `&status=${params.status}` : ""}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                params.label === l ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {l}
            </Link>
          ))}
          <div className="w-px h-6 bg-slate-200 mx-0.5" />
          {statuses.map((s) => (
            <Link
              key={s}
              href={`/admin/issues?status=${s}${params.ward ? `&ward=${params.ward}` : ""}${params.label ? `&label=${params.label}` : ""}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                params.status === s ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {getStatusLabel(s as IssueStatus)}
            </Link>
          ))}
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">Issue</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">Ward</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">Label</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">Score</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">By</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">Date</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3.5">
                    <Link href={`/individual/issues/${issue.id}`} className="font-medium text-slate-900 hover:text-indigo-600 flex items-center gap-1.5 transition-colors">
                      {issue.title.length > 40 ? issue.title.slice(0, 40) + "..." : issue.title}
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{issue.ward.name}</td>
                  <td className="px-4 py-3.5 text-center">
                    <LabelBadge label={issue.label as IssueLabel} />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className="inline-flex w-8 h-8 items-center justify-center rounded-lg text-white text-xs font-bold shadow-sm"
                      style={{ backgroundColor: getScoreHex(issue.score) }}
                    >
                      {issue.score}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <StatusBadge status={issue.status as IssueStatus} />
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{issue.user.name}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-500">{formatDate(issue.createdAt)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <AdminIssueActions issueId={issue.id} currentStatus={issue.status as IssueStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {issues.length === 0 && (
          <div className="p-16 text-center">
            <FileWarning className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No issues found</h3>
            <p className="text-slate-400 text-sm">No issues match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
