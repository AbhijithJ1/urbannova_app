import { IssueLabel, IssueStatus } from "@/types";

export function getScoreSeverity(score: number): {
  label: string;
  color: string;
  bg: string;
} {
  if (score <= 33) return { label: "Low", color: "text-green-600", bg: "bg-green-100" };
  if (score <= 66) return { label: "Moderate", color: "text-yellow-600", bg: "bg-yellow-100" };
  return { label: "Critical", color: "text-red-600", bg: "bg-red-100" };
}

export function getScoreHex(score: number): string {
  if (score <= 33) return "#16a34a";
  if (score <= 66) return "#ca8a04";
  return "#dc2626";
}

export function getLabelColor(label: IssueLabel): string {
  const map: Record<IssueLabel, string> = {
    WASTE: "bg-orange-100 text-orange-700 border-orange-200",
    WATER: "bg-blue-100 text-blue-700 border-blue-200",
    ENERGY: "bg-yellow-100 text-yellow-700 border-yellow-200",
    POLLUTION: "bg-purple-100 text-purple-700 border-purple-200",
  };
  return map[label];
}

export function getLabelIcon(label: IssueLabel): string {
  const map: Record<IssueLabel, string> = {
    WASTE: "🗑️",
    WATER: "💧",
    ENERGY: "⚡",
    POLLUTION: "🌫️",
  };
  return map[label];
}

export function getStatusColor(status: IssueStatus): string {
  const map: Record<IssueStatus, string> = {
    OPEN: "bg-red-100 text-red-700 border-red-200",
    INPROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
    COMPLETED: "bg-green-100 text-green-700 border-green-200",
    BLOCKED: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return map[status];
}

export function getStatusLabel(status: IssueStatus): string {
  const map: Record<IssueStatus, string> = {
    OPEN: "Open",
    INPROGRESS: "In Progress",
    COMPLETED: "Completed",
    BLOCKED: "Blocked",
  };
  return map[status];
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getLast6Months(): string[] {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(
      d.toLocaleString("en-IN", { month: "short", year: "2-digit" })
    );
  }
  return months;
}

export function countIssuesByMonth(
  issues: { createdAt: Date | string }[]
): number[] {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return issues.filter((issue) => {
      const created = new Date(issue.createdAt);
      return (
        created.getFullYear() === d.getFullYear() &&
        created.getMonth() === d.getMonth()
      );
    }).length;
  });
}
