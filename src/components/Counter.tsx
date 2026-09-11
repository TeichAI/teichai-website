"use client";

import { useEffect, useRef, useState } from "react";
import { formatCompact, formatFull } from "@/lib/format";

interface CounterProps {
  value: number;
  format?: "compact" | "full";
  suffix?: string;
  className?: string;
  duration?: number;
}

// Renders the final value on the server (always visible, no layout shift),
// then counts up from zero the first time it scrolls into view. Honours
// prefers-reduced-motion by leaving the final value in place.
export function Counter({ value, format = "compact", suffix = "", className, duration = 1.6 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / (duration * 1000));
          const eased = 1 - Math.pow(1 - t, 4);
          setDisplay(Math.round(value * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: "-10% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  const fmt = format === "compact" ? formatCompact : formatFull;
  return (
    <span ref={ref} className={className}>
      {fmt(display)}
      {suffix}
    </span>
  );
}
