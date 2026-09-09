/**
 * Normaliza texto de ingredientes para el motor de clasificación Halal:
 * - Convierte a minúsculas
 * - Elimina acentos y tildes diacríticas
 * - Normaliza aditivos E-numbers a formato canónico "eXXX" (ej: E-471 -> e471, E 120 -> e120, E-472a -> e472a)
 */
export function normalizeText(text: string): string {
  if (!text) {
    return '';
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return '';
  }

  return trimmed
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\be[\s-]*(\d{3,4})[\s-]*([a-z])?\b/gi, (_match, digits, letter) => {
      return `e${digits}${letter ? letter.toLowerCase() : ''}`;
    });
}
