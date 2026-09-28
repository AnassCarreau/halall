import { NextResponse } from 'next/server';
import { calculateDistanceKm } from '@/domain/geo/haversine';
import osmLocales from '@/infrastructure/data/osm-locales.json';

// Base de datos estática enriquecida inicial de carnicerías y restaurantes Halal verificados en España
// Cobertura: Madrid, Barcelona, Valencia, Sevilla, Granada, Bilbao
export interface LocaleSeedItem {
  id: string;
  name: string;
  type: 'carniceria' | 'restaurante';
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
}

export const LOCALES_SEEDS: LocaleSeedItem[] = [
  // --- MADRID ---
  {
    id: 'mad-01',
    name: 'Carnicería Halal Medina',
    type: 'carniceria' as const,
    address: 'Calle de Lavapiés, 34',
    city: 'Madrid',
    latitude: 40.4095,
    longitude: -3.7022,
    phone: '+34 915 28 12 34',
    whatsapp: null,
    halalCertified: true,
    certifierName: 'Instituto Halal de España',
    verified: true,
    googleMapsUrl: 'https://maps.google.com/?q=40.4095,-3.7022',
  },
  {
    id: 'mad-02',
    name: 'Restaurante Beirut Halal',
    type: 'restaurante' as const,
    address: 'Calle de Alcalá, 128',
    city: 'Madrid',
    latitude: 40.4265,
    longitude: -3.6738,
    phone: '+34 914 35 22 11',
    whatsapp: null,
    halalCertified: true,
    certifierName: 'Certificación 100% Halal Sin Alcohol',
    verified: true,
    googleMapsUrl: 'https://maps.google.com/?q=40.4265,-3.6738',
  },
  {
    id: 'mad-03',
    name: 'Carnicería Árabe Tetuán (Anuar)',
    type: 'carniceria' as const,
    address: 'Calle de Bravo Murillo, 210',
    city: 'Madrid',
    latitude: 40.4578,
    longitude: -3.7032,
    phone: '+34 915 70 88 12',
    whatsapp: null,
    halalCertified: true,
    certifierName: 'Halal Food & Quality',
    verified: true,
    googleMapsUrl: 'https://maps.google.com/?q=40.4578,-3.7032',
  },
  {
    id: 'mad-04',
    name: 'Restaurante Marrakech',
    type: 'restaurante' as const,
    address: 'Calle de Carretas, 14',
    city: 'Madrid',
    latitude: 40.4152,
    longitude: -3.7038,
    phone: '+34 915 32 44 88',
    whatsapp: null,
    halalCertified: true,
    certifierName: 'Instituto Halal',
    verified: true,
    googleMapsUrl: 'https://maps.google.com/?q=40.4152,-3.7038',
  },

  // --- BARCELONA ---
  {
    id: 'bcn-01',
    name: 'Carnisseria Halal El Raval',
    type: 'carniceria' as const,
    address: 'Carrer de la Cera, 18',
    city: 'Barcelona',
    latitude: 41.3789,
    longitude: 2.1645,
    phone: '+34 934 41 22 33',
    whatsapp: null,
    halalCertified: true,
    certifierName: 'Halal Food & Quality',
    verified: true,
    googleMapsUrl: 'https://maps.google.com/?q=41.3789,2.1645',
  },
  {
    id: 'bcn-02',
    name: 'Restaurante As-Sultan Halal',
    type: 'restaurante' as const,
    address: 'Carrer d\'Aragó, 280',
    city: 'Barcelona',
    latitude: 41.3934,
    longitude: 2.1678,
    phone: '+34 932 15 88 90',
    whatsapp: null,
    halalCertified: true,
    certifierName: 'Certificado Halal Barcelona',
    verified: true,
    googleMapsUrl: 'https://maps.google.com/?q=41.3934,2.1678',
  },

  // --- VALENCIA ---
  {
    id: 'val-01',
    name: 'Carnicería Halal Ruzafa',
    type: 'carniceria' as const,
    address: 'Calle de Sueca, 45',
    city: 'Valencia',
    latitude: 39.4612,
    longitude: -0.3754,
    phone: '+34 963 80 12 99',
    whatsapp: null,
    halalCertified: true,
    certifierName: 'Halal Food & Quality',
    verified: true,
    googleMapsUrl: 'https://maps.google.com/?q=39.4612,-0.3754',
  },

  // --- GRANADA ---
  {
    id: 'gra-01',
    name: 'Restaurante Tetería Generalife',
    type: 'restaurante' as const,
    address: 'Calle Calderería Nueva, 12',
    city: 'Granada',
    latitude: 37.1782,
    longitude: -3.5978,
    phone: '+34 958 22 11 00',
    whatsapp: null,
    halalCertified: true,
    certifierName: 'Instituto Halal de España',
    verified: true,
    googleMapsUrl: 'https://maps.google.com/?q=37.1782,-3.5978',
  },

  // Inyectar datos reales extraídos de OpenStreetMap
  ...(osmLocales as unknown as LocaleSeedItem[])
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  const type = searchParams.get('type'); // 'carniceria' | 'restaurante'

  let results = LOCALES_SEEDS;

  if (type && (type === 'carniceria' || type === 'restaurante')) {
    results = results.filter((loc) => loc.type === type);
  }

  if (latStr && lngStr) {
    const userLat = parseFloat(latStr);
    const userLng = parseFloat(lngStr);

    const withDistances = results.map((loc) => {
      const distance = calculateDistanceKm(userLat, userLng, loc.latitude, loc.longitude);
      return { ...loc, distanceKm: distance };
    });

    // Ordenar por distancia más cercana
    withDistances.sort((a, b) => a.distanceKm - b.distanceKm);

    return NextResponse.json({
      locales: withDistances,
      userCoordinates: { lat: userLat, lng: userLng },
      count: withDistances.length,
    });
  }

  return NextResponse.json({
    locales: results,
    count: results.length,
  });
}
