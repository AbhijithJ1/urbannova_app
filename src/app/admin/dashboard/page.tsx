import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getLast6Months, countIssuesByMonth } from "@/lib/utils";
import IssueStatusDonut from "@/components/charts/IssueStatusDonut";
import WardPriorityBar from "@/components/charts/WardPriorityBar";
import IssueTrendLine from "@/components/charts/IssueTrendLine";
import ResolutionStackedBar from "@/components/charts/ResolutionStackedBar";
import Link from "next/link";
import { AlertTriangle, CheckCircle, BarChart3, Clock, TrendingUp, Users, MapPin, ArrowRight, FileWarning } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/individual/dashboard");

  const [allIssues, wards, userCount] = await Promise.all([
    db.issue.findMany({ include: { ward: true } }),
    db.ward.findMany({ include: { issues: true, users: true } }),
    db.user.count({ where: { role: "USER" } }),
  ]);

  // KPIs
  const total = allIssues.length;
  const open = allIssues.filter((i) => i.status === "OPEN").length;
  const inProgress = allIssues.filter((i) => i.status === "INPROGRESS").length;
  const completed = allIssues.filter((i) => i.status === "COMPLETED").length;
  const blocked = allIssues.filter((i) => i.status === "BLOCKED").length;

  const activeIssues = allIssues.filter((i) => i.status === "OPEN" || i.status === "INPROGRESS");
  const cityStress = activeIssues.length > 0
    ? Math.round(activeIssues.reduce((sum, i) => sum + i.score, 0) / activeIssues.length)
    : 0;

  // Ward priority data
  const wardPriority = wards.map((w) => {
    const wardActive = w.issues.filter((i) => i.status === "OPEN" || i.status === "INPROGRESS");
    return {
      name: w.name,
      avgScore: wardActive.length > 0
        ? wardActive.reduce((sum, i) => sum + i.score, 0) / wardActive.length
        : 0,
    };
  });

  // Resolution data
  const wardResolution = wards.map((w) => ({
    name: w.name,
    resolved: w.issues.filter((i) => i.status === "COMPLETED").length,
    open: w.issues.filter((i) => i.status !== "COMPLETED").length,
  }));

  // Trend data
  const trendLabels = getLast6Months();
  const trendData = countIssuesByMonth(allIssues);

  // Most critical ward
  const criticalWard = wardPriority.reduce(
    (max, w) => (w.avgScore > max.avgScore ? w : max),
    { name: "N/A", avgScore: 0 }
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">City-wide sustainability overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/wards"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-sm"
          >
            <MapPin className="w-4 h-4 text-indigo-600" />
            Manage Wards
          </Link>
          <Link
            href="/admin/issues"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-sm"
          >
            <BarChart3 className="w-4 h-4" />
            View Issues
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
            <BarChart3 className="w-5 h-5 text-slate-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{total}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total Issues</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{open}</p>
          <p className="text-xs text-slate-500 mt-0.5">Open</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{inProgress}</p>
          <p className="text-xs text-slate-500 mt-0.5">In Progress</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{completed}</p>
          <p className="text-xs text-slate-500 mt-0.5">Resolved</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{cityStress}</p>
          <p className="text-xs text-slate-500 mt-0.5">City Stress</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-violet-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{userCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Citizens</p>
        </div>
      </div>

      {/* Critical Ward Alert */}
      {criticalWard.avgScore > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8 flex items-center gap-4">
          <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-red-900">Critical Ward: {criticalWard.name}</p>
            <p className="text-sm text-red-700">Average active issue score: {Math.round(criticalWard.avgScore)}/100</p>
          </div>
          <Link href="/admin/issues" className="text-sm text-red-700 font-medium hover:text-red-800 flex items-center gap-1">
            View <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Charts */}
      {total === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
          <FileWarning className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No issues yet</h3>
          <p className="text-slate-500 text-sm">Charts will appear once citizens start reporting issues.</p>
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <IssueStatusDonut open={open} inProgress={inProgress} completed={completed} blocked={blocked} />
            <IssueTrendLine labels={trendLabels} data={trendData} />
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <WardPriorityBar wards={wardPriority} />
            <ResolutionStackedBar wards={wardResolution} />
          </div>
        </>
      )}
    </div>
  );
}
