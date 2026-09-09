/**
 * Diccionarios de ingredientes para el motor de clasificación Halal.
 * Fuente de verdad para las reglas de negocio.
 */

/**
 * Ingredientes explícitamente haram.
 * Cada entrada es un string ya normalizado (minúsculas, sin acentos).
 */
export const HARAM_INGREDIENTS: ReadonlyArray<string> = [
  // Cerdo y derivados
  'cerdo',
  'puerco',
  'porcino',
  'tocino',
  'bacon',
  'panceta',
  'manteca de cerdo',
  'lardo',
  'jamon serrano',
  'jamon iberico',
  'embutido de cerdo',
  'gelatina de cerdo',
  // Sangre
  'sangre',
  'plasma',
  'morcilla',
  // Alcohol y derivados
  'alcohol',
  'etanol',
  'licor',
  'vino',
  'cerveza',
  'ron',
  'brandy',
  'whisky',
  'vodka',
  'ginebra',
  'tequila',
  'sake',
  'champan',
  'sidra',
  'absenta',
  'aguardiente',
];

/**
 * Expresiones de vinagre que, aun conteniendo la palabra "vino" o "alcohol",
 * son halal permitidos y deben excluirse de la detección haram.
 */
export const VINEGAR_EXCEPTIONS: ReadonlyArray<string> = [
  'vinagre de vino',
  'vinagre de vino tinto',
  'vinagre de vino blanco',
  'vinagre de alcohol',
];

/**
 * Ingredientes de carne terrestre que requieren certificación halal.
 * Pescados y mariscos NO están incluidos (son halal por defecto).
 */
export const MEAT_INGREDIENTS: ReadonlyArray<string> = [
  'pollo',
  'pavo',
  'gallina',
  'ternera',
  'vacuno',
  'buey',
  'cordero',
  'cabrito',
  'pato',
  'conejo',
  'carne picada',
  'grasa animal',
  'caldo de pollo',
  'extracto de carne',
];

/**
 * Aditivos E-number y otros ingredientes de origen animal ambiguo.
 * Cada entrada tiene el código normalizado (eXXX) y metadatos.
 */
export interface DoubtfulAdditive {
  code: string;
  name: string;
  reason: string;
}

export const DOUBTFUL_ADDITIVES: ReadonlyArray<DoubtfulAdditive> = [
  { code: 'e120', name: 'Carmín / Cochinilla', reason: 'Colorante de origen animal (insecto cochinilla)' },
  { code: 'e441', name: 'Gelatina', reason: 'Gelatina sin especificar origen (puede ser porcina)' },
  { code: 'e471', name: 'Mono y diglicéridos de ácidos grasos', reason: 'Posible origen animal no especificado' },
  { code: 'e472', name: 'Ésteres de ácidos grasos', reason: 'Posible origen animal no especificado' },
  { code: 'e472a', name: 'Ésteres acéticos de mono y diglicéridos', reason: 'Posible origen animal no especificado' },
  { code: 'e472b', name: 'Ésteres lácticos de mono y diglicéridos', reason: 'Posible origen animal no especificado' },
  { code: 'e472c', name: 'Ésteres cítricos de mono y diglicéridos', reason: 'Posible origen animal no especificado' },
  { code: 'e472d', name: 'Ésteres tartáricos de mono y diglicéridos', reason: 'Posible origen animal no especificado' },
  { code: 'e472e', name: 'Ésteres monoacetiltartáricos', reason: 'Posible origen animal no especificado' },
  { code: 'e472f', name: 'Ésteres mixtos de ácidos grasos', reason: 'Posible origen animal no especificado' },
  { code: 'e920', name: 'L-cisteína', reason: 'Aminoácido que puede derivar de pelo o plumas animales' },
  { code: 'e542', name: 'Fosfato de hueso', reason: 'Derivado de huesos animales' },
];

/**
 * Ingredientes de origen animal ambiguo que no son E-numbers.
 */
export interface DoubtfulIngredient {
  term: string;
  name: string;
  reason: string;
}

export const DOUBTFUL_NON_ENUMBER: ReadonlyArray<DoubtfulIngredient> = [
  { term: 'cuajo animal', name: 'Cuajo animal', reason: 'Enzima de origen animal no especificado' },
  { term: 'pepsina', name: 'Pepsina', reason: 'Enzima digestiva de origen animal' },
  { term: 'quimosina animal', name: 'Quimosina animal', reason: 'Enzima de cuajar de origen animal' },
];
