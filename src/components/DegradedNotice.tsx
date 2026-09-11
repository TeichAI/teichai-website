import { AlertTriangle } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Shown when a primary Hugging Face request failed for this render.
export function DegradedNotice({ className }: { className?: string }) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground",
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden />
      <p>
        Hugging Face did not answer in time, so this page may be missing models or datasets. The full catalog is
        always at{" "}
        <a href={site.links.huggingface} className="font-medium text-ember underline underline-offset-2" target="_blank" rel="noopener noreferrer">
          huggingface.co/TeichAI
        </a>
        .
      </p>
    </div>
  );
}
