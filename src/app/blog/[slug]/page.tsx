import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost, getAllBlogSlugs } from "@/content/blog-posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Artikel niet gevonden",
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://pandblink.nl/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://pandblink.nl/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

// Simple markdown-to-HTML converter for our static content
function parseMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">$1</h2>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Lists
    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-orange-500 hover:text-orange-600">$1</a>')
    // Tables (basic)
    .replace(/\|(.*)\|/g, (match) => {
      const cells = match.split('|').filter(Boolean);
      const isHeader = match.includes('---');
      if (isHeader) return '';
      return `<tr>${cells.map(cell => `<td class="border px-4 py-2">${cell.trim()}</td>`).join('')}</tr>`;
    })
    // Paragraphs
    .replace(/^(?!<[hl]|<li|<tr)(.*$)/gm, (match) => {
      if (match.trim() === '') return '';
      return `<p class="text-slate-600 mb-4">${match}</p>`;
    })
    // Wrap lists
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc mb-4 space-y-2">$&</ul>');
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const htmlContent = parseMarkdown(post.content);

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
            href="/blog"
            className="text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            ← Alle artikelen
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <article>
          <header className="mb-8">
            <span className="text-sm text-orange-500 font-medium">
              {new Date(post.publishedAt).toLocaleDateString("nl-NL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
              {post.title}
            </h1>
            <p className="text-xl text-slate-600">{post.description}</p>
          </header>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Probeer Pandblink gratis
          </h2>
          <p className="text-slate-600 mb-6">
            Verbeter je woningfoto&apos;s met AI. Je eerste 3 foto&apos;s zijn gratis.
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition"
          >
            Start nu gratis
          </Link>
        </div>

        {/* Back to blog */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            ← Bekijk alle artikelen
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
