import { describe, it, expect } from 'vitest';
import { classify } from '@/domain/classification/classify';

describe('classify — DOUBTFUL additives detection', () => {
  describe('E-number additives', () => {
    it('E120 (carmín/cochinilla) is DOUBTFUL', () => {
      const r = classify('Agua, azúcar, E-120');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.conflicts.some(c => c.code === 'e120')).toBe(true);
    });

    it('E441 (gelatina sin especificar) is DOUBTFUL', () => {
      const r = classify('Gelatina (E441), azúcar');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.conflicts.some(c => c.code === 'e441')).toBe(true);
    });

    it('E471 is DOUBTFUL', () => {
      const r = classify('Emulgente E-471, harina');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.conflicts.some(c => c.code === 'e471')).toBe(true);
    });

    it('E472 (base) is DOUBTFUL', () => {
      const r = classify('Aceite, E472, sal');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.conflicts.some(c => c.code === 'e472')).toBe(true);
    });

    it('E472a is DOUBTFUL', () => {
      const r = classify('Harina, E-472a');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.conflicts.some(c => c.code === 'e472a')).toBe(true);
    });

    it('E472b is DOUBTFUL', () => {
      const r = classify('Aceite, E 472b');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.conflicts.some(c => c.code === 'e472b')).toBe(true);
    });

    it('E472c is DOUBTFUL', () => {
      const r = classify('Harina, E-472c, sal');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.conflicts.some(c => c.code === 'e472c')).toBe(true);
    });

    it('E472d is DOUBTFUL', () => {
      const r = classify('E-472d, arroz');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.conflicts.some(c => c.code === 'e472d')).toBe(true);
    });

    it('E472e is DOUBTFUL', () => {
      const r = classify('Leche, E472e');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.conflicts.some(c => c.code === 'e472e')).toBe(true);
    });

    it('E472f is DOUBTFUL', () => {
      const r = classify('Harina, E-472f');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.conflicts.some(c => c.code === 'e472f')).toBe(true);
    });

    it('E920 (L-cisteína) is DOUBTFUL', () => {
      const r = classify('Harina de trigo, E920');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.conflicts.some(c => c.code === 'e920')).toBe(true);
    });

    it('E542 (fosfato de hueso) is DOUBTFUL', () => {
      const r = classify('Pan, E-542');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.conflicts.some(c => c.code === 'e542')).toBe(true);
    });
  });

  describe('Non-E-number doubtful ingredients', () => {
    it('"cuajo animal" is DOUBTFUL', () => {
      const r = classify('Leche, cuajo animal, sal');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.conflicts.some(c => c.severity === 'DOUBTFUL')).toBe(true);
    });

    it('"pepsina" is DOUBTFUL', () => {
      const r = classify('Leche, pepsina, sal');
      expect(r.status).toBe('DOUBTFUL');
    });

    it('"quimosina animal" is DOUBTFUL', () => {
      const r = classify('Leche pasteurizada, quimosina animal');
      expect(r.status).toBe('DOUBTFUL');
    });
  });

  describe('conflict details', () => {
    it('includes code, name, and reason for E-number conflict', () => {
      const r = classify('Azúcar, E-120, sal');
      const conflict = r.conflicts.find(c => c.code === 'e120');
      expect(conflict).toBeDefined();
      expect(conflict!.name).toBeTruthy();
      expect(conflict!.reason).toBeTruthy();
      expect(conflict!.severity).toBe('DOUBTFUL');
    });
  });
});
