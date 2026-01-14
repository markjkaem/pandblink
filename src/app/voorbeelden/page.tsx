import Link from "next/link";
import Image from "next/image";
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

const examples = [
  {
    id: 1,
    title: "Woonkamer",
    description: "Donkere woonkamer getransformeerd naar lichte, uitnodigende ruimte",
    before: "/examples/woonkamer-voor.jpg",
    after: "/examples/woonkamer-na.jpg",
  },
  {
    id: 2,
    title: "Keuken",
    description: "Kleurloze keuken met verbeterde warmte en helderheid",
    before: "/examples/keuken-voor.jpg",
    after: "/examples/keuken-na.jpg",
  },
  {
    id: 3,
    title: "Slaapkamer",
    description: "Onderbelichte slaapkamer met geoptimaliseerde belichting",
    before: "/examples/slaapkamer-voor.jpg",
    after: "/examples/slaapkamer-na.jpg",
  },
  {
    id: 4,
    title: "Badkamer",
    description: "Geelachtige tint gecorrigeerd naar natuurlijke kleuren",
    before: "/examples/badkamer-voor.jpg",
    after: "/examples/badkamer-na.jpg",
  },
  {
    id: 5,
    title: "Tuin",
    description: "Bewolkte tuin omgetoverd naar zonnige buitenruimte",
    before: "/examples/tuin-voor.jpg",
    after: "/examples/tuin-na.jpg",
  },
  {
    id: 6,
    title: "Exterieur",
    description: "Gevelaanzicht met verbeterde scherpte en contrast",
    before: "/examples/exterieur-voor.jpg",
    after: "/examples/exterieur-na.jpg",
  },
];

export default function VoorbeeldenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Pandblink</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            Terug naar home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
          Voorbeelden
        </h1>
        <p className="text-slate-600 text-center mb-4 max-w-2xl mx-auto">
          Bekijk het verschil dat Pandblink AI maakt. Vergelijk de originele
          foto&apos;s met de verbeterde versies.
        </p>
        <p className="text-sm text-slate-500 text-center mb-12">
          Beweeg je muis over de foto&apos;s om het voor/na effect te zien
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {examples.map((example) => (
            <div
              key={example.id}
              className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="relative aspect-[4/3] group cursor-pointer">
                {/* Before image (shown by default) */}
                <Image
                  src={example.before}
                  alt={`${example.title} - voor`}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* After image (shown on hover) */}
                <Image
                  src={example.after}
                  alt={`${example.title} - na`}
                  fill
                  className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Labels */}
                <div className="absolute top-3 left-3 bg-slate-900/70 text-white text-xs font-medium px-2 py-1 rounded transition-opacity duration-300 group-hover:opacity-0">
                  VOOR
                </div>
                <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  NA
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-slate-900 mb-1">
                  {example.title}
                </h3>
                <p className="text-sm text-slate-600">{example.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder notice */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <p className="text-amber-800 text-sm">
            <strong>Let op:</strong> De voorbeeldafbeeldingen worden binnenkort
            toegevoegd. Plaats je eigen afbeeldingen in{" "}
            <code className="bg-amber-100 px-1 rounded">/public/examples/</code>{" "}
            met de bestandsnamen zoals hierboven aangegeven.
          </p>
        </div>

        {/* Stats section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-1">3 sec</div>
            <div className="text-sm text-slate-600">Verwerkingstijd</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-1">4x</div>
            <div className="text-sm text-slate-600">Scherpere details</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-1">100%</div>
            <div className="text-sm text-slate-600">Automatisch</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-1">€0.58</div>
            <div className="text-sm text-slate-600">Vanaf per foto</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Overtuigd? Probeer het zelf!
          </h2>
          <p className="text-slate-600 mb-6">
            Je eerste 3 foto&apos;s zijn gratis. Geen creditcard nodig.
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all text-lg"
          >
            Start nu gratis
          </Link>
        </div>
      </main>
    </div>
  );
}
