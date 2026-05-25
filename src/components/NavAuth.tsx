"use client";

import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function NavAuth() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <span className="hidden text-sm text-slate-500 sm:inline">...</span>;
  }

  if (!user) {
    return (
      <Link className="btn-primary px-4 py-2 text-sm" href="/login">
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-sm text-slate-700 sm:flex">
        <UserRound size={15} />
        {user.name.split(" ")[0]}
      </span>
      <button
        onClick={logout}
        className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        aria-label="Logout"
        title="Logout"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}
