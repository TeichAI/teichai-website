import { CopyButton } from "@/components/CopyButton";
import { cn } from "@/lib/utils";

export function Snippet({
  code,
  label,
  language,
  className,
}: {
  code: string;
  label?: string;
  language?: string;
  className?: string;
}) {
  return (
    <div className={cn("code-block relative overflow-hidden", className)}>
      {(label || language) && (
        <div className="flex items-center justify-between border-b border-white/[0.07] px-3.5 py-2">
          <span className="text-[11px] font-medium text-white/70">{label}</span>
          <div className="flex items-center gap-2">
            {language && (
              <span className="font-mono text-[11px] uppercase tracking-wider text-white/60">{language}</span>
            )}
            <CopyButton text={code} />
          </div>
        </div>
      )}
      {!label && !language && (
        <div className="absolute right-2 top-2">
          <CopyButton text={code} />
        </div>
      )}
      {/* Focusable so keyboard users can scroll long lines. */}
      <pre
        tabIndex={0}
        role="region"
        aria-label={label ? `${label} code` : "Code"}
        className="overflow-x-auto px-4 py-3.5 text-[12.5px] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ember"
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
