import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoCircuit } from "@/components/LogoCircuit";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80vh] flex-col items-center justify-center pt-24 text-center">
      <div className="w-40">
        <LogoCircuit variant="outline" />
      </div>
      <p className="eyebrow mt-8">404 · trace not found</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">This path was never distilled.</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you are looking for does not exist. The catalog, however, is very much alive.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="ember">
          <Link href="/models">
            Browse models <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </section>
  );
}
