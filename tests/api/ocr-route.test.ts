import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('POST /api/ocr', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 503 when GOOGLE_API_KEY env is not set', async () => {
    delete process.env.GOOGLE_API_KEY;

    const { POST } = await import('@/app/api/ocr/route');
    const req = new Request('http://localhost:3000/api/ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: 'data:image/jpeg;base64,/9j/4AAQ' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it('returns 400 when imageBase64 is missing', async () => {
    process.env.GOOGLE_API_KEY = 'test-key-12345';

    const { POST } = await import('@/app/api/ocr/route');
    const req = new Request('http://localhost:3000/api/ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const res = await POST(req);

    expect(res.status).toBe(400);

    delete process.env.GOOGLE_API_KEY;
  });

  it('returns 413 when payload is too large (>500KB base64)', async () => {
    process.env.GOOGLE_API_KEY = 'test-key-12345';

    const largeBase64 = 'A'.repeat(600_000);

    const { POST } = await import('@/app/api/ocr/route');
    const req = new Request('http://localhost:3000/api/ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: largeBase64 }),
    });
    const res = await POST(req);

    expect(res.status).toBe(413);

    delete process.env.GOOGLE_API_KEY;
  });

  it('returns 200 with classification when Gemini OCR returns ingredients', async () => {
    process.env.GOOGLE_API_KEY = 'test-key-12345';

    vi.doMock('@/infrastructure/gemini/gemini-ocr', () => ({
      extractIngredients: vi.fn().mockResolvedValue('Harina de trigo, agua, sal'),
    }));

    // Force re-import after mock
    vi.resetModules();
    const { POST } = await import('@/app/api/ocr/route');

    const req = new Request('http://localhost:3000/api/ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: 'data:image/jpeg;base64,/9j/4AAQ' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.found).toBe(true);
    expect(body.status).toBeDefined();
    expect(body.ingredients).toBeDefined();
    expect(body.ingredientsText).toBe('Harina de trigo, agua, sal');

    delete process.env.GOOGLE_API_KEY;
  });

  it('returns 500 when Gemini OCR throws an error', async () => {
    process.env.GOOGLE_API_KEY = 'test-key-12345';

    vi.doMock('@/infrastructure/gemini/gemini-ocr', () => ({
      extractIngredients: vi.fn().mockRejectedValue(new Error('Gemini API failed')),
    }));

    vi.resetModules();
    const { POST } = await import('@/app/api/ocr/route');

    const req = new Request('http://localhost:3000/api/ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: 'data:image/jpeg;base64,/9j/4AAQ' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(500);

    delete process.env.GOOGLE_API_KEY;
  });
});
