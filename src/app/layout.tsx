import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import CookieConsent from "@/components/CookieConsent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pandblink.nl"),
  title: {
    default: "Woningfoto Verbeteren met AI | Pandblink - Perfect voor Funda",
    template: "%s | Pandblink",
  },
  description:
    "Verbeter je woningfoto's voor Funda met AI. Professionele belichting, heldere kleuren en scherpe details in seconden. Verkoop je huis sneller met mooiere foto's. 3 foto's gratis!",
  keywords: [
    "funda foto verbeteren",
    "woningfoto verbeteren",
    "huis foto bewerken",
    "funda foto tips",
    "woningfotografie",
    "vastgoed foto AI",
    "ai foto verbetering woning",
    "goedkope woningfotografie",
    "foto's voor funda verbeteren",
    "makelaar foto verbeteren",
    "huis verkopen foto",
  ],
  authors: [{ name: "Pandblink" }],
  creator: "Pandblink",
  publisher: "Pandblink",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Woningfoto Verbeteren voor Funda | Pandblink",
    description:
      "Verbeter je woningfoto's met AI. Professionele foto's voor Funda in seconden. Verkoop je huis sneller. 3 foto's gratis!",
    type: "website",
    locale: "nl_NL",
    url: "https://pandblink.nl",
    siteName: "Pandblink",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pandblink - AI woningfoto verbetering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Funda Foto Verbeteren met AI | Pandblink",
    description: "Verbeter je woningfoto's voor Funda. Professionele resultaten in seconden. 3 foto's gratis!",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://pandblink.nl",
  },
  manifest: "/manifest.json",
};

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Pandblink - Woningfoto Verbeteren",
  applicationCategory: "PhotoEditingApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    description: "3 gratis woningfoto verbeteringen, daarna vanaf €0.58 per foto",
  },
  description:
    "Verbeter je woningfoto's voor Funda met AI. Optimaliseer belichting, kleuren en scherpte automatisch. Perfect voor particuliere verkopers en makelaars.",
  inLanguage: "nl",
  url: "https://pandblink.nl",
  keywords: "funda foto verbeteren, woningfoto verbeteren, huis foto bewerken, vastgoedfotografie",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "127",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>{children}</SessionProvider>
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
