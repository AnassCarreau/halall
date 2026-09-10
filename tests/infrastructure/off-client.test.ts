import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OpenFoodFactsClient, type OffProduct } from '@/infrastructure/off/off-client';

describe('OpenFoodFactsClient', () => {
  let client: OpenFoodFactsClient;

  beforeEach(() => {
    client = new OpenFoodFactsClient();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps a valid OFF v2 response successfully', async () => {
    const mockResponse = {
      status: 1,
      code: '8410000000001',
      product: {
        product_name: 'Galletas de Chocolate',
        brands: 'Gullón',
        ingredients_text: 'Harina de trigo, azúcar, cacao en polvo, aceite de girasol',
        labels_tags: ['en:vegetarian'],
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });
    vi.stubGlobal('fetch', fetchMock);

    const product = await client.getProduct('8410000000001');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('8410000000001'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'User-Agent': expect.stringContaining('Halall'),
        }),
      })
    );

    expect(product).toEqual<OffProduct>({
      barcode: '8410000000001',
      name: 'Galletas de Chocolate',
      brand: 'Gullón',
      ingredientsText: 'Harina de trigo, azúcar, cacao en polvo, aceite de girasol',
      categoriesTags: [],
      isCertifiedHalal: false,
    });
  });

  it('detects halal certification in labels_tags', async () => {
    const mockResponse = {
      status: 1,
      code: '8410000000002',
      product: {
        product_name: 'Pollo Halal',
        brands: 'Halal Meat Co',
        ingredients_text: 'Carne de pollo',
        labels_tags: ['en:halal', 'en:no-preservatives'],
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      })
    );

    const product = await client.getProduct('8410000000002');
    expect(product?.isCertifiedHalal).toBe(true);
  });

  it('detects halal certification in raw labels string if labels_tags does not have it', async () => {
    const mockResponse = {
      status: 1,
      code: '8410000000003',
      product: {
        product_name: 'Carne Picada',
        ingredients_text: 'Carne de vacuno',
        labels: 'Certificado Halal de España',
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      })
    );

    const product = await client.getProduct('8410000000003');
    expect(product?.isCertifiedHalal).toBe(true);
  });

  it('prefers Spanish ingredients_text_es and product_name_es when present', async () => {
    const mockResponse = {
      status: 1,
      code: '8410000000004',
      product: {
        product_name: 'Cereal Flakes',
        product_name_es: 'Copos de Cereal',
        ingredients_text: 'Wheat, barley, sugar',
        ingredients_text_es: 'Trigo, cebada, azúcar',
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      })
    );

    const product = await client.getProduct('8410000000004');
    expect(product?.name).toBe('Copos de Cereal');
    expect(product?.ingredientsText).toBe('Trigo, cebada, azúcar');
  });

  it('returns null when product is not found (status 0)', async () => {
    const mockResponse = {
      status: 0,
      status_verbose: 'product not found',
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      })
    );

    const product = await client.getProduct('9999999999999');
    expect(product).toBeNull();
  });

  it('returns null on HTTP 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      })
    );

    const product = await client.getProduct('9999999999999');
    expect(product).toBeNull();
  });

  it('returns null and does not throw on network failure or timeout', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('AbortError: The operation was aborted'))
    );

    const product = await client.getProduct('8410000000001');
    expect(product).toBeNull();
  });

  it('extracts categories_tags as lowercased string array', async () => {
    const mockResponse = {
      status: 1,
      code: '8410000000005',
      product: {
        product_name: 'Agua Mineral Natural',
        categories_tags: ['EN:Waters', 'En:Spring-Waters', 'en:Mineral-Waters'],
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      })
    );

    const product = await client.getProduct('8410000000005');
    expect(product?.categoriesTags).toEqual([
      'en:waters',
      'en:spring-waters',
      'en:mineral-waters',
    ]);
  });
});
