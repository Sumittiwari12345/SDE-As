export function parseTopRecruiters(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return value ? [value] : [];
  }
}

export function formatPlacement<T extends { topRecruiters: string }>(placement: T) {
  return {
    ...placement,
    topRecruiters: parseTopRecruiters(placement.topRecruiters)
  };
}
