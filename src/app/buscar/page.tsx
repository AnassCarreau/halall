"use client";

import { useState } from "react";
import { Search, CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import type { HalalStatus } from "@/domain/classification/types";

interface SearchItem {
  barcode: string;
  name: string;
  brand: string | null;
  status: HalalStatus;
  hasMeat: boolean;
}

export default function BuscarPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-neutral-950 text-neutral-100 min-h-screen px-4 pt-8 pb-24 max-w-md mx-auto w-full">
      <header className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-white">Buscar producto</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Busca por nombre de producto o marca española
        </p>
      </header>

      <form onSubmit={handleSearch} className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: yogur fresa, galletas digestive..."
          className="w-full py-3.5 pl-11 pr-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <button
          type="submit"
          className="sr-only"
        >
          Buscar
        </button>
      </form>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          <p className="text-xs mt-3">Buscando productos indexados...</p>
        </div>
      ) : hasSearched && results.length === 0 ? (
        <div className="text-center py-12 text-neutral-400 bg-neutral-900/40 rounded-2xl p-6 border border-neutral-800/60">
          <p className="text-sm font-medium text-neutral-300">No encontramos coincidencias</p>
          <p className="text-xs text-neutral-500 mt-1">
            Si tienes el producto físico delante, usa la cámara para escanear el código de barras o su etiqueta.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {results.map((item) => (
            <div
              key={item.barcode}
              className="p-3.5 bg-neutral-900 border border-neutral-800/80 rounded-2xl flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-neutral-100 truncate">{item.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  {item.brand && <span className="text-xs text-neutral-400 truncate">{item.brand}</span>}
                  <span className="text-[10px] font-mono text-neutral-500">{item.barcode}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1.5">
                {item.status === "HALAL" && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[11px] font-bold rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Halal
                  </span>
                )}
                {item.status === "HARAM" && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-rose-950/80 border border-rose-800/80 text-rose-300 text-[11px] font-bold rounded-lg">
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    Haram
                  </span>
                )}
                {item.status === "DOUBTFUL" && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-amber-950/80 border border-amber-800/80 text-amber-300 text-[11px] font-bold rounded-lg">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Dudoso
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
