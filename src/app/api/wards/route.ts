import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const wards = await db.ward.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return NextResponse.json(wards);
}
