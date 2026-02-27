import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import IssueCard from "@/components/IssueCard";
import { Issue } from "@/types";
import Link from "next/link";
import { Plus, Filter, FileWarning } from "lucide-react";

export default async function CitizenIssuesPage({
  searchParams,
}: {
  searchParams: Promise<{ label?: string; status?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role === "ADMIN") redirect("/admin/issues");
  if (!session.user.wardId) redirect("/register");

  const params = await searchParams;

  const where: Record<string, unknown> = { wardId: session.user.wardId };
  if (params.label) where.label = params.label;
  if (params.status) where.status = params.status;

  const issues = await db.issue.findMany({
    where,
    include: { user: { select: { id: true, name: true, email: true } }, ward: true },
    orderBy: { createdAt: "desc" },
  });

  const ward = await db.ward.findUnique({ where: { id: session.user.wardId } });
  const issueList = issues as unknown as Issue[];

  const labels = ["WASTE", "WATER", "ENERGY", "POLLUTION"];
  const statuses = ["OPEN", "INPROGRESS", "COMPLETED", "BLOCKED"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ward Issues</h1>
          <p className="text-slate-500 mt-1">{ward?.name} — {issues.length} issue(s)</p>
        </div>
        <Link
          href="/individual/issues/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Report Issue
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-medium text-slate-700">Filters</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/individual/issues"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              !params.label && !params.status
                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            All
          </Link>
          {labels.map((l) => (
            <Link
              key={l}
              href={`/individual/issues?label=${l}${params.status ? `&status=${params.status}` : ""}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                params.label === l
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {l}
            </Link>
          ))}
          <div className="w-px h-6 bg-slate-200 mx-1" />
          {statuses.map((s) => (
            <Link
              key={s}
              href={`/individual/issues?status=${s}${params.label ? `&label=${params.label}` : ""}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                params.status === s
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {s === "INPROGRESS" ? "In Progress" : s.charAt(0) + s.slice(1).toLowerCase()}
            </Link>
          ))}
        </div>
      </div>

      {/* Issues List */}
      {issueList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
          <FileWarning className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No issues found</h3>
          <p className="text-slate-400 mb-6 text-sm">No issues matching your filters.</p>
          <Link
            href="/individual/issues/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" /> Report an Issue
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {issueList.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
