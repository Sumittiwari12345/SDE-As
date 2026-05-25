"use client";

type SearchPreset = {
  label: string;
  search?: string;
  city?: string;
  maxFees?: string;
};

const presets: SearchPreset[] = [
  { label: "IIT Bombay", search: "iit" },
  { label: "VIT Vellore", search: "vit" },
  { label: "NIT Trichy", search: "nit" },
  { label: "Mumbai colleges", city: "Mumbai" },
  { label: "Bengaluru colleges", city: "Bengaluru" },
  { label: "Engineering colleges", search: "engineering" },
  { label: "Under ₹2L fees", maxFees: "200000" }
];

type Props = {
  onApply: (preset: SearchPreset) => void;
};

export function PopularSearches({ onApply }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Popular searches</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onApply(preset)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </section>
  );
}
