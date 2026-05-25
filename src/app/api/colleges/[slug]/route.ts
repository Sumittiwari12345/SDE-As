import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ApiError, handleApiError } from "@/lib/errors";
import { formatPlacement } from "@/lib/placement";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const user = await getCurrentUser();
    const college = await prisma.college.findUnique({
      where: { slug: params.slug },
      include: {
        courses: { orderBy: { annualFees: "asc" } },
        placements: { orderBy: { year: "desc" } },
        reviews: { orderBy: { createdAt: "desc" } }
      }
    });

    if (!college) {
      throw new ApiError(404, "College not found");
    }

    const favorite = user
      ? await prisma.favorite.findUnique({
          where: { userId_collegeId: { userId: user.id, collegeId: college.id } }
        })
      : null;

    return NextResponse.json({
      data: {
        ...college,
        placements: college.placements.map(formatPlacement),
        isFavorite: Boolean(favorite)
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
