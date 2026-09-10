# Technical Plan — 02-ux-i18n

**Input:** `specs/active/02-ux-i18n/Spec.md`  
**Status:** `approved`  
**Author:** Hermes — **Reviewer:** Anass Carreau

## Technical Summary

1. **Domain & Infrastructure / OFF (`src/infrastructure/off/` & `src/application/`):**
   - Ampliar `OffProduct` para incluir `categoriesTags: string[]`.
   - Definir lista canónica `NATURAL_HALAL_CATEGORIES` (aguas minerales, aguas de manantial, verduras frescas, frutas frescas, legumbres secas, sal marina).
   - En `scanBarcode`: si `ingredientsText` está vacío pero `categoriesTags` contiene alguna categoría natural halal $\rightarrow$ clasificar como `HALAL` con texto explicativo adecuado y `ingredientsText = 'Producto natural sin ingredientes procesados'`.
   - Incluir `ingredientsText` en `ScanResultFound` y en la columna `ingredients_text` de Drizzle schema (opcional / nullable para compatibilidad hacia atrás).

2. **Internacionalización (`src/i18n/`):**
   - `src/i18n/types.ts`: Tipos estrictos para claves de traducción.
   - `src/i18n/translations.ts`: Diccionarios para `es`, `en`, `ar`.
   - `src/i18n/context.tsx`: `LanguageProvider` y hook `useTranslation()`. Al conmutar a `ar`, actualiza el atributo `dir="rtl"` y `lang="ar"` en el elemento `document.documentElement` o contenedor principal.

3. **Componentes UI (`src/components/` & `src/app/`):**
   - `Header.tsx`: Barra superior con el logotipo de Halall, selector de idioma (ES | EN | AR) y botón de ayuda `(?)`.
   - `GuideModal.tsx`: Ventana modal informativa con pestañas o acordeones explicando el código de colores, el criterio con la carne, los números E y las fuentes de datos.
   - `ResultSheet.tsx`: 
     - Mostrar `explanation` siempre (incluso si `conflicts` está vacío).
     - Acordeón "Ver lista de ingredientes" / "Hide ingredients" con animación limpia.
     - Botón de escaneo OCR integrado si los ingredientes faltan.
   - Actualizar `ScannerView.tsx`, `BottomNav.tsx`, `src/app/buscar/page.tsx` y `src/app/locales/page.tsx` con los textos traducidos vía `useTranslation()`.

## System Impact
- Schema DB: Añadir columna `ingredients_text` (text, nullable) a `products`.
- Tests: Nuevos tests unitarios para categorías seguras de OFF y para el motor de traducción.
