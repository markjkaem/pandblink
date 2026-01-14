import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voorbeelden van Foto Verbetering | Pandblink",
  description:
    "Bekijk voor- en na-voorbeelden van woningfoto's verbeterd met Pandblink AI. Zie het verschil dat professionele belichting en kleuren maken.",
  keywords: [
    "woningfoto voorbeelden",
    "voor en na foto verbetering",
    "funda foto voorbeelden",
    "ai foto resultaten",
  ],
};

export default function VoorbeeldenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
