import { describe, expect, it } from 'vitest';
import {
  calcularRetencion,
  depurarBase,
  retencionMensual,
} from './retencion.js';
import {
  ARL_INDEPENDIENTE,
  IBC_INDEPENDIENTE,
  PENSION_INDEPENDIENTE,
  SALUD_INDEPENDIENTE,
  UVT_2026,
} from '../config.js';

describe('retencion module (Art. 383 ET)', () => {
  const UVT = UVT_2026.value; // 52374

  describe('depurarBase', () => {
    it('depurates base correctly for S = 10,000,000 with 8% employee contributions', () => {
      const ingreso = 10_000_000;
      const aportes = 800_000;
      const base = depurarBase(ingreso, aportes, UVT);

      // net = 9,200,000
      // 25% exempt = 2,300,000
      // 790/12 UVT = 3,447,955 -> exempt cap not hit
      // 40% cap = 3,680,000 -> global cap not hit
      // base = 9,200,000 - 2,300,000 = 6,900,000
      expect(base).toBeCloseTo(6_900_000, 0);
    });

    it('caps 25% exemption when it exceeds 790 / 12 UVT', () => {
      const ingreso = 25_000_000;
      const aportes = 2_000_000;
      const net = ingreso - aportes; // 23,000,000
      const maxExempt = (790 / 12) * UVT; // ~3,447,955

      const base = depurarBase(ingreso, aportes, UVT);
      expect(base).toBeCloseTo(net - maxExempt, 0);
    });

    it('handles zero or negative income safely', () => {
      expect(depurarBase(0, 0, UVT)).toBe(0);
      expect(depurarBase(-1000, 0, UVT)).toBe(0);
      expect(depurarBase(null, undefined, UVT)).toBe(0);
    });
  });

  describe('calcularRetencion', () => {
    it('returns 0 UVT for base <= 95 UVT', () => {
      expect(calcularRetencion(0)).toBe(0);
      expect(calcularRetencion(50)).toBe(0);
      expect(calcularRetencion(95)).toBe(0);
    });

    it('calculates tax for bracket >95 to 150 UVT (19%)', () => {
      // Base = 131.7447 UVT: (131.7447 - 95) * 0.19 = 6.9815 UVT
      const baseUVT = 6_900_000 / UVT;
      const taxUVT = calcularRetencion(baseUVT);
      expect(taxUVT).toBeCloseTo(6.9815, 2);
    });

    it('calculates tax for bracket >150 to 360 UVT (28% + 10 UVT)', () => {
      // Base = 200 UVT: (200 - 150) * 0.28 + 10 = 14 + 10 = 24 UVT
      expect(calcularRetencion(200)).toBeCloseTo(24, 4);
    });

    it('calculates tax for bracket >360 to 640 UVT (33% + 69 UVT)', () => {
      // Base = 400 UVT: (400 - 360) * 0.33 + 69 = 13.2 + 69 = 82.2 UVT
      expect(calcularRetencion(400)).toBeCloseTo(82.2, 4);
    });

    it('calculates tax for bracket >640 to 945 UVT (35% + 162 UVT)', () => {
      // Base = 700 UVT: (700 - 640) * 0.35 + 162 = 21 + 162 = 183 UVT
      expect(calcularRetencion(700)).toBeCloseTo(183, 4);
    });

    it('calculates tax for bracket >945 to 2300 UVT (37% + 268 UVT)', () => {
      // Base = 1000 UVT: (1000 - 945) * 0.37 + 268 = 20.35 + 268 = 288.35 UVT
      expect(calcularRetencion(1000)).toBeCloseTo(288.35, 4);
    });

    it('calculates tax for bracket >2300 UVT (39% + 770 UVT)', () => {
      // Base = 2500 UVT: (2500 - 2300) * 0.39 + 770 = 78 + 770 = 848 UVT
      expect(calcularRetencion(2500)).toBeCloseTo(848, 4);
    });
  });

  describe('retencionMensual', () => {
    it('calculates employee monthly withholding ≈ 366,000 COP for S = 10,000,000 (tolerance ±1%)', () => {
      const ingreso = 10_000_000;
      const aportes = ingreso * 0.08; // 800,000
      const retencion = retencionMensual(ingreso, aportes, UVT);

      // Expected ≈ 366,000 COP
      const expected = 366_000;
      const tolerance = expected * 0.01;
      expect(retencion).toBeGreaterThanOrEqual(expected - tolerance);
      expect(retencion).toBeLessThanOrEqual(expected + tolerance);
      expect(retencion).toBeCloseTo(365_649, 0);
    });

    it('calculates independent provision ≈ 707,000 COP for B = 12,840,000 (tolerance ±1%)', () => {
      const B = 12_840_000;
      const ssRate =
        IBC_INDEPENDIENTE.value *
        (SALUD_INDEPENDIENTE.value + PENSION_INDEPENDIENTE.value + ARL_INDEPENDIENTE.value);
      const aportesSS = B * ssRate; // ~1,490,570 COP

      const provision = retencionMensual(B, aportesSS, UVT);

      // Expected ≈ 707,000 COP
      const expected = 707_000;
      const tolerance = expected * 0.01;
      expect(provision).toBeGreaterThanOrEqual(expected - tolerance);
      expect(provision).toBeLessThanOrEqual(expected + tolerance);
      expect(provision).toBeCloseTo(707_408, -1);
    });

    it('returns 0 COP for low income below 95 UVT taxable base', () => {
      const ingreso = 3_000_000;
      const aportes = 240_000;
      expect(retencionMensual(ingreso, aportes, UVT)).toBe(0);
    });
  });
});
