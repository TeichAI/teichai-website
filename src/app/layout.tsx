import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider, themeInitScript } from "@/components/ThemeProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { LogoSprite } from "@/components/LogoSprite";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  // Share images and canonicals resolve against the production domain.
  metadataBase: new URL(site.url),
  title: {
    default: "TeichAI — Open distillation lab",
    template: "%s · TeichAI",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "TeichAI",
    "distillation",
    "distilled models",
    "reasoning datasets",
    "agent traces",
    "GGUF",
    "Qwen",
    "Gemma",
    "Claude distill",
    "open source LLM",
    "teich",
  ],
  // Title and description are inherited per page; the file-based
  // opengraph-image.png is attached automatically.
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
    { media: "(prefers-color-scheme: light)", color: "#faf7f3" },
  ],
  width: "device-width",
  initialScale: 1,
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#org`,
      name: site.name,
      url: site.url,
      logo: `${site.url}/icon-512.png`,
      sameAs: [site.links.huggingface, site.links.github, site.links.discord],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      publisher: { "@id": `${site.url}/#org` },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen antialiased`}>
        <LogoSprite />
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main" tabIndex={-1} className="relative outline-none">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
