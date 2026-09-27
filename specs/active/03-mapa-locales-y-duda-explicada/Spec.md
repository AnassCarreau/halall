# Spec: 03-mapa-locales-y-duda-explicada (Halall)

## 1. Goal
1. **Transparencia Total de la Duda (Mushbooh Deep-Dive):**
   - Extender el tipo `IngredientConflict` para incluir:
     - `originRisk`: "animal_vs_vegetal" | "alcohol_carrier" | "madhhab_divergence" | "unverified_slaughter".
     - `whyDoubt`: Explicación clara en lenguaje humano (ej. *"El E471 se produce tanto a partir de aceites vegetales (palma/soja) como de grasas animales (sebo/cerdo). Sin declaración del fabricante no es posible asegurar su origen"*).
     - `questionToManufacturer`: Pregunta exacta pre-redactada para copiar y pegar por email o redes sociales.
2. **Directorio & Mapa Interactivo de Locales Halal en España:**
   - Esquema Drizzle `locales` con latitud, longitud, tipo (`carniceria` | `restaurante`), nombre, dirección, teléfono y verificación halal.
   - Endpoint `/api/locales` con cálculo de distancia determinista (fórmula Haversine en SQL/TypeScript) y filtro por radio geográfico.
   - Script de ingesta local desde Overpass Turbo OSM (`diet:halal=yes|only`, `cuisine=halal`, `shop=butcher`).
   - Vista móvil con pestañas de Carnicerías y Restaurantes, lista por cercanía y botón directo a Google Maps / WhatsApp.

## 2. User Scenarios
- **US-1 (Entender la duda):** El usuario escanea un bollo con E471. El resultado marca "DUDOSO" pero despliega una tarjeta explicativa: *"¿Por qué se duda? El E471 puede ser vegetal o animal. Pregunta al fabricante: ¿El E471 de este producto es 100% vegetal?"* con botón para copiar la pregunta.
- **US-2 (Encontrar carnicería/restaurante cercano):** El usuario pulsa la pestaña "Locales", el navegador pide su ubicación y muestra las carnicerías y restaurantes halal más cercanos ordenados por distancia (ej. a 450m, a 1.2km) con botón de ruta y teléfono.

## 3. Acceptance Criteria
- [x] Motor de clasificación enriquecido con `whyDoubt` y `questionToManufacturer` en cada conflicto.
- [x] Schema Drizzle `locales` en `src/infrastructure/db/schema.ts`.
- [x] Módulo determinista `src/domain/geo/haversine.ts` con tests unitarios.
- [x] Endpoint `/api/locales` con soporte para `lat`, `lng` y `radiusKm`.
- [x] Ingesta inicial de carnicerías y restaurantes de España cargada en la base de datos local.
- [x] Vista UI en `src/app/locales/page.tsx` conectada y funcional con soporte multiidioma (ES/EN/AR).
- [x] 100% de tests en Vitest pasando (`npm test`) y build en verde (`npm run build`).
