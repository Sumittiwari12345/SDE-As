"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Heart,
  MapPin,
  Star,
  Building2,
  GraduationCap,
  Briefcase,
  MessageSquare
} from "lucide-react";
import type { CollegeDetail } from "@/types/college";
import { getCollege, removeFavorite, saveFavorite } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency, formatLpa } from "@/utils/format";
import { EmptyState } from "@/components/EmptyState";

const typeLabels = {
  PRIVATE: "Private University",
  PUBLIC: "Government College",
  DEEMED: "Deemed University"
};

export default function CollegeDetailPage({ params }: { params: { slug: string } }) {
  const [college, setCollege] = useState<CollegeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "reviews">("overview");
  const { user } = useAuth();

  useEffect(() => {
    getCollege(params.slug)
      .then(setCollege)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.slug]);

  async function toggleFavorite() {
    if (!college) return;
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (college.isFavorite) {
      await removeFavorite(college.id);
      setCollege({ ...college, isFavorite: false });
    } else {
      await saveFavorite(college.id);
      setCollege({ ...college, isFavorite: true });
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-64 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState title="College unavailable" message={error ?? "The requested college could not be loaded."} />
      </div>
    );
  }

  const latestPlacement = college.placements[0];
  const initials = college.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: Building2 },
    { id: "courses" as const, label: "Courses", icon: GraduationCap },
    { id: "placements" as const, label: "Placements", icon: Briefcase },
    { id: "reviews" as const, label: "Reviews", icon: MessageSquare }
  ];

  return (
    <div className="pb-12">
      <section className="border-b border-brand-100 bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            ← Back to colleges
          </Link>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-5">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-2xl font-bold text-white shadow-soft">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{college.name}</h1>
                <p className="mt-2 flex flex-wrap items-center gap-2 text-muted">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={16} className="text-brand-500" />
                    {college.city}, {college.state}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span>Est. {college.establishedYear}</span>
                  <span className="text-slate-300">·</span>
                  <span className="rounded-md bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">
                    {typeLabels[college.type]}
                  </span>
                </p>
                <div className="mt-3 inline-flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-800">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  {college.rating.toFixed(1)} / 5
                  <span className="font-normal text-amber-700">({college.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {college.website && (
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center gap-2"
                >
                  Website
                  <ExternalLink size={15} />
                </a>
              )}
              <Link href={`/compare?a=${college.id}`} className="btn-outline">
                Compare
              </Link>
              <button
                onClick={toggleFavorite}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Heart size={17} className={college.isFavorite ? "fill-white" : ""} />
                {college.isFavorite ? "Saved" : "Save College"}
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Average fees" value={formatCurrency(college.averageFees)} />
            <Stat label="Avg package" value={formatLpa(college.averagePackage)} />
            <Stat label="Highest package" value={formatLpa(college.highestPackage)} />
            <Stat label="Courses offered" value={String(college.courses.length)} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="-mt-px flex gap-1 overflow-x-auto border-b border-slate-200 bg-white">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "border-brand-600 text-brand-600"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-ink">About {college.name}</h2>
              <p className="mt-4 leading-7 text-slate-700">{college.overview}</p>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="card overflow-hidden">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-lg font-bold text-ink">Courses & Fees</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-muted">
                    <tr>
                      <th className="px-5 py-3">Course</th>
                      <th className="px-5 py-3">Degree</th>
                      <th className="px-5 py-3">Duration</th>
                      <th className="px-5 py-3">Annual fees</th>
                      <th className="px-5 py-3">Seats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {college.courses.map((course) => (
                      <tr key={course.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                        <td className="px-5 py-3.5 font-semibold text-ink">{course.name}</td>
                        <td className="px-5 py-3.5 text-muted">{course.degree}</td>
                        <td className="px-5 py-3.5 text-muted">{course.duration}</td>
                        <td className="px-5 py-3.5 font-medium text-brand-700">{formatCurrency(course.annualFees)}</td>
                        <td className="px-5 py-3.5 text-muted">{course.seats}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "placements" && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-ink">Placement Highlights</h2>
              {latestPlacement ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <Stat label="Placement rate" value={`${latestPlacement.placementRate}%`} compact />
                  <Stat label="Average package" value={formatLpa(latestPlacement.averagePackage)} compact />
                  <Stat label="Highest package" value={formatLpa(latestPlacement.highestPackage)} compact />
                  <div className="sm:col-span-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Top recruiters</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {latestPlacement.topRecruiters.map((recruiter) => (
                        <span
                          key={recruiter}
                          className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700"
                        >
                          {recruiter}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-muted">Placement data not available.</p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-3">
              {college.reviews.map((review) => (
                <div key={review.id} className="card p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-ink">{review.author}</p>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-800">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      {review.rating}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  compact = false
}: {
  label: string;
  value: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`rounded-xl bg-white/80 ${compact ? "p-4" : "border border-white/60 p-4 shadow-sm backdrop-blur"}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1 font-bold text-ink ${compact ? "text-lg" : "text-xl"}`}>{value}</p>
    </div>
  );
}
