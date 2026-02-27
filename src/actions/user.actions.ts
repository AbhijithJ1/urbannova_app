"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  wardId: string;
}) {
  const existing = await db.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("Email already registered");

  const ward = await db.ward.findUnique({ where: { id: data.wardId } });
  if (!ward) throw new Error("Invalid ward selected");

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: Role.USER,
      wardId: data.wardId,
    },
  });

  return { id: user.id, name: user.name, email: user.email };
}
