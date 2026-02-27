import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { MapPin, Users, AlertTriangle } from "lucide-react";
import WardActions from "./WardActions";

export default async function AdminWardsPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/individual/dashboard");

  const wards = await db.ward.findMany({
    include: {
      users: { select: { id: true } },
      issues: { select: { id: true, score: true, status: true } },
    },
    orderBy: { name: "asc" },
  });

  const wardData = wards.map((w) => {
    const active = w.issues.filter((i) => i.status === "OPEN" || i.status === "INPROGRESS");
    const avgScore = active.length > 0
      ? Math.round(active.reduce((sum, i) => sum + i.score, 0) / active.length)
      : 0;

    return {
      id: w.id,
      name: w.name,
      citizenCount: w.users.length,
      issueCount: w.issues.length,
      openCount: w.issues.filter((i) => i.status === "OPEN").length,
      avgScore,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ward Management</h1>
          <p className="text-slate-500 mt-1">{wards.length} ward(s) registered</p>
        </div>
        <WardActions mode="create" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3.5">Ward Name</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3.5">Citizens</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3.5">Total Issues</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3.5">Open</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3.5">Avg Score</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {wardData.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                      </div>
                      <span className="font-medium text-slate-900">{w.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-sm text-slate-600">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {w.citizenCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-600">{w.issueCount}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-medium ${w.openCount > 0 ? "text-red-600" : "text-emerald-600"}`}>
                      {w.openCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      w.avgScore > 66 ? "bg-red-50 text-red-700" :
                      w.avgScore > 33 ? "bg-yellow-50 text-yellow-700" :
                      w.avgScore > 0 ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500"
                    }`}>
                      {w.avgScore > 0 && <AlertTriangle className="w-3 h-3" />}
                      {w.avgScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <WardActions mode="edit" wardId={w.id} wardName={w.name} />
                      <WardActions mode="delete" wardId={w.id} wardName={w.name} hasCitizens={w.citizenCount > 0} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
