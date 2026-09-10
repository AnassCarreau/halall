# Tasks — 02-ux-i18n

**Input:** `Spec.md`, `Plan.md`, approved decisions.

## Implementation Tasks

### Bloque 1: Categorías Naturales y Transparencia de Ingredientes (US-1, US-2)
- [x] T101 [US-1] [RF-001] Actualizar `OffProduct` en `src/infrastructure/off/off-client.ts` para capturar `categoriesTags: string[]`.
- [x] T102 [US-1] [RF-001] Definir `NATURAL_HALAL_CATEGORIES` y reglas de fallback por categoría en `src/application/scan-barcode.ts`.
- [x] T103 [US-2] [RF-002] Extender `ScanResultFound` para incluir `ingredientsText` y actualizar schema Drizzle si procede.
- [x] T104 [US-1] [US-2] Escribir tests para categorías naturales y retorno de ingredientes en `tests/application/scan-barcode.test.ts`.

### Bloque 2: Sistema de Internacionalización y Soporte RTL (US-3)
- [x] T110 [US-3] [RF-004] Crear `src/i18n/types.ts` y diccionarios `translations.ts` para español, inglés y árabe.
- [x] T111 [US-3] [RF-004] Implementar `src/i18n/context.tsx` con `LanguageProvider` y hook `useTranslation()`, manejando `document.documentElement.dir = 'rtl'` en árabe.
- [x] T112 [US-3] [RF-004] Escribir tests unitarios para `translations.ts` y las claves en `tests/i18n/translations.test.ts`.

### Bloque 3: Interfaz de Usuario y Componentes (US-2, US-3, US-4)
- [x] T120 [US-4] [RF-005] Crear `src/components/GuideModal.tsx` con la explicación detallada de colores, carnes, aditivos E y fuentes.
- [x] T121 [US-3] [US-4] Crear `src/components/Header.tsx` con logo, selector de idioma (ES/EN/AR) y botón `(?)`.
- [x] T122 [US-2] [US-3] Actualizar `src/components/ResultSheet.tsx` para mostrar siempre la explicación, el acordeón de ingredientes completos y soporte multiidioma.
- [x] T123 [US-3] Actualizar `src/components/ScannerView.tsx`, `BottomNav.tsx`, `src/app/page.tsx`, `src/app/buscar/page.tsx`, `src/app/locales/page.tsx` y `src/app/layout.tsx` para envolver con `LanguageProvider` y usar traducciones.

### Bloque 4: Verificación y Despliegue
- [x] T130 Ejecutar `npm test && npm run lint && npm run build` y asegurar 0 errores.
- [ ] T131 Mergear a `main` y hacer `git push` para desplegar automáticamente a Vercel.
