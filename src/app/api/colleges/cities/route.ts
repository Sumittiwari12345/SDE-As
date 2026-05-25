import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await prisma.college.findMany({
      distinct: ["city"],
      orderBy: { city: "asc" },
      select: { city: true }
    });
    return NextResponse.json({ data: rows.map((row) => row.city) });
  } catch (error) {
    return handleApiError(error);
  }
}
