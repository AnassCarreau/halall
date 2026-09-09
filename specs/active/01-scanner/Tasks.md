# Tasks — 01-scanner (Scanner Feature)

**Input:** `Spec.md`, `Plan.md`, approved decisions.
**Rule:** Every task produces an atomic, reviewable change with explicit paths and evidence.

## Syntax
`- [ ] T001 [P?] [US-1] [RF-001] Action description in \`exact/path\``

## Preparation
- [x] T001 Create feature branch `feature/01-scanner`; ensure clean working tree.
- [x] T002 Baseline check: `npm run lint` and `npm run build` exit 0 on scaffold.

## Implementation — Domain (US-1/US-2, motor determinista)
- [x] T010 [US-1] [RF-005] Write failing tests for ingredient text normalization in `tests/domain/normalize.test.ts`.
  - *Done when:* tests fail (missing module).
- [x] T011 [US-1] [RF-005] Implement `src/domain/classification/normalize.ts` (lowercase, sin acentos, E-numbers canónicos).
  - *Done when:* `npm test` passes.
- [x] T012 [US-1] [RF-005] Write failing tests for haram detection (cerdo, alcohol, sangre, vinagre de vino vs vino) in `tests/domain/classify-haram.test.ts`.
- [x] T013 [US-1] [RF-005] Implement dictionaries + haram branch in `src/domain/classification/classify.ts`.
- [x] T014 [US-1] [RF-005] Write failing tests for meat rule (pollo/ternera → DOUBTFUL; certificación halal → HALAL; pescado nunca dudoso) in `tests/domain/classify-meat.test.ts`.
- [x] T015 [US-1] [RF-005] Implement meat branch in `classify.ts`.
- [x] T016 [US-1] [RF-005] Write failing tests for doubtful E-numbers (E120, E441, E471 family, E920, E542, cuajo, grasa animal) in `tests/domain/classify-doubtful.test.ts`.
- [x] T017 [US-1] [RF-005] Implement doubtful branch in `classify.ts`.
- [x] T018 [US-1] [RF-005] Write failing tests for priority ordering (haram > carne > aditivos > halal) y texto vacío → DOUBTFUL in `tests/domain/classify-priority.test.ts`.
- [x] T019 [US-1] [RF-005] Implement priority + empty-input guard in `classify.ts`.

## Implementation — Data & Integration (US-1, RF-002)
- [x] T020 [US-1] [RF-002] Create Drizzle schema `src/infrastructure/db/schema.ts` (products: barcode PK, name, brand, status, conflicts[], source, timestamps) + `drizzle.config.ts`.
  - *Done when:* `npm run db:generate` produces migration SQL.
- [x] T021 [US-1] [RF-002] Implement lazy db client + products repo (`client.ts`, `products-repo.ts`) — fail-soft sin DATABASE_URL.
- [x] T022 [US-1] [RF-002] Write failing tests for OFF client mapping (v2 payload, not-found, timeout) in `tests/infrastructure/off-client.test.ts`.
- [x] T023 [US-1] [RF-002] Implement `src/infrastructure/off/off-client.ts`.
- [x] T024 [US-1] [RF-002] Write failing tests for use-case scan-barcode (cache hit, OFF fallback, lazy-cache write, OFF miss → null) in `tests/application/scan-barcode.test.ts`.
- [x] T025 [US-1] [RF-002] Implement `src/application/scan-barcode.ts` con puertos inyectados.

## Implementation — API (US-1/US-2, RF-002/RF-004)
- [x] T030 [US-1] [RF-002] Write failing tests for `GET /api/scan` (validación barcode, found/not-found, 400) in `tests/api/scan-route.test.ts`.
- [x] T031 [US-1] [RF-002] Implement `src/app/api/scan/route.ts`.
- [x] T032 [US-1] [RF-002] Write failing tests + implement `GET /api/search` (búsqueda por nombre en cache local) in `tests/api/search-route.test.ts` + `src/app/api/search/route.ts`.
- [x] T033 [US-2] [RF-004] Write failing tests for `POST /api/ocr` (sin key → 503, payload grande → 413, Gemini stub → veredicto) in `tests/api/ocr-route.test.ts`.
- [x] T034 [US-2] [RF-004] Implement `src/infrastructure/gemini/gemini-ocr.ts` + `src/app/api/ocr/route.ts`.

## Implementation — UI (US-1, RF-001/RF-003/RF-005)
- [ ] T040 [US-1] [RF-001] Implement `BottomNav.tsx` (3 pestañas: Escanear/Buscar/Locales) + `layout.tsx`.
- [ ] T041 [US-1] [RF-001] Implement `ScannerView.tsx` (ZXing `decodeFromConstraints`, facingMode environment, permiso denegado → mensaje + link a /buscar).
- [ ] T042 [US-1] [RF-005] Implement `ResultSheet.tsx` (bottom sheet: semáforo gigante, nombre, motivos, "Escanear otro" reanuda cámara).
- [ ] T043 [US-1] [RF-002] Wire `src/app/page.tsx` → ScannerView + fetch `/api/scan` + vibración.
- [ ] T044 [US-1] [RF-003] Implement `src/app/buscar/page.tsx` (búsqueda por nombre con resultados semáforo) y `src/app/locales/page.tsx` (Próximamente).

## Finalization
- [ ] T900 Run `npm run lint && npx tsc --noEmit && npm test && npm run build`; log evidence in `Verify.md`.
- [ ] T901 Smoke test real: `npm run dev` + página `/`, `/buscar`, `/locales`, `/api/scan?barcode=3017620422003` (vía OFF en vivo).
- [ ] T902 Independent review (subagent Reviewer) → fill `Verify.md` → human approval (Anass).
- [ ] T903 Await `DATABASE_URL` (Supabase) + `GOOGLE_API_KEY` de Anass para aplicar migración y activar OCR real.
