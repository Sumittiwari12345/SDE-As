"use client";

import { useAuth } from "@/hooks/useAuth";
import { removeFavorite, saveFavorite } from "@/services/api";
import type { CollegeSummary } from "@/types/college";
import { formatCurrency, formatLpa } from "@/utils/format";
import { ArrowRight, Heart, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  college: CollegeSummary;
};

const typeLabels = {
  PRIVATE: "Private",
  PUBLIC: "Government",
  DEEMED: "Deemed"
};

const typeColors = {
  PRIVATE: "bg-violet-100 text-violet-700",
  PUBLIC: "bg-emerald-100 text-emerald-700",
  DEEMED: "bg-amber-100 text-amber-800"
};

export function CollegeCard({ college }: Props) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(college.isFavorite);

  useEffect(() => {
    setIsFavorite(college.isFavorite);
  }, [college.isFavorite]);

  async function toggleFavorite(event: React.MouseEvent) {
    event.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(college.id);
      } else {
        await saveFavorite(college.id);
      }
      setIsFavorite((value) => !value);
    } catch {
      // Keep the current state if the API request fails.
    }
  }

  const initials = college.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <article className="card group overflow-hidden transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft">
      <div className="flex items-start gap-4 p-5">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-bold text-white shadow-sm">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href={`/colleges/${college.slug}`}
                className="line-clamp-2 text-lg font-bold text-ink transition group-hover:text-brand-600"
              >
                {college.name}
              </Link>
              <p className="mt-1.5 flex items-center gap-1 text-sm text-muted">
                <MapPin size={14} className="shrink-0 text-brand-500" />
                {college.city}, {college.state}
              </p>
            </div>
            <button
              onClick={toggleFavorite}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50"
              aria-label="Toggle favorite"
              title="Save favorite"
            >
              <Heart size={17} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${typeColors[college.type]}`}>
              {typeLabels[college.type]}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {college.rating.toFixed(1)}
              <span className="font-normal text-amber-700/80">({college.reviewCount} reviews)</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px border-t border-slate-100 bg-slate-50/80 text-center text-sm">
        <Metric label="Avg fees" value={formatCurrency(college.averageFees)} />
        <Metric label="Avg package" value={formatLpa(college.averagePackage)} />
        <Metric label="Highest" value={formatLpa(college.highestPackage)} />
      </div>

      <div className="border-t border-slate-100 px-5 py-3">
        <Link
          href={`/colleges/${college.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          View details
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="px-3 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-bold text-ink">{value}</p>
    </div>
  );
}
