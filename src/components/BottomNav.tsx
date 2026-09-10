"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Search, MapPin } from "lucide-react";
import { useTranslation } from "@/i18n/context";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const tabs = [
    {
      href: "/",
      label: t.nav.scan,
      icon: Camera,
      active: pathname === "/",
    },
    {
      href: "/buscar",
      label: t.nav.search,
      icon: Search,
      active: pathname === "/buscar",
    },
    {
      href: "/locales",
      label: t.nav.places,
      icon: MapPin,
      active: pathname === "/locales",
      badge: t.nav.soon,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
                tab.active
                  ? "text-emerald-400 font-medium"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${tab.active ? "scale-110" : ""} transition-transform`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-4 rtl:-left-4 rtl:right-auto bg-emerald-950 text-emerald-400 text-[10px] font-bold px-1 rounded-full border border-emerald-800/50">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
