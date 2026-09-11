import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoGlyph } from "./LogoCircuit";

export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return <LogoGlyph size={size} className={cn("select-none", className)} />;
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-semibold tracking-tight", className)}>
      Teich<span className="text-ember">AI</span>
    </span>
  );
}

export function LogoLink({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5 rounded-lg", className)}
      aria-label="TeichAI home"
    >
      <span className="relative">
        <span className="absolute inset-0 rounded-full bg-ember/40 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
        <LogoMark className="relative transition-transform duration-500 group-hover:rotate-90" />
      </span>
      <Wordmark className="text-[17px]" />
    </Link>
  );
}
