"use client";

import { useId, type ReactNode } from "react";
import { ArrowUpDown, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

// Wraps the filter groups. Always visible on md+, collapsible on phones.
export function FilterPanel({
  open,
  onToggle,
  activeCount,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  activeCount: number;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className="rounded-2xl border border-border bg-surface/60">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium md:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-subtle" />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-ember">
              {activeCount}
              <span className="sr-only"> active</span>
            </span>
          )}
        </span>
        <ChevronDown className={cn("size-4 text-subtle transition-transform", open && "rotate-180")} />
      </button>
      <div
        id={id}
        className={cn("space-y-3 p-4 md:block", !open && "hidden", open && "border-t border-border md:border-t-0")}
      >
        {children}
      </div>
    </div>
  );
}

export function FilterChip({
  active,
  onClick,
  children,
  count,
  dot,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  count?: number;
  dot?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-xs font-medium transition",
        active
          ? "border-ember bg-accent text-foreground shadow-[0_0_0_1px_var(--accent)]"
          : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
        className,
      )}
    >
      {dot && (
        <span aria-hidden className="inline-block size-1.5 rounded-full" style={{ backgroundColor: dot }} />
      )}
      {children}
      {typeof count === "number" && (
        <span className={cn("tabular text-[11px]", active ? "text-ember" : "text-subtle")}>
          <span className="sr-only">, </span>
          {count}
        </span>
      )}
    </button>
  );
}

export function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
      <span id={id} className="eyebrow mt-2 w-24 shrink-0 text-[11px] text-subtle">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <div className="relative flex h-11 flex-1 items-center">
      <Search className="pointer-events-none absolute left-3.5 size-4 text-subtle" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-full w-full rounded-xl border border-border-control bg-surface pl-10 pr-10 text-base text-foreground outline-none transition placeholder:text-subtle focus:border-ember focus:ring-2 focus:ring-ember sm:text-sm [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-1.5 inline-flex size-8 items-center justify-center rounded-md text-subtle hover:bg-surface-2 hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

export function SortSelect<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger className="h-11 w-full rounded-xl bg-surface sm:w-48" aria-label="Sort results">
        <span className="flex items-center gap-2">
          <ArrowUpDown className="size-3.5 text-subtle" />
          <SelectValue placeholder="Sort" />
        </span>
      </SelectTrigger>
      <SelectContent align="end">
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ResultsBar({
  count,
  total,
  noun,
  hasFilters,
  onClear,
}: {
  count: number;
  total: number;
  noun: string;
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 text-xs text-muted-foreground">
      <span className="tabular" role="status" aria-live="polite">
        Showing <span className="font-semibold text-foreground">{count}</span> of {total} {noun}
      </span>
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-ember transition hover:bg-accent"
        >
          <X className="size-3" /> Clear filters
        </button>
      )}
    </div>
  );
}

export function EmptyState({ onClear, noun }: { onClear: () => void; noun: string }) {
  return (
    <div className="col-span-full rounded-2xl border border-dashed border-border-strong py-16 text-center">
      <p className="text-sm text-muted-foreground">No {noun} match those filters.</p>
      <button type="button" onClick={onClear} className="mt-3 text-sm font-medium text-ember hover:underline">
        Clear filters
      </button>
    </div>
  );
}
