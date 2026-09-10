"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Camera, AlertCircle, Image as ImageIcon } from "lucide-react";
import { useTranslation } from "@/i18n/context";

interface ScannerViewProps {
  onScan: (barcode: string) => void;
  onPhotoTaken: (base64: string) => void;
  paused?: boolean;
}

export function ScannerView({ onScan, onPhotoTaken, paused }: ScannerViewProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errorType, setErrorType] = useState<"denied" | "generic" | null>(null);
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

        setErrorType(null);

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
        const isDenied = err instanceof Error && err.name === "NotAllowedError";
        setErrorType(isDenied ? "denied" : "generic");
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

  const errorMessage =
    errorType === "denied"
      ? t.scanner.cameraErrorDenied
      : errorType === "generic"
      ? t.scanner.cameraErrorGeneric
      : null;

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-7.5rem)] bg-black flex flex-col items-center justify-center overflow-hidden">
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

          {/* Animated guide line */}
          <div className="absolute inset-x-4 top-1/2 h-0.5 bg-emerald-400/60 shadow-[0_0_8px_#34d399] animate-pulse" />
        </div>

        <p className="text-white/80 text-xs font-medium mt-6 px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-center max-w-xs">
          {t.scanner.pointBarcode}
        </p>
      </div>

      {/* Floating manual OCR / upload button */}
      <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto z-20">
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
          title={t.scanner.ocrTooltip}
          aria-label={t.scanner.ocrTooltip}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Error / Permission fallback screen */}
      {errorMessage && (
        <div className="absolute inset-0 bg-neutral-950/95 z-30 flex flex-col items-center justify-center p-6 text-center text-neutral-200">
          <div className="w-14 h-14 bg-rose-950/60 border border-rose-800/80 rounded-2xl flex items-center justify-center text-rose-400 mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold">{t.scanner.cameraErrorTitle}</h3>
          <p className="text-xs text-neutral-400 mt-2 max-w-xs leading-relaxed">{errorMessage}</p>

          <div className="mt-6 flex flex-col w-full max-w-xs gap-2.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50"
            >
              <Camera className="w-4 h-4" />
              {t.scanner.uploadOrPhoto}
            </button>
            <Link
              href="/buscar"
              className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-medium text-center"
            >
              {t.scanner.searchByName}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
