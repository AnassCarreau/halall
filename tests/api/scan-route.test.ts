import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as scanUseCase from '@/application/scan-barcode';

describe('GET /api/scan', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 400 when barcode parameter is missing', async () => {
    const { GET } = await import('@/app/api/scan/route');
    const req = new Request('http://localhost:3000/api/scan');
    const res = await GET(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it('returns 400 when barcode is invalid (non-numeric or invalid length)', async () => {
    const { GET } = await import('@/app/api/scan/route');

    // Too short (< 8 digits)
    const resShort = await GET(new Request('http://localhost:3000/api/scan?barcode=123'));
    expect(resShort.status).toBe(400);

    // Non numeric
    const resAlpha = await GET(new Request('http://localhost:3000/api/scan?barcode=abcdefgh'));
    expect(resAlpha.status).toBe(400);

    // Too long (> 14 digits)
    const resLong = await GET(new Request('http://localhost:3000/api/scan?barcode=123456789012345'));
    expect(resLong.status).toBe(400);
  });

  it('returns 200 with product details including ingredientsText when barcode is found', async () => {
    const mockResult: scanUseCase.ScanResult = {
      found: true,
      barcode: '8410000000001',
      name: 'Yogur Natural',
      brand: 'Danone',
      status: 'HALAL',
      hasMeat: false,
      conflicts: [],
      explanation: 'No se han detectado ingredientes problemáticos',
      ingredientsText: 'Leche entera pasteurizada, fermentos lácticos',
      source: 'OFF',
    };

    vi.spyOn(scanUseCase, 'scanBarcode').mockResolvedValue(mockResult);

    const { GET } = await import('@/app/api/scan/route');
    const req = new Request('http://localhost:3000/api/scan?barcode=8410000000001');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(mockResult);
    expect(body.ingredientsText).toBe('Leche entera pasteurizada, fermentos lácticos');
    expect(scanUseCase.scanBarcode).toHaveBeenCalledWith('8410000000001');
  });

  it('returns 200 with { found: false } when barcode is not found', async () => {
    vi.spyOn(scanUseCase, 'scanBarcode').mockResolvedValue({ found: false });

    const { GET } = await import('@/app/api/scan/route');
    const req = new Request('http://localhost:3000/api/scan?barcode=8410000000009');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ found: false });
  });

  it('returns 500 when use-case throws an unexpected error', async () => {
    vi.spyOn(scanUseCase, 'scanBarcode').mockRejectedValue(new Error('Unexpected crash'));

    const { GET } = await import('@/app/api/scan/route');
    const req = new Request('http://localhost:3000/api/scan?barcode=8410000000001');
    const res = await GET(req);

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });
});
