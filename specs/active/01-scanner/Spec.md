# Specification: 01-scanner — Lector Cód. de Barras y Clasificador

## User Stories & Acceptance Criteria
### US-1: Escaneo Inmediato en Pasillo (Priority: P1)
- **Independent Validation:** Un usuario abre la app y puede escanear un yogur del supermercado para saber instantáneamente si es halal sin registrarse ni pulsar menús intermedios.
- **Acceptance Scenarios:**
  - **GIVEN** la PWA instalada y cámara permitida,
  - **WHEN** un código de barras es detectado con @zxing/browser,
  - **THEN** un Bottom Sheet muestra el estado (✅ Halal, ⚠️ Dudoso, ❌ Haram), nombre corto y el motivo clave (ingredient highlights) en menos de 2 segundos.

### US-2: Fallback Inteligente (OCR/Foto) (Priority: P1)
- **Independent Validation:** Si el código no está indexado, el usuario no queda bloqueado. Puede tomar una foto a la etiqueta de ingredientes.
- **Acceptance Scenarios:**
  - **GIVEN** un código de barras no registrado en Drizzle DB o llamada externa,
  - **WHEN** el UI presenta un botón "Tomar foto de ingredientes",
  - **THEN** la imagen va al backend OCR (Gemini Vision) y devuelve el semáforo y análisis en un máximo de 3-5 segundos.

## Functional Requirements (EARS)
- **RF-001 [US-1]:** WHEN la página raíz (`/`) carga, THE SYSTEM SHALL inicializar el lector de código de barras a pantalla completa automáticamente.
- **RF-002 [US-1]:** WHEN el scanner lee un `barcode`, THE SYSTEM SHALL consultar la base de datos optimizada en PostgreSQL vía un endpoint Next.js Route Handler.
- **RF-003 [US-1]:** IF el `barcode` no existe, THEN THE SYSTEM SHALL mostrar un aviso claro ofreciendo "Buscar ingredientes por foto".
- **RF-004 [US-2]:** WHEN se envía una foto, THE SYSTEM SHALL pasarla a Gemini Flash Vision para extraer texto crudo (ingredientes) e instanciar el motor determinista de reglas para otorgar el veredicto.
- **RF-005 [US-1]:** THE SYSTEM SHALL presentar la resolución en un Bottom Sheet nativo deslizante usando Tailwind y shadcn/ui.

## Non-Functional Requirements
- **RNF-001 Performance:** API DB de código de barras < 100ms. Drizzle debe ejecutarse en el edge framework sin bloqueos ni pool errors.
- **RNF-002 Security:** Las llamadas a la API de Gemini (`DATABASE_URL`, `GOOGLE_API_KEY`) deben suceder extrictamente en Server Components/Handlers y no quedar expuestas en cliente.
- **RNF-003 Compatibility:** Compatible con iOS Safari / Chrome en móviles (PWA). Peticiones de permisos de cámara elegantes.

## Data, Integrations & Permissions
- Data Entities: Product (barcode PK, name, status, conflicts array).
- Integrations: 
  - OCR backend: Google Generative AI (Gemini 2.0 / 1.5 Flash).
  - Web Camera: `@zxing/browser`.
- Permissions: Solicitar de forma explícita `navigator.mediaDevices.getUserMedia({ video: true })`. Uso anónimo, zero auth (RLS de DB anon permitido de solo lectura o protegido detrás de endpoints Next.js api).

## Edge Cases & Error Handling
- Si no da permisos de cámara: Mensaje indicativo amigable para activar permisos o barra de búsqueda manual.
- timeouts en red del súper (sin señal): Bottom sheet genérico "Sin conexión. No podemos validarlo ahora".

## Success Criteria & Definition of Done
- **SC-001:** Lectura efectiva en móvil real de código de barras.
- **SC-002:** El resultado UI es de Bottom Sheet deslizante.
- **SC-003:** Ingesta de productos con carne que marquen ⚠️ por defecto.
- Mandatory commands in `AGENTS.md` exit with code 0.
- All applicable requirements have recorded evidence in `Verify.md`.