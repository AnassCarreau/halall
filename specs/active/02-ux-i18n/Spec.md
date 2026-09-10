# Specification: 02-ux-i18n — UX Transparente, Categorías Naturales e i18n (ES/EN/AR)

## User Stories & Acceptance Criteria

### US-1: Categorías Naturales Automáticas (Priority: P1)
- **Independent Validation:** Escanear agua mineral o vegetales frescos sin ingredientes impresos debe arrojar ✅ Halal en vez de Dudoso.
- **Acceptance Scenarios:**
  - **GIVEN** un producto en Open Food Facts sin `ingredients_text`,
  - **WHEN** sus `categories_tags` pertenecen a alimentos o bebidas naturalmente halal (`waters`, `mineral-waters`, `fresh-fruits`, `fresh-vegetables`, etc.),
  - **THEN** el sistema lo clasifica como `HALAL` con explicación "Alimento natural sin aditivos añadidos".

### US-2: Transparencia de Ingredientes en Ficha de Resultado (Priority: P1)
- **Independent Validation:** En el Bottom Sheet de resultado, el usuario debe ver la explicación del veredicto y poder desplegar los ingredientes completos.
- **Acceptance Scenarios:**
  - **GIVEN** un escaneo exitoso,
  - **WHEN** se presenta el `ResultSheet`,
  - **THEN** muestra siempre la explicación del estado, los ingredientes conflictivos (si los hay) y un botón/acordeón para inspeccionar el texto íntegro de ingredientes.

### US-3: Internacionalización con Soporte RTL (ES / EN / AR) (Priority: P1)
- **Independent Validation:** Cambiar de idioma conmuta instantáneamente toda la interfaz; al seleccionar Árabe, el documento activa `dir="rtl"`.
- **Acceptance Scenarios:**
  - **GIVEN** la app cargada en cualquier pantalla,
  - **WHEN** el usuario selecciona Árabe en el selector de cabecera,
  - **THEN** todos los textos se traducen al árabe y la disposición visual se invierte a derecha-a-izquierda (`rtl`).

### US-4: Guía Metodológica Accesible (Priority: P2)
- **Independent Validation:** Pulsar el botón `(?)` en la cabecera abre una ventana modal con los criterios de clasificación halal.
- **Acceptance Scenarios:**
  - **GIVEN** la barra superior de la app,
  - **WHEN** el usuario pulsa el icono `(?)`,
  - **THEN** se muestra un modal explicando el significado de ✅ ⚠️ ❌, la regla estricta de carnes, aditivos E y fuentes de datos.

## Functional Requirements (EARS)
- **RF-001 [US-1]:** WHEN un producto de OFF carece de lista de ingredientes, IF sus categorías contienen etiquetas puras (`en:waters`, `en:spring-waters`, `en:mineral-waters`, `en:fresh-vegetables`, `en:fresh-fruits`), THE SYSTEM SHALL clasificarlo como `HALAL`.
- **RF-002 [US-2]:** THE SYSTEM SHALL incluir `ingredientsText` en la respuesta de `/api/scan` y almacenarlo en la base de datos `products`.
- **RF-003 [US-2]:** WHEN el `ResultSheet` se renderiza, THE SYSTEM SHALL mostrar siempre el bloque de explicación y un acordeón colapsable para leer la lista completa de ingredientes.
- **RF-004 [US-3]:** THE SYSTEM SHALL proporcionar un contexto de internacionalización en cliente soportando `es`, `en` y `ar`, aplicando `dir="rtl"` en árabe.
- **RF-005 [US-4]:** WHEN el usuario interactúa con el botón de ayuda en cabecera, THE SYSTEM SHALL desplegar el modal de guía metodológica.

## Non-Functional Requirements
- **RNF-001 Performance:** Cambio de idioma en 0ms sin recargar página.
- **RNF-002 Accessibility:** Dirección `dir="rtl"` consistente en layout, botones e iconos.
- **RNF-003 Simplicity:** Sin dependencias pesadas de i18n en servidor; diccionarios tipados en TypeScript.

## Success Criteria & Definition of Done
- Todos los tests unitarios pasan al 100% (`npm test`).
- `npm run lint` y `npm run build` terminan con código 0.
