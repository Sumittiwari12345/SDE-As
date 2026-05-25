import { prisma } from "@/lib/prisma";

function likePattern(value: string) {
  return `%${value.trim()}%`;
}

/** Case-insensitive search across college fields and course names (SQLite-safe). */
export async function findMatchingCollegeIds(search: string): Promise<string[]> {
  const term = search.trim();
  if (!term) return [];

  const pattern = likePattern(term);
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT DISTINCT c.id
    FROM College c
    LEFT JOIN Course co ON co.collegeId = c.id
    WHERE LOWER(c.name) LIKE LOWER(${pattern})
       OR LOWER(c.slug) LIKE LOWER(${pattern})
       OR LOWER(c.city) LIKE LOWER(${pattern})
       OR LOWER(c.state) LIKE LOWER(${pattern})
       OR LOWER(c.overview) LIKE LOWER(${pattern})
       OR LOWER(co.name) LIKE LOWER(${pattern})
       OR LOWER(co.degree) LIKE LOWER(${pattern})
  `;

  return rows.map((row) => row.id);
}

/** Case-insensitive partial match on city or state. */
export async function findCollegeIdsInCity(city: string): Promise<string[]> {
  const term = city.trim();
  if (!term) return [];

  const pattern = likePattern(term);
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM College
    WHERE LOWER(city) LIKE LOWER(${pattern})
       OR LOWER(state) LIKE LOWER(${pattern})
  `;

  return rows.map((row) => row.id);
}

export function intersectIds(a: string[], b: string[]): string[] {
  const set = new Set(b);
  return a.filter((id) => set.has(id));
}
