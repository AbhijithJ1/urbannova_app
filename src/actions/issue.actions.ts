"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { IssueLabel, IssueStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createIssue(data: {
  title: string;
  description: string;
  landmark: string;
  label: IssueLabel;
  score: number;
}) {
  const session = await auth();
  if (!session || session.user.role !== "USER") throw new Error("Unauthorized");
  if (!session.user.wardId) throw new Error("No ward assigned");

  if (data.score < 1 || data.score > 100) throw new Error("Score must be 1–100");

  const issue = await db.issue.create({
    data: {
      title: data.title.trim(),
      description: data.description.trim(),
      landmark: data.landmark.trim(),
      label: data.label,
      score: data.score,
      status: IssueStatus.OPEN,
      wardId: session.user.wardId,
      userId: session.user.id,
    },
  });

  // Create initial status log
  await db.issueStatusLog.create({
    data: {
      issueId: issue.id,
      status: IssueStatus.OPEN,
      changedById: session.user.id,
    },
  });

  revalidatePath("/individual/issues");
  revalidatePath("/individual/dashboard");
  return issue;
}

export async function updateIssueStatus(
  issueId: string,
  status: IssueStatus,
  blockReason?: string
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  if (status === IssueStatus.BLOCKED && !blockReason?.trim()) {
    throw new Error("Block reason is required");
  }

  const issue = await db.issue.update({
    where: { id: issueId },
    data: {
      status,
      blockReason: status === IssueStatus.BLOCKED ? blockReason?.trim() : null,
    },
  });

  await db.issueStatusLog.create({
    data: {
      issueId,
      status,
      blockReason: status === IssueStatus.BLOCKED ? blockReason?.trim() : null,
      changedById: session.user.id,
    },
  });

  revalidatePath("/admin/issues");
  revalidatePath(`/individual/issues/${issueId}`);
  return issue;
}
