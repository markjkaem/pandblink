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
    default: "Pandblink - Verbeter je woningfoto's met AI",
    template: "%s | Pandblink",
  },
  description:
    "Maak je woningfoto's klaar voor Funda met AI. Verbeter licht, kleur en scherpte in seconden. 3 foto's gratis!",
  keywords: [
    "woningfoto verbeteren",
    "funda foto bewerken",
    "vastgoed foto AI",
    "huis foto verbeteren",
    "makelaar foto",
    "foto bewerken funda",
    "ai foto verbetering",
    "vastgoedfotografie",
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
    title: "Pandblink - Laat je woning stralen",
    description:
      "Verbeter je woningfoto's met AI. Perfect voor Funda listings. 3 foto's gratis!",
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
    title: "Pandblink - Verbeter je woningfoto's met AI",
    description: "Maak je Funda foto's professioneel met AI. 3 foto's gratis!",
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
  name: "Pandblink",
  applicationCategory: "PhotoEditingApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    description: "3 gratis foto verbeteringen, daarna vanaf €0.58 per foto",
  },
  description:
    "AI-gestuurde woningfoto verbetering voor Funda. Verbetert belichting, kleuren en scherpte automatisch.",
  inLanguage: "nl",
  url: "https://pandblink.nl",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "50",
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
