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

export async function createWard(name: string) {
  await requireAdmin();
  if (!name.trim()) throw new Error("Ward name is required");

  const ward = await db.ward.create({ data: { name: name.trim() } });
  revalidatePath("/admin/wards");
  revalidatePath("/register");
  return ward;
}

export async function updateWard(id: string, name: string) {
  await requireAdmin();
  if (!name.trim()) throw new Error("Ward name is required");

  const ward = await db.ward.update({
    where: { id },
    data: { name: name.trim() },
  });
  revalidatePath("/admin/wards");
  return ward;
}

export async function deleteWard(id: string) {
  await requireAdmin();

  const userCount = await db.user.count({ where: { wardId: id } });
  if (userCount > 0) {
    throw new Error("Cannot delete ward with registered citizens");
  }

  const issueCount = await db.issue.count({ where: { wardId: id } });
  if (issueCount > 0) {
    throw new Error("Cannot delete ward with existing issues");
  }

  await db.ward.delete({ where: { id } });
  revalidatePath("/admin/wards");
}
