import {
  DEDUCCIONES_TOTALES_LIMITE_UVT,
  DEDUCCIONES_TOTALES_PORCENTAJE,
  EXENCION_LABORAL_LIMITE_UVT,
  EXENCION_LABORAL_PORCENTAJE,
  RETENCION_TABLA_383,
  UVT_2026,
} from '../config.js';

/**
 * Computes the depurated monthly tax base in COP after subtracting mandatory social security
 * contributions and applying the 25% statutory labor exemption subject to statutory caps.
 *
 * Depuration steps per Colombian tax law (Art. 206, 336, 383 ET):
 * 1. Net income = gross income - mandatory social security contributions.
 * 2. 25% exempt labor income = min(25% of net, 790 UVT / 12).
 * 3. Global deduction & exemption cap = min(40% of net, 1340 UVT / 12).
 * 4. Applicable exempt income = min(exempt income, global cap).
 * 5. Depurated base = max(0, net income - applicable exempt income).
 *
 * @param {number} ingreso - Monthly gross income in COP.
 * @param {number} aportes - Monthly mandatory social security contributions in COP.
 * @param {number} [uvt=UVT_2026.value] - Applicable UVT value in COP.
 * @returns {number} Depurated monthly tax base in COP.
 */
export function depurarBase(ingreso, aportes, uvt = UVT_2026.value) {
  if (!ingreso || ingreso <= 0 || !Number.isFinite(ingreso)) {
    return 0;
  }

  const safeAportes = Math.max(0, Number.isFinite(aportes) ? aportes : 0);
  const safeUvt = uvt && uvt > 0 ? uvt : UVT_2026.value;
  const net = Math.max(0, ingreso - safeAportes);

  if (net === 0) {
    return 0;
  }

  // 25% exempt labor income capped at 790 UVT / 12
  const monthlyExemptCapCOP = (EXENCION_LABORAL_LIMITE_UVT.value / 12) * safeUvt;
  const exempt = Math.min(net * EXENCION_LABORAL_PORCENTAJE.value, monthlyExemptCapCOP);

  // Global cap on deductions & exemptions: min(40% of net, 1340 UVT / 12)
  const monthlyGlobalCapCOP = (DEDUCCIONES_TOTALES_LIMITE_UVT.value / 12) * safeUvt;
  const globalCap = Math.min(net * DEDUCCIONES_TOTALES_PORCENTAJE.value, monthlyGlobalCapCOP);

  const applicableExempt = Math.min(exempt, globalCap);

  return Math.max(0, net - applicableExempt);
}

/**
 * Calculates withholding tax in UVT per Article 383 of the Colombian Tax Statute (Estatuto Tributario).
 *
 * @param {number} baseMensualUVT - Monthly depurated tax base expressed in UVT.
 * @returns {number} Withholding tax amount in UVT.
 */
export function calcularRetencion(baseMensualUVT) {
  if (!baseMensualUVT || baseMensualUVT <= 0 || !Number.isFinite(baseMensualUVT)) {
    return 0;
  }

  const brackets = RETENCION_TABLA_383.value;
  for (const bracket of brackets) {
    if (baseMensualUVT > bracket.minUVT && baseMensualUVT <= bracket.maxUVT) {
      return (baseMensualUVT - bracket.minUVT) * bracket.marginalRate + bracket.additionalUVT;
    }
  }

  return 0;
}

/**
 * Calculates monthly withholding tax in COP by combining base depuration and bracket lookup.
 *
 * @param {number} ingreso - Monthly gross income in COP.
 * @param {number} aportes - Monthly mandatory social security contributions in COP.
 * @param {number} [uvt=UVT_2026.value] - Applicable UVT value in COP.
 * @returns {number} Monthly withholding tax amount in COP.
 */
export function retencionMensual(ingreso, aportes, uvt = UVT_2026.value) {
  const safeUvt = uvt && uvt > 0 ? uvt : UVT_2026.value;
  const baseCOP = depurarBase(ingreso, aportes, safeUvt);
  const baseUVT = baseCOP / safeUvt;
  const retencionUVT = calcularRetencion(baseUVT);
  return retencionUVT * safeUvt;
}
