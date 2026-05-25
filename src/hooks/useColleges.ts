"use client";

import { useEffect, useState } from "react";
import type { PaginatedColleges } from "@/types/college";
import { getColleges } from "@/services/api";

const DEBOUNCE_MS = 300;

export function useColleges(queryString: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(queryString);
  const [data, setData] = useState<PaginatedColleges | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(queryString), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [queryString]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getColleges(new URLSearchParams(debouncedQuery), controller.signal)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err: Error) => {
        if (active && err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [debouncedQuery]);

  return { data, loading, error };
}
