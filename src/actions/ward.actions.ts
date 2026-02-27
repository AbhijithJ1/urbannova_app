"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createWard(name: string): Promise<{ error?: string }> {
  await requireAdmin();
  if (!name.trim()) return { error: "Ward name is required" };

  try {
    await db.ward.create({ data: { name: name.trim() } });
  } catch {
    return { error: "Ward name may already exist" };
  }
  revalidatePath("/admin/wards");
  revalidatePath("/register");
  return {};
}

export async function updateWard(id: string, name: string): Promise<{ error?: string }> {
  await requireAdmin();
  if (!name.trim()) return { error: "Ward name is required" };

  try {
    await db.ward.update({
      where: { id },
      data: { name: name.trim() },
    });
  } catch {
    return { error: "Ward name may already exist" };
  }
  revalidatePath("/admin/wards");
  return {};
}

export async function deleteWard(id: string): Promise<{ error?: string }> {
  await requireAdmin();

  const userCount = await db.user.count({ where: { wardId: id } });
  if (userCount > 0) {
    return { error: "Cannot delete ward with registered citizens" };
  }

  const issueCount = await db.issue.count({ where: { wardId: id } });
  if (issueCount > 0) {
    return { error: "Cannot delete ward with existing issues" };
  }

  try {
    await db.ward.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete ward — it may still have linked data" };
  }

  revalidatePath("/admin/wards");
  return {};
}
