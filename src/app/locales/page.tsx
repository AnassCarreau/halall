"use client";

import { MapPin, Utensils, Store, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n/context";

export default function LocalesPage() {
  const { t } = useTranslation();

  return (
    <main className="flex-1 bg-neutral-950 text-neutral-100 min-h-screen px-4 pt-6 pb-24 max-w-md mx-auto w-full flex flex-col justify-center text-center">
      <div className="w-16 h-16 bg-emerald-950/50 border border-emerald-800/60 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-400">
        <MapPin className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-emerald-400 text-xs font-semibold mx-auto mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        {t.locales.phaseBadge}
      </div>

      <h1 className="text-2xl font-black text-white tracking-tight">
        {t.locales.title}
      </h1>
      <p className="text-xs text-neutral-400 mt-2 max-w-xs mx-auto leading-relaxed">
        {t.locales.subtitle}
      </p>

      <div className="grid grid-cols-2 gap-3 mt-8 text-left rtl:text-right">
        <div className="p-4 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl">
          <Utensils className="w-5 h-5 text-emerald-400 mb-2" />
          <h3 className="text-xs font-bold text-neutral-200">{t.locales.restaurantsTitle}</h3>
          <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
            {t.locales.restaurantsDesc}
          </p>
        </div>

        <div className="p-4 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl">
          <Store className="w-5 h-5 text-emerald-400 mb-2" />
          <h3 className="text-xs font-bold text-neutral-200">{t.locales.butchersTitle}</h3>
          <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
            {t.locales.butchersDesc}
          </p>
        </div>
      </div>
    </main>
  );
}
