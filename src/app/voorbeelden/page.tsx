"use client";

import Link from "next/link";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

const examples = [
  {
    id: 1,
    title: "Moderne woning",
    description: "Verbeterde belichting en levendige kleuren",
    before: "/examples/huis-1.jpg",
    after: "/examples/huis-1-enhanced.jpg",
  },
  {
    id: 2,
    title: "Stadswoning",
    description: "Scherpere details en natuurlijke tinten",
    before: "/examples/huis-2.webp",
    after: "/examples/huis-2-enhanced.webp",
  },
  {
    id: 3,
    title: "Vrijstaand huis",
    description: "Professionele uitstraling voor Funda",
    before: "/examples/huis-3.webp",
    after: "/examples/huis-3-enhanced.webp",
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
          Bekijk het verschil dat Pandblink AI maakt. Sleep de slider om de
          originele en verbeterde foto&apos;s te vergelijken.
        </p>
        <p className="text-sm text-slate-500 text-center mb-12">
          Klik op het vergrootglas voor volledig scherm
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example) => (
            <div
              key={example.id}
              className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="aspect-[4/3]">
                <BeforeAfterSlider
                  beforeImage={example.before}
                  afterImage={example.after}
                  beforeLabel="Voor"
                  afterLabel="Na"
                />
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

        {/* Stats section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-1">&lt;30s</div>
            <div className="text-sm text-slate-600">Verwerkingstijd</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-1">HDR</div>
            <div className="text-sm text-slate-600">Effect toevoegen</div>
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
