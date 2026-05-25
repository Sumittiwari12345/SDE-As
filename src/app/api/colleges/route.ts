import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  findCollegeIdsInCity,
  findMatchingCollegeIds,
  intersectIds
} from "@/lib/college-search";
import { handleApiError } from "@/lib/errors";
import { listCollegesSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const query = listCollegesSchema.parse(params);
    const user = await getCurrentUser();

    const andFilters: Prisma.CollegeWhereInput[] = [];
    if (query.minFees) andFilters.push({ averageFees: { gte: query.minFees } });
    if (query.maxFees) andFilters.push({ averageFees: { lte: query.maxFees } });

    const searchIds = query.search ? await findMatchingCollegeIds(query.search) : null;
    const cityIds = query.city ? await findCollegeIdsInCity(query.city) : null;

    let idFilter: string[] | null = null;
    if (searchIds !== null && cityIds !== null) {
      idFilter = intersectIds(searchIds, cityIds);
    } else if (searchIds !== null) {
      idFilter = searchIds;
    } else if (cityIds !== null) {
      idFilter = cityIds;
    }

    if (idFilter !== null) {
      andFilters.push({ id: { in: idFilter.length > 0 ? idFilter : ["__none__"] } });
    }

    const where: Prisma.CollegeWhereInput = andFilters.length > 0 ? { AND: andFilters } : {};

    const [total, colleges, favoriteRows] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        orderBy: [{ rating: "desc" }, { averagePackage: "desc" }],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
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
      }),
      user
        ? prisma.favorite.findMany({
            where: { userId: user.id },
            select: { collegeId: true }
          })
        : Promise.resolve([])
    ]);

    const favoriteIds = new Set(favoriteRows.map((row) => row.collegeId));

    return NextResponse.json({
      data: colleges.map((college) => ({
        ...college,
        isFavorite: favoriteIds.has(college.id)
      })),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
