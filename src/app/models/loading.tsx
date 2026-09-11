import { ExplorerSkeleton } from "@/components/ExplorerSkeleton";

export default function Loading() {
  return (
    <section className="container-x pb-24 pt-40">
      <div className="mb-10 space-y-4">
        <div className="h-4 w-32 animate-pulse rounded bg-surface-2" />
        <div className="h-12 w-2/3 animate-pulse rounded-lg bg-surface-2" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-surface-2" />
      </div>
      <ExplorerSkeleton />
    </section>
  );
}
