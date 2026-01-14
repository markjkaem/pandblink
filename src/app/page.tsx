"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const [dragActive, setDragActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(session?.user?.credits ?? null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);
    setEnhancedImage(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
      }
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setEnhancedImage(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleEnhance = async () => {
    if (!selectedFile) return;

    // Check if logged in
    if (!session) {
      setError("Je moet eerst inloggen om foto's te verbeteren");
      return;
    }

    setIsEnhancing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("/api/enhance", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.requireLogin) {
          setError("Je moet eerst inloggen om foto's te verbeteren");
        } else if (data.noCredits) {
          setError("Je hebt geen credits meer. Koop meer credits om door te gaan.");
        } else {
          throw new Error(data.error || "Er ging iets mis");
        }
        return;
      }

      // Validate that we got a proper URL string
      if (data.enhancedImageUrl && typeof data.enhancedImageUrl === "string") {
        setEnhancedImage(data.enhancedImageUrl);
      } else {
        throw new Error("Geen geldige afbeelding ontvangen");
      }
      if (data.remainingCredits !== undefined) {
        setCredits(data.remainingCredits);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleDownload = async () => {
    if (!enhancedImage) return;

    try {
      const response = await fetch(enhancedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pandblink-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      setError("Download mislukt. Probeer opnieuw.");
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    setPreview(null);
    setEnhancedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-lg md:text-xl font-bold text-slate-900">Pandblink</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#hoe-het-werkt" className="text-slate-600 hover:text-slate-900 transition">Hoe het werkt</a>
            <a href="#prijzen" className="text-slate-600 hover:text-slate-900 transition">Prijzen</a>
            <a href="#voorbeelden" className="text-slate-600 hover:text-slate-900 transition">Voorbeelden</a>
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
      <main className="pt-24">
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Laat je woning <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">stralen</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-4">
              Verbeter je woningfoto&apos;s met AI. Perfecte belichting, heldere kleuren en scherpe details. Klaar voor Funda in seconden.
            </p>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto mb-8">
              Verkoop je huis sneller met professionele foto&apos;s. Onze AI-technologie verbetert automatisch de kwaliteit van je woningfoto&apos;s, zodat ze er net zo goed uitzien als die van een professionele vastgoedfotograaf.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>3 foto&apos;s gratis</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Perfect voor Funda</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Resultaat in seconden</span>
              </div>
            </div>
          </div>

          {/* Upload/Result Area */}
          <div className="max-w-4xl mx-auto">
            {enhancedImage && typeof enhancedImage === "string" ? (
              /* Before/After Comparison */
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Original */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-500 text-center">Origineel</div>
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      {preview && (
                        <Image
                          src={preview}
                          alt="Origineel"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      )}
                    </div>
                  </div>
                  {/* Enhanced */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-orange-500 text-center flex items-center justify-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Verbeterd
                    </div>
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border-2 border-orange-500">
                      <Image
                        src={enhancedImage}
                        alt="Verbeterd"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={resetAll}
                    className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition font-medium"
                  >
                    Nieuwe foto
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition font-medium flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download verbeterde foto
                  </button>
                </div>
              </div>
            ) : (
              /* Upload Area */
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${
                  dragActive
                    ? "border-orange-500 bg-orange-50"
                    : "border-slate-300 hover:border-orange-400 hover:bg-slate-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {preview ? (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 max-w-2xl mx-auto">
                      <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    {error && (
                      <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={resetAll}
                        disabled={isEnhancing}
                        className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition font-medium disabled:opacity-50"
                      >
                        Andere foto
                      </button>
                      {session ? (
                        <button
                          onClick={handleEnhance}
                          disabled={isEnhancing}
                          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                          {isEnhancing ? (
                            <>
                              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Bezig met verbeteren...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              Verbeter foto ({credits ?? session.user?.credits ?? 0} credits)
                            </>
                          )}
                        </button>
                      ) : (
                        <Link
                          href="/login"
                          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition font-medium flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Log in om te verbeteren
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-slate-900">
                          Sleep je woningfoto hierheen
                        </p>
                        <p className="text-slate-500 mt-1">
                          of <span className="text-orange-500 font-medium">klik om te selecteren</span>
                        </p>
                      </div>
                      <p className="text-sm text-slate-400">
                        JPG, PNG of WebP • Max 10MB
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        {/* How it Works */}
        <section id="hoe-het-werkt" className="bg-slate-50 py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">
              Zo werkt het
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Upload je foto",
                  description: "Sleep je woningfoto naar de upload zone of selecteer een bestand.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  ),
                },
                {
                  step: "2",
                  title: "AI verbetert automatisch",
                  description: "Onze AI optimaliseert belichting, kleuren en scherpte in seconden.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                },
                {
                  step: "3",
                  title: "Download & gebruik",
                  description: "Download je verbeterde foto en upload naar Funda of je makelaar.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white mb-6">
                    {item.icon}
                  </div>
                  <div className="text-sm font-medium text-orange-500 mb-2">Stap {item.step}</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
              Wat we verbeteren
            </h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Subtiele, professionele verbeteringen die je foto&apos;s laten stralen zonder ze onrealistisch te maken.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Belichting", description: "Donkere hoeken en kamers worden opgehelderd" },
                { title: "Kleuren", description: "Natuurlijke, levendige kleuren die uitnodigen" },
                { title: "Scherpte", description: "Scherpe details zonder overdreven effecten" },
                { title: "Witbalans", description: "Witte muren blijven wit, geen gele tint" },
              ].map((feature) => (
                <div key={feature.title} className="text-center p-6">
                  <div className="w-12 h-12 mx-auto bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
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
        <section className="bg-slate-50 py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">
              Wat klanten zeggen
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Mijn Funda listing kreeg 40% meer views na het gebruik van Pandblink!",
                  author: "Mark V.",
                  role: "Particuliere verkoper",
                },
                {
                  quote: "Eindelijk professionele foto's zonder dure fotograaf. Super makkelijk!",
                  author: "Lisa B.",
                  role: "Makelaar",
                },
                {
                  quote: "De AI verbetert precies wat nodig is. Natuurlijk resultaat.",
                  author: "Jan K.",
                  role: "Vastgoedinvesteerder",
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-600 mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
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
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Klaar om je foto&apos;s te verbeteren?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Start nu gratis met 3 foto&apos;s. Geen creditcard nodig.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium text-lg hover:from-orange-600 hover:to-amber-600 transition shadow-lg shadow-orange-500/25"
            >
              Probeer Pandblink gratis
            </button>
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
                  <li><a href="mailto:info@pandblink.nl" className="hover:text-white transition">Contact</a></li>
                  <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                  <li><Link href="/funda-foto-verbeteren" className="hover:text-white transition">Funda foto verbeteren</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Juridisch</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition">Voorwaarden</a></li>
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
