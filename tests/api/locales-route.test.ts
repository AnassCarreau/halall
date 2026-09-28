import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/locales/route';

describe('GET /api/locales', () => {
  it('returns list of locales with total count', async () => {
    const req = new Request('http://localhost:3000/api/locales');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.locales).toBeDefined();
    expect(Array.isArray(data.locales)).toBe(true);
    expect(data.count).toBeGreaterThan(0);
  });

  it('filters by type correctly', async () => {
    const req = new Request('http://localhost:3000/api/locales?type=carniceria');
    const res = await GET(req);
    const data = await res.json();

    expect(data.locales.length).toBeGreaterThan(0);
    for (const loc of data.locales) {
      expect(loc.type).toBe('carniceria');
    }
  });

  it('sorts by distance when coords provided', async () => {
    // Madrid coords: 40.4168, -3.7038
    const req = new Request('http://localhost:3000/api/locales?lat=40.4168&lng=-3.7038');
    const res = await GET(req);
    const data = await res.json();

    expect(data.locales.length).toBeGreaterThan(0);
    expect(data.locales[0].distanceKm).toBeDefined();
    expect(data.locales[0].distanceKm).toBeLessThan(data.locales[data.locales.length - 1].distanceKm);
  });
});
