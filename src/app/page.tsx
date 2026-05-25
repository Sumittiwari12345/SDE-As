"use client";

import { Suspense } from "react";
import { CollegeCard } from "@/components/CollegeCard";
import { EmptyState } from "@/components/EmptyState";
import { HeroSection } from "@/components/HeroSection";
import { LoadingGrid } from "@/components/LoadingGrid";
import { PopularSearches } from "@/components/PopularSearches";
import { QuickActions } from "@/components/QuickActions";
import { useColleges } from "@/hooks/useColleges";
import { getCities } from "@/services/api";
import { Filter, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <CollegeListingPage />
    </Suspense>
  );
}

function HomePageFallback() {
  return (
    <>
      <div className="bg-hero border-b border-brand-100 py-16" />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <LoadingGrid />
      </div>
    </>
  );
}

function CollegeListingPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [maxFees, setMaxFees] = useState(searchParams.get("maxFees") ?? "");
  const [page, setPage] = useState(1);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
    setCity(searchParams.get("city") ?? "");
    setMaxFees(searchParams.get("maxFees") ?? "");
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    getCities().then(setCities).catch(() => setCities([]));
  }, []);

  const queryString = useMemo(() => {
    const query = new URLSearchParams({
      page: String(page),
      limit: "6"
    });
    if (search.trim()) query.set("search", search.trim());
    if (city) query.set("city", city);
    if (maxFees) query.set("maxFees", maxFees);
    return query.toString();
  }, [city, maxFees, page, search]);

  const { data, loading, error } = useColleges(queryString);

  function resetPage(action: () => void) {
    action();
    setPage(1);
  }

  function applyPreset(preset: { search?: string; city?: string; maxFees?: string }) {
    setSearch(preset.search ?? "");
    setCity(preset.city ?? "");
    setMaxFees(preset.maxFees ?? "");
    setPage(1);
    document.getElementById("colleges-listing")?.scrollIntoView({ behavior: "smooth" });
  }

  function clearFilters() {
    setSearch("");
    setCity("");
    setMaxFees("");
    setPage(1);
  }

  return (
    <>
      <HeroSection
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={() => setPage(1)}
        totalColleges={data?.meta.total}
      />
      <QuickActions />
      <PopularSearches onApply={applyPreset} />

      <div id="colleges-listing" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-72 lg:shrink-0">
            <div className="card sticky top-24 p-5">
              <div className="flex items-center gap-2 text-ink">
                <Filter size={18} className="text-brand-600" />
                <h2 className="font-bold">Filters</h2>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-sm font-medium text-ink" htmlFor="sidebar-search">
                    Search
                  </label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      id="sidebar-search"
                      value={search}
                      onChange={(event) => resetPage(() => setSearch(event.target.value))}
                      placeholder="Name, city, state..."
                      className="input-field py-2 pl-9 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-ink" htmlFor="city">
                    City
                  </label>
                  <select
                    id="city"
                    value={city}
                    onChange={(event) => resetPage(() => setCity(event.target.value))}
                    className="input-field mt-2 text-sm"
                  >
                    <option value="">All cities</option>
                    {cities.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-ink" htmlFor="fees">
                    Max annual fees (₹)
                  </label>
                  <input
                    id="fees"
                    type="number"
                    min="0"
                    value={maxFees}
                    onChange={(event) => resetPage(() => setMaxFees(event.target.value))}
                    placeholder="e.g. 300000"
                    className="input-field mt-2 text-sm"
                  />
                </div>

                <button type="button" onClick={clearFilters} className="btn-outline w-full text-sm">
                  Clear filters
                </button>
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="section-title">Top Colleges in India</h2>
                <p className="mt-1 text-sm text-muted">
                  Ranked by rating and placement packages
                </p>
              </div>
              {data && (
                <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
                  {data.meta.total} colleges
                </span>
              )}
            </div>

            <div className="mt-6">
              {loading && <LoadingGrid />}
              {error && (
                <EmptyState
                  title="Could not load colleges"
                  message={
                    error.includes("Internal") || error.includes("failed")
                      ? `${error} — Run: npm run db:setup`
                      : error
                  }
                />
              )}
              {!loading && !error && data?.data.length === 0 && (
                <EmptyState title="No colleges found" message="Try adjusting your search or filters." />
              )}

              {!loading && !error && data && data.data.length > 0 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {data.data.map((college) => (
                      <CollegeCard key={college.id} college={college} />
                    ))}
                  </div>

                  <div className="card mt-6 flex items-center justify-between p-4">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((value) => value - 1)}
                      className="btn-outline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm font-medium text-muted">
                      Page {data.meta.page} of {Math.max(data.meta.totalPages, 1)}
                    </span>
                    <button
                      disabled={page >= data.meta.totalPages}
                      onClick={() => setPage((value) => value + 1)}
                      className="btn-outline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
