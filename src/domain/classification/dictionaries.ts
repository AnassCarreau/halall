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
  whyDoubt: string;
  questionToManufacturer: string;
}

export const DOUBTFUL_ADDITIVES: ReadonlyArray<DoubtfulAdditive> = [
  { 
    code: 'e120', 
    name: 'Carmín / Cochinilla', 
    reason: 'Colorante de origen animal (insecto cochinilla)',
    whyDoubt: 'Se obtiene triturando hembras del insecto Dactylopius coccus. Considerado no permitido por la mayoría de juristas (Hanafi) o dudoso según la escuela jurídica.',
    questionToManufacturer: '¿El colorante E120 utilizado en este producto es de origen insecto natural o utilizan alternativas sintéticas/vegetales (como remolacha E162 o antocianinas E163)?'
  },
  { 
    code: 'e441', 
    name: 'Gelatina', 
    reason: 'Gelatina sin especificar origen (puede ser porcina o bovina no halal)',
    whyDoubt: 'La gelatina convencional en Europa procede en un 80% de piel de cerdo y un 15% de despojos bovinos no certificados halal.',
    questionToManufacturer: '¿Cuál es la especie de origen de la gelatina empleada (porcina, bovina o pescado) y cuenta con certificado Halal acreditado?'
  },
  { 
    code: 'e471', 
    name: 'Mono y diglicéridos de ácidos grasos', 
    reason: 'Emulsionante que puede proceder tanto de grasas animales como de aceites vegetales',
    whyDoubt: 'Se sintetiza a partir de glicerol y ácidos grasos que pueden provenir de manteca de cerdo, sebo bovino o aceites vegetales (palma/soja). Si la etiqueta no indica \'100% origen vegetal\', su origen es incierto.',
    questionToManufacturer: '¿Los mono y diglicéridos de ácidos grasos (E471) de este lote son 100% de origen vegetal o contienen fracciones de origen animal?'
  },
  { 
    code: 'e472', 
    name: 'Ésteres de ácidos grasos', 
    reason: 'Emulsionante de posible origen animal no especificado',
    whyDoubt: 'Familia de ésteres derivados del E471; comparte la misma incertidumbre entre grasa de cerdo/sebo y aceites vegetales.',
    questionToManufacturer: '¿Los ésteres de ácidos grasos (E472) provienen exclusivamente de aceites vegetales?'
  },
  { 
    code: 'e472a', 
    name: 'Ésteres acéticos de mono y diglicéridos', 
    reason: 'Posible origen animal no especificado',
    whyDoubt: 'Derivado del E471 con ácido acético; requiere confirmar el origen vegetal de la fracción lipídica.',
    questionToManufacturer: '¿El aditivo E472a procede al 100% de aceites vegetales certificados?'
  },
  { 
    code: 'e472b', 
    name: 'Ésteres lácticos de mono y diglicéridos', 
    reason: 'Posible origen animal no especificado',
    whyDoubt: 'Derivado de E471 con ácido láctico. La fracción grasa puede ser animal.',
    questionToManufacturer: '¿El emulsionante E472b contiene grasas de procedencia animal?'
  },
  { 
    code: 'e472c', 
    name: 'Ésteres cítricos de mono y diglicéridos', 
    reason: 'Posible origen animal no especificado',
    whyDoubt: 'Derivado de E471 con ácido cítrico; suele ser vegetal pero no siempre está garantizado.',
    questionToManufacturer: '¿El aditivo E472c está elaborado únicamente con grasas vegetales?'
  },
  { 
    code: 'e472d', 
    name: 'Ésteres tartáricos de mono y diglicéridos', 
    reason: 'Posible origen animal no especificado',
    whyDoubt: 'Derivado del E471 con ácido tartárico; origen lipídico ambiguo.',
    questionToManufacturer: '¿El aditivo E472d es apto para vegetarianos y 100% vegetal?'
  },
  { 
    code: 'e472e', 
    name: 'Ésteres monoacetiltartáricos', 
    reason: 'Posible origen animal no especificado',
    whyDoubt: 'Emulsionante panario muy extendido; puede contener subproductos grasos animales.',
    questionToManufacturer: '¿El E472e utilizado en la masa proviene íntegramente de fuentes vegetales?'
  },
  { 
    code: 'e472f', 
    name: 'Ésteres mixtos de ácidos grasos', 
    reason: 'Posible origen animal no especificado',
    whyDoubt: 'Mezcla de ésteres de ácidos grasos con riesgo de origen porcino o bovino.',
    questionToManufacturer: '¿El E472f es 100% vegetal o contiene derivados de grasas animales?'
  },
  { 
    code: 'e920', 
    name: 'L-cisteína', 
    reason: 'Aminoácido que puede derivar de plumas o pelo de cerdo',
    whyDoubt: 'Mejorante panario que históricamente se extrae de cerdas de cerdo o plumas de ave, aunque existen métodos modernos de fermentación bacteriana sintética.',
    questionToManufacturer: '¿La L-cisteína (E920) utilizada en la harina proviene de síntesis microbiana/vegetal o de subproductos animales?'
  },
  { 
    code: 'e542', 
    name: 'Fosfato de hueso', 
    reason: 'Derivado de huesos animales',
    whyDoubt: 'Se obtiene calcinando y tratando huesos de ganado convencional no sacrificado según el rito halal.',
    questionToManufacturer: '¿El fosfato de hueso (E542) cuenta con certificación Halal o procede de ganado no sacrificado por el rito islámico?'
  },
];

/**
 * Ingredientes de origen animal ambiguo que no son E-numbers.
 */
export interface DoubtfulIngredient {
  term: string;
  name: string;
  reason: string;
  whyDoubt: string;
  questionToManufacturer: string;
}

export const DOUBTFUL_NON_ENUMBER: ReadonlyArray<DoubtfulIngredient> = [
  { 
    term: 'cuajo animal', 
    name: 'Cuajo animal', 
    reason: 'Enzima de origen animal no especificado',
    whyDoubt: 'Se extrae de la mucosa del cuarto estómago de terneros lechales sacrificados convencionalmente.',
    questionToManufacturer: '¿El queso utiliza cuajo animal tradicional o cuajo microbiano/vegetal apto para dieta halal/vegetariana?'
  },
  { 
    term: 'pepsina', 
    name: 'Pepsina', 
    reason: 'Enzima digestiva de origen animal',
    whyDoubt: 'Frecuentemente obtenida de estómagos de cerdo en la industria enzimática europea.',
    questionToManufacturer: '¿Cuál es la especie animal de procedencia de la enzima pepsina utilizada?'
  },
  { 
    term: 'quimosina animal', 
    name: 'Quimosina animal', 
    reason: 'Enzima de cuajar de origen animal',
    whyDoubt: 'Enzima coagulante procedente de cuajar de ternero no certificado.',
    questionToManufacturer: '¿La quimosina utilizada es de fermentación microbiana (FPC) o de tejido animal?'
  },
];
