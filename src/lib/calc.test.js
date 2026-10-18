import { describe, expect, it } from 'vitest';
import {
  anualEmpleado,
  calcular,
  netoIndependiente,
  obligadoADeclarar,
} from './calc.js';
import {
  AUXILIO_TRANSPORTE_2026,
  COSTO_CAMBIO_DEFAULT,
  SMMLV_2026,
  TRM_DEFAULT,
  UVT_2026,
} from '../config.js';

describe('calc module', () => {
  const S = 10_000_000;
  const UVT = UVT_2026.value; // 52374
  const TRM = TRM_DEFAULT.value; // 4000
  const COSTO_CAMBIO = COSTO_CAMBIO_DEFAULT.value; // 0.03

  describe('Core 4 Specification Benchmark Cases (S = 10,000,000, tolerance ±1%)', () => {
    it('Case A: vacaciones pagas, no retention -> ≈ 12,840,000 COP (1.28x)', () => {
      const res = calcular({
        modo: 'cop-to-usd',
        monto: S,
        vacacionesPagas: true,
        diasVacaciones: 15,
        despuesDeRetencion: false,
        trm: TRM,
        costoCambio: COSTO_CAMBIO,
        integral: false,
        uvt: UVT,
      });

      const expectedCOP = 12_840_000;
      const tolerance = expectedCOP * 0.01;

      expect(res.equivalenteCOP).toBeGreaterThanOrEqual(expectedCOP - tolerance);
      expect(res.equivalenteCOP).toBeLessThanOrEqual(expectedCOP + tolerance);

      expect(res.factor).toBeGreaterThanOrEqual(1.27);
      expect(res.factor).toBeLessThanOrEqual(1.30);

      // Verify sub-properties
      expect(res.independiente.cobroMensualCOP).toBeCloseTo(res.equivalenteCOP, 2);
      expect(res.independiente.cobroMensualUSD).toBeCloseTo(res.equivalenteCOP / TRM, 2);
      expect(res.empleado.salarioMensual).toBe(S);
      expect(res.empleado.aportesMensuales).toBe(S * 0.08);
      expect(res.obligadoADeclarar).toBe(true);
    });

    it('Case B: 15 days unpaid vacation, no retention -> ≈ 13,650,000 COP (1.37x)', () => {
      const res = calcular({
        modo: 'cop-to-usd',
        monto: S,
        vacacionesPagas: false,
        diasVacaciones: 15,
        despuesDeRetencion: false,
        trm: TRM,
        costoCambio: COSTO_CAMBIO,
        integral: false,
        uvt: UVT,
      });

      const expectedCOP = 13_650_000;
      const tolerance = expectedCOP * 0.01;

      expect(res.equivalenteCOP).toBeGreaterThanOrEqual(expectedCOP - tolerance);
      expect(res.equivalenteCOP).toBeLessThanOrEqual(expectedCOP + tolerance);

      expect(res.factor).toBeGreaterThanOrEqual(1.35);
      expect(res.factor).toBeLessThanOrEqual(1.38);
    });

    it('Case C: vacaciones pagas, with retention -> ≈ 13,350,000 COP (1.34x)', () => {
      const res = calcular({
        modo: 'cop-to-usd',
        monto: S,
        vacacionesPagas: true,
        diasVacaciones: 15,
        despuesDeRetencion: true,
        trm: TRM,
        costoCambio: COSTO_CAMBIO,
        integral: false,
        uvt: UVT,
      });

      const expectedCOP = 13_350_000;
      const tolerance = expectedCOP * 0.01;

      expect(res.equivalenteCOP).toBeGreaterThanOrEqual(expectedCOP - tolerance);
      expect(res.equivalenteCOP).toBeLessThanOrEqual(expectedCOP + tolerance);

      expect(res.factor).toBeGreaterThanOrEqual(1.32);
      expect(res.factor).toBeLessThanOrEqual(1.35);
    });

    it('Case D: 15 days unpaid vacation, with retention -> ≈ 14,360,000 COP (1.44x)', () => {
      const res = calcular({
        modo: 'cop-to-usd',
        monto: S,
        vacacionesPagas: false,
        diasVacaciones: 15,
        despuesDeRetencion: true,
        trm: TRM,
        costoCambio: COSTO_CAMBIO,
        integral: false,
        uvt: UVT,
      });

      const expectedCOP = 14_360_000;
      const tolerance = expectedCOP * 0.01;

      expect(res.equivalenteCOP).toBeGreaterThanOrEqual(expectedCOP - tolerance);
      expect(res.equivalenteCOP).toBeLessThanOrEqual(expectedCOP + tolerance);

      expect(res.factor).toBeGreaterThanOrEqual(1.42);
      expect(res.factor).toBeLessThanOrEqual(1.46);
    });
  });

  describe('Withholding tax and independent provisioning benchmarks', () => {
    it('calculates employee withholding ≈ 366,000 COP/month for S = 10,000,000', () => {
      const res = calcular({
        modo: 'cop-to-usd',
        monto: S,
        uvt: UVT,
      });

      const expectedWithholding = 366_000;
      const tolerance = expectedWithholding * 0.01;

      expect(res.retencionEmpleado).toBeGreaterThanOrEqual(expectedWithholding - tolerance);
      expect(res.retencionEmpleado).toBeLessThanOrEqual(expectedWithholding + tolerance);
    });

    it('calculates independent provision ≈ 707,000 COP/month for B ≈ 12,840,000', () => {
      const res = calcular({
        modo: 'cop-to-usd',
        monto: S,
        vacacionesPagas: true,
        despuesDeRetencion: false,
        uvt: UVT,
      });

      const expectedProvision = 707_000;
      const tolerance = expectedProvision * 0.01;

      expect(res.provisionIndependiente).toBeGreaterThanOrEqual(expectedProvision - tolerance);
      expect(res.provisionIndependiente).toBeLessThanOrEqual(expectedProvision + tolerance);
    });
  });

  describe('Reverse mode (usd-to-cop)', () => {
    it('converts USD contractor rate back to equivalent COP salary matching Case A', () => {
      // For S = 10,000,000, Case A equivalent COP is ~12,842,853 -> in USD @ 4000 TRM = 3,210.71325
      const usdRate = 12_842_853.31 / TRM;

      const res = calcular({
        modo: 'usd-to-cop',
        monto: usdRate,
        vacacionesPagas: true,
        despuesDeRetencion: false,
        trm: TRM,
        costoCambio: COSTO_CAMBIO,
        integral: false,
        uvt: UVT,
      });

      // Equivalent salary should recover S = 10,000,000 COP within 0.1%
      expect(res.equivalenteCOP).toBeCloseTo(S, -3);
      expect(res.empleado.salarioMensual).toBeCloseTo(S, -3);
      expect(res.factor).toBeCloseTo(1.284, 2);
    });

    it('reverses Case C with retention correctly', () => {
      // Forward calculation
      const forward = calcular({
        modo: 'cop-to-usd',
        monto: S,
        vacacionesPagas: true,
        despuesDeRetencion: true,
        trm: TRM,
        costoCambio: COSTO_CAMBIO,
        integral: false,
        uvt: UVT,
      });

      // Reverse using the resulting USD amount
      const reverse = calcular({
        modo: 'usd-to-cop',
        monto: forward.equivalenteUSD,
        vacacionesPagas: true,
        despuesDeRetencion: true,
        trm: TRM,
        costoCambio: COSTO_CAMBIO,
        integral: false,
        uvt: UVT,
      });

      expect(reverse.equivalenteCOP).toBeCloseTo(S, -2);
    });
  });

  describe('Helper functions', () => {
    it('anualEmpleado computes standard salary compensation without transport allowance above 2 SMMLV', () => {
      // Non-integral, S = 10,000,000 -> 13.16 * S = 131,600,000
      const net = anualEmpleado(S, false);
      expect(net).toBe(131_600_000);
    });

    it('anualEmpleado includes statutory transport allowance for salary <= 2 SMMLV', () => {
      const salarioMinimo = SMMLV_2026.value; // 1,423,500
      const auxTransporte = AUXILIO_TRANSPORTE_2026.value; // 200,000

      const net = anualEmpleado(salarioMinimo, false, salarioMinimo, auxTransporte);
      // 13.16 * 1,423,500 + 12 * 200,000 = 18,733,260 + 2,400,000 = 21,133,260
      const expected = 13.16 * salarioMinimo + 12 * auxTransporte;
      expect(net).toBeCloseTo(expected, 2);
    });

    it('anualEmpleado computes integral salary compensation', () => {
      // Integral: 12 * S * (1 - 0.056)
      const net = anualEmpleado(20_000_000, true);
      const expected = 12 * 20_000_000 * (1 - 0.056);
      expect(net).toBeCloseTo(expected, 2);
    });

    it('netoIndependiente computes contractor annual net earnings correctly', () => {
      const B = 10_000_000;
      const M = 12;
      const c = 0.03;
      // ssRate = 0.40 * (0.125 + 0.16 + 0.00522) = 0.116088
      // netFactor = 1 - 0.116088 - 0.03 = 0.853912
      // net = 10,000,000 * 12 * 0.853912 = 102,469,440
      const net = netoIndependiente(B, M, c);
      expect(net).toBeCloseTo(102_469_440, 0);
    });

    it('obligadoADeclarar correctly evaluates Art. 592 threshold (1,400 UVT)', () => {
      const thresholdCOP = 1400 * UVT; // 73,323,600
      expect(obligadoADeclarar(thresholdCOP - 100, UVT)).toBe(false);
      expect(obligadoADeclarar(thresholdCOP, UVT)).toBe(true);
      expect(obligadoADeclarar(thresholdCOP + 1000, UVT)).toBe(true);
      expect(obligadoADeclarar(0, UVT)).toBe(false);
    });
  });

  describe('Edge cases and defensive input handling', () => {
    it('returns zeroes for zero or negative monto', () => {
      const resZero = calcular({ monto: 0 });
      expect(resZero.equivalenteCOP).toBe(0);
      expect(resZero.equivalenteUSD).toBe(0);
      expect(resZero.factor).toBe(0);

      const resNegative = calcular({ monto: -5000 });
      expect(resNegative.equivalenteCOP).toBe(0);
      expect(resNegative.equivalenteUSD).toBe(0);
    });
  });
});
