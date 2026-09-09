# Clarifications — 01-scanner (Scanner & Bottom Sheet)

**Reviewer:** Anass Carreau  
**Status:** `ready for planning`  

## Questions & Decisions (del Grilling)
| ID | Ambiguity / Question | Impact | Decision | Rationale | Owner | Status |
|---|---|---|---|---|---|---|
| CL-001 | ¿Qué hace si el barcode no está en Off / base de datos propia? | `blocker` | UI presenta botón para foto a etiqueta. Server llama a Gemini Flash Vision para OCR + Motor | TesseractJS en local de Safari rompe y descarga megas. Enviar foto al servidor usa el tier gratuito rápido de la IA. | Anass | `resolved` |
| CL-002 | ¿Es configurable el perfil de filtros (ej. E120) o estricto global por defecto? | `high` | Criterio Estricto transparente. Si hay E120, marca dudoso con explicación. No se guarda localstorage de preferencias inicialmente. | Reduce toda la UI y almacenamiento personal. La info es real, el usuario decide si compra o no en base al disclaimer. | Anass | `resolved` |
| CL-003 | Tratamiento teológico general de la carne | `high` | Marcar ⚠️ como dudoso siempre que haya carne (pollo, ternera) no certificada (o no listada como halal confirmada). | Integridad reputacional ante usuarios musulmanes. Dar 'Verde' a un paté de pollo ordinario quiebra la app ante expertos. | Anass | `resolved` |
| CL-004 | Modelo de almacenamiento Supabase | `high` | Tabla Drizzle `products` ultradelgada. No el dump de texto crudo de ingredientes para no pasarse de la cuota de 500MB en Supabase. | Viabilidad cero-coste para 200.000 filas. | Anass | `resolved` |

## Accepted Assumptions
| ID | Assumption | Risk if Invalid | Validation Plan |
|---|---|---|---|
| AS-001 | @zxing/browser trackea decentemente en móviles con React de Vercel/Next | Si es lento o falla, los usuarios no lo usarán al tardar en escanear. | Haremos spike/deploy inicial temprano a Vercel Hobby para probar en el móvil a mano la velocidad cámara/lente. |

## Planning Gate
- [x] Zero unresolved blocker questions.
- [x] Requirements are internally consistent.
- [x] Actors, data schemas, and error boundaries are documented.

**Verdict:** `READY` — Todas las decisiones duras de producto fueron resueltas en el Grilling previo a la Feature.