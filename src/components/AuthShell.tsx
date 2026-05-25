import { GraduationCap } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: Props) {
  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white shadow-soft">
          <GraduationCap size={28} />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
      <div className="card p-6 sm:p-8">{children}</div>
    </div>
  );
}
