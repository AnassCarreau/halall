# Technical Plan — 01-scanner (Barcode Scan & Classification)

**Input:** `specs/active/01-scanner/spec.md`
**Status:** `approved`
**Author:** Hermes — **Reviewer:** Anass Carreau

## Technical Summary

Clean/Hexagonal monolith dentro de Next.js 16 (App Router). El corazón es un **motor determinista de reglas** en `src/domain/classification/` (TypeScript puro, cero I/O) que mapea texto de ingredientes normalizado → `{status, conflicts, hasMeat}`.

Flujo de datos:

```
Cámara (ZXing, client) ──► GET /api/scan?barcode=EAN13
                              ├─ hit tabla products (Drizzle, <100ms) ──► veredicto cacheado
                              ├─ miss ──► Open Food Facts v2 (sin API key)
                              │            └─► motor de reglas ──► upsert products (lazy cache) ──► veredicto
                              └─ OFF también miss ──► UI ofrece fallback foto ──► POST /api/ocr
                                                          └─► Gemini Flash Vision extrae texto ──► motor de reglas ──► veredicto
```

- Capas: `domain` (reglas puras) → `application` (use-cases con puertos inyectados) → `infrastructure` (Drizzle repo, cliente OFF, cliente Gemini) → `api` (Route Handlers) → `app` (UI cliente).
- Los use-cases reciben sus dependencias (repo, offClient) como parámetros → testeables con fakes sin mocks frágiles.
- Sin `DATABASE_URL`, el repo devuelve null y el sistema degrada con elegancia a solo-OFF (permite smoke test end-to-end sin credenciales).

## Decisions & Alternatives

| Decision | Selected Option | Rejected Alternatives | Trade-offs & Cost |
|---|---|---|---|
| DEC-001 ORM | Drizzle ORM + `postgres` driver con `prepare: false` (pooler Supabase Transaction mode) | Prisma (binario Rust, cold starts en serverless); `pg` raw | Type-safe, arranque <1ms, sin binarios; coste: menos "magic" que Prisma |
| DEC-002 Clasificación | Motor determinista TS (diccionarios haram/dudoso/carne + normalización E-numbers) | LLM por escaneo (coste, latencia, alucinaciones) | Instantáneo, gratis, 100% testeable; LLM reservado a extracción OCR |
| DEC-003 Regla de carne | Cualquier carne terrestre → DOUBTFUL salvo certificación halal (labels OFF) o whitelist manual | Verde automático si no hay cerdo | Protege credibilidad religiosa; coste: muchos productos procesados quedan amarillos |
| DEC-004 Datos | Tabla delgada `products` + lazy cache al escanear; sincronización periódica vía script cron (feature ops futura) | Import del dump completo OFF | <60MB para 200k filas; coste: primer escaneo de un producto es más lento (~1-2s vía OFF) |
| DEC-005 Cámara | `@zxing/browser` `decodeFromConstraints({ video: { facingMode: 'environment' } })` | BarcodeDetector API (no existe en Safari/Firefox) | Funciona iOS Safari + Android Chrome |
| DEC-006 OCR | Foto comprimida (base64, 50-100KB) → Gemini Flash Vision en servidor | Tesseract.js en cliente (15MB WASM, impreciso en etiquetas pequeñas) | Cero peso en cliente, funciona en todos los móviles |
| DEC-007 PWA shell | Diferido a feature `02-pwa` | Incluir Serwist en esta feature | Mantiene 01-scanner atómico y reversible |

## System Impact

- File Paths:
  - `src/domain/classification/types.ts` — tipos HalalStatus, IngredientConflict, Classification.
  - `src/domain/classification/normalize.ts` — normalización de texto (minúsculas, sin acentos, E-numbers canónicos).
  - `src/domain/classification/dictionaries.ts` — diccionarios haram / dudoso / carne (fuente de verdad halal).
  - `src/domain/classification/classify.ts` — motor de reglas + prioridad HARAM > carne > aditivos > HALAL.
  - `src/application/scan-barcode.ts` — use-case: repo → OFF → clasificar → lazy cache.
  - `src/infrastructure/db/schema.ts` — tabla Drizzle `products`.
  - `src/infrastructure/db/client.ts` — cliente postgres/drizzle (lazy singleton, fail-soft sin DATABASE_URL).
  - `src/infrastructure/db/products-repo.ts` — get/upsert.
  - `src/infrastructure/off/off-client.ts` — cliente OFF v2 (User-Agent propio, timeout 5s).
  - `src/infrastructure/gemini/gemini-ocr.ts` — extracción de ingredientes por visión.
  - `src/app/api/scan/route.ts` — GET barcode → veredicto.
  - `src/app/api/search/route.ts` — GET q → búsqueda por nombre.
  - `src/app/api/ocr/route.ts` — POST foto → veredicto.
  - `src/components/ScannerView.tsx`, `ResultSheet.tsx`, `BottomNav.tsx` — UI cliente.
  - `src/app/page.tsx`, `src/app/buscar/page.tsx`, `src/app/locales/page.tsx` — rutas.
  - `vitest.config.ts`, `drizzle.config.ts`, `.env.example` — config.
- Data Migrations: `drizzle-kit generate` → SQL aditivo (CREATE TABLE products + índices). Rollback: DROP TABLE. Sin backfill.
- Interfaces:
  - `GET /api/scan?barcode={8-14 dígitos}` → `{found, barcode?, name?, status?, conflicts?, hasMeat?, source}` | 400/500.
  - `GET /api/search?q={texto}` → `{results: [{barcode, name, status}]}`.
  - `POST /api/ocr {imageBase64}` → igual que scan sin barcode | 413/503.
- Dependencies: `drizzle-orm`, `postgres` (runtime); `drizzle-kit`, `vitest`, `@vitest/coverage-v8` (dev). Justificación: reemplazo de Prisma (DEC-001) y testing obligatorio por Constitution §III.

## Quality & Verification Strategy

| Requirement | Evidence Level | Command or Test Path |
|---|---|---|
| RF-001, RF-005 | smoke | `npm run dev` + verificación de página `/` en navegador |
| RF-002 | unit + integration | `tests/api/scan-route.test.ts` (fake repo + OFF stub) |
| RF-003 | unit | `tests/api/scan-route.test.ts` (not-found → found:false) |
| RF-004 | unit | `tests/api/ocr-route.test.ts` (Gemini stubbed) |
| RNF-001 | unit | `tests/domain/classify.test.ts` (motor puro) |
| RNF-002 | unit | claves solo en server handlers; sin `NEXT_PUBLIC` para secrets |
| RNF-003 | build | `npm run build` + smoke móvil-emulado (viewport) |

## Implementation Gate

- [x] Plan satisface RF-001..RF-005 y RNF-001..003.
- [x] Decisiones complejas con alternativas evaluadas (DEC-001..007).
- [x] Operaciones reversibles: migración aditiva, rollback documentado (DROP TABLE products).
