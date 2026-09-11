import type { ReactNode } from "react";
import { Eyebrow } from "./ui/section";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden pb-10 pt-32 md:pt-40", className)}>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid mask-radial absolute inset-0 opacity-50" />
        <div className="absolute left-1/2 top-0 h-[28rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--accent-glow),transparent)] opacity-50 blur-2xl" />
      </div>
      <div className="container-x">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">{description}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

export function StatPill({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="inline-flex items-baseline gap-2 rounded-full border border-border bg-surface px-4 py-2">
      <span className="text-lg font-semibold tabular text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
