import { eq, ilike } from 'drizzle-orm';
import { getDb, type DbType } from './client';
import { products, type Product, type NewProduct } from './schema';

export interface ProductsRepository {
  findByBarcode(barcode: string): Promise<Product | null>;
  searchByName(query: string, limit?: number): Promise<Product[]>;
  upsert(product: NewProduct): Promise<Product | null>;
}

export class DrizzleProductsRepository implements ProductsRepository {
  private customDb?: DbType | null;

  constructor(db?: DbType | null) {
    this.customDb = db;
  }

  private resolveDb(): DbType | null {
    if (this.customDb !== undefined) {
      return this.customDb;
    }
    return getDb();
  }

  async findByBarcode(barcode: string): Promise<Product | null> {
    const db = this.resolveDb();
    if (!db) {
      return null;
    }

    try {
      const rows = await db
        .select()
        .from(products)
        .where(eq(products.barcode, barcode))
        .limit(1);

      return rows[0] ?? null;
    } catch {
      // Fail-soft: DB error must not crash the app
      return null;
    }
  }

  async searchByName(query: string, limit = 20): Promise<Product[]> {
    const db = this.resolveDb();
    if (!db) {
      return [];
    }

    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      return [];
    }

    try {
      const rows = await db
        .select()
        .from(products)
        .where(ilike(products.name, `%${trimmed}%`))
        .limit(limit);

      return rows;
    } catch {
      // Fail-soft: DB error must not crash the app
      return [];
    }
  }

  async upsert(product: NewProduct): Promise<Product | null> {
    const db = this.resolveDb();
    if (!db) {
      return null;
    }

    try {
      const rows = await db
        .insert(products)
        .values(product)
        .onConflictDoUpdate({
          target: products.barcode,
          set: {
            name: product.name,
            brand: product.brand,
            status: product.status,
            hasMeat: product.hasMeat,
            conflicts: product.conflicts,
            explanation: product.explanation,
            ingredientsText: product.ingredientsText,
            source: product.source,
            updatedAt: new Date(),
          },
        })
        .returning();

      return rows[0] ?? null;
    } catch {
      // Fail-soft: DB error must not crash the app
      return null;
    }
  }
}

/** Default singleton repository instance using lazy getDb() */
export const defaultProductsRepo = new DrizzleProductsRepository();
