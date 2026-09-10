"use client";

import { X, CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Beef, Beaker, Database } from "lucide-react";
import { useTranslation } from "@/i18n/context";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl text-neutral-100 space-y-6 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/70 border border-emerald-800/80 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="guide-modal-title" className="text-lg font-bold text-white leading-tight">
                {t.guide.title}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {t.guide.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.guide.close}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Traffic Light */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            {t.guide.trafficLightTitle}
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-xl flex items-start gap-2.5 text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{t.guide.trafficLightHalal}</span>
            </div>

            <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-xl flex items-start gap-2.5 text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{t.guide.trafficLightDoubtful}</span>
            </div>

            <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-xl flex items-start gap-2.5 text-rose-200">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{t.guide.trafficLightHaram}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Meat Rule */}
        <div className="space-y-2 p-3.5 bg-neutral-950/60 rounded-2xl border border-neutral-800">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
            <Beef className="w-4 h-4 text-amber-400" />
            <span>{t.guide.meatRuleTitle}</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t.guide.meatRuleDesc}
          </p>
        </div>

        {/* Section 3: Additives */}
        <div className="space-y-2 p-3.5 bg-neutral-950/60 rounded-2xl border border-neutral-800">
          <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
            <Beaker className="w-4 h-4 text-rose-400" />
            <span>{t.guide.additivesTitle}</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t.guide.additivesDesc}
          </p>
        </div>

        {/* Section 4: Data Sources */}
        <div className="space-y-2 p-3.5 bg-neutral-950/60 rounded-2xl border border-neutral-800">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>{t.guide.sourcesTitle}</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t.guide.sourcesDesc}
          </p>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
        >
          {t.guide.close}
        </button>
      </div>
    </div>
  );
}
