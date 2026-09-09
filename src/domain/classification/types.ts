export type HalalStatus = 'HALAL' | 'DOUBTFUL' | 'HARAM';

export interface IngredientConflict {
  code?: string;
  name: string;
  severity: 'HARAM' | 'DOUBTFUL';
  reason: string;
}

export interface ClassificationResult {
  status: HalalStatus;
  hasMeat: boolean;
  conflicts: IngredientConflict[];
  explanation: string;
}

export interface ClassificationOptions {
  isCertifiedHalal?: boolean;
}
