"use client";

import { Search } from "lucide-react";
import { FormEvent } from "react";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  totalColleges?: number;
};

export function HeroSection({ search, onSearchChange, onSearchSubmit, totalColleges }: Props) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSearchSubmit();
    document.getElementById("colleges-listing")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="bg-hero border-b border-brand-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center rounded-full bg-brand-100 px-4 py-1 text-sm font-semibold text-brand-700">
            India&apos;s college discovery platform
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Find the Right College for Your Future
          </h1>
          <p className="mt-3 text-base text-muted sm:text-lg">
            Search {totalColleges ? `${totalColleges}+` : ""} colleges, compare fees & placements, and
            save your favorites — just like CollegeDunia.
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  value={search}
                  onChange={(event) => onSearchChange(event.target.value)}
                  name="search"
                  autoComplete="off"
                  placeholder="Try IIT, VIT, Mumbai, Engineering..."
                  className="w-full rounded-xl border-0 bg-transparent py-3.5 pl-12 pr-4 text-ink outline-none placeholder:text-slate-400"
                />
              </div>
              <button type="submit" className="btn-primary shrink-0 px-8 py-3.5 sm:rounded-xl">
                Search Colleges
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
