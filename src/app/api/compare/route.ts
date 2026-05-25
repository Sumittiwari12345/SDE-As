import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, handleApiError } from "@/lib/errors";
import { compareSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const query = compareSchema.parse(Object.fromEntries(request.nextUrl.searchParams));
    if (query.collegeA === query.collegeB) {
      throw new ApiError(400, "Please select two different colleges");
    }

    const colleges = await prisma.college.findMany({
      where: {
        id: { in: [query.collegeA, query.collegeB] }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        state: true,
        averageFees: true,
        averagePackage: true,
        highestPackage: true,
        rating: true,
        reviewCount: true
      }
    });

    if (colleges.length !== 2) {
      throw new ApiError(404, "One or more colleges could not be found");
    }

    return NextResponse.json({ data: colleges });
  } catch (error) {
    return handleApiError(error);
  }
}
