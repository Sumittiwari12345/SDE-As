import Link from "next/link";
import { BarChart3, GitCompare, Heart, Search } from "lucide-react";

const actions = [
  {
    href: "/#colleges-listing",
    icon: Search,
    title: "Find Colleges",
    description: "Browse by city, fees, and ratings",
    color: "bg-orange-50 text-brand-600"
  },
  {
    href: "/compare",
    icon: GitCompare,
    title: "Compare Colleges",
    description: "Side-by-side fees, placements & ratings",
    color: "bg-blue-50 text-blue-600"
  },
  {
    href: "/favorites",
    icon: Heart,
    title: "Saved Colleges",
    description: "Your shortlisted colleges in one place",
    color: "bg-rose-50 text-rose-600"
  },
  {
    href: "/#colleges-listing",
    icon: BarChart3,
    title: "Top Ranked",
    description: "Colleges sorted by rating & packages",
    color: "bg-emerald-50 text-emerald-600"
  }
];

export function QuickActions() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="-mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="card group flex gap-4 p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft"
          >
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${action.color}`}>
              <action.icon size={22} />
            </span>
            <div>
              <h3 className="font-bold text-ink group-hover:text-brand-600">{action.title}</h3>
              <p className="mt-1 text-sm text-muted">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
