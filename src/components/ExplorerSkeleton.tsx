export function ExplorerSkeleton({ cards = 9 }: { cards?: number }) {
  return (
    <div className="space-y-6" role="status" aria-busy="true">
      <span className="sr-only">Loading</span>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="h-11 flex-1 animate-pulse rounded-xl bg-surface-2" />
        <div className="h-11 w-full animate-pulse rounded-xl bg-surface-2 sm:w-48" />
      </div>
      <div className="h-40 animate-pulse rounded-2xl bg-surface-2" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="h-52 animate-pulse rounded-2xl bg-surface-2" style={{ animationDelay: `${i * 60}ms` }} />
        ))}
      </div>
    </div>
  );
}
