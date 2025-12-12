import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
