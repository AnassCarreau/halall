import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DrizzleProductsRepository } from '@/infrastructure/db/products-repo';
import type { Product, NewProduct } from '@/infrastructure/db/schema';

describe('ProductsRepository (fail-soft behavior)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null on findByBarcode when no db client is available', async () => {
    // null db passed explicitly
    const repo = new DrizzleProductsRepository(null);
    const result = await repo.findByBarcode('8410000000001');
    expect(result).toBeNull();
  });

  it('returns empty array on searchByName when no db client is available', async () => {
    const repo = new DrizzleProductsRepository(null);
    const result = await repo.searchByName('yogur');
    expect(result).toEqual([]);
  });

  it('returns null on upsert when no db client is available', async () => {
    const repo = new DrizzleProductsRepository(null);
    const product: NewProduct = {
      barcode: '8410000000001',
      name: 'Yogur Natural',
      status: 'HALAL',
      source: 'OFF',
    };
    const result = await repo.upsert(product);
    expect(result).toBeNull();
  });

  it('catches and handles database errors gracefully (fail-soft)', async () => {
    const mockDb = {
      select: vi.fn().mockImplementation(() => {
        throw new Error('Connection refused');
      }),
      insert: vi.fn().mockImplementation(() => {
        throw new Error('Timeout');
      }),
    } as any;

    const repo = new DrizzleProductsRepository(mockDb);

    expect(await repo.findByBarcode('12345678')).toBeNull();
    expect(await repo.searchByName('test')).toEqual([]);
    expect(await repo.upsert({ barcode: '123', name: 'X', status: 'HALAL', source: 'OFF' })).toBeNull();
  });

  it('returns product when found in db', async () => {
    const dummyProduct: Product = {
      barcode: '8410000000001',
      name: 'Yogur Natural',
      brand: 'Danone',
      status: 'HALAL',
      hasMeat: false,
      conflicts: [],
      explanation: 'No se han detectado ingredientes problemáticos',
      source: 'OFF',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockDb = {
      select: vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([dummyProduct]),
          }),
        }),
      }),
    } as any;

    const repo = new DrizzleProductsRepository(mockDb);
    const result = await repo.findByBarcode('8410000000001');
    expect(result).toEqual(dummyProduct);
  });

  it('performs upsert successfully when db is available', async () => {
    const newProd: NewProduct = {
      barcode: '8410000000001',
      name: 'Yogur Natural',
      status: 'HALAL',
      source: 'OFF',
    };
    const returnedProd: Product = {
      ...newProd,
      brand: null,
      hasMeat: false,
      conflicts: [],
      explanation: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockDb = {
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          onConflictDoUpdate: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([returnedProd]),
          }),
        }),
      }),
    } as any;

    const repo = new DrizzleProductsRepository(mockDb);
    const result = await repo.upsert(newProd);
    expect(result).toEqual(returnedProd);
  });
});
