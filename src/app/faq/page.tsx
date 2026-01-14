import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veelgestelde Vragen over Woningfoto Verbetering | Pandblink",
  description:
    "Antwoorden op veelgestelde vragen over Pandblink's AI foto verbetering service. Leer hoe je woningfoto's verbetert voor Funda en andere vastgoedplatforms.",
  keywords: [
    "funda foto verbeteren",
    "woningfoto verbeteren faq",
    "ai foto verbetering vragen",
    "vastgoedfotografie hulp",
  ],
};

const faqs = [
  {
    question: "Wat is Pandblink?",
    answer:
      "Pandblink is een AI-gestuurde dienst die je woningfoto's automatisch verbetert. We optimaliseren belichting, kleuren en scherpte voor professionele resultaten die perfect zijn voor Funda en andere vastgoedplatforms.",
  },
  {
    question: "Hoe werkt het?",
    answer:
      "Upload je foto via onze website, onze AI analyseert en verbetert de afbeelding automatisch binnen enkele seconden. Je kunt direct het resultaat bekijken en de verbeterde versie downloaden.",
  },
  {
    question: "Hoeveel kost het?",
    answer:
      "Je krijgt 3 gratis credits bij registratie. Daarna kun je credits kopen: 10 credits voor €9 (€0.90/foto), 25 credits voor €19 (€0.76/foto), of 50 credits voor €29 (€0.58/foto).",
  },
  {
    question: "Verlopen mijn credits?",
    answer:
      "Nee, gekochte credits verlopen nooit. Gebruik ze wanneer je wilt, er is geen tijdslimiet.",
  },
  {
    question: "Welke bestandsformaten worden ondersteund?",
    answer:
      "We ondersteunen JPG, PNG en WebP bestanden tot maximaal 10MB. Voor de beste resultaten raden we aan om foto's in de hoogst mogelijke kwaliteit te uploaden.",
  },
  {
    question: "Blijft de originele foto behouden?",
    answer:
      "Ja, we passen je originele bestand niet aan. De verbeterde versie wordt apart opgeslagen en kun je altijd terugvinden in je fotogeschiedenis.",
  },
  {
    question: "Hoe betaal ik?",
    answer:
      "Je kunt veilig betalen met iDEAL of creditcard via Stripe. Alle betalingen zijn beveiligd en je gegevens worden nooit opgeslagen.",
  },
  {
    question: "Kan ik mijn verbeterde foto's later terugvinden?",
    answer:
      "Ja, alle verbeterde foto's worden opgeslagen in je account onder 'Mijn foto's'. Je kunt ze altijd opnieuw bekijken en downloaden.",
  },
];

// Generate FAQPage structured data for Google rich snippets
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
          Veelgestelde vragen
        </h1>
        <p className="text-slate-600 text-center mb-12">
          Vind snel antwoord op je vragen over Pandblink.
        </p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Nog vragen?</p>
          <a
            href="mailto:info@pandblink.nl"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Neem contact op via info@pandblink.nl
          </a>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            Start met foto verbeteren
          </Link>
        </div>
      </main>
    </div>
  );
}
