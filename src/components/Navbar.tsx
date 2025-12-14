"use client";

import { useState } from "react";
import { Menu, Sun, Moon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Models", href: "/models" },
    { name: "Datasets", href: "/datasets" },
    { name: "Benchmarks", href: "/benchmarks" },
    { name: "About", href: "/about" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 shadow-[0_1px_0_rgba(255,255,255,0.03)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="TeichAI Logo"
            width={32}
            height={32}
            className="rounded-lg shadow-sm"
            priority
          />
          <span className="text-lg font-semibold tracking-tight text-foreground">TeichAI</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button
              key={link.name}
              asChild
              variant={isActive(link.href) ? "default" : "ghost"}
              className="h-9 px-4"
            >
              <Link href={link.href}>{link.name}</Link>
            </Button>
          ))}

          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="ml-1"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <Button asChild className="ml-1">
            <a href="https://huggingface.co/TeichAI" target="_blank" rel="noopener noreferrer">
              HF Hub
            </a>
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5"
              >
                <Image
                  src="/logo.png"
                  alt="TeichAI Logo"
                  width={28}
                  height={28}
                  className="rounded-md"
                />
                <span className="font-semibold tracking-tight">TeichAI</span>
              </Link>

              <Separator className="my-4" />

              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Button
                    key={link.name}
                    asChild
                    variant={isActive(link.href) ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={link.href}>{link.name}</Link>
                  </Button>
                ))}
              </div>

              <Separator className="my-4" />

              <Button asChild className="w-full">
                <a href="https://huggingface.co/TeichAI" target="_blank" rel="noopener noreferrer">
                  HF Hub
                </a>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
