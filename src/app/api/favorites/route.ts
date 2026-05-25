import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ApiError, handleApiError } from "@/lib/errors";
import { favoriteSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new ApiError(401, "Authentication required");
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            state: true,
            type: true,
            averageFees: true,
            averagePackage: true,
            highestPackage: true,
            rating: true,
            reviewCount: true
          }
        }
      }
    });

    return NextResponse.json({
      data: favorites.map((favorite) => ({ ...favorite.college, isFavorite: true }))
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new ApiError(401, "Authentication required");
    }

    const body = favoriteSchema.parse(await request.json());
    await prisma.favorite.upsert({
      where: { userId_collegeId: { userId: user.id, collegeId: body.collegeId } },
      update: {},
      create: { userId: user.id, collegeId: body.collegeId }
    });

    return NextResponse.json({ data: true }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
