"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CREDIT_PACKAGES = [
  {
    id: "credits_10",
    name: "10 Credits",
    credits: 10,
    price: "€9",
    perCredit: "€0.90 per foto",
  },
  {
    id: "credits_25",
    name: "25 Credits",
    credits: 25,
    price: "€19",
    perCredit: "€0.76 per foto",
    popular: true,
  },
  {
    id: "credits_50",
    name: "50 Credits",
    credits: 50,
    price: "€29",
    perCredit: "€0.58 per foto",
  },
];

export default function CreditsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(packageId);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Er ging iets mis");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
      setLoading(null);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

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
          {session && (
            <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium text-orange-600">
                {session.user?.credits ?? 0} credits
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Koop Credits
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Kies het pakket dat bij je past. Credits verlopen niet en je kunt ze
            gebruiken wanneer je wilt.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-8 text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {CREDIT_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-2xl p-8 shadow-sm relative ${
                pkg.popular ? "ring-2 ring-orange-500 shadow-lg" : "border border-slate-200"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                  Populair
                </div>
              )}
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-900 mb-1">
                  {pkg.price}
                </div>
                <div className="text-slate-500 mb-2">{pkg.credits} credits</div>
                <div className="text-sm text-green-600 font-medium mb-6">
                  {pkg.perCredit}
                </div>
                <button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={loading === pkg.id}
                  className={`w-full py-3 rounded-lg font-medium transition ${
                    pkg.popular
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  } disabled:opacity-50`}
                >
                  {loading === pkg.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Laden...
                    </span>
                  ) : (
                    "Kopen"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500 mb-4">Betaalmethodes</p>
          <div className="flex items-center justify-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200">
              <span className="font-medium text-slate-700">iDEAL</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200">
              <span className="font-medium text-slate-700">Creditcard</span>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            ← Terug naar Pandblink
          </Link>
        </div>
      </main>
    </div>
  );
}
