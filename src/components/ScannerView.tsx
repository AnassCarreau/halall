"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Camera, AlertCircle, Image as ImageIcon } from "lucide-react";

interface ScannerViewProps {
  onScan: (barcode: string) => void;
  onPhotoTaken: (base64: string) => void;
  paused?: boolean;
}

export function ScannerView({ onScan, onPhotoTaken, paused }: ScannerViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    let active = true;
    const codeReader = new BrowserMultiFormatReader();
    readerRef.current = codeReader;
    const videoEl = videoRef.current;

    async function startScanner() {
      if (!videoEl || paused) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        setError(null);

        codeReader.decodeFromStream(stream, videoEl, (result) => {
          if (!active) return;
          if (result) {
            const text = result.getText().trim();
            if (text.length >= 8) {
              onScan(text);
            }
          }
        });
      } catch (err: unknown) {
        if (!active) return;
        const msg =
          err instanceof Error && err.name === "NotAllowedError"
            ? "Permiso de cámara denegado. Concede acceso a la cámara para escanear."
            : "No se pudo iniciar la cámara en este dispositivo.";
        setError(msg);
      }
    }

    startScanner();

    return () => {
      active = false;
      if (videoEl && videoEl.srcObject) {
        const stream = videoEl.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        videoEl.srcObject = null;
      }
    };
  }, [onScan, paused]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onPhotoTaken(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-4rem)] bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Video feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
      />

      {/* Dark overlay with transparent center scanner box */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
        <div className="w-72 h-72 border-2 border-emerald-400/80 rounded-3xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl -mt-1 -ml-1" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl -mt-1 -mr-1" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl -mb-1 -ml-1" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl -mb-1 -mr-1" />

          {/* Animated red/laser guide line */}
          <div className="absolute inset-x-4 top-1/2 h-0.5 bg-emerald-400/60 shadow-[0_0_8px_#34d399] animate-pulse" />
        </div>

        <p className="text-white/80 text-xs font-medium mt-6 px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full">
          Apunta al código de barras del producto
        </p>
      </div>

      {/* Floating manual OCR / upload button */}
      <div className="absolute top-4 right-4 z-20">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-neutral-900/80 backdrop-blur-md text-neutral-200 border border-neutral-700/80 p-2.5 rounded-full hover:bg-neutral-800 transition-colors shadow-lg cursor-pointer"
          title="Tomar foto de ingredientes (OCR)"
        >
          <ImageIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Error / Permission fallback screen */}
      {error && (
        <div className="absolute inset-0 bg-neutral-950/95 z-30 flex flex-col items-center justify-center p-6 text-center text-neutral-200">
          <div className="w-14 h-14 bg-rose-950/60 border border-rose-800/80 rounded-2xl flex items-center justify-center text-rose-400 mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold">Cámara no disponible</h3>
          <p className="text-xs text-neutral-400 mt-2 max-w-xs leading-relaxed">{error}</p>

          <div className="mt-6 flex flex-col w-full max-w-xs gap-2.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50"
            >
              <Camera className="w-4 h-4" />
              Subir o tomar foto de ingredientes
            </button>
            <a
              href="/buscar"
              className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-medium text-center"
            >
              Buscar producto por nombre
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
