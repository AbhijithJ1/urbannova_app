import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getScoreSeverity, getLast6Months, countIssuesByMonth } from "@/lib/utils";
import IssueCard from "@/components/IssueCard";
import IssueStatusDonut from "@/components/charts/IssueStatusDonut";
import IssueTrendLine from "@/components/charts/IssueTrendLine";
import { Issue } from "@/types";
import Link from "next/link";
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Plus, ArrowRight, FileWarning } from "lucide-react";

export default async function CitizenDashboard() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role === "ADMIN") redirect("/admin/dashboard");
  if (!session.user.wardId) redirect("/register");

  const ward = await db.ward.findUnique({ where: { id: session.user.wardId } });
  const issues = await db.issue.findMany({
    where: { wardId: session.user.wardId },
    include: { user: { select: { id: true, name: true, email: true } }, ward: true },
    orderBy: { createdAt: "desc" },
  });

  // Compute ward stress score
  type DbIssue = typeof issues[number];
  const activeIssues = issues.filter((i: DbIssue) => i.status === "OPEN" || i.status === "INPROGRESS");
  const wardStress = activeIssues.length > 0
    ? Math.round(activeIssues.reduce((sum: number, i: DbIssue) => sum + i.score, 0) / activeIssues.length)
    : 0;
  const severity = getScoreSeverity(wardStress);

  // Status counts
  const open = issues.filter((i: DbIssue) => i.status === "OPEN").length;
  const inProgress = issues.filter((i: DbIssue) => i.status === "INPROGRESS").length;
  const completed = issues.filter((i: DbIssue) => i.status === "COMPLETED").length;
  const blocked = issues.filter((i: DbIssue) => i.status === "BLOCKED").length;

  // Trend data
  const trendLabels = getLast6Months();
  const trendData = countIssuesByMonth(issues);

  const recentIssues = issues.slice(0, 5) as unknown as Issue[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {session.user.name}
          </h1>
          <p className="text-slate-500 mt-1">
            Your ward: <span className="font-medium text-indigo-600">{ward?.name}</span>
          </p>
        </div>
        <Link
          href="/individual/issues/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Report Issue
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${severity.bg} ${severity.color}`}>
              {severity.label}
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{wardStress}</p>
          <p className="text-xs text-slate-500 mt-0.5">Ward Stress Score</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{open}</p>
          <p className="text-xs text-slate-500 mt-0.5">Open Issues</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{inProgress}</p>
          <p className="text-xs text-slate-500 mt-0.5">In Progress</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{completed}</p>
          <p className="text-xs text-slate-500 mt-0.5">Resolved</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <IssueStatusDonut open={open} inProgress={inProgress} completed={completed} blocked={blocked} />
        <IssueTrendLine labels={trendLabels} data={trendData} />
      </div>

      {/* Recent Issues */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Issues</h2>
          {issues.length > 5 && (
            <Link href="/individual/issues" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        {recentIssues.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <FileWarning className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">No issues reported in your ward yet.</p>
            <Link
              href="/individual/issues/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Report the first issue
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
