import { classify } from '../src/domain/classification';
import { getDb } from '../src/infrastructure/db/client';
import { products } from '../src/infrastructure/db/schema';

// ponytail: single-file script reusing domain engine and drizzle client
const HEADERS = { 'User-Agent': 'Mozilla/5.0' };

function cleanHtml(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/Ingredientes:\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchJson(url: string) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  return res.json();
}

async function main() {
  const db = getDb();
  if (!db) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  console.log('Fetching Mercadona categories...');
  const root = await fetchJson('https://tienda.mercadona.es/api/categories/');
  const mainCats = root.results || [];

  const subcatIds: number[] = [];
  for (const cat of mainCats) {
    for (const sub of cat.categories || []) {
      subcatIds.push(sub.id);
    }
  }
  console.log(`Found ${subcatIds.length} subcategories across ${mainCats.length} main categories.`);

  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < subcatIds.length; i++) {
    const subId = subcatIds[i];
    try {
      const subData = await fetchJson(`https://tienda.mercadona.es/api/categories/${subId}/`);
      for (const section of subData.categories || []) {
        for (const prod of section.products || []) {
          try {
            const detail = await fetchJson(`https://tienda.mercadona.es/api/products/${prod.id}/`);
            const ean = detail.ean?.trim();
            if (!ean) {
              skipped++;
              continue;
            }

            const rawIng = detail.nutrition_information?.ingredients;
            const ingText = cleanHtml(rawIng);
            const name = detail.display_name || prod.display_name;
            const brand = detail.brand || 'Hacendado';

            const classification = classify(ingText || name);

            await db
              .insert(products)
              .values({
                barcode: ean,
                name,
                brand,
                status: classification.status,
                hasMeat: classification.hasMeat,
                conflicts: classification.conflicts,
                explanation: classification.explanation,
                ingredientsText: ingText || null,
                source: 'MERCADONA',
              })
              .onConflictDoUpdate({
                target: products.barcode,
                set: {
                  name,
                  brand,
                  status: classification.status,
                  hasMeat: classification.hasMeat,
                  conflicts: classification.conflicts,
                  explanation: classification.explanation,
                  ingredientsText: ingText || null,
                  source: 'MERCADONA',
                },
              });

            inserted++;
            if (inserted % 50 === 0) {
              console.log(`[Progress] Subcat ${i + 1}/${subcatIds.length} | Inserted: ${inserted} | Skipped without EAN: ${skipped}`);
            }
          } catch {
            skipped++;
          }
        }
      }
    } catch (err) {
      console.error(`Error in subcat ${subId}:`, err);
    }
  }

  console.log(`\nDONE! Total inserted/updated in Supabase: ${inserted}. Skipped: ${skipped}.`);
}

main().catch(console.error);
