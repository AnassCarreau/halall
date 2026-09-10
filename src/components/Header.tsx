"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { useTranslation } from "@/i18n/context";
import { GuideModal } from "./GuideModal";
import type { Language } from "@/i18n/types";

export function Header() {
  const { language, setLanguage, t } = useTranslation();
  const [guideOpen, setGuideOpen] = useState(false);

  const languages: Language[] = ["es", "en", "ar"];

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80 safe-area-pt">
        <div className="max-w-md mx-auto flex items-center justify-between h-14 px-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-black tracking-tight text-emerald-400 group-hover:text-emerald-300 transition-colors">
              Halall
            </span>
          </Link>

          {/* Controls: Lang switcher + Help button */}
          <div className="flex items-center gap-2">
            {/* Lang buttons */}
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 text-xs font-semibold">
              {languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded-md uppercase text-[11px] transition-all cursor-pointer ${
                    language === lang
                      ? "bg-emerald-600 text-white font-bold shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                  aria-label={`Switch to ${lang.toUpperCase()}`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Help / Guide button */}
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              title={t.header.helpTooltip}
              aria-label={t.header.helpTooltip}
              className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <GuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
}
