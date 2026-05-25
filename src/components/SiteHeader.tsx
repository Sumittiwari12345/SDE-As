import Link from "next/link";
import { GraduationCap, Search } from "lucide-react";
import { NavAuth } from "@/components/NavAuth";

const navLinks = [
  { href: "/", label: "Colleges" },
  { href: "/compare", label: "Compare" },
  { href: "/favorites", label: "Saved" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-600 text-white shadow-sm">
            <GraduationCap size={22} />
          </span>
          <div className="leading-tight">
            <span className="block text-lg font-bold text-ink">CollegeHub</span>
            <span className="hidden text-[11px] font-medium text-brand-600 sm:block">
              Discover · Compare · Decide
            </span>
          </div>
        </Link>

        <form action="/" method="get" className="hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              name="search"
              type="search"
              placeholder="Search colleges, cities, states..."
              className="input-field py-2 pl-10 pr-4 text-sm"
            />
          </div>
        </form>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 sm:px-3"
            >
              {link.label}
            </Link>
          ))}
          <NavAuth />
        </nav>
      </div>
    </header>
  );
}
