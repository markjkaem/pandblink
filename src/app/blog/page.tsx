import Link from "next/link";
import { Metadata } from "next";
import { blogPosts } from "@/content/blog-posts";

export const metadata: Metadata = {
  title: "Blog - Tips voor Woningfotografie | Pandblink",
  description:
    "Lees onze tips en artikelen over woningfotografie, Funda foto's verbeteren en je huis sneller verkopen met mooiere foto's.",
  keywords: [
    "woningfotografie blog",
    "funda foto tips",
    "huis verkopen tips",
    "vastgoedfotografie artikelen",
  ],
  alternates: {
    canonical: "https://pandblink.nl/blog",
  },
  openGraph: {
    title: "Blog - Woningfotografie Tips | Pandblink",
    description:
      "Tips en artikelen over woningfotografie en je huis sneller verkopen.",
    url: "https://pandblink.nl/blog",
  },
};

export default function BlogPage() {
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

      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
          Blog
        </h1>
        <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
          Tips, tricks en inzichten over woningfotografie. Leer hoe je je huis
          sneller verkoopt met mooiere foto&apos;s.
        </p>

        <div className="grid gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-md transition"
            >
              <Link href={`/blog/${post.slug}`}>
                <span className="text-sm text-orange-500 font-medium">
                  {new Date(post.publishedAt).toLocaleDateString("nl-NL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mt-2 mb-3 hover:text-orange-500 transition">
                  {post.title}
                </h2>
                <p className="text-slate-600 mb-4">{post.description}</p>
                <span className="text-orange-500 font-medium hover:text-orange-600">
                  Lees meer →
                </span>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Klaar om je foto&apos;s te verbeteren?
          </h2>
          <p className="text-slate-600 mb-6">
            Pas de tips uit onze artikelen toe en verbeter je resultaat met Pandblink.
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition"
          >
            Probeer gratis - 3 foto&apos;s
          </Link>
        </div>
      </main>

      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Link href="/" className="text-slate-400 hover:text-white transition">
            © 2025 Pandblink
          </Link>
        </div>
      </footer>
    </div>
  );
}
