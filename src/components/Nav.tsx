"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, MessagesSquare, Moon, Sun } from "lucide-react";
import { LogoLink, LogoMark, Wordmark } from "./Logo";
import { useTheme } from "./ThemeProvider";
import { DiscordIcon, GithubIcon, HuggingFaceIcon } from "./BrandIcons";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
    >
      {children}
    </a>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300",
        scrolled || open ? "glass border-border" : "border-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <LogoLink />

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.name}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-ember shadow-[0_0_12px_var(--accent)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-0.5 md:flex">
          <div className="hidden items-center gap-0.5 lg:flex">
            <IconLink href={site.links.discord} label="Discord">
              <DiscordIcon className="size-4" />
            </IconLink>
            <IconLink href={site.links.forum} label="Community forum">
              <MessagesSquare className="size-4" />
            </IconLink>
            <IconLink href={site.links.github} label="GitHub">
              <GithubIcon className="size-4" />
            </IconLink>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
          >
            <ThemeIcon className="size-4" />
          </button>
          <a
            href={site.links.huggingface}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TeichAI on Hugging Face (opens in a new tab)"
            className="ml-2 inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-foreground pl-3 pr-3.5 text-sm font-medium text-background transition hover:bg-ember hover:text-primary-foreground"
          >
            <HuggingFaceIcon className="size-4" />
            <span className="hidden lg:inline">Hugging Face</span>
            <span className="lg:hidden">HF</span>
            <ArrowUpRight className="size-3.5 opacity-70" />
          </a>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
          >
            <ThemeIcon className="size-5" />
          </button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition hover:bg-surface-2"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[88vw] max-w-sm flex-col border-border bg-background p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-16 items-center border-b border-border px-5">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                  <LogoMark size={26} />
                  <Wordmark className="text-[17px]" />
                </Link>
              </div>
              <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-lg font-medium transition",
                      isActive(link.href)
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                    )}
                  >
                    {link.name}
                    {isActive(link.href) && <span className="size-1.5 rounded-full bg-ember" />}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-3 border-t border-border p-4">
                <a
                  href={site.links.huggingface}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-medium text-background"
                >
                  <HuggingFaceIcon className="size-4" />
                  Open Hugging Face org
                </a>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={site.links.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 items-center justify-center gap-2 rounded-xl bg-surface-2 text-xs font-medium"
                  >
                    <DiscordIcon className="size-4" /> Discord
                  </a>
                  <a
                    href={site.links.forum}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 items-center justify-center gap-2 rounded-xl bg-surface-2 text-xs font-medium"
                  >
                    <MessagesSquare className="size-4" /> Forum
                  </a>
                  <a
                    href={site.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 items-center justify-center gap-2 rounded-xl bg-surface-2 text-xs font-medium"
                  >
                    <GithubIcon className="size-4" /> GitHub
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
