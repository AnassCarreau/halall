import { describe, it, expect } from 'vitest';
import { classify } from '@/domain/classification/classify';

describe('classify — MEAT detection', () => {
  describe('Meat without halal certification → DOUBTFUL', () => {
    it('pollo without certification is DOUBTFUL', () => {
      const r = classify('Pollo, sal, agua');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.hasMeat).toBe(true);
    });

    it('ternera without certification is DOUBTFUL', () => {
      const r = classify('Ternera, cebolla');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.hasMeat).toBe(true);
    });

    it('pavo without certification is DOUBTFUL', () => {
      const r = classify('Pechuga de pavo');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.hasMeat).toBe(true);
    });

    it('cordero without certification is DOUBTFUL', () => {
      const r = classify('Cordero, romero');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.hasMeat).toBe(true);
    });

    it('carne picada without certification is DOUBTFUL', () => {
      const r = classify('Carne picada, sal');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.hasMeat).toBe(true);
    });

    it('grasa animal without certification is DOUBTFUL', () => {
      const r = classify('Grasa animal, harina');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.hasMeat).toBe(true);
    });

    it('caldo de pollo without certification is DOUBTFUL', () => {
      const r = classify('Agua, caldo de pollo, fideos');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.hasMeat).toBe(true);
    });

    it('extracto de carne without certification is DOUBTFUL', () => {
      const r = classify('Extracto de carne, sal');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.hasMeat).toBe(true);
    });

    it('gallina without certification is DOUBTFUL', () => {
      const r = classify('Gallina campera');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.hasMeat).toBe(true);
    });

    it('vacuno without certification is DOUBTFUL', () => {
      const r = classify('Vacuno, pimienta');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.hasMeat).toBe(true);
    });

    it('buey without certification is DOUBTFUL', () => {
      const r = classify('Buey, sal');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.hasMeat).toBe(true);
    });

    it('cabrito without certification is DOUBTFUL', () => {
      const r = classify('Cabrito lechal');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.hasMeat).toBe(true);
    });

    it('pato without certification is DOUBTFUL', () => {
      const r = classify('Pato confitado');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.hasMeat).toBe(true);
    });

    it('conejo without certification is DOUBTFUL', () => {
      const r = classify('Conejo en salsa');
      expect(r.status).toBe('DOUBTFUL');
      expect(r.hasMeat).toBe(true);
    });
  });

  describe('Meat WITH halal certification → HALAL', () => {
    it('pollo with certification is HALAL', () => {
      const r = classify('Pollo, sal, agua', { isCertifiedHalal: true });
      expect(r.status).toBe('HALAL');
      expect(r.hasMeat).toBe(true);
    });

    it('ternera with certification is HALAL', () => {
      const r = classify('Ternera, cebolla', { isCertifiedHalal: true });
      expect(r.status).toBe('HALAL');
      expect(r.hasMeat).toBe(true);
    });
  });

  describe('Fish and seafood are NOT meat (halal by default)', () => {
    it('salmon is HALAL (not meat)', () => {
      const r = classify('Salmón, sal, aceite');
      expect(r.status).toBe('HALAL');
      expect(r.hasMeat).toBe(false);
    });

    it('atun is HALAL (not meat)', () => {
      const r = classify('Atún en aceite de oliva');
      expect(r.status).toBe('HALAL');
      expect(r.hasMeat).toBe(false);
    });

    it('gambas is HALAL (not meat)', () => {
      const r = classify('Gambas, ajo, aceite');
      expect(r.status).toBe('HALAL');
      expect(r.hasMeat).toBe(false);
    });

    it('merluza is HALAL (not meat)', () => {
      const r = classify('Merluza, limón');
      expect(r.status).toBe('HALAL');
      expect(r.hasMeat).toBe(false);
    });
  });

  describe('conflict details for meat', () => {
    it('includes DOUBTFUL conflict for uncertified meat', () => {
      const r = classify('Pollo, sal');
      const conflict = r.conflicts.find(c => c.severity === 'DOUBTFUL');
      expect(conflict).toBeDefined();
      expect(conflict!.reason).toContain('carne');
    });
  });
});
