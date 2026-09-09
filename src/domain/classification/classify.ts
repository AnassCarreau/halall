import { normalizeText } from './normalize';
import {
  HARAM_INGREDIENTS,
  VINEGAR_EXCEPTIONS,
  MEAT_INGREDIENTS,
  DOUBTFUL_ADDITIVES,
  DOUBTFUL_NON_ENUMBER,
} from './dictionaries';
import type {
  ClassificationResult,
  ClassificationOptions,
  IngredientConflict,
} from './types';

/**
 * Motor determinista de clasificación Halal.
 *
 * Prioridades:
 *   1. HARAM — ingrediente haram explícito
 *   2. MEAT  — carne terrestre sin certificación → DOUBTFUL
 *   3. DOUBTFUL_ADDITIVES — aditivos de origen animal ambiguo → DOUBTFUL
 *   4. HALAL — nada problemático encontrado
 *
 * Texto vacío o <3 caracteres → DOUBTFUL ("no especificados")
 */
export function classify(
  ingredientText: string,
  options?: ClassificationOptions,
): ClassificationResult {
  const trimmed = ingredientText.trim();

  // Empty / unreadable guard
  if (trimmed.length < 3) {
    return {
      status: 'DOUBTFUL',
      hasMeat: false,
      conflicts: [],
      explanation: 'Ingredientes no especificados o ilegibles',
    };
  }

  const normalized = normalizeText(ingredientText);
  const conflicts: IngredientConflict[] = [];
  let hasMeat = false;

  // --- Phase 1: Strip vinegar exceptions before haram/alcohol scan ---
  // Replace vinegar phrases with a placeholder so "vino" inside "vinagre de vino" doesn't trigger haram
  let textForHaram = normalized;
  for (const vinegar of VINEGAR_EXCEPTIONS) {
    const vinegarNorm = normalizeText(vinegar);
    // Use a global replacement
    textForHaram = textForHaram.split(vinegarNorm).join('__vinagre__');
  }

  // --- Phase 2: Detect HARAM ingredients ---
  for (const haramTerm of HARAM_INGREDIENTS) {
    const termNorm = normalizeText(haramTerm);
    if (containsTerm(textForHaram, termNorm)) {
      conflicts.push({
        name: haramTerm,
        severity: 'HARAM',
        reason: `Contiene ingrediente haram: ${haramTerm}`,
      });
    }
  }

  // --- Phase 3: Detect MEAT ingredients ---
  for (const meatTerm of MEAT_INGREDIENTS) {
    const termNorm = normalizeText(meatTerm);
    if (containsTerm(normalized, termNorm)) {
      hasMeat = true;
      // Only add as conflict if not certified halal
      if (!options?.isCertifiedHalal) {
        conflicts.push({
          name: meatTerm,
          severity: 'DOUBTFUL',
          reason: `Contiene carne no verificada como halal: ${meatTerm}`,
        });
      }
    }
  }

  // --- Phase 4: Detect DOUBTFUL ADDITIVES (E-numbers) ---
  for (const additive of DOUBTFUL_ADDITIVES) {
    if (containsTerm(normalized, additive.code)) {
      conflicts.push({
        code: additive.code,
        name: additive.name,
        severity: 'DOUBTFUL',
        reason: additive.reason,
      });
    }
  }

  // --- Phase 5: Detect DOUBTFUL non-E-number ingredients ---
  for (const ingredient of DOUBTFUL_NON_ENUMBER) {
    const termNorm = normalizeText(ingredient.term);
    if (containsTerm(normalized, termNorm)) {
      conflicts.push({
        name: ingredient.name,
        severity: 'DOUBTFUL',
        reason: ingredient.reason,
      });
    }
  }

  // --- Determine final status by priority ---
  const hasHaram = conflicts.some(c => c.severity === 'HARAM');
  const hasDoubtful = conflicts.some(c => c.severity === 'DOUBTFUL');

  let status: ClassificationResult['status'];
  let explanation: string;

  if (hasHaram) {
    status = 'HARAM';
    const haramNames = conflicts
      .filter(c => c.severity === 'HARAM')
      .map(c => c.name)
      .join(', ');
    explanation = `Contiene ingredientes haram: ${haramNames}`;
  } else if (hasDoubtful) {
    status = 'DOUBTFUL';
    const doubtfulReasons = conflicts
      .filter(c => c.severity === 'DOUBTFUL')
      .map(c => c.reason)
      .join('; ');
    explanation = doubtfulReasons;
  } else {
    status = 'HALAL';
    explanation = 'No se han detectado ingredientes problemáticos';
  }

  // Also check haram pork terms for hasMeat flag
  // cerdo/porcino/tocino/bacon/panceta/lardo/jamon/embutido de cerdo/gelatina de cerdo/puerco are pork = meat
  const porkTerms = ['cerdo', 'puerco', 'porcino', 'tocino', 'bacon', 'panceta',
    'manteca de cerdo', 'lardo', 'jamon serrano', 'jamon iberico', 'embutido de cerdo',
    'gelatina de cerdo'];
  for (const porkTerm of porkTerms) {
    const termNorm = normalizeText(porkTerm);
    if (containsTerm(normalized, termNorm)) {
      hasMeat = true;
      break;
    }
  }

  return { status, hasMeat, conflicts, explanation };
}

/**
 * Checks if `text` contains `term` as a word or sub-phrase (not just substring of unrelated word).
 * Uses word-boundary-aware matching.
 */
function containsTerm(text: string, term: string): boolean {
  // For multi-word terms, just check indexOf (they are specific enough)
  if (term.includes(' ')) {
    return text.includes(term);
  }
  // For single-word terms or E-numbers, use word-boundary regex
  // E-numbers like e472a need special handling: the boundary after a letter is fine
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, 'i');
  return regex.test(text);
}
