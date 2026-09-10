import { describe, it, expect } from 'vitest';
import { translations } from '@/i18n/translations';
import type { Language } from '@/i18n/types';

describe('i18n Translations Dictionary', () => {
  const languages: Language[] = ['es', 'en', 'ar'];

  it('contains translations for es, en, and ar', () => {
    expect(Object.keys(translations)).toEqual(expect.arrayContaining(['es', 'en', 'ar']));
  });

  languages.forEach((lang) => {
    describe(`Language: ${lang}`, () => {
      const t = translations[lang];

      it('has complete navigation keys', () => {
        expect(t.nav.scan).toBeTruthy();
        expect(t.nav.search).toBeTruthy();
        expect(t.nav.places).toBeTruthy();
        expect(t.nav.soon).toBeTruthy();
      });

      it('has complete header keys', () => {
        expect(t.header.title).toBeTruthy();
        expect(t.header.helpTooltip).toBeTruthy();
      });

      it('has complete scanner keys', () => {
        expect(t.scanner.pointBarcode).toBeTruthy();
        expect(t.scanner.ocrTooltip).toBeTruthy();
        expect(t.scanner.cameraErrorTitle).toBeTruthy();
        expect(t.scanner.cameraErrorDenied).toBeTruthy();
        expect(t.scanner.uploadOrPhoto).toBeTruthy();
        expect(t.scanner.searchByName).toBeTruthy();
      });

      it('has complete result and accordion keys', () => {
        expect(t.result.statusHalal).toBeTruthy();
        expect(t.result.statusHaram).toBeTruthy();
        expect(t.result.statusDoubtful).toBeTruthy();
        expect(t.result.showFullIngredients).toBeTruthy();
        expect(t.result.hideFullIngredients).toBeTruthy();
        expect(t.result.noIngredientsRecorded).toBeTruthy();
        expect(t.result.meatWarningTitle).toBeTruthy();
        expect(t.result.meatWarningDesc).toBeTruthy();
        expect(t.result.ocrButton).toBeTruthy();
      });

      it('has complete guide modal keys', () => {
        expect(t.guide.title).toBeTruthy();
        expect(t.guide.trafficLightTitle).toBeTruthy();
        expect(t.guide.trafficLightHalal).toBeTruthy();
        expect(t.guide.trafficLightDoubtful).toBeTruthy();
        expect(t.guide.trafficLightHaram).toBeTruthy();
        expect(t.guide.meatRuleTitle).toBeTruthy();
        expect(t.guide.meatRuleDesc).toBeTruthy();
        expect(t.guide.additivesTitle).toBeTruthy();
        expect(t.guide.additivesDesc).toBeTruthy();
        expect(t.guide.sourcesTitle).toBeTruthy();
        expect(t.guide.sourcesDesc).toBeTruthy();
      });
    });
  });

  it('includes authentic Arabic script in ar dictionary', () => {
    const arabicRegex = /[\u0600-\u06FF]/;
    const ar = translations.ar;

    expect(arabicRegex.test(ar.nav.scan)).toBe(true);
    expect(arabicRegex.test(ar.result.statusHalal)).toBe(true);
    expect(arabicRegex.test(ar.result.statusDoubtful)).toBe(true);
    expect(arabicRegex.test(ar.result.statusHaram)).toBe(true);
    expect(arabicRegex.test(ar.guide.title)).toBe(true);
    expect(arabicRegex.test(ar.result.showFullIngredients)).toBe(true);
  });

  it('ensures all keys present in ES are also present in EN and AR with identical shape', () => {
    function getKeys(obj: Record<string, unknown>, prefix = ''): string[] {
      return Object.keys(obj).flatMap((key) => {
        const val = obj[key];
        const currentPath = prefix ? `${prefix}.${key}` : key;
        if (typeof val === 'object' && val !== null) {
          return getKeys(val as Record<string, unknown>, currentPath);
        }
        return [currentPath];
      });
    }

    const esKeys = getKeys(translations.es as unknown as Record<string, unknown>).sort();
    const enKeys = getKeys(translations.en as unknown as Record<string, unknown>).sort();
    const arKeys = getKeys(translations.ar as unknown as Record<string, unknown>).sort();

    expect(enKeys).toEqual(esKeys);
    expect(arKeys).toEqual(esKeys);
  });
});
