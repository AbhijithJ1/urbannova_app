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
}): Promise<{ error?: string }> {
  const session = await auth();
  if (!session || session.user.role !== "USER") return { error: "Unauthorized" };
  if (!session.user.wardId) return { error: "No ward assigned" };

  if (data.score < 1 || data.score > 100) return { error: "Score must be 1–100" };

  try {
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
  } catch {
    return { error: "Failed to create issue" };
  }

  revalidatePath("/individual/issues");
  revalidatePath("/individual/dashboard");
  return {};
}

export async function updateIssueStatus(
  issueId: string,
  status: IssueStatus,
  blockReason?: string
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  if (status === IssueStatus.BLOCKED && !blockReason?.trim()) {
    return { error: "Block reason is required" };
  }

  try {
    await db.issue.update({
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
  } catch {
    return { error: "Failed to update issue status" };
  }

  revalidatePath("/admin/issues");
  revalidatePath(`/individual/issues/${issueId}`);
  return {};
}
