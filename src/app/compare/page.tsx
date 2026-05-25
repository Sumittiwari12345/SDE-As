"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GitCompare } from "lucide-react";
import type { CollegeSummary } from "@/types/college";
import { compareColleges, getColleges } from "@/services/api";
import { formatCurrency, formatLpa } from "@/utils/format";
import { EmptyState } from "@/components/EmptyState";

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10">Loading...</div>}>
      <ComparePageContent />
    </Suspense>
  );
}

function ComparePageContent() {
  const searchParams = useSearchParams();
  const [options, setOptions] = useState<CollegeSummary[]>([]);
  const [collegeA, setCollegeA] = useState(searchParams.get("a") ?? "");
  const [collegeB, setCollegeB] = useState(searchParams.get("b") ?? "");
  const [result, setResult] = useState<CollegeSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getColleges(new URLSearchParams({ page: "1", limit: "24" }))
      .then((payload) => setOptions(payload.data))
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    const a = searchParams.get("a");
    if (a) setCollegeA(a);
  }, [searchParams]);

  async function runCompare() {
    setError(null);
    setLoading(true);
    try {
      setResult(await compareColleges(collegeA, collegeB));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comparison failed");
      setResult([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-100 text-blue-600">
          <GitCompare size={24} />
        </span>
        <div>
          <h1 className="section-title">Compare Colleges</h1>
          <p className="text-sm text-muted">
            Compare on fees, placements, ratings — like CollegeDunia&apos;s compare tool
          </p>
        </div>
      </div>

      <section className="card mt-8 p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <SelectCollege label="College A" value={collegeA} onChange={setCollegeA} options={options} />
          <SelectCollege label="College B" value={collegeB} onChange={setCollegeB} options={options} />
          <button
            onClick={runCompare}
            disabled={!collegeA || !collegeB || loading}
            className="btn-primary h-fit px-8"
          >
            {loading ? "Comparing..." : "Compare Now"}
          </button>
        </div>
      </section>

      {error && <div className="mt-6"><EmptyState title="Comparison unavailable" message={error} /></div>}

      {result.length === 2 && (
        <section className="card mt-6 overflow-hidden">
          <div className="grid grid-cols-3 border-b border-slate-200 bg-gradient-to-r from-brand-50 to-blue-50 text-sm font-bold text-ink">
            <div className="p-4">Metric</div>
            {result.map((college) => (
              <Link
                key={college.id}
                href={`/colleges/${college.slug}`}
                className="border-l border-slate-200 p-4 text-brand-700 hover:underline"
              >
                {college.name}
              </Link>
            ))}
          </div>
          <CompareRow label="Location" values={result.map((item) => `${item.city}, ${item.state}`)} />
          <CompareRow label="College type" values={result.map((item) => item.type)} />
          <CompareRow label="Average fees" values={result.map((item) => formatCurrency(item.averageFees))} highlight />
          <CompareRow label="Average placement" values={result.map((item) => formatLpa(item.averagePackage))} highlight />
          <CompareRow label="Highest placement" values={result.map((item) => formatLpa(item.highestPackage))} />
          <CompareRow label="Student rating" values={result.map((item) => `${item.rating.toFixed(1)} / 5`)} />
          <CompareRow label="Reviews" values={result.map((item) => String(item.reviewCount))} />
        </section>
      )}
    </div>
  );
}

function SelectCollege({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: CollegeSummary[];
}) {
  return (
    <label className="text-sm font-semibold text-ink">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="input-field mt-2">
        <option value="">Select a college</option>
        {options.map((college) => (
          <option key={college.id} value={college.id}>
            {college.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function CompareRow({
  label,
  values,
  highlight = false
}: {
  label: string;
  values: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-3 border-b border-slate-100 text-sm last:border-b-0 ${
        highlight ? "bg-brand-50/40" : ""
      }`}
    >
      <div className="p-4 font-semibold text-muted">{label}</div>
      {values.map((value, index) => (
        <div key={`${label}-${index}`} className="border-l border-slate-100 p-4 font-medium text-ink">
          {value}
        </div>
      ))}
    </div>
  );
}
