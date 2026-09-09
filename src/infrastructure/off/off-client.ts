export interface OffProduct {
  barcode: string;
  name: string;
  brand: string | null;
  ingredientsText: string;
  isCertifiedHalal: boolean;
}

export interface OffClient {
  getProduct(barcode: string): Promise<OffProduct | null>;
}

export interface OffClientOptions {
  baseUrl?: string;
  userAgent?: string;
  timeoutMs?: number;
}

const DEFAULT_OFF_BASE_URL = 'https://world.openfoodfacts.org/api/v2/product';
const DEFAULT_USER_AGENT = 'Halall - Web - Version 0.1.0 - https://halall.app';
const DEFAULT_TIMEOUT_MS = 5000;

export class OpenFoodFactsClient implements OffClient {
  private baseUrl: string;
  private userAgent: string;
  private timeoutMs: number;

  constructor(options?: OffClientOptions) {
    this.baseUrl = options?.baseUrl ?? DEFAULT_OFF_BASE_URL;
    this.userAgent = options?.userAgent ?? DEFAULT_USER_AGENT;
    this.timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  async getProduct(barcode: string): Promise<OffProduct | null> {
    const cleanBarcode = barcode.trim();
    if (!cleanBarcode) {
      return null;
    }

    try {
      const url = `${this.baseUrl}/${encodeURIComponent(cleanBarcode)}.json`;
      const signal = AbortSignal.timeout(this.timeoutMs);

      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
          Accept: 'application/json',
        },
        signal,
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (!data || data.status !== 1 || !data.product) {
        return null;
      }

      const product = data.product;

      const name =
        product.product_name_es?.trim() ||
        product.product_name?.trim() ||
        product.product_name_en?.trim() ||
        'Producto sin nombre';

      const brand = product.brands?.trim() || product.brand?.trim() || null;

      const ingredientsText =
        product.ingredients_text_es?.trim() ||
        product.ingredients_text?.trim() ||
        product.ingredients_text_en?.trim() ||
        '';

      const labelsTags: string[] = Array.isArray(product.labels_tags)
        ? product.labels_tags
        : [];
      const hasHalalTag = labelsTags.some(tag =>
        tag.toLowerCase().includes('halal')
      );

      const rawLabels = typeof product.labels === 'string' ? product.labels : '';
      const hasHalalLabel = rawLabels.toLowerCase().includes('halal');

      const isCertifiedHalal = hasHalalTag || hasHalalLabel;

      return {
        barcode: cleanBarcode,
        name,
        brand,
        ingredientsText,
        isCertifiedHalal,
      };
    } catch {
      // Fail-soft: network errors, JSON parsing errors, or timeouts return null
      return null;
    }
  }
}

/** Default singleton OFF client */
export const defaultOffClient = new OpenFoodFactsClient();
