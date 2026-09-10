# Clarifications — 02-ux-i18n

**Reviewer:** Anass Carreau  
**Status:** `ready for planning`

## Questions & Decisions (del Grilling)
| ID | Ambiguity / Question | Decision | Rationale | Status |
|---|---|---|---|---|
| CL-010 | ¿BarcodeDetector nativo o ZXing simple? | Mantener ZXing simple y ligero sin BarcodeDetector API. | Evita complejidad y código redundante; el usuario coloca el código en el encuadre. | `resolved` |
| CL-011 | ¿Cómo resolver productos naturales sin ingredientes en OFF? | Lista de categorías intrínsecamente halal (aguas, frutas, verduras, legumbres, sales). | Evita falsos dudosos en alimentos elementales como agua embotellada o tomates. | `resolved` |
| CL-012 | ¿Cómo implementar i18n (ES/EN/AR)? | Client-side React context con diccionarios tipados + `dir="rtl"` para árabe. | Instantáneo, sin llamadas a servidor, cero recargas de página. | `resolved` |
| CL-013 | ¿Cómo estructurar la transparencia de ingredientes? | Explicación siempre visible + acordeón desplegable para lista completa de ingredientes. | Respuesta inmediata pero auditoría completa disponible con un toque. | `resolved` |
| CL-014 | ¿Dónde ubicar la guía metodológica? | Botón `(?)` en la cabecera superior que abre un modal informativo. | Accesible en cualquier momento sin estorbar el flujo de escaneo. | `resolved` |

## Planning Gate
- [x] Zero unresolved blocker questions.
- [x] All requirements mapped to user stories.
- **Verdict:** `READY`
