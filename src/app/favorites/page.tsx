"use client";

import { CollegeCard } from "@/components/CollegeCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingGrid } from "@/components/LoadingGrid";
import { getFavorites } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CollegeSummary } from "@/types/college";

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [colleges, setColleges] = useState<CollegeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    getFavorites()
      .then(setColleges)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (!authLoading && !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="Login to view saved colleges"
          message="Create an account or login to save and manage your favorite colleges."
        />
        <div className="mt-6 text-center">
          <Link href="/login" className="btn-primary inline-block">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-rose-100 text-rose-600">
          <Heart size={24} />
        </span>
        <div>
          <h1 className="section-title">Saved Colleges</h1>
          <p className="text-sm text-muted">Colleges you&apos;ve shortlisted for later</p>
        </div>
      </div>

      <div className="mt-8">
        {loading && <LoadingGrid />}
        {error && <EmptyState title="Could not load favorites" message={error} />}
        {!loading && !error && colleges.length === 0 && (
          <EmptyState
            title="No saved colleges yet"
            message="Browse colleges and tap the heart icon to save them here."
          />
        )}
        {!loading && !error && colleges.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {colleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
