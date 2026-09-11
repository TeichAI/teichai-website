import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "ember" | "outline" | "mono" | "success";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-foreground/90 border-transparent",
  ember: "bg-accent text-ember border-transparent",
  outline: "bg-transparent text-muted-foreground border-border-strong",
  mono: "bg-surface-2 text-foreground/80 border-transparent font-mono tracking-tight",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-transparent",
};

export function Chip({
  children,
  tone = "neutral",
  dot,
  className,
  title,
}: {
  children: ReactNode;
  tone?: Tone;
  dot?: string;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-[11.5px] font-medium leading-none",
        tones[tone],
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden
          className="inline-block size-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: dot }}
        />
      )}
      {children}
    </span>
  );
}

export function MetaItem({
  icon,
  children,
  className,
  title,
}: {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground tabular", className)}
    >
      {icon}
      {title && <span className="sr-only">{title}: </span>}
      {children}
    </span>
  );
}
