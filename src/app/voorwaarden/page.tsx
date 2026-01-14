import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden | Pandblink",
  description:
    "Lees de algemene voorwaarden van Pandblink. Voorwaarden voor het gebruik van onze AI foto verbeteringsdienst.",
  keywords: ["pandblink voorwaarden", "algemene voorwaarden", "gebruiksvoorwaarden"],
};

export default function VoorwaardenPage() {
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
          Algemene Voorwaarden
        </h1>
        <p className="text-slate-600 text-center mb-12">
          Laatst bijgewerkt: januari 2025
        </p>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              1. Definities
            </h2>
            <ul className="space-y-2 text-slate-600">
              <li>
                <strong>Pandblink:</strong> De aanbieder van de AI
                fotoverwerkingsdienst, bereikbaar via pandblink.nl
              </li>
              <li>
                <strong>Gebruiker:</strong> Iedere natuurlijke of rechtspersoon
                die gebruik maakt van de dienst
              </li>
              <li>
                <strong>Dienst:</strong> De AI-gestuurde fotoverbetering
                aangeboden via de website
              </li>
              <li>
                <strong>Credits:</strong> Tegoed dat kan worden gebruikt voor
                fotoverbetering
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              2. Toepasselijkheid
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Deze algemene voorwaarden zijn van toepassing op elk gebruik van
              de dienst en elke overeenkomst tussen Pandblink en de gebruiker.
              Door gebruik te maken van de dienst, ga je akkoord met deze
              voorwaarden.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              3. De Dienst
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Pandblink biedt een AI-gestuurde fotoverwerkingsdienst waarmee
              gebruikers woningfoto&apos;s kunnen verbeteren. De dienst omvat:
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Automatische verbetering van belichting en kleuren</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Verhoging van scherpte en beeldkwaliteit</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Opslag van verbeterde foto&apos;s in je account</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              4. Account en Registratie
            </h2>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  Je moet een account aanmaken om de dienst te gebruiken
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  Je bent verantwoordelijk voor het geheim houden van je
                  inloggegevens
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  Je mag je account niet delen met of overdragen aan anderen
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Je moet minimaal 18 jaar oud zijn om de dienst te gebruiken</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              5. Credits en Betaling
            </h2>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  Nieuwe gebruikers ontvangen 3 gratis credits bij registratie
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>1 credit = 1 fotoverbetering</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Gekochte credits verlopen niet</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  Betalingen zijn definitief; credits kunnen niet worden
                  terugbetaald
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  Prijzen zijn inclusief BTW en kunnen zonder voorafgaande
                  kennisgeving worden gewijzigd
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              6. Gebruik van de Dienst
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Je gaat ermee akkoord om:
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  Alleen foto&apos;s te uploaden waarvan je de rechten bezit of
                  toestemming hebt
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  Geen illegale, aanstootgevende of schadelijke content te
                  uploaden
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  De dienst niet te misbruiken of te proberen te hacken
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  Geen geautomatiseerde systemen te gebruiken om de dienst te
                  benaderen
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              7. Intellectueel Eigendom
            </h2>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  Je behoudt alle rechten op je originele foto&apos;s
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  Je behoudt alle rechten op de verbeterde versies van je
                  foto&apos;s
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  De Pandblink software, website en branding blijven eigendom
                  van Pandblink
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              8. Aansprakelijkheid
            </h2>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  De dienst wordt geleverd &quot;as is&quot; zonder garanties
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  Pandblink is niet aansprakelijk voor indirecte schade of
                  gevolgschade
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  De maximale aansprakelijkheid is beperkt tot het bedrag dat je
                  hebt betaald
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  Wij zijn niet verantwoordelijk voor het verlies van
                  foto&apos;s door technische storingen
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              9. Beëindiging
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Pandblink behoudt zich het recht voor om accounts te beëindigen
              die in strijd handelen met deze voorwaarden. Bij beëindiging
              verlies je toegang tot je account en resterende credits, tenzij de
              beëindiging onterecht was.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              10. Wijzigingen
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Wij kunnen deze voorwaarden van tijd tot tijd wijzigen. Bij
              belangrijke wijzigingen informeren wij je via e-mail of een
              melding op de website. Voortgezet gebruik van de dienst na
              wijzigingen betekent acceptatie van de nieuwe voorwaarden.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              11. Toepasselijk Recht
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Op deze voorwaarden is Nederlands recht van toepassing. Geschillen
              worden voorgelegd aan de bevoegde rechter in Nederland.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              12. Contact
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Voor vragen over deze voorwaarden kun je contact opnemen via:
            </p>
            <p className="text-slate-600 mt-4">
              <strong>E-mail:</strong>{" "}
              <a
                href="mailto:info@pandblink.nl"
                className="text-orange-500 hover:text-orange-600"
              >
                info@pandblink.nl
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            Terug naar home
          </Link>
        </div>
      </main>
    </div>
  );
}
