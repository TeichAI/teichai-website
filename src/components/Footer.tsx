import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LogoMark, Wordmark } from "./Logo";
import { LogoCircuit } from "./LogoCircuit";
import { navLinks, site } from "@/lib/site";

const columns = [
  {
    title: "Explore",
    links: navLinks.map((l) => ({ name: l.name, href: l.href, external: false })),
  },
  {
    title: "Community",
    links: [
      { name: "Hugging Face", href: site.links.huggingface, external: true },
      { name: "Discord", href: site.links.discord, external: true },
      { name: "Forum", href: site.links.forum, external: true },
      { name: "GitHub", href: site.links.github, external: true },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Ko-fi", href: site.links.kofi, external: true },
      { name: "PayPal", href: site.links.paypal, external: true },
      { name: "Request a distill", href: site.links.distillRequests, external: true },
      { name: "Org data (JSON)", href: "/api/huggingface", external: false },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border">
      <div className="pointer-events-none absolute -right-24 -top-16 w-[26rem] md:-right-6">
        <LogoCircuit variant="outline" uniform animate={false} nodes={false} strokeWidth={8} opacity={0.22} />
      </div>
      <div className="container-x relative py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <LogoMark size={30} />
              <Wordmark className="text-xl" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {site.tagline}
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Synced hourly from Hugging Face
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="eyebrow mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) =>
                  l.external ? (
                    <li key={l.name}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
                      >
                        {l.name}
                        <ArrowUpRight className="size-3 opacity-0 transition group-hover:opacity-70 group-focus-visible:opacity-70" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ) : (
                    <li key={l.name}>
                      <Link
                        href={l.href}
                        className="text-sm text-muted-foreground transition hover:text-foreground"
                      >
                        {l.name}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-subtle md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} TeichAI. Models and datasets released under their listed licenses.</p>
          <p className="font-mono">Open weights · Open data · Open tooling</p>
        </div>
      </div>
    </footer>
  );
}
