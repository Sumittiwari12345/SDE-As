import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await clearSession();
    return NextResponse.json({ data: true });
  } catch (error) {
    return handleApiError(error);
  }
}
