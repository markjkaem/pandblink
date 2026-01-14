import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Pandblink",
  description:
    "Neem contact op met Pandblink. Vragen over woningfoto verbetering? Wij helpen je graag verder.",
  keywords: ["pandblink contact", "klantenservice", "hulp woningfoto"],
};

export default function ContactPage() {
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
          Contact
        </h1>
        <p className="text-slate-600 text-center mb-12">
          Heb je een vraag of opmerking? We horen graag van je!
        </p>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Neem contact met ons op
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-1">E-mail</h3>
                  <a
                    href="mailto:info@pandblink.nl"
                    className="text-orange-500 hover:text-orange-600"
                  >
                    info@pandblink.nl
                  </a>
                  <p className="text-sm text-slate-500 mt-1">
                    We reageren meestal binnen 24 uur
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-1">
                    Veelgestelde vragen
                  </h3>
                  <p className="text-slate-600 text-sm mb-2">
                    Misschien staat het antwoord al in onze FAQ
                  </p>
                  <Link
                    href="/faq"
                    className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                  >
                    Bekijk FAQ →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Waar kunnen we je mee helpen?
            </h2>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-center gap-3">
                <span className="text-orange-500">•</span>
                Vragen over je account of credits
              </li>
              <li className="flex items-center gap-3">
                <span className="text-orange-500">•</span>
                Technische problemen met foto uploads
              </li>
              <li className="flex items-center gap-3">
                <span className="text-orange-500">•</span>
                Vragen over betalingen en facturen
              </li>
              <li className="flex items-center gap-3">
                <span className="text-orange-500">•</span>
                Feedback en suggesties
              </li>
              <li className="flex items-center gap-3">
                <span className="text-orange-500">•</span>
                Zakelijke samenwerkingen voor makelaars
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-8 border border-orange-100">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Voor makelaars en vastgoedbedrijven
            </h2>
            <p className="text-slate-600 mb-4">
              Interesse in een zakelijk pakket met volumekorting? Neem contact
              met ons op voor een offerte op maat.
            </p>
            <a
              href="mailto:zakelijk@pandblink.nl"
              className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-all text-sm"
            >
              zakelijk@pandblink.nl
            </a>
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
