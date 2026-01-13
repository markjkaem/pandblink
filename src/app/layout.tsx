import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pandblink - Verbeter je woningfoto's met AI",
  description: "Maak je woningfoto's klaar voor Funda met AI. Verbeter licht, kleur en scherpte in seconden. 3 foto's gratis per maand.",
  keywords: ["woningfoto verbeteren", "funda foto bewerken", "vastgoed foto AI", "huis foto verbeteren", "makelaar foto"],
  authors: [{ name: "Pandblink" }],
  openGraph: {
    title: "Pandblink - Laat je woning stralen",
    description: "Verbeter je woningfoto's met AI. Perfect voor Funda listings.",
    type: "website",
    locale: "nl_NL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
