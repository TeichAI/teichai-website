"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyButton({
  text,
  className,
  label = "Copy",
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 1800);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label} to clipboard`}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 text-[11px] font-medium text-white/80 transition hover:bg-white/10 hover:text-white",
        state === "copied" && "border-emerald-400/40 text-emerald-300",
        state === "failed" && "border-red-400/40 text-red-300",
        className,
      )}
    >
      {state === "copied" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      <span aria-hidden>{state === "copied" ? "Copied" : state === "failed" ? "Select & copy" : label}</span>
      <span role="status" className="sr-only">
        {state === "copied" ? "Copied to clipboard" : state === "failed" ? "Copy failed; select the text to copy it" : ""}
      </span>
    </button>
  );
}
