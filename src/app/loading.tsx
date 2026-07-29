export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <div className="h-7 w-40 animate-pulse rounded bg-surface-hover" />
        <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-surface-hover" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-4 sm:p-5">
            <div className="flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded-full bg-surface-hover" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-surface-hover" />
            </div>
            <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-surface-hover" />
            <div className="mt-2 h-4 w-full animate-pulse rounded bg-surface-hover" />
            <div className="mt-1 h-4 w-2/3 animate-pulse rounded bg-surface-hover" />
            <div className="mt-4 h-12 w-full animate-pulse rounded-lg bg-surface-hover" />
          </div>
        ))}
      </div>
    </div>
  );
}
