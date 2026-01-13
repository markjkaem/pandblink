"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [credits, setCredits] = useState<number | null>(null);
  const [creditsAdded, setCreditsAdded] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setError("Geen sessie gevonden");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/stripe/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Verificatie mislukt");
        }

        setCredits(data.credits);
        setCreditsAdded(data.alreadyProcessed ? null : data.creditsAdded);
        setStatus("success");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Er ging iets mis");
        setStatus("error");
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
      {status === "loading" && (
        <>
          <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Betaling verwerken...
          </h1>
          <p className="text-slate-600">
            Even geduld terwijl we je credits toevoegen.
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Betaling gelukt!
          </h1>
          {creditsAdded && (
            <p className="text-slate-600 mb-4">
              <span className="font-semibold text-green-600">+{creditsAdded} credits</span> zijn toegevoegd aan je account.
            </p>
          )}
          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-500">Je huidige saldo</p>
            <p className="text-3xl font-bold text-orange-500">{credits} credits</p>
          </div>
          <Link
            href="/"
            className="inline-block w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition"
          >
            Start met verbeteren
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Er ging iets mis
          </h1>
          <p className="text-slate-600 mb-6">
            {error}
          </p>
          <Link
            href="/credits"
            className="inline-block w-full py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            Probeer opnieuw
          </Link>
        </>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
      <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-orange-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        Laden...
      </h1>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <Suspense fallback={<LoadingFallback />}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
