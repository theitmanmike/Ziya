export default function EventDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="h-4 w-32 animate-pulse rounded bg-surface-hover" />
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-24 animate-pulse rounded-full bg-surface-hover" />
        <div className="h-6 w-28 animate-pulse rounded-full bg-surface-hover" />
      </div>
      <div className="mt-3 h-8 w-2/3 animate-pulse rounded bg-surface-hover" />
      <div className="mt-2 h-4 w-full animate-pulse rounded bg-surface-hover" />
      <div className="mt-6 h-48 w-full animate-pulse rounded-xl bg-surface-hover" />
    </div>
  );
}
