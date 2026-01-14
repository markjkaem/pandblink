import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mijn Foto's",
  description: "Bekijk je eerder verbeterde woningfoto's en download ze opnieuw.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
