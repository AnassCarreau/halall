import { describe, it, expect } from 'vitest';
import { classify } from '@/domain/classification/classify';

describe('classify — priority ordering and edge cases', () => {
  describe('HARAM > MEAT > DOUBTFUL_ADDITIVE > HALAL', () => {
    it('haram + meat → HARAM (haram wins)', () => {
      const r = classify('Cerdo, pollo, sal');
      expect(r.status).toBe('HARAM');
    });

    it('haram + doubtful additive → HARAM (haram wins)', () => {
      const r = classify('Alcohol, E-120, agua');
      expect(r.status).toBe('HARAM');
    });

    it('meat + doubtful additive (no cert) → DOUBTFUL with both conflicts', () => {
      const r = classify('Pollo, E-120, sal');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.hasMeat).toBe(true);
      expect(r.conflicts.length).toBeGreaterThanOrEqual(2);
    });

    it('meat + doubtful additive (certified) → DOUBTFUL (additive still doubtful)', () => {
      const r = classify('Pollo, E-120, sal', { isCertifiedHalal: true });
      expect(r.status).toBe('DOUBTFUL');
      // Meat is OK but additive is still doubtful
      expect(r.conflicts.some(c => c.code === 'e120')).toBe(true);
    });

    it('clean ingredients → HALAL', () => {
      const r = classify('Agua, sal, aceite de oliva, tomate');
      expect(r.status).toBe('HALAL');
      expect(r.hasMeat).toBe(false);
      expect(r.conflicts).toHaveLength(0);
    });
  });

  describe('Empty / unreadable input → DOUBTFUL', () => {
    it('empty string → DOUBTFUL', () => {
      const r = classify('');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.explanation).toContain('no especificados');
    });

    it('very short text (<3 chars) → DOUBTFUL', () => {
      const r = classify('ab');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.explanation).toContain('no especificados');
    });

    it('whitespace only → DOUBTFUL', () => {
      const r = classify('   ');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.explanation).toContain('no especificados');
    });
  });

  describe('hasMeat flag accuracy', () => {
    it('hasMeat is false when no meat present', () => {
      const r = classify('Agua, sal, azúcar');
      expect(r.hasMeat).toBe(false);
    });

    it('hasMeat is true even when result is HARAM (cerdo IS meat)', () => {
      // cerdo is haram but also sets hasMeat
      const r = classify('Cerdo, pollo');
      expect(r.hasMeat).toBe(true);
    });

    it('hasMeat is true for uncertified meat products', () => {
      const r = classify('Pollo deshuesado');
      expect(r.hasMeat).toBe(true);
    });
  });

  describe('multiple conflicts accumulate', () => {
    it('multiple haram ingredients create multiple conflicts', () => {
      const r = classify('Cerdo, alcohol, sangre');
      expect(r.status).toBe('HARAM');
      expect(r.conflicts.filter(c => c.severity === 'HARAM').length).toBeGreaterThanOrEqual(3);
    });

    it('multiple doubtful additives create multiple conflicts', () => {
      const r = classify('Agua, E-120, E-471, E-920');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.conflicts.filter(c => c.severity === 'DOUBTFUL').length).toBeGreaterThanOrEqual(3);
    });
  });
});
