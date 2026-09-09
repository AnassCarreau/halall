import { describe, it, expect } from 'vitest';
import { normalizeText } from '@/domain/classification/normalize';

describe('normalizeText', () => {
  it('converts uppercase to lowercase', () => {
    expect(normalizeText('AGUA, AZUCAR, SAL')).toBe('agua, azucar, sal');
  });

  it('removes diacritics and accents', () => {
    expect(normalizeText('jamón, carmín, paté, limón')).toBe('jamon, carmin, pate, limon');
  });

  it('normalizes E-numbers with dashes to canonical eXXX format', () => {
    expect(normalizeText('emulgente (E-471), colorante (E-120)')).toBe('emulgente (e471), colorante (e120)');
  });

  it('normalizes E-numbers with spaces to canonical eXXX format', () => {
    expect(normalizeText('acidulante (E 330), gelificante E 441')).toBe('acidulante (e330), gelificante e441');
  });

  it('normalizes E-numbers with sub-letter suffixes like e472a or E-472b', () => {
    expect(normalizeText('E-472a, E 472b, E-472c, e-472d')).toBe('e472a, e472b, e472c, e472d');
  });

  it('handles empty and whitespace-only strings', () => {
    expect(normalizeText('')).toBe('');
    expect(normalizeText('   ')).toBe('');
  });
});
