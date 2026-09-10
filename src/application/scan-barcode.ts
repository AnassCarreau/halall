import { classify } from '@/domain/classification';
import type { HalalStatus, IngredientConflict } from '@/domain/classification/types';
import { defaultProductsRepo, type ProductsRepository } from '@/infrastructure/db/products-repo';
import { defaultOffClient, type OffClient } from '@/infrastructure/off/off-client';
import type { NewProduct } from '@/infrastructure/db/schema';

export interface ScanResultFound {
  found: true;
  barcode: string;
  name: string;
  brand?: string | null;
  status: HalalStatus;
  hasMeat: boolean;
  conflicts: IngredientConflict[];
  explanation?: string | null;
  ingredientsText?: string | null;
  source: string;
}

export interface ScanResultNotFound {
  found: false;
}

export type ScanResult = ScanResultFound | ScanResultNotFound;

export const NATURAL_HALAL_CATEGORIES: ReadonlyArray<string> = [
  'en:waters',
  'en:spring-waters',
  'en:mineral-waters',
  'en:natural-mineral-waters',
  'en:fresh-fruits',
  'en:fruits',
  'en:fresh-vegetables',
  'en:vegetables',
  'en:tomatoes',
  'en:raw-tomatoes',
  'en:legumes',
  'en:pulses',
  'en:grains',
  'en:rice',
  'en:salts',
  'en:sea-salts',
];

export interface ScanBarcodeDependencies {
  repo?: ProductsRepository;
  offClient?: OffClient;
  classifyEngine?: typeof classify;
}

/**
 * Use case: Escanear código de barras.
 *
 * Flujo:
 * 1. Busca en Drizzle DB (hit -> devuelve veredicto cacheado).
 * 2. Si miss, consulta Open Food Facts v2.
 * 3. Si OFF devuelve producto, pasa ingredientes por el motor de clasificación.
 * 4. Guarda resultado en DB (lazy cache, fail-soft).
 * 5. Si OFF tampoco encuentra el producto, devuelve { found: false }.
 */
export async function scanBarcode(
  barcode: string,
  deps?: ScanBarcodeDependencies
): Promise<ScanResult> {
  const repo = deps?.repo ?? defaultProductsRepo;
  const offClient = deps?.offClient ?? defaultOffClient;
  const classifyEngine = deps?.classifyEngine ?? classify;

  const cleanBarcode = barcode?.trim();
  if (!cleanBarcode) {
    return { found: false };
  }

  // 1. Cache hit check
  try {
    const cached = await repo.findByBarcode(cleanBarcode);
    if (cached) {
      return {
        found: true,
        barcode: cached.barcode,
        name: cached.name,
        brand: cached.brand,
        status: cached.status,
        hasMeat: cached.hasMeat,
        conflicts: cached.conflicts,
        explanation: cached.explanation,
        ingredientsText: cached.ingredientsText,
        source: cached.source || 'DB',
      };
    }
  } catch {
    // Fail-soft: continue to OFF on DB read error
  }

  // 2. Open Food Facts fallback
  const offProduct = await offClient.getProduct(cleanBarcode);
  if (!offProduct) {
    return { found: false };
  }

  // 3. Classify ingredients or check natural halal categories
  const rawIngredients = offProduct.ingredientsText?.trim() || '';
  const isIngredientsEmpty = rawIngredients.length < 3;

  let status: HalalStatus;
  let hasMeat: boolean;
  let conflicts: IngredientConflict[];
  let explanation: string | null;
  let finalIngredientsText: string;

  const isNaturalHalal =
    isIngredientsEmpty &&
    (offProduct.categoriesTags ?? []).some((tag) =>
      NATURAL_HALAL_CATEGORIES.includes(tag.toLowerCase())
    );

  if (isNaturalHalal) {
    status = 'HALAL';
    hasMeat = false;
    conflicts = [];
    explanation = 'Alimento o agua natural sin aditivos añadidos';
    finalIngredientsText = offProduct.name;
  } else {
    const classification = classifyEngine(offProduct.ingredientsText, {
      isCertifiedHalal: offProduct.isCertifiedHalal,
    });
    status = classification.status;
    hasMeat = classification.hasMeat;
    conflicts = classification.conflicts;
    explanation = classification.explanation;
    finalIngredientsText = offProduct.ingredientsText;
  }

  // 4. Lazy cache write to DB
  const newProduct: NewProduct = {
    barcode: offProduct.barcode,
    name: offProduct.name,
    brand: offProduct.brand,
    status,
    hasMeat,
    conflicts,
    explanation,
    ingredientsText: finalIngredientsText,
    source: 'OFF',
  };

  try {
    await repo.upsert(newProduct);
  } catch {
    // Fail-soft: lazy cache failures must not fail the scan response
  }

  return {
    found: true,
    barcode: offProduct.barcode,
    name: offProduct.name,
    brand: offProduct.brand,
    status,
    hasMeat,
    conflicts,
    explanation,
    ingredientsText: finalIngredientsText,
    source: 'OFF',
  };
}
