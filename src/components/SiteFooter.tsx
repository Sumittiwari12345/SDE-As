import Link from "next/link";
import { GraduationCap } from "lucide-react";

const footerLinks = {
  Explore: [
    { href: "/", label: "All Colleges" },
    { href: "/compare", label: "Compare Colleges" },
    { href: "/favorites", label: "Saved Colleges" }
  ],
  Popular: [
    { href: "/?search=Engineering", label: "Engineering" },
    { href: "/?search=Management", label: "Management" },
    { href: "/?city=Bangalore", label: "Bangalore" },
    { href: "/?city=Mumbai", label: "Mumbai" }
  ],
  Account: [
    { href: "/login", label: "Login" },
    { href: "/signup", label: "Sign Up" }
  ]
};

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-ink text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600">
                <GraduationCap size={20} />
              </span>
              <span className="text-lg font-bold">CollegeHub</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Find, compare, and shortlist colleges across India — inspired by the discovery experience
              on CollegeDunia.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">{title}</h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-400 transition hover:text-brand-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-700 pt-8 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} CollegeHub. Built for SDE Assignment.</p>
          <p>Data is seeded for demo purposes.</p>
        </div>
      </div>
    </footer>
  );
}
