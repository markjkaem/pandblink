"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import MultiImageUploader, { type QueuedImage } from "@/components/MultiImageUploader";
import EnhancementOptions, { type EnhancementSettings, getCreditCost } from "@/components/EnhancementOptions";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { useEnhancementQueue } from "@/hooks/useEnhancementQueue";

export default function Home() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(session?.user?.credits ?? null);
  const [error, setError] = useState<string | null>(null);

  // Multi-image state
  const [images, setImages] = useState<QueuedImage[]>([]);
  const [settings, setSettings] = useState<EnhancementSettings>({
    preset: "standard",
    strength: 100,
    faceEnhance: false,
  });

  // Selected image for before/after view
  const [selectedResult, setSelectedResult] = useState<QueuedImage | null>(null);

  // Enhancement queue
  const queue = useEnhancementQueue({
    onCreditsUpdate: (newCredits) => setCredits(newCredits),
    onError: (err) => setError(err),
  });

  const handleStartEnhancement = useCallback(() => {
    if (!session) {
      setError("Je moet eerst inloggen om foto's te verbeteren");
      return;
    }

    setError(null);
    queue.startQueue(images, settings, setImages);
  }, [session, images, settings, queue]);

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `pandblink-${filename}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch {
      setError("Download mislukt. Probeer opnieuw.");
    }
  };

  const handleDownloadAll = async () => {
    const completedImages = images.filter((img) => img.status === "completed" && img.enhancedUrl);
    for (const img of completedImages) {
      await handleDownload(img.enhancedUrl!, img.file.name);
    }
  };

  const resetAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setError(null);
    setSelectedResult(null);
  };

  const currentCredits = credits ?? session?.user?.credits ?? 0;
  const totalCost = queue.getTotalCost(images, settings.preset);
  const pendingCount = images.filter((img) => img.status === "pending").length;
  const completedImages = images.filter((img) => img.status === "completed");
  const hasResults = completedImages.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-lg md:text-xl font-bold text-slate-900">Pandblink</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#hoe-het-werkt" className="text-slate-600 hover:text-slate-900 transition">Hoe het werkt</a>
            <a href="#prijzen" className="text-slate-600 hover:text-slate-900 transition">Prijzen</a>
            <Link href="/voorbeelden" className="text-slate-600 hover:text-slate-900 transition">Voorbeelden</Link>
            <Link href="/over-ons" className="text-slate-600 hover:text-slate-900 transition">Over ons</Link>
            <Link href="/contact" className="text-slate-600 hover:text-slate-900 transition">Contact</Link>
          </nav>

          {status === "loading" ? (
            <div className="w-20 h-8 bg-slate-100 rounded-lg animate-pulse" />
          ) : session ? (
            <>
              {/* Desktop: full menu */}
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/history"
                  className="text-slate-600 hover:text-slate-900 transition text-sm font-medium"
                >
                  Mijn foto&apos;s
                </Link>
                <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-medium text-orange-600">
                    {credits ?? session.user?.credits ?? 0}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-slate-600 hover:text-slate-900 transition text-sm font-medium"
                >
                  Uitloggen
                </button>
              </div>

              {/* Mobile: credits badge + hamburger */}
              <div className="flex md:hidden items-center gap-2">
                <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                  <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xs font-medium text-orange-600">
                    {credits ?? session.user?.credits ?? 0}
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-slate-600 hover:text-slate-900"
                >
                  {mobileMenuOpen ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-slate-900 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-slate-800 transition text-sm font-medium"
            >
              Inloggen
            </Link>
          )}
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && session && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-3">
            <Link
              href="/history"
              className="block text-slate-700 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mijn foto&apos;s
            </Link>
            <Link
              href="/credits"
              className="block text-slate-700 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Credits kopen
            </Link>
            <a href="#hoe-het-werkt" className="block text-slate-600 py-2" onClick={() => setMobileMenuOpen(false)}>
              Hoe het werkt
            </a>
            <a href="#prijzen" className="block text-slate-600 py-2" onClick={() => setMobileMenuOpen(false)}>
              Prijzen
            </a>
            <Link
              href="/voorbeelden"
              className="block text-slate-600 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Voorbeelden
            </Link>
            <Link
              href="/over-ons"
              className="block text-slate-600 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Over ons
            </Link>
            <Link
              href="/contact"
              className="block text-slate-600 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <button
              onClick={() => {
                signOut();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-red-600 font-medium py-2 border-t border-slate-100 mt-2 pt-3"
            >
              Uitloggen
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="pt-16">
        <section className="relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
            <div className="absolute top-40 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          </div>

          <div className="max-w-6xl mx-auto px-4 py-20 md:py-32">
            <div className="text-center mb-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-sm font-medium text-orange-700">AI-powered foto verbetering</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-[1.1] tracking-tight">
                Laat je woning
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">stralen</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                Verbeter je woningfoto&apos;s met AI. Perfecte belichting, heldere kleuren en scherpe details.
                <span className="text-orange-500 font-medium"> Klaar voor Funda in seconden.</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <button
                  onClick={() => document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-semibold text-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-2">
                    Start gratis
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
                <a href="#hoe-het-werkt" className="px-8 py-4 text-slate-700 font-semibold hover:text-orange-500 transition flex items-center gap-2">
                  Bekijk hoe het werkt
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-slate-200">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>3 foto&apos;s gratis</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-slate-200">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Perfect voor Funda</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-slate-200">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Resultaat in seconden</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-slate-200 bg-slate-50/50">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">10K+</div>
                <div className="text-slate-600 mt-1">Foto&apos;s verbeterd</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">4.8</div>
                <div className="text-slate-600 mt-1 flex items-center justify-center gap-1">
                  <span>Gemiddelde rating</span>
                  <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">&lt;30s</div>
                <div className="text-slate-600 mt-1">Verwerkingstijd</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">40%</div>
                <div className="text-slate-600 mt-1">Meer views op Funda</div>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section id="upload-zone" className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white -z-10" />

          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Upload je foto&apos;s
              </h2>
              <p className="text-lg text-slate-600 max-w-xl mx-auto">
                Sleep je woningfoto&apos;s hieronder of klik om bestanden te selecteren
              </p>
            </div>

            {/* Upload/Result Area */}
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Before/After Modal for selected result */}
              {selectedResult && selectedResult.enhancedUrl && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">
                        {selectedResult.file.name}
                      </h3>
                      <button
                        onClick={() => setSelectedResult(null)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                      >
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-4">
                      <BeforeAfterSlider
                        beforeImage={selectedResult.preview}
                        afterImage={selectedResult.enhancedUrl}
                      />
                    </div>
                    <div className="p-4 border-t border-slate-200 flex justify-end gap-3">
                      <button
                        onClick={() => setSelectedResult(null)}
                        className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
                      >
                        Sluiten
                      </button>
                      <button
                        onClick={() => handleDownload(selectedResult.enhancedUrl!, selectedResult.file.name)}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Multi Image Uploader */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <MultiImageUploader
                  images={images}
                  onImagesChange={setImages}
                  maxImages={20}
                  disabled={queue.isProcessing}
                />
              </div>

              {/* Enhancement Options (show when images are selected) */}
              {images.length > 0 && (
                <EnhancementOptions
                  settings={settings}
                  onChange={setSettings}
                  credits={currentCredits}
                  disabled={queue.isProcessing}
                />
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Processing Progress */}
              {queue.isProcessing && (
                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-orange-700">
                      Verbeteren... ({queue.completedCount + 1} van {queue.totalImages})
                    </span>
                    <button
                      onClick={queue.cancelQueue}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Annuleren
                    </button>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${((queue.completedCount) / queue.totalImages) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {images.length > 0 && !queue.isProcessing && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetAll}
                    className="px-6 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition font-medium shadow-sm"
                  >
                    Alles wissen
                  </button>

                  {hasResults && (
                    <button
                      onClick={handleDownloadAll}
                      className="px-6 py-3.5 bg-white border border-orange-200 rounded-xl text-orange-600 hover:bg-orange-50 transition font-medium shadow-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download alle ({completedImages.length})
                    </button>
                  )}

                  {pendingCount > 0 && (
                    session ? (
                      <button
                        onClick={handleStartEnhancement}
                        disabled={totalCost > currentCredits}
                        className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Verbeter {pendingCount} foto{pendingCount !== 1 ? "'s" : ""} ({totalCost} credit{totalCost !== 1 ? "s" : ""})
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition font-medium flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Log in om te verbeteren
                      </Link>
                    )
                  )}
                </div>
              )}

              {/* Results Grid - Click to view before/after */}
              {hasResults && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Verbeterde foto&apos;s (klik om te vergelijken)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {completedImages.map((image) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedResult(image)}
                        className="relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-green-500 hover:ring-2 hover:ring-orange-500 hover:ring-offset-2 transition-all group"
                      >
                        <Image
                          src={image.enhancedUrl || image.preview}
                          alt={image.file.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-2 shadow-lg">
                            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="hoe-het-werkt" className="relative bg-slate-50 py-16 md:py-24 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />

          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 mb-6 shadow-sm">
                <span className="text-sm font-medium text-slate-600">Eenvoudig proces</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                Zo werkt het
              </h2>
              <p className="text-lg text-slate-600 max-w-xl mx-auto">
                In drie simpele stappen naar professionele woningfoto&apos;s
              </p>
            </div>

            <div className="relative">
              {/* Connecting line - hidden on mobile */}
              <div className="hidden md:block absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200" />

              <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                {[
                  {
                    step: "1",
                    title: "Upload je foto",
                    description: "Sleep je woningfoto naar de upload zone of selecteer een bestand van je computer.",
                    icon: (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    ),
                  },
                  {
                    step: "2",
                    title: "AI verbetert automatisch",
                    description: "Onze AI optimaliseert belichting, kleuren en scherpte binnen 30 seconden.",
                    icon: (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                  },
                  {
                    step: "3",
                    title: "Download & gebruik",
                    description: "Download je verbeterde foto en upload direct naar Funda of stuur naar je makelaar.",
                    icon: (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    ),
                  },
                ].map((item, index) => (
                  <div key={item.step} className="relative">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 h-full">
                      {/* Step number badge */}
                      <div className="absolute -top-4 left-8 w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-orange-500/30">
                        {item.step}
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center text-orange-500 mb-6 mt-2">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                    {/* Arrow between cards - hidden on mobile */}
                    {index < 2 && (
                      <div className="hidden md:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                        <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-100">
                          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-40 -right-40 w-80 h-80 bg-orange-100 rounded-full opacity-30 blur-3xl" />
          <div className="absolute bottom-20 -left-40 w-80 h-80 bg-amber-100 rounded-full opacity-30 blur-3xl" />

          <div className="max-w-6xl mx-auto px-4 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 mb-6">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span className="text-sm font-medium text-orange-700">AI Verbeteringen</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                Wat we verbeteren
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Subtiele, professionele verbeteringen die je foto&apos;s laten stralen zonder ze onrealistisch te maken.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Belichting",
                  description: "Donkere hoeken en kamers worden opgehelderd voor een lichtere sfeer",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ),
                },
                {
                  title: "Kleuren",
                  description: "Natuurlijke, levendige kleuren die uitnodigen en realistisch blijven",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  ),
                },
                {
                  title: "Scherpte",
                  description: "Scherpe details zonder overdreven effecten of ruis",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ),
                },
                {
                  title: "Witbalans",
                  description: "Witte muren blijven wit, geen gele tint of verkleuring",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  ),
                },
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mb-5 text-orange-500 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Voordelen voor Funda */}
        <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
              Waarom je woningfoto&apos;s verbeteren?
            </h2>
            <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
              Goede foto&apos;s zijn essentieel voor een succesvolle huisverkoop. Onderzoek toont aan dat woningen met professionele foto&apos;s sneller verkopen en vaak tegen een hogere prijs. Met Pandblink krijg je professionele kwaliteit zonder de kosten van een fotograaf.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Meer bekeken op Funda</h3>
                <p className="text-slate-600 text-sm">Woningen met heldere, professionele foto&apos;s krijgen tot 40% meer weergaven op Funda en andere vastgoedplatforms.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Snellere verkoop</h3>
                <p className="text-slate-600 text-sm">Aantrekkelijke foto&apos;s zorgen voor meer bezichtigingen en uiteindelijk een snellere verkoop van je woning.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Goedkoper dan een fotograaf</h3>
                <p className="text-slate-600 text-sm">Bespaar honderden euro&apos;s vergeleken met een professionele vastgoedfotograaf. Vanaf slechts €0,58 per foto.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Professionele kwaliteit</h3>
                <p className="text-slate-600 text-sm">Onze AI levert resultaten die vergelijkbaar zijn met professionele foto-editing, maar dan in seconden.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-slate-50 py-16 md:py-24 relative overflow-hidden">
          {/* Quote decoration */}
          <div className="absolute top-20 left-10 text-slate-200/50 text-[200px] font-serif leading-none select-none">&ldquo;</div>

          <div className="max-w-6xl mx-auto px-4 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 mb-6 shadow-sm">
                <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-sm font-medium text-slate-600">Klant reviews</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                Wat klanten zeggen
              </h2>
              <p className="text-lg text-slate-600 max-w-xl mx-auto">
                Ontdek waarom duizenden gebruikers kiezen voor Pandblink
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Mijn Funda listing kreeg 40% meer views na het gebruik van Pandblink! De foto's zien er nu echt professioneel uit.",
                  author: "Mark V.",
                  role: "Particuliere verkoper",
                  initials: "MV",
                  color: "from-blue-500 to-indigo-500",
                },
                {
                  quote: "Eindelijk professionele foto's zonder dure fotograaf. Super makkelijk en het resultaat is geweldig!",
                  author: "Lisa B.",
                  role: "Makelaar",
                  initials: "LB",
                  color: "from-orange-500 to-amber-500",
                },
                {
                  quote: "De AI verbetert precies wat nodig is. Het resultaat is natuurlijk en niet overdreven bewerkt.",
                  author: "Jan K.",
                  role: "Vastgoedinvesteerder",
                  initials: "JK",
                  color: "from-green-500 to-emerald-500",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-slate-600 mb-6 leading-relaxed flex-grow">&ldquo;{testimonial.quote}&rdquo;</p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.author}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="prijzen" className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
              Eenvoudige prijzen
            </h2>
            <p className="text-center text-slate-600 mb-12">
              Start gratis met 3 credits. Koop meer wanneer je ze nodig hebt. Credits verlopen niet.
            </p>
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {/* Free */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-500 mb-2">Gratis</div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">€0</div>
                  <div className="text-slate-500 mb-4">3 credits</div>
                  <div className="text-sm text-green-600 font-medium mb-6">Bij registratie</div>
                  <Link href="/login" className="block w-full py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition text-center">
                    Start gratis
                  </Link>
                </div>
              </div>

              {/* 10 Credits */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-500 mb-2">Starter</div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">€9</div>
                  <div className="text-slate-500 mb-4">10 credits</div>
                  <div className="text-sm text-green-600 font-medium mb-6">€0,90 per foto</div>
                  <Link href="/credits" className="block w-full py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition text-center">
                    Kopen
                  </Link>
                </div>
              </div>

              {/* 25 Credits - Popular */}
              <div className="bg-white rounded-2xl p-6 shadow-lg ring-2 ring-orange-500 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                  Populair
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-orange-500 mb-2">Meeste waarde</div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">€19</div>
                  <div className="text-slate-500 mb-4">25 credits</div>
                  <div className="text-sm text-green-600 font-medium mb-6">€0,76 per foto</div>
                  <Link href="/credits" className="block w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition text-center">
                    Kopen
                  </Link>
                </div>
              </div>

              {/* 50 Credits */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-500 mb-2">Pro</div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">€29</div>
                  <div className="text-slate-500 mb-4">50 credits</div>
                  <div className="text-sm text-green-600 font-medium mb-6">€0,58 per foto</div>
                  <Link href="/credits" className="block w-full py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition text-center">
                    Kopen
                  </Link>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Credits verlopen niet
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Betaal met iDEAL of creditcard
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Geen abonnement nodig
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />
          <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />

          <div className="max-w-4xl mx-auto px-4 text-center relative">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              <span className="text-sm font-medium text-white/90">Geen creditcard nodig</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Klaar om je foto&apos;s te
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400"> verbeteren?</span>
            </h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Start nu gratis met 3 foto&apos;s. Zie direct het verschil en maak indruk op potentiele kopers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' })}
                className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-semibold text-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2">
                  Probeer Pandblink gratis
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              <Link
                href="/credits"
                className="px-8 py-4 text-white/90 font-semibold hover:text-white transition flex items-center gap-2"
              >
                Bekijk prijzen
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Veilige verwerking
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resultaat in &lt;30 seconden
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Credits verlopen niet
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <span className="text-xl font-bold">Pandblink</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Laat je woning stralen met AI-verbeterde foto&apos;s.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#hoe-het-werkt" className="hover:text-white transition">Hoe het werkt</a></li>
                  <li><a href="#prijzen" className="hover:text-white transition">Prijzen</a></li>
                  <li><Link href="/faq" className="hover:text-white transition">Veelgestelde vragen</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Bedrijf</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><Link href="/over-ons" className="hover:text-white transition">Over ons</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                  <li><Link href="/voorbeelden" className="hover:text-white transition">Voorbeelden</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Juridisch</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
                  <li><Link href="/voorwaarden" className="hover:text-white transition">Voorwaarden</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
              © 2025 Pandblink. Alle rechten voorbehouden.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
