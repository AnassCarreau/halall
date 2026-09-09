import { describe, it, expect } from 'vitest';
import { classify } from '@/domain/classification/classify';

describe('classify — HARAM detection', () => {
  describe('Cerdo and pork derivatives', () => {
    it('detects "cerdo" as HARAM', () => {
      const r = classify('Carne de cerdo, sal, especias');
      expect(r.status).toBe('HARAM');
      expect(r.conflicts.some(c => c.severity === 'HARAM')).toBe(true);
    });

    it('detects "porcino" as HARAM', () => {
      const r = classify('Grasa porcino, harina');
      expect(r.status).toBe('HARAM');
    });

    it('detects "tocino" as HARAM', () => {
      const r = classify('Tocino ahumado');
      expect(r.status).toBe('HARAM');
    });

    it('detects "bacon" as HARAM', () => {
      const r = classify('Bacon, queso, pan');
      expect(r.status).toBe('HARAM');
    });

    it('detects "panceta" as HARAM', () => {
      const r = classify('Panceta ibérica');
      expect(r.status).toBe('HARAM');
    });

    it('detects "manteca de cerdo" as HARAM', () => {
      const r = classify('Manteca de cerdo, harina, azúcar');
      expect(r.status).toBe('HARAM');
    });

    it('detects "lardo" as HARAM', () => {
      const r = classify('Lardo, sal');
      expect(r.status).toBe('HARAM');
    });

    it('detects "jamon serrano" as HARAM', () => {
      const r = classify('Jamón serrano, tomate');
      expect(r.status).toBe('HARAM');
    });

    it('detects "jamon iberico" as HARAM', () => {
      const r = classify('Jamón ibérico de bellota');
      expect(r.status).toBe('HARAM');
    });

    it('detects "embutido de cerdo" as HARAM', () => {
      const r = classify('Embutido de cerdo, pimentón');
      expect(r.status).toBe('HARAM');
    });

    it('detects "gelatina de cerdo" as HARAM', () => {
      const r = classify('Gelatina de cerdo, azúcar, agua');
      expect(r.status).toBe('HARAM');
    });

    it('detects "puerco" as HARAM', () => {
      const r = classify('Carne de puerco');
      expect(r.status).toBe('HARAM');
    });
  });

  describe('Blood', () => {
    it('detects "sangre" as HARAM', () => {
      const r = classify('Sangre de cerdo, arroz');
      expect(r.status).toBe('HARAM');
    });

    it('detects "plasma" as HARAM', () => {
      const r = classify('Plasma sanguíneo, proteínas');
      expect(r.status).toBe('HARAM');
    });

    it('detects "morcilla" as HARAM', () => {
      const r = classify('Morcilla de Burgos');
      expect(r.status).toBe('HARAM');
    });
  });

  describe('Alcohol', () => {
    it('detects "alcohol" as HARAM', () => {
      const r = classify('Alcohol etílico, agua');
      expect(r.status).toBe('HARAM');
    });

    it('detects "etanol" as HARAM', () => {
      const r = classify('Etanol, saborizante');
      expect(r.status).toBe('HARAM');
    });

    it('detects "licor" as HARAM', () => {
      const r = classify('Licor de naranja');
      expect(r.status).toBe('HARAM');
    });

    it('detects "vino" as HARAM', () => {
      const r = classify('Vino tinto, sal');
      expect(r.status).toBe('HARAM');
    });

    it('detects "cerveza" as HARAM', () => {
      const r = classify('Cerveza, malta');
      expect(r.status).toBe('HARAM');
    });

    it('detects "ron" as HARAM', () => {
      const r = classify('Ron añejo');
      expect(r.status).toBe('HARAM');
    });

    it('detects "brandy" as HARAM', () => {
      const r = classify('Brandy, azúcar');
      expect(r.status).toBe('HARAM');
    });
  });

  describe('Vinegar exceptions (NOT haram)', () => {
    it('"vinagre de vino" is NOT haram', () => {
      const r = classify('Vinagre de vino, aceite de oliva, sal');
      expect(r.status).not.toBe('HARAM');
    });

    it('"vinagre de alcohol" is NOT haram', () => {
      const r = classify('Vinagre de alcohol, mostaza, agua');
      expect(r.status).not.toBe('HARAM');
    });

    it('"vinagre de vino tinto" is NOT haram', () => {
      const r = classify('Vinagre de vino tinto, aceitunas');
      expect(r.status).not.toBe('HARAM');
    });
  });

  describe('conflict details', () => {
    it('includes conflict with name and reason for haram ingredient', () => {
      const r = classify('Gelatina de cerdo, agua');
      expect(r.conflicts.length).toBeGreaterThan(0);
      const conflict = r.conflicts.find(c => c.severity === 'HARAM');
      expect(conflict).toBeDefined();
      expect(conflict!.name).toBeTruthy();
      expect(conflict!.reason).toBeTruthy();
    });

    it('sets explanation on a haram result', () => {
      const r = classify('Carne de cerdo');
      expect(r.explanation.length).toBeGreaterThan(0);
    });
  });
});
