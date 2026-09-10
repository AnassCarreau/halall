"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import type { Language, Translations } from "./types";
import { translations } from "./translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "halall_lang_pref";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === "es" || saved === "en" || saved === "ar") {
      return saved;
    }
  } catch {
    // Ignore localStorage access errors
  }
  return "es";
}

function getServerSnapshot(): Language {
  return "es";
}

function setStorageLanguage(lang: Language) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Ignore storage errors
  }
  listeners.forEach((listener) => listener());
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      const isRtl = language === "ar";
      document.documentElement.dir = isRtl ? "rtl" : "ltr";
      document.documentElement.lang = language;
    }
  }, [language]);

  const value: LanguageContextValue = {
    language,
    setLanguage: setStorageLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fail-safe fallback if used outside Provider
    return {
      language: "es",
      setLanguage: () => {},
      t: translations.es,
    };
  }
  return context;
}
