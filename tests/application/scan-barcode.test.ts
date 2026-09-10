import { describe, it, expect, vi } from 'vitest';
import { scanBarcode } from '@/application/scan-barcode';
import type { ProductsRepository } from '@/infrastructure/db/products-repo';
import type { OffClient, OffProduct } from '@/infrastructure/off/off-client';
import type { Product } from '@/infrastructure/db/schema';
import type { ClassificationResult, IngredientConflict } from '@/domain/classification/types';

describe('scanBarcode use case', () => {
  const dummyCachedProduct: Product = {
    barcode: '8410000000001',
    name: 'Pan de Molde',
    brand: 'Bimbo',
    status: 'HALAL',
    hasMeat: false,
    conflicts: [],
    explanation: 'No se han detectado ingredientes problemáticos',
    source: 'DB',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createMockRepo = (overrides?: Partial<ProductsRepository>): ProductsRepository => ({
    findByBarcode: vi.fn().mockResolvedValue(null),
    searchByName: vi.fn().mockResolvedValue([]),
    upsert: vi.fn().mockResolvedValue(null),
    ...overrides,
  });

  const createMockOffClient = (overrides?: Partial<OffClient>): OffClient => ({
    getProduct: vi.fn().mockResolvedValue(null),
    ...overrides,
  });

  it('returns cached product immediately when DB hit occurs (no OFF call)', async () => {
    const repo = createMockRepo({
      findByBarcode: vi.fn().mockResolvedValue(dummyCachedProduct),
    });
    const offClient = createMockOffClient();

    const result = await scanBarcode('8410000000001', { repo, offClient });

    expect(repo.findByBarcode).toHaveBeenCalledWith('8410000000001');
    expect(offClient.getProduct).not.toHaveBeenCalled();
    expect(result).toEqual({
      found: true,
      barcode: '8410000000001',
      name: 'Pan de Molde',
      brand: 'Bimbo',
      status: 'HALAL',
      hasMeat: false,
      conflicts: [],
      explanation: 'No se han detectado ingredientes problemáticos',
      source: 'DB',
    });
  });

  it('queries OFF on DB miss, classifies product, saves to DB lazy-cache, and returns verdict', async () => {
    const offProduct: OffProduct = {
      barcode: '8410000000002',
      name: 'Salchichas de Pavo',
      brand: 'Campofrío',
      ingredientsText: 'Carne de pavo 70%, agua, sal',
      isCertifiedHalal: false,
    };

    const repo = createMockRepo({
      findByBarcode: vi.fn().mockResolvedValue(null),
      upsert: vi.fn().mockResolvedValue({
        ...offProduct,
        status: 'DOUBTFUL',
        hasMeat: true,
        conflicts: [],
        explanation: 'Carne no verificada',
        source: 'OFF',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    });

    const offClient = createMockOffClient({
      getProduct: vi.fn().mockResolvedValue(offProduct),
    });

    const result = await scanBarcode('8410000000002', { repo, offClient });

    expect(repo.findByBarcode).toHaveBeenCalledWith('8410000000002');
    expect(offClient.getProduct).toHaveBeenCalledWith('8410000000002');

    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.barcode).toBe('8410000000002');
      expect(result.name).toBe('Salchichas de Pavo');
      expect(result.brand).toBe('Campofrío');
      expect(result.status).toBe('DOUBTFUL');
      expect(result.hasMeat).toBe(true);
      expect(result.source).toBe('OFF');
    }

    // Lazy cache write was invoked
    expect(repo.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        barcode: '8410000000002',
        name: 'Salchichas de Pavo',
        status: 'DOUBTFUL',
        hasMeat: true,
        source: 'OFF',
      })
    );
  });

  it('classifies meat with isCertifiedHalal: true as HALAL', async () => {
    const offProduct: OffProduct = {
      barcode: '8410000000003',
      name: 'Pollo Certificado',
      brand: 'Isla Halal',
      ingredientsText: 'Carne de pollo 100%',
      isCertifiedHalal: true,
    };

    const repo = createMockRepo();
    const offClient = createMockOffClient({
      getProduct: vi.fn().mockResolvedValue(offProduct),
    });

    const result = await scanBarcode('8410000000003', { repo, offClient });

    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.status).toBe('HALAL');
      expect(result.hasMeat).toBe(true);
      expect(result.conflicts).toHaveLength(0);
    }
  });

  it('returns found: false when both DB and OFF miss', async () => {
    const repo = createMockRepo();
    const offClient = createMockOffClient({
      getProduct: vi.fn().mockResolvedValue(null),
    });

    const result = await scanBarcode('9999999999999', { repo, offClient });

    expect(result).toEqual({ found: false });
    expect(repo.upsert).not.toHaveBeenCalled();
  });

  it('still returns classification result even if lazy-cache upsert fails', async () => {
    const offProduct: OffProduct = {
      barcode: '8410000000004',
      name: 'Yogur de Fresa',
      brand: 'Danone',
      ingredientsText: 'Leche pasteurizada, azúcar, fresa, carmín E120',
      isCertifiedHalal: false,
    };

    const repo = createMockRepo({
      findByBarcode: vi.fn().mockResolvedValue(null),
      upsert: vi.fn().mockRejectedValue(new Error('DB write failed')),
    });

    const offClient = createMockOffClient({
      getProduct: vi.fn().mockResolvedValue(offProduct),
    });

    const result = await scanBarcode('8410000000004', { repo, offClient });

    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.status).toBe('DOUBTFUL');
      expect(result.conflicts.some((c: IngredientConflict) => c.code === 'e120')).toBe(true);
    }
  });

  it('accepts a custom classify engine if injected', async () => {
    const offProduct: OffProduct = {
      barcode: '8410000000005',
      name: 'Custom Product',
      brand: null,
      ingredientsText: 'Ingredientes secretos',
      isCertifiedHalal: false,
    };

    const repo = createMockRepo();
    const offClient = createMockOffClient({
      getProduct: vi.fn().mockResolvedValue(offProduct),
    });

    const customClassify = vi.fn().mockReturnValue({
      status: 'HARAM',
      hasMeat: false,
      conflicts: [{ name: 'Custom Haram', severity: 'HARAM', reason: 'Test' }],
      explanation: 'Custom Haram found',
    } satisfies ClassificationResult);

    const result = await scanBarcode('8410000000005', {
      repo,
      offClient,
      classifyEngine: customClassify,
    });

    expect(customClassify).toHaveBeenCalledWith('Ingredientes secretos', {
      isCertifiedHalal: false,
    });
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.status).toBe('HARAM');
    }
  });

  describe('Natural Halal Categories fallback', () => {
    it('classifies product with empty ingredients and natural category tag as HALAL', async () => {
      const offProduct: OffProduct = {
        barcode: '8410000000010',
        name: 'Agua Mineral Natural 1.5L',
        brand: 'Bezoya',
        ingredientsText: '',
        categoriesTags: ['en:beverages', 'en:waters', 'en:spring-waters'],
        isCertifiedHalal: false,
      };

      const repo = createMockRepo();
      const offClient = createMockOffClient({
        getProduct: vi.fn().mockResolvedValue(offProduct),
      });

      const result = await scanBarcode('8410000000010', { repo, offClient });

      expect(result.found).toBe(true);
      if (result.found) {
        expect(result.status).toBe('HALAL');
        expect(result.hasMeat).toBe(false);
        expect(result.conflicts).toHaveLength(0);
        expect(result.explanation).toBe('Alimento o agua natural sin aditivos añadidos');
        expect(result.ingredientsText).toBe('Agua Mineral Natural 1.5L');
      }

      expect(repo.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          barcode: '8410000000010',
          status: 'HALAL',
          explanation: 'Alimento o agua natural sin aditivos añadidos',
          ingredientsText: 'Agua Mineral Natural 1.5L',
        })
      );
    });

    it('classifies fresh vegetables or fruits with empty ingredients as HALAL', async () => {
      const offProduct: OffProduct = {
        barcode: '8410000000011',
        name: 'Tomates de rama',
        brand: null,
        ingredientsText: '  ',
        categoriesTags: ['en:plant-based-foods', 'en:fresh-vegetables', 'en:tomatoes'],
        isCertifiedHalal: false,
      };

      const repo = createMockRepo();
      const offClient = createMockOffClient({
        getProduct: vi.fn().mockResolvedValue(offProduct),
      });

      const result = await scanBarcode('8410000000011', { repo, offClient });

      expect(result.found).toBe(true);
      if (result.found) {
        expect(result.status).toBe('HALAL');
        expect(result.hasMeat).toBe(false);
        expect(result.conflicts).toHaveLength(0);
        expect(result.explanation).toBe('Alimento o agua natural sin aditivos añadidos');
        expect(result.ingredientsText).toBe('Tomates de rama');
      }
    });

    it('falls back to DOUBTFUL if ingredients are empty and categories do not match natural halal', async () => {
      const offProduct: OffProduct = {
        barcode: '8410000000012',
        name: 'Snack Desconocido',
        brand: 'Misterio',
        ingredientsText: '',
        categoriesTags: ['en:snacks', 'en:processed-foods'],
        isCertifiedHalal: false,
      };

      const repo = createMockRepo();
      const offClient = createMockOffClient({
        getProduct: vi.fn().mockResolvedValue(offProduct),
      });

      const result = await scanBarcode('8410000000012', { repo, offClient });

      expect(result.found).toBe(true);
      if (result.found) {
        expect(result.status).toBe('DOUBTFUL');
        expect(result.explanation).toContain('Ingredientes no especificados');
      }
    });

    it('returns ingredientsText from cached DB product', async () => {
      const cachedWithIngredients: Product = {
        barcode: '8410000000013',
        name: 'Zumo de Naranja',
        brand: 'Don Simón',
        status: 'HALAL',
        hasMeat: false,
        conflicts: [],
        explanation: 'Sin aditivos problemáticos',
        ingredientsText: '100% zumo de naranja exprimida',
        source: 'DB',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const repo = createMockRepo({
        findByBarcode: vi.fn().mockResolvedValue(cachedWithIngredients),
      });
      const offClient = createMockOffClient();

      const result = await scanBarcode('8410000000013', { repo, offClient });

      expect(result.found).toBe(true);
      if (result.found) {
        expect(result.ingredientsText).toBe('100% zumo de naranja exprimida');
      }
    });
  });
});
