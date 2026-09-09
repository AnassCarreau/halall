"use client";

import { useState, useCallback, useRef } from "react";
import { ScannerView } from "@/components/ScannerView";
import { ResultSheet, ScanResultData } from "@/components/ResultSheet";

export default function Home() {
  const [result, setResult] = useState<ScanResultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const isScanningRef = useRef(false);

  const handleScan = useCallback(async (barcode: string) => {
    if (isScanningRef.current) return;
    isScanningRef.current = true;
    setPaused(true);
    setLoading(true);

    // Haptic feedback
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(60);
    }

    try {
      const res = await fetch(`/api/scan?barcode=${encodeURIComponent(barcode)}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        found: false,
        barcode,
        explanation: "Error al consultar los datos del producto",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePhotoTaken = useCallback(async (base64Data: string) => {
    setPaused(true);
    setLoading(true);

    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Data }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        found: false,
        explanation: "No se pudo procesar la imagen de los ingredientes",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClose = () => {
    setResult(null);
    setLoading(false);
    setPaused(false);
    isScanningRef.current = false;
  };

  return (
    <main className="relative flex flex-col flex-1 h-full min-h-screen bg-black overflow-hidden safe-area-pb">
      <ScannerView
        onScan={handleScan}
        onPhotoTaken={handlePhotoTaken}
        paused={paused}
      />
      <ResultSheet
        result={result}
        loading={loading}
        onClose={handleClose}
      />
    </main>
  );
}
