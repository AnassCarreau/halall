import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { LanguageProvider } from "@/i18n/context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Halall — Escáner Halal para España",
  description: "Verifica al instante el estado halal de productos en supermercados españoles. Sin anuncios ni registros.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-neutral-100 selection:bg-emerald-500 selection:text-black">
        <LanguageProvider>
          <Header />
          {children}
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
