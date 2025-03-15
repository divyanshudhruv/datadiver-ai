import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DataDiver AI - Transform Websites into Clean JSON",
  description: "AI-powered web scraping tool that extracts structured data from any website. Convert unstructured web content to clean, organized JSON with our simple API.",
  keywords: ["web scraping", "AI", "JSON", "data extraction", "web crawler", "structured data", "content extraction", "HTML parsing", "Mistral AI"],
  robots: "index, follow",
  alternates: {
    canonical: "https://datadiver-ai.vercel.app",
  },
  authors: [{ name: "Divyanshu Dhruv", url: "https://github.com/divyanshudhruv" }],
  category: "technology",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
  ],
  openGraph: {
    title: "DataDiver AI - Transform Websites into Clean JSON",
    description: "Extract structured data from any website with our AI-powered web scraping tool. Convert messy HTML into clean, organized JSON instantly.",
    url: "https://datadiver-ai.vercel.app",
    siteName: "DataDiver AI",
    images: [
      {
        url: "/og.png",
        alt: "DataDiver AI - Web Scraping Made Easy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DataDiver AI - Web Scraping Made Easy",
    description: "Transform any website into clean JSON with our AI-powered web scraping tool",
    images: ["/og.png"],
    creator: "@divyanshudhruv",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "DataDiver AI",
              "applicationCategory": "WebApplication",
              "operatingSystem": "Web",
              "description": "AI-powered web scraping tool that extracts structured data from any website."
            })
          }}
        />
      </head>
      <Analytics />
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
