"use client";

import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, Camera } from "lucide-react";
import type { HalalStatus, IngredientConflict } from "@/domain/classification/types";

export interface ScanResultData {
  found: boolean;
  barcode?: string;
  name?: string;
  brand?: string | null;
  status?: HalalStatus;
  hasMeat?: boolean;
  conflicts?: IngredientConflict[];
  explanation?: string | null;
  source?: string;
}

interface ResultSheetProps {
  result: ScanResultData | null;
  loading: boolean;
  onClose: () => void;
  onTriggerOcr?: () => void;
}

export function ResultSheet({
  result,
  loading,
  onClose,
  onTriggerOcr,
}: ResultSheetProps) {
  if (!result && !loading) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 max-w-md mx-auto animate-in slide-in-from-bottom duration-200">
      <div className="bg-neutral-900 border-t border-neutral-800 rounded-t-3xl shadow-2xl p-6 pb-24 text-neutral-100 max-h-[80vh] overflow-y-auto">
        {/* Handle bar */}
        <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto mb-4" />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-sm text-neutral-400 font-medium">Analizando ingredientes...</p>
          </div>
        ) : !result?.found ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-14 h-14 bg-amber-950/60 border border-amber-800/60 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-100">Producto no encontrado</h3>
              <p className="text-xs text-neutral-400 mt-1">
                El código de barras <span className="font-mono text-neutral-300">{result?.barcode}</span> no está en nuestro índice.
              </p>
            </div>

            {onTriggerOcr && (
              <button
                type="button"
                onClick={onTriggerOcr}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Fotografiar lista de ingredientes (OCR)
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-neutral-400 hover:text-neutral-200 text-xs font-medium cursor-pointer"
            >
              Escanear otro código
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Verdict Card */}
            <div
              className={`p-4 rounded-2xl border flex items-center gap-4 ${
                result.status === "HALAL"
                  ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-300"
                  : result.status === "HARAM"
                  ? "bg-rose-950/40 border-rose-800/80 text-rose-300"
                  : "bg-amber-950/40 border-amber-800/80 text-amber-300"
              }`}
            >
              {result.status === "HALAL" && <CheckCircle2 className="w-9 h-9 text-emerald-400 shrink-0" />}
              {result.status === "HARAM" && <XCircle className="w-9 h-9 text-rose-400 shrink-0" />}
              {result.status === "DOUBTFUL" && <AlertTriangle className="w-9 h-9 text-amber-400 shrink-0" />}

              <div>
                <span className="text-xs font-bold uppercase tracking-wider">
                  {result.status === "HALAL"
                    ? "Halal Confirmado"
                    : result.status === "HARAM"
                    ? "No Apto (Haram)"
                    : "Dudoso / Requiere Revisión"}
                </span>
                <h2 className="text-lg font-bold text-neutral-100 leading-snug">{result.name}</h2>
                {result.brand && <p className="text-xs text-neutral-400">{result.brand}</p>}
              </div>
            </div>

            {/* Meat warning */}
            {result.hasMeat && (
              <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-amber-200 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Aviso de carne:</strong> Contiene carne terrestre (pollo/pavo/vacuno). Verifica si el paquete incluye sello de certificación halal acreditada.
                </span>
              </div>
            )}

            {/* Explanation / Conflicts */}
            {result.conflicts && result.conflicts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Ingredientes identificados
                </h4>
                <div className="space-y-1.5">
                  {result.conflicts.map((conflict, idx) => (
                    <div
                      key={`${conflict.name}-${idx}`}
                      className="p-2.5 bg-neutral-950/60 rounded-xl border border-neutral-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-neutral-200">{conflict.name}</span>
                        <p className="text-neutral-400 text-[11px] mt-0.5">{conflict.reason}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          conflict.severity === "HARAM"
                            ? "bg-rose-950 text-rose-300 border border-rose-800/60"
                            : "bg-amber-950 text-amber-300 border border-amber-800/60"
                        }`}
                      >
                        {conflict.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              Escanear otro producto
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
