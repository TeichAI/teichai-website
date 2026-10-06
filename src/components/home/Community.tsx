import { ArrowUpRight, Heart } from "lucide-react";
import { site } from "@/lib/site";
import { formatCompact } from "@/lib/format";
import { DiscordIcon, HuggingFaceIcon, KofiIcon } from "@/components/BrandIcons";
import { Button } from "@/components/ui/button";

export function Community({ followers }: { followers: number }) {
  const cards = [
    {
      icon: <DiscordIcon className="size-5" />,
      title: "Discord",
      body: "Distill requests, release announcements, training chatter. The fastest way to reach us.",
      href: site.links.discord,
      cta: "Join the server",
    },
    {
      icon: <HuggingFaceIcon className="size-5" />,
      title: "Hugging Face",
      body: `${formatCompact(followers)} followers get every drop first. Weights, quants and datasets live here.`,
      href: site.links.huggingface,
      cta: "Follow TeichAI",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <a
            key={c.title}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover group flex flex-col rounded-2xl border border-border bg-surface p-6"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-surface-2 text-foreground">{c.icon}</span>
            <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-ember">
              {c.cta} <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        ))}
      </div>

      <div className="noise relative overflow-hidden rounded-3xl border border-ember/30 bg-gradient-to-br from-ember/15 via-surface to-surface p-6 md:p-10">
        <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow">Support the lab</p>
            <h3 className="mt-3 text-balance text-2xl font-semibold tracking-tight md:text-3xl">
              Every coffee turns into API credits and GPU hours.
            </h3>
            <p className="mt-3 text-pretty text-muted-foreground">
              We are a small team paying for frontier-model generation and training runs out of pocket. A single
              high-reasoning dataset can cost more than a month of rent in tokens. If our models save you time,
              consider chipping in, or drop a distill request in the Discord and tell us what to build next.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" variant="ember">
              <a href={site.links.kofi} target="_blank" rel="noopener noreferrer">
                <KofiIcon className="size-4" /> Buy us a coffee on Ko-fi
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href={site.links.paypal} target="_blank" rel="noopener noreferrer">
                <Heart className="size-4" /> Donate via PayPal
              </a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href={site.links.distillRequests} target="_blank" rel="noopener noreferrer">
                <DiscordIcon className="size-4" /> Request a distill on Discord <ArrowUpRight className="size-3.5 opacity-60" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
