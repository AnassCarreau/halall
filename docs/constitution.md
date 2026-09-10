# Constitution — Halall

**Version:** 1.0.0  
**Ratified:** 2026-09-09  
**Last Modified:** 2026-09-10  

## I. Misión y Alcance Explícito
Halall existe para resolver la incertidumbre alimentaria del consumidor y viajero musulmán en España, proporcionando un veredicto instantáneo, transparente y sin fricción sobre productos de consumo diario.
- **Alcance Fase 1 (MVP):** Escaneo de código de barras, fallback OCR por visión IA, catálogo de supermercados españoles y consulta transparente sin registro.
- **Fuera de alcance en Fase 1:** Cuentas de usuario obligatorias, pasarelas de pago, publicidad de terceros, cobertura fuera de España y directorio de restaurantes/carnicerías (diferidos formalmente a Fase 2).
- Cualquier complejidad técnica no alineada con este alcance requerirá justificación escrita.

## II. Leyes Teológicas y Criterio de Clasificación Halal
La credibilidad religiosa y la transparencia son los activos supremos del producto.
1. **Regla de la Carne Terrestre:** Ningún producto que contenga carne o derivados de aves, vacuno, ovino o caprino podrá clasificarse como ✅ HALAL a menos que cuente con certificación halal explícita acreditada. En ausencia de sello verificado, el dictamen inmutable será ⚠️ DUDOSO con aviso de carne no verificada.
2. **Productos Prohibidos (Haram):** La presencia confirmada de cerdo, derivados porcinos (manteca, tocino, lardo, gelatina de cerdo), sangre o alcohol etílico como ingrediente dictaminará ❌ HARAM de forma no negociable. Se exceptúan los vinagres de fermentación acética (vinagre de vino, vinagre de alcohol).
3. **Aditivos Ambiguos (E-numbers):** Ingredientes de origen potencialmente animal (E120 carmín, E441 gelatina sin especificar, familia E471/E472, E920, cuajos animales) se clasificarán como ⚠️ DUDOSO, desglosando obligatoriamente el motivo exacto para autonomía del consumidor.
4. **Alimentos Puros y Naturales:** Aguas minerales naturales, frutas y verduras frescas sin procesar se consideran halal por origen y no podrán marcarse como dudosos por ausencia de etiquetado de ingredientes.

## III. Experiencia de Usuario y Cero Fricción
1. **Cero Login Obligatorio:** La consulta, el escaneo y el veredicto deben ser accesibles en menos de 2 segundos sin exigir registro, correo electrónico ni datos personales al usuario en el supermercado.
2. **Cero Anuncios Abusivos:** Halall no incluirá banners de terceros, anuncios emergentes ni trackers intrusivos que degraden la velocidad o violen la privacidad.
3. **Transparencia Total:** Toda clasificación debe estar acompañada de su explicación visible y permitir al usuario desplegar la lista íntegra de ingredientes.
4. **Accesibilidad Multilingüe:** La interfaz debe operar de forma nativa e instantánea en Español, Inglés y Árabe (con soporte RTL de derecha a izquierda).

## IV. Arquitectura Técnica y Disciplina de Coste
1. **Coste Operativo 0,00 € en Fase 1:** La infraestructura se apoyará exclusivamente en tiers gratuitos escalables (Next.js en Vercel, PostgreSQL en Supabase, APIs de cuota gratuita como Open Food Facts y Gemini Vision).
2. **Modelo de Datos Ultra-Optimizado (Lazy Cache):** La base de datos no alojará volcados innecesarios; se alimentará de forma bajo-demanda (*lazy cache*) a partir de consultas reales para operar holgadamente bajo la cuota gratuita.
3. **Monolito Modular Limpio:** Separación estricta entre Dominio puro (TypeScript sin dependencias externas), Casos de Uso, Infraestructura y UI. Los cambios de base de datos o proveedores externos no afectarán la lógica central de clasificación.

## V. Evidencia, TDD y Puertas de Calidad
1. **Rigor TDD:** Cada regla del clasificador y cada endpoint requiere tests unitarios automatizados que verifiquen casos positivos, negativos y de borde antes de considerarse implementados.
2. **Gates de Salida Obligatorios:** Ningún cambio podrá mergearse a la rama principal si `npm test`, `npm run lint` o `npm run build` devuelven errores o advertencias.
3. **Autonomía Supervisada:** Los agentes y subagentes podrán diseñar, implementar y verificar dentro de sus límites; los despliegues a producción, migraciones destructivas y cambios constitucionales exigen ratificación humana.
