import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacybeleid | Pandblink",
  description:
    "Lees ons privacybeleid. Ontdek hoe Pandblink omgaat met je persoonsgegevens en foto's.",
  keywords: ["pandblink privacy", "privacybeleid", "gegevensbescherming"],
};

export default function PrivacyPage() {
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
          Privacybeleid
        </h1>
        <p className="text-slate-600 text-center mb-12">
          Laatst bijgewerkt: januari 2025
        </p>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              1. Introductie
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Pandblink (&quot;wij&quot;, &quot;ons&quot;, &quot;onze&quot;)
              respecteert je privacy en zet zich in voor de bescherming van je
              persoonsgegevens. Dit privacybeleid informeert je over hoe wij
              omgaan met je persoonsgegevens wanneer je onze website bezoekt en
              gebruik maakt van onze diensten.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              2. Welke gegevens verzamelen wij?
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Wij verzamelen de volgende categorieën persoonsgegevens:
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  <strong>Accountgegevens:</strong> E-mailadres en naam (bij
                  Google login)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  <strong>Foto&apos;s:</strong> De woningfoto&apos;s die je
                  uploadt voor verbetering
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  <strong>Betalingsgegevens:</strong> Transactie-informatie via
                  Stripe (wij slaan geen creditcardnummers op)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  <strong>Gebruiksgegevens:</strong> IP-adres, browsertype,
                  bezochte pagina&apos;s
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              3. Waarvoor gebruiken wij je gegevens?
            </h2>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Om je foto&apos;s te verbeteren en op te slaan</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Om je account te beheren en credits bij te houden</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Om betalingen te verwerken</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  Om je te informeren over belangrijke wijzigingen in onze
                  dienst
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Om onze dienst te verbeteren en problemen op te lossen</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              4. Delen van gegevens
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Wij delen je gegevens alleen met:
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  <strong>Stripe:</strong> Voor veilige betalingsverwerking
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  <strong>Replicate:</strong> Voor AI-fotoverbetering
                  (alleen de foto, geen persoonsgegevens)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  <strong>Vercel:</strong> Voor hosting en analytics
                </span>
              </li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              Wij verkopen nooit je gegevens aan derden.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              5. Bewaartermijnen
            </h2>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  <strong>Accountgegevens:</strong> Zolang je account actief is
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  <strong>Foto&apos;s:</strong> Zolang je account actief is
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  <strong>Betalingsgegevens:</strong> 7 jaar (wettelijke
                  verplichting)
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              6. Je rechten
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Onder de AVG heb je de volgende rechten:
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Recht op inzage in je gegevens</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Recht op correctie van onjuiste gegevens</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Recht op verwijdering van je gegevens</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Recht op overdraagbaarheid van je gegevens</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Recht om bezwaar te maken tegen verwerking</span>
              </li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              Om je rechten uit te oefenen, neem contact op via{" "}
              <a
                href="mailto:privacy@pandblink.nl"
                className="text-orange-500 hover:text-orange-600"
              >
                privacy@pandblink.nl
              </a>
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              7. Cookies
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Wij gebruiken essentiële cookies voor de werking van de website en
              analytische cookies (Vercel Analytics) om onze dienst te
              verbeteren. Je kunt je cookievoorkeuren beheren via de
              cookiebanner.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              8. Contact
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Voor vragen over dit privacybeleid kun je contact opnemen via:
            </p>
            <p className="text-slate-600 mt-4">
              <strong>E-mail:</strong>{" "}
              <a
                href="mailto:privacy@pandblink.nl"
                className="text-orange-500 hover:text-orange-600"
              >
                privacy@pandblink.nl
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
