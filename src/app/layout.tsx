import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeichAI - Distilled Models & Datasets",
  description: "Open-source distilled models and curated reasoning datasets from frontier AI models like Claude, GPT, and Gemini.",
  metadataBase: new URL("https://teichai.com"),
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "TeichAI - Distilled Models & Datasets",
    description: "Open-source distilled models and curated reasoning datasets from frontier AI models like Claude, GPT, and Gemini.",
    url: "https://teichai.com",
    siteName: "TeichAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TeichAI - Distilled Models & Datasets",
    description: "Open-source distilled models and curated reasoning datasets from frontier AI models.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
