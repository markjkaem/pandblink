import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Over Ons | Pandblink",
  description:
    "Leer meer over Pandblink, de Nederlandse AI-dienst voor woningfoto verbetering. Ontdek ons verhaal en missie.",
  keywords: [
    "pandblink over ons",
    "woningfoto verbetering nederland",
    "ai fotografie bedrijf",
  ],
};

export default function OverOnsPage() {
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

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
          Over Pandblink
        </h1>
        <p className="text-slate-600 text-center mb-12">
          De slimme manier om je woningfoto&apos;s te verbeteren
        </p>

        <div className="space-y-8">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Onze Missie
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Bij Pandblink geloven we dat iedereen toegang moet hebben tot
              professionele woningfotografie. Of je nu je huis verkoopt via
              Funda, een makelaar bent, of vastgoed verhuurt – met onze
              AI-technologie transformeren we je foto&apos;s naar professionele
              kwaliteit in enkele seconden.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Wat We Doen
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Onze geavanceerde AI analyseert je woningfoto&apos;s en verbetert
              automatisch:
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">✓</span>
                <span>
                  <strong>Belichting</strong> – Donkere ruimtes worden helder en
                  uitnodigend
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">✓</span>
                <span>
                  <strong>Kleuren</strong> – Natuurlijke, levendige kleuren die
                  de ruimte tot leven brengen
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">✓</span>
                <span>
                  <strong>Scherpte</strong> – Kristalheldere details voor een
                  professionele uitstraling
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">✓</span>
                <span>
                  <strong>Contrast</strong> – Gebalanceerde tonen voor maximale
                  impact
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Waarom Pandblink?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-slate-900 mb-2">
                  Snel & Eenvoudig
                </h3>
                <p className="text-slate-600 text-sm">
                  Upload je foto en ontvang binnen seconden een verbeterde
                  versie. Geen ingewikkelde software nodig.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Betaalbaar</h3>
                <p className="text-slate-600 text-sm">
                  Vanaf €0.58 per foto. Veel goedkoper dan een professionele
                  fotograaf inhuren.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 mb-2">
                  Nederlands Bedrijf
                </h3>
                <p className="text-slate-600 text-sm">
                  Gevestigd in Nederland, met Nederlandse klantenservice en
                  iDEAL betaling.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 mb-2">
                  Privacy Eerst
                </h3>
                <p className="text-slate-600 text-sm">
                  Je foto&apos;s zijn veilig bij ons. We delen nooit je gegevens
                  met derden.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            Probeer het zelf – 3 foto&apos;s gratis
          </Link>
        </div>
      </main>
    </div>
  );
}
