export function LoadingGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="card animate-pulse overflow-hidden">
          <div className="flex gap-4 p-5">
            <div className="h-14 w-14 shrink-0 rounded-xl bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-1/2 rounded bg-slate-100" />
              <div className="h-5 w-1/3 rounded bg-slate-100" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px border-t border-slate-100 bg-slate-50 p-3">
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
