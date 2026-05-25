import type { AuthUser, CollegeDetail, CollegeSummary, PaginatedColleges } from "@/types/college";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    signal: options?.signal,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    }
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed");
  }
  return payload;
}

export function getColleges(query: URLSearchParams, signal?: AbortSignal) {
  return request<PaginatedColleges>(`/api/colleges?${query.toString()}`, { signal });
}

export async function getCollege(slug: string) {
  const payload = await request<{ data: CollegeDetail }>(`/api/colleges/${slug}`);
  return payload.data;
}

export async function getCities() {
  const payload = await request<{ data: string[] }>("/api/colleges/cities");
  return payload.data;
}

export async function compareColleges(collegeA: string, collegeB: string) {
  const params = new URLSearchParams({ collegeA, collegeB });
  const payload = await request<{ data: CollegeSummary[] }>(`/api/compare?${params.toString()}`);
  return payload.data;
}

export async function getMe() {
  const payload = await request<{ data: AuthUser | null }>("/api/auth/me");
  return payload.data;
}

export async function login(email: string, password: string) {
  const payload = await request<{ data: AuthUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  return payload.data;
}

export async function signup(name: string, email: string, password: string) {
  const payload = await request<{ data: AuthUser }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password })
  });
  return payload.data;
}

export function logout() {
  return request<{ data: true }>("/api/auth/logout", { method: "POST" });
}

export function saveFavorite(collegeId: string) {
  return request<{ data: true }>("/api/favorites", {
    method: "POST",
    body: JSON.stringify({ collegeId })
  });
}

export function removeFavorite(collegeId: string) {
  return request<{ data: true }>(`/api/favorites/${collegeId}`, { method: "DELETE" });
}

export async function getFavorites() {
  const payload = await request<{ data: CollegeSummary[] }>("/api/favorites");
  return payload.data;
}
