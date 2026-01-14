import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Funda Foto Verbeteren | AI Woningfoto Verbetering voor Funda",
  description:
    "Verbeter je Funda foto's met AI. Maak je woningfoto's professioneel in seconden. Meer bekijkers, snellere verkoop. 3 foto's gratis!",
  keywords: [
    "funda foto verbeteren",
    "funda foto bewerken",
    "woningfoto verbeteren funda",
    "huis foto funda",
    "funda listing foto",
    "vastgoedfoto verbeteren",
  ],
  alternates: {
    canonical: "https://pandblink.nl/funda-foto-verbeteren",
  },
  openGraph: {
    title: "Funda Foto Verbeteren met AI | Pandblink",
    description:
      "Verbeter je woningfoto's voor Funda. Professionele kwaliteit in seconden. 3 foto's gratis!",
    url: "https://pandblink.nl/funda-foto-verbeteren",
  },
};

export default function FundaFotoVerbeterenPage() {
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
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition"
          >
            Start nu gratis
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Funda Foto Verbeteren met{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              AI
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Maak je woningfoto&apos;s klaar voor Funda in seconden. Onze AI verbetert
            automatisch belichting, kleuren en scherpte voor professionele resultaten.
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-amber-600 transition shadow-lg shadow-orange-500/25"
          >
            Probeer gratis - 3 foto&apos;s
          </Link>
        </section>

        {/* Waarom Funda foto's verbeteren */}
        <section className="bg-slate-50 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Waarom je Funda foto&apos;s verbeteren?
            </h2>
            <div className="prose prose-lg max-w-none text-slate-600">
              <p>
                Als je je huis verkoopt via Funda, zijn goede foto&apos;s essentieel.
                Funda is het grootste vastgoedplatform van Nederland en potentiële
                kopers scrollen dagelijks door honderden woningadvertenties. Je hebt
                slechts enkele seconden om hun aandacht te trekken.
              </p>
              <p>
                <strong>Onderzoek toont aan</strong> dat woningen met professionele foto&apos;s
                tot 32% sneller verkopen en gemiddeld 47% meer bekeken worden dan
                woningen met amateur foto&apos;s. Het probleem? Een professionele
                vastgoedfotograaf kost al snel €200 tot €400 per sessie.
              </p>
              <p>
                Met Pandblink kun je zelf je woningfoto&apos;s verbeteren voor een fractie
                van de prijs. Onze AI-technologie analyseert je foto en past automatisch
                de belichting, kleuren en scherpte aan voor een professioneel resultaat.
              </p>
            </div>
          </div>
        </section>

        {/* Wat we verbeteren */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
              Wat verbetert onze AI aan je Funda foto&apos;s?
            </h2>
            <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
              Onze AI is specifiek getraind op woningfotografie en weet precies wat
              nodig is voor aantrekkelijke vastgoedfoto&apos;s.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  🌟 Belichting optimaliseren
                </h3>
                <p className="text-slate-600">
                  Donkere hoeken en kamers worden opgehelderd zonder dat het
                  onnatuurlijk wordt. Ramen die overbelicht zijn worden gecorrigeerd.
                  Het resultaat: een gelijkmatig verlichte ruimte die groter en
                  uitnodigender lijkt.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  🎨 Kleuren versterken
                </h3>
                <p className="text-slate-600">
                  Grauwe, vale foto&apos;s krijgen levendige, natuurlijke kleuren.
                  Houten vloeren worden warmer, groene tuinen frisser en blauwe
                  luchten helderder. Zonder overdreven filters of onrealistische effecten.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  🔍 Scherpte verhogen
                </h3>
                <p className="text-slate-600">
                  Details worden scherper zonder harde randen. Van tegels en
                  stucwerk tot keukenapparatuur en decoratie - alles komt beter
                  tot zijn recht in je Funda listing.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  ⚪ Witbalans corrigeren
                </h3>
                <p className="text-slate-600">
                  Witte muren die gelig of blauwachtig lijken worden gecorrigeerd.
                  Dit is een veelvoorkomend probleem bij binnen-foto&apos;s en maakt een
                  groot verschil in de algehele uitstraling.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips voor Funda foto's */}
        <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Tips voor de beste Funda foto&apos;s
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-2">
                  1. Fotografeer bij daglicht
                </h3>
                <p className="text-slate-600">
                  Maak je foto&apos;s overdag wanneer er voldoende natuurlijk licht is.
                  Open alle gordijnen en zet lampen aan voor extra sfeer. Onze AI
                  kan veel corrigeren, maar begint graag met een goed uitgangspunt.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-2">
                  2. Ruim op en style
                </h3>
                <p className="text-slate-600">
                  Verwijder persoonlijke spullen en rommel. Een opgeruimde ruimte
                  lijkt groter en stelt kopers in staat zich voor te stellen hoe
                  zij de ruimte zouden inrichten.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-2">
                  3. Gebruik de juiste hoek
                </h3>
                <p className="text-slate-600">
                  Fotografeer vanuit een hoek van de kamer voor meer diepte.
                  Houd de camera op borsthoogte en zorg dat verticale lijnen
                  recht blijven.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-2">
                  4. Upload naar Pandblink
                </h3>
                <p className="text-slate-600">
                  Na het fotograferen upload je je foto&apos;s naar Pandblink.
                  Binnen seconden heb je professioneel verbeterde foto&apos;s die
                  klaar zijn voor je Funda advertentie.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Prijzen */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Betaalbaar voor iedereen
            </h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Geen dure fotograaf nodig. Met Pandblink verbeter je je Funda foto&apos;s
              vanaf slechts €0,58 per foto. Start gratis met 3 foto&apos;s.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="text-3xl font-bold text-slate-900 mb-1">€9</div>
                <div className="text-slate-500 mb-4">10 foto&apos;s</div>
                <div className="text-sm text-green-600 font-medium">€0,90 per foto</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg ring-2 ring-orange-500">
                <div className="text-sm text-orange-500 font-medium mb-2">Populair</div>
                <div className="text-3xl font-bold text-slate-900 mb-1">€19</div>
                <div className="text-slate-500 mb-4">25 foto&apos;s</div>
                <div className="text-sm text-green-600 font-medium">€0,76 per foto</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="text-3xl font-bold text-slate-900 mb-1">€29</div>
                <div className="text-slate-500 mb-4">50 foto&apos;s</div>
                <div className="text-sm text-green-600 font-medium">€0,58 per foto</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Klaar om je Funda foto&apos;s te verbeteren?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Begin vandaag nog en geef je woningadvertentie de aandacht die het verdient.
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-amber-600 transition"
            >
              Start gratis met 3 foto&apos;s
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <Link href="/" className="text-slate-400 hover:text-white transition">
              ← Terug naar Pandblink
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
