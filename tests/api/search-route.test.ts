import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Product } from '@/infrastructure/db/schema';

vi.mock('@/infrastructure/db/products-repo', () => ({
  DrizzleProductsRepository: vi.fn(),
  defaultProductsRepo: {
    findByBarcode: vi.fn().mockResolvedValue(null),
    searchByName: vi.fn().mockResolvedValue([]),
    upsert: vi.fn().mockResolvedValue(null),
  },
}));

describe('GET /api/search', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 400 when query parameter q is missing', async () => {
    const { GET } = await import('@/app/api/search/route');
    const req = new Request('http://localhost:3000/api/search');
    const res = await GET(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it('returns 400 when q parameter is too short (< 2 chars)', async () => {
    const { GET } = await import('@/app/api/search/route');
    const req = new Request('http://localhost:3000/api/search?q=a');
    const res = await GET(req);

    expect(res.status).toBe(400);
  });

  it('returns 200 with results array when search is valid', async () => {
    const mockProducts = [
      {
        barcode: '8410000000001',
        name: 'Yogur Natural',
        brand: 'Danone',
        status: 'HALAL',
        hasMeat: false,
        conflicts: [],
        explanation: 'No hay ingredientes problemáticos',
        source: 'OFF',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const { defaultProductsRepo } = await import('@/infrastructure/db/products-repo');
    vi.mocked(defaultProductsRepo.searchByName).mockResolvedValue(mockProducts as Product[]);

    const { GET } = await import('@/app/api/search/route');
    const req = new Request('http://localhost:3000/api/search?q=yogur');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results).toBeDefined();
    expect(Array.isArray(body.results)).toBe(true);
  });

  it('returns 200 with empty results when no match found', async () => {
    const { defaultProductsRepo } = await import('@/infrastructure/db/products-repo');
    vi.mocked(defaultProductsRepo.searchByName).mockResolvedValue([]);

    const { GET } = await import('@/app/api/search/route');
    const req = new Request('http://localhost:3000/api/search?q=xyznonexistent');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results).toEqual([]);
  });
});
