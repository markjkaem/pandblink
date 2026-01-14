"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CardSkeleton } from "@/components/Skeleton";

interface HistoryItem {
  id: string;
  createdAt: string;
  enhancedImageUrl: string | null;
  originalFileName: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
}

interface HistoryResponse {
  history: HistoryItem[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalCount: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchHistory(1);
    }
  }, [status]);

  const fetchHistory = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/history?page=${page}&limit=12`);
      const data: HistoryResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.history ? "Onbekende fout" : "Fout bij ophalen");
      }

      setHistory(data.history);
      setPagination({
        page: data.pagination.page,
        totalCount: data.pagination.totalCount,
        totalPages: data.pagination.totalPages,
        hasMore: data.pagination.hasMore,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "loading" || (status === "authenticated" && loading && history.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header skeleton */}
        <header className="bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-slate-900">Pandblink</span>
            </Link>
          </div>
        </header>
        {/* Content skeleton */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-slate-100 rounded animate-pulse mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </main>
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
          <div className="flex items-center gap-4">
            {session && (
              <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg">
                <svg
                  className="w-4 h-4 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="text-sm font-medium text-orange-600">
                  {session.user?.credits ?? 0} credits
                </span>
              </div>
            )}
            <Link
              href="/credits"
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Credits kopen
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Je Verbeterde Foto&apos;s
            </h1>
            <p className="text-slate-600 mt-1">
              {pagination.totalCount === 0
                ? "Je hebt nog geen foto's verbeterd"
                : `${pagination.totalCount} foto${pagination.totalCount !== 1 ? "'s" : ""} verbeterd`}
            </p>
          </div>
          <Link
            href="/"
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            Nieuwe foto
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-8 text-center">
            {error}
          </div>
        )}

        {history.length === 0 && !loading ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Nog geen foto&apos;s verbeterd
            </h2>
            <p className="text-slate-600 mb-6">
              Begin met het verbeteren van je woningfoto&apos;s!
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all"
            >
              Foto uploaden
            </Link>
          </div>
        ) : (
          <>
            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[4/3] relative bg-slate-100">
                    {item.enhancedImageUrl ? (
                      <Image
                        src={item.enhancedImageUrl}
                        alt={item.originalFileName || "Verbeterde foto"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <svg
                          className="w-12 h-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-slate-500 truncate">
                      {item.originalFileName || "Foto"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDate(item.createdAt)}
                    </p>
                    {item.enhancedImageUrl && (
                      <a
                        href={item.enhancedImageUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => fetchHistory(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Vorige
                </button>
                <span className="px-4 py-2 text-slate-600">
                  Pagina {pagination.page} van {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchHistory(pagination.page + 1)}
                  disabled={!pagination.hasMore || loading}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Volgende
                </button>
              </div>
            )}
          </>
        )}

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
