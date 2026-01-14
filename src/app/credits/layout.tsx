import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credits Kopen voor Woningfoto Verbetering",
  description:
    "Koop credits voor AI woningfoto verbetering. Vanaf €0.58 per foto. Verbeter je Funda foto's professioneel. Betaal met iDEAL of creditcard.",
  keywords: [
    "woningfoto credits kopen",
    "funda foto verbeteren prijs",
    "vastgoedfotografie kosten",
  ],
  alternates: {
    canonical: "https://pandblink.nl/credits",
  },
  openGraph: {
    title: "Credits Kopen | Pandblink",
    description:
      "Koop credits voor professionele foto verbeteringen. Vanaf €0.58 per foto.",
    url: "https://pandblink.nl/credits",
  },
};

// Product structured data for credit packages
const productSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "Product",
      position: 1,
      name: "Pandblink Starter - 10 Credits",
      description: "10 AI foto verbeteringen voor woningfotografie",
      offers: {
        "@type": "Offer",
        price: "9.00",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        priceValidUntil: "2026-12-31",
      },
    },
    {
      "@type": "Product",
      position: 2,
      name: "Pandblink Popular - 25 Credits",
      description: "25 AI foto verbeteringen voor woningfotografie - Beste waarde",
      offers: {
        "@type": "Offer",
        price: "19.00",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        priceValidUntil: "2026-12-31",
      },
    },
    {
      "@type": "Product",
      position: 3,
      name: "Pandblink Pro - 50 Credits",
      description: "50 AI foto verbeteringen voor woningfotografie",
      offers: {
        "@type": "Offer",
        price: "29.00",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        priceValidUntil: "2026-12-31",
      },
    },
  ],
};

export default function CreditsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {children}
    </>
  );
}
