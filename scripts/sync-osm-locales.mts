/**
 * Script de sincronización con OpenStreetMap (Overpass API)
 * Ingesta carnicerías y restaurantes halal en las principales ciudades de España
 * Uso: npx tsx scripts/sync-osm-locales.mts
 */
import fs from 'node:fs';
import path from 'node:path';

interface OsmElement {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags?: {
    name?: string;
    shop?: string;
    amenity?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    'addr:city'?: string;
    phone?: string;
    'contact:phone'?: string;
    'contact:whatsapp'?: string;
    website?: string;
    cuisine?: string;
    'diet:halal'?: string;
  };
}

const CITIES_BBOX = [
  { city: 'Madrid', bbox: '40.35,-3.75,40.50,-3.60' },
  { city: 'Barcelona', bbox: '41.34,2.10,41.45,2.23' },
  { city: 'Valencia', bbox: '39.43,-0.42,39.50,-0.33' },
  { city: 'Granada', bbox: '37.15,-3.63,37.20,-3.57' },
  { city: 'Sevilla', bbox: '37.35,-6.02,37.42,-5.95' },
];

async function fetchOsmForCity(city: string, bbox: string): Promise<OsmElement[]> {
  const query = `
[out:json][timeout:25];
(
  node["shop"="butcher"]["diet:halal"~"yes|only"](${bbox});
  node["amenity"~"restaurant|fast_food"]["diet:halal"~"yes|only"](${bbox});
  node["amenity"~"restaurant|fast_food"]["cuisine"="halal"](${bbox});
);
out center 40;
`;
  const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'HalallApp/1.0' } });
    if (!res.ok) {
      console.warn(`[OSM] Fallo en ${city}: ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return (data.elements || [])
      .filter((el: OsmElement) => el.tags && el.tags.name)
      .map((el: OsmElement) => {
        const t = el.tags!;
        const isButcher = t.shop === 'butcher';
        const street = t['addr:street'] ? `${t['addr:street']} ${t['addr:housenumber'] || ''}`.trim() : 'Dirección céntrica';
        return {
          id: `osm-${el.id}`,
          name: t.name!,
          type: isButcher ? 'carniceria' : 'restaurante',
          address: street,
          city: city,
          latitude: el.lat,
          longitude: el.lon,
          phone: t.phone || t['contact:phone'] || null,
          whatsapp: t['contact:whatsapp'] ? t['contact:whatsapp'].replace(/[^0-9]/g, '') : null,
          halalCertified: true,
          certifierName: 'OpenStreetMap (diet:halal)',
          verified: true,
          googleMapsUrl: `https://maps.google.com/?q=${el.lat},${el.lon}`,
        };
      });
  } catch (err) {
    console.error(`[OSM] Error en ${city}:`, err);
    return [];
  }
}

async function main() {
  console.log('🌍 Iniciando ingesta de OpenStreetMap España...');
  const allLocales = [];
  for (const c of CITIES_BBOX) {
    console.log(`🔎 Consultando ${c.city}...`);
    const locales = await fetchOsmForCity(c.city, c.bbox);
    console.log(`✅ ${c.city}: ${locales.length} locales encontrados.`);
    allLocales.push(...locales);
    // Pausa de cortesía para la API de OSM
    await new Promise((r) => setTimeout(r, 1500));
  }

  const outPath = path.join(process.cwd(), 'src/infrastructure/data/osm-locales.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(allLocales, null, 2), 'utf-8');
  console.log(`🎉 Total guardados: ${allLocales.length} locales en ${outPath}`);
}

main();
