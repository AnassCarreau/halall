"use client";

import { useState, useEffect } from "react";
import { MapPin, Utensils, Store, Phone, ExternalLink, Navigation, CheckCircle2, MessageCircle } from "lucide-react";
import { formatDistance } from "@/domain/geo/haversine";

interface LocaleItem {
  id: string;
  name: string;
  type: "carniceria" | "restaurante";
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone?: string | null;
  whatsapp?: string | null;
  halalCertified: boolean;
  certifierName?: string | null;
  verified: boolean;
  googleMapsUrl?: string | null;
  distanceKm?: number;
}

export default function LocalesPage() {
  const [activeTab, setActiveTab] = useState<"todos" | "carniceria" | "restaurante">("todos");
  const [locales, setLocales] = useState<LocaleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  const fetchLocales = async (lat?: number, lng?: number) => {
    setLoading(true);
    try {
      let url = "/api/locales";
      const params = new URLSearchParams();
      if (lat && lng) {
        params.append("lat", lat.toString());
        params.append("lng", lng.toString());
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setLocales(data.locales || []);
    } catch (e) {
      console.error("Error cargando locales:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/locales");
        const data = await res.json();
        if (!ignore) {
          setLocales(data.locales || []);
        }
      } catch (e) {
        console.error("Error cargando locales:", e);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      alert("La geolocalización no está soportada por tu navegador.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        fetchLocales(coords.lat, coords.lng);
        setLocating(false);
      },
      (err) => {
        console.warn("Permiso de ubicación denegado o error:", err);
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const filteredLocales = locales.filter((loc) => {
    if (activeTab === "todos") return true;
    return loc.type === activeTab;
  });

  return (
    <main className="flex-1 bg-neutral-950 text-neutral-100 min-h-screen px-4 pt-6 pb-24 max-w-md mx-auto w-full">
      {/* Header */}
      <header className="flex items-center justify-between pb-4 border-b border-neutral-900">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            Locales Halal España
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">Carnicerías y restaurantes verificados cerca de ti</p>
        </div>
        <button
          onClick={handleRequestLocation}
          disabled={locating}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/80 rounded-xl text-xs font-semibold text-emerald-400 transition"
        >
          <Navigation className={`w-3.5 h-3.5 ${locating ? "animate-spin" : ""}`} />
          {userLocation ? "Cerca de ti" : "Ubicación"}
        </button>
      </header>

      {/* Tabs */}
      <div className="flex bg-neutral-900 p-1 rounded-xl mt-4 border border-neutral-800 text-xs">
        <button
          onClick={() => setActiveTab("todos")}
          className={`flex-1 py-1.5 rounded-lg font-medium transition ${
            activeTab === "todos" ? "bg-neutral-800 text-white shadow" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setActiveTab("carniceria")}
          className={`flex-1 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition ${
            activeTab === "carniceria" ? "bg-neutral-800 text-emerald-400 shadow" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          Carnicerías
        </button>
        <button
          onClick={() => setActiveTab("restaurante")}
          className={`flex-1 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition ${
            activeTab === "restaurante" ? "bg-neutral-800 text-emerald-400 shadow" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          Restaurantes
        </button>
      </div>

      {/* List */}
      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="text-center py-12 text-neutral-500 text-xs">Cargando locales...</div>
        ) : filteredLocales.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-xs">No se encontraron locales con este filtro.</div>
        ) : (
          filteredLocales.map((loc) => (
            <article
              key={loc.id}
              className="p-4 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl hover:border-neutral-700 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {loc.type === "carniceria" ? "Carnicería" : "Restaurante"}
                    </span>
                    {loc.halalCertified && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        Halal
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-neutral-100 mt-2">{loc.name}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{loc.address}, {loc.city}</p>
                  {loc.certifierName && (
                    <p className="text-[11px] text-neutral-500 mt-1 italic">Cert: {loc.certifierName}</p>
                  )}
                </div>

                {loc.distanceKm !== undefined && (
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded-xl shrink-0">
                    {formatDistance(loc.distanceKm)}
                  </span>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-neutral-800/80 text-xs">
                {loc.googleMapsUrl && (
                  <a
                    href={loc.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-neutral-200 font-semibold transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                    Cómo llegar
                  </a>
                )}

                {loc.whatsapp && (
                  <a
                    href={`https://wa.me/${loc.whatsapp}?text=Hola,%20os%20he%20visto%20en%20Halall%20y%20quería%20hacer%20un%20pedido.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-semibold transition shrink-0"
                    title="Pedir por WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Pedir
                  </a>
                )}

                {loc.phone && !loc.whatsapp && (
                  <a
                    href={`tel:${loc.phone}`}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-neutral-200 transition"
                    title="Llamar"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
