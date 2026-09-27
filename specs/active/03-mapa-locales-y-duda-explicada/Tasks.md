# Tasks: 03-mapa-locales-y-duda-explicada

- [x] T01: Extender tipos en `src/domain/classification/types.ts` (`whyDoubt`, `questionToManufacturer`).
- [x] T02: Actualizar `src/domain/classification/dictionaries.ts` y `classify.ts` con la información de origen y preguntas al fabricante.
- [x] T03: Actualizar tests en `tests/domain/` para verificar los nuevos campos enriquecidos.
- [x] T04: Crear módulo de distancia Haversine en `src/domain/geo/haversine.ts` + tests en `tests/domain/haversine.test.ts`.
- [x] T05: Extender schema de Drizzle en `src/infrastructure/db/schema.ts` con la tabla `locales`.
- [x] T06: Crear endpoint API `/api/locales/route.ts` con soporte para filtrado por proximidad.
- [x] T07: Ingesta de dataset verificado de carnicerías y restaurantes halal en España.
- [x] T08: Rediseñar `src/app/locales/page.tsx` con tabs (Carnicerías / Restaurantes), geolocalización viva y tarjetas de local.
- [x] T09: Actualizar `ResultSheet.tsx` para mostrar la tarjeta "¿Por qué se duda?" con botón de copiar consulta.
- [x] T10: Verificación integral con Vitest (`npm test`) y comprobación de build (`npm run build`).
