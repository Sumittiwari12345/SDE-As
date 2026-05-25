import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ApiError, handleApiError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function DELETE(_request: NextRequest, { params }: { params: { collegeId: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new ApiError(401, "Authentication required");
    }

    await prisma.favorite.deleteMany({
      where: { userId: user.id, collegeId: params.collegeId }
    });

    return NextResponse.json({ data: true });
  } catch (error) {
    return handleApiError(error);
  }
}
