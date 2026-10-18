import {
  APORTE_EMPLEADO,
  ARL_INDEPENDIENTE,
  AUXILIO_TRANSPORTE_2026,
  COSTO_CAMBIO_DEFAULT,
  DIAS_HABILES_MES,
  DIAS_VACACIONES_DEFAULT,
  FACTOR_PRESTACIONAL_INTEGRAL,
  IBC_INDEPENDIENTE,
  INTERESES_CESANTIAS,
  PENSION_INDEPENDIENTE,
  SALUD_INDEPENDIENTE,
  SMMLV_2026,
  TOPE_DECLARAR_UVT,
  TRM_DEFAULT,
  UVT_2026,
} from '../config.js';
import { retencionMensual } from './retencion.js';

/**
 * Calculates net annual employee compensation.
 *
 * For ordinary (non-integral) salary:
 * - 12 monthly salaries net of employee social security (4% health + 4% pension = 8%): 12 * S * 0.92
 * - Prima de servicios: 1 month salary = 1 * S
 * - Cesantías: 1 month salary = 1 * S
 * - Intereses de cesantías: 12% of cesantías = 0.12 * S
 * Sum: 12 * 0.92 * S + 2.12 * S = 13.16 * S.
 * For salaries <= 2 SMMLV, statutory transportation allowance (12 * auxTransporte) is added.
 *
 * For integral salary (salario integral):
 * - Minimum 13 SMMLV (10 salary + 3 benefits per Art. 132 CST).
 * - Employee contributes 8% on 70% of the salary: 0.70 * 8% = 5.6%.
 * - Annual net: 12 * S * (1 - 0.056).
 *
 * @param {number} salario - Monthly base salary in COP.
 * @param {boolean} [integral=false] - Whether the employment contract is salario integral.
 * @param {number} [smmlv=SMMLV_2026.value] - Applicable SMMLV in COP.
 * @param {number} [auxTransporte=AUXILIO_TRANSPORTE_2026.value] - Applicable monthly transportation allowance in COP.
 * @returns {number} Net annual compensation for employee in COP.
 */
export function anualEmpleado(
  salario,
  integral = false,
  smmlv = SMMLV_2026.value,
  auxTransporte = AUXILIO_TRANSPORTE_2026.value,
) {
  if (!salario || salario <= 0 || !Number.isFinite(salario)) {
    return 0;
  }

  const safeSmmlv = smmlv && smmlv > 0 ? smmlv : SMMLV_2026.value;
  const safeAuxTransporte = auxTransporte && auxTransporte >= 0 ? auxTransporte : AUXILIO_TRANSPORTE_2026.value;

  if (integral) {
    const integralContributionRate = (1 - FACTOR_PRESTACIONAL_INTEGRAL.value) * APORTE_EMPLEADO.value;
    return 12 * salario * (1 - integralContributionRate);
  }

  const employeeRetentionNetRate = 1 - APORTE_EMPLEADO.value;
  const multiplier = 12 * employeeRetentionNetRate + 1 + 1 + INTERESES_CESANTIAS.value;
  const transportAllowance = salario <= 2 * safeSmmlv ? 12 * safeAuxTransporte : 0;

  return multiplier * salario + transportAllowance;
}

/**
 * Calculates net annual income for an independent contractor.
 *
 * Formula: B * M * (1 - 0.40 * (0.125 + 0.16 + 0.00522) - costoCambio)
 * Where:
 * - B = Monthly gross billing in COP.
 * - M = Number of billable months in the year.
 * - 0.40 * (salud + pensión + arl) = independent social security effective rate (~11.6%).
 * - costoCambio = foreign exchange spread / international transfer fee.
 *
 * @param {number} cobroMensualCOP - Monthly billing in COP.
 * @param {number} mesesFacturables - Billable months per year (M).
 * @param {number} [costoCambio=COSTO_CAMBIO_DEFAULT.value] - Exchange spread fraction.
 * @returns {number} Net annual contractor income in COP.
 */
export function netoIndependiente(
  cobroMensualCOP,
  mesesFacturables,
  costoCambio = COSTO_CAMBIO_DEFAULT.value,
) {
  if (
    !cobroMensualCOP ||
    cobroMensualCOP <= 0 ||
    !mesesFacturables ||
    mesesFacturables <= 0 ||
    !Number.isFinite(cobroMensualCOP) ||
    !Number.isFinite(mesesFacturables)
  ) {
    return 0;
  }

  const ssRate =
    IBC_INDEPENDIENTE.value *
    (SALUD_INDEPENDIENTE.value + PENSION_INDEPENDIENTE.value + ARL_INDEPENDIENTE.value);
  const safeCostoCambio = Number.isFinite(costoCambio) && costoCambio >= 0 ? costoCambio : COSTO_CAMBIO_DEFAULT.value;
  const netFactor = 1 - ssRate - safeCostoCambio;

  return cobroMensualCOP * mesesFacturables * netFactor;
}

/**
 * Determines whether an individual is obligated to file an annual income tax return in Colombia.
 * Per Art. 592 of the Tax Statute, filing is mandatory if annual gross income >= 1,400 UVT.
 *
 * @param {number} ingresoAnual - Annual gross income in COP.
 * @param {number} [uvt=UVT_2026.value] - Applicable UVT value in COP.
 * @returns {boolean} True if obligated to declare income tax, false otherwise.
 */
export function obligadoADeclarar(ingresoAnual, uvt = UVT_2026.value) {
  if (!ingresoAnual || ingresoAnual <= 0 || !Number.isFinite(ingresoAnual)) {
    return false;
  }
  const safeUvt = uvt && uvt > 0 ? uvt : UVT_2026.value;
  return ingresoAnual >= TOPE_DECLARAR_UVT.value * safeUvt;
}

/**
 * Main conversion and comparison engine between Colombian employee salary (COP)
 * and international independent contractor fees (USD).
 *
 * @param {Object} options - Calculation configuration.
 * @param {'cop-to-usd'|'usd-to-cop'} [options.modo='cop-to-usd'] - Conversion mode.
 * @param {number} options.monto - Amount to convert (salary in COP or fee in USD).
 * @param {boolean} [options.vacacionesPagas=true] - Whether contractor vacations are compensated.
 * @param {number} [options.diasVacaciones=15] - Vacation days per year.
 * @param {boolean} [options.despuesDeRetencion=false] - Whether to equalize net income after withholding/provisioning.
 * @param {number} [options.trm=TRM_DEFAULT.value] - Exchange rate (COP per USD).
 * @param {number} [options.costoCambio=COSTO_CAMBIO_DEFAULT.value] - Foreign exchange fee fraction.
 * @param {boolean} [options.integral=false] - Whether the employment is salario integral.
 * @param {number} [options.uvt=UVT_2026.value] - UVT value in COP.
 * @param {number} [options.smmlv=SMMLV_2026.value] - Minimum wage (SMMLV) in COP.
 * @param {number} [options.auxTransporte=AUXILIO_TRANSPORTE_2026.value] - Transportation allowance in COP.
 * @returns {Object} Comprehensive calculation results comparing employee vs independent.
 */
export function calcular({
  modo = 'cop-to-usd',
  monto = 0,
  vacacionesPagas = true,
  diasVacaciones = DIAS_VACACIONES_DEFAULT.value,
  despuesDeRetencion = false,
  trm = TRM_DEFAULT.value,
  costoCambio = COSTO_CAMBIO_DEFAULT.value,
  integral = false,
  uvt = UVT_2026.value,
  smmlv = SMMLV_2026.value,
  auxTransporte = AUXILIO_TRANSPORTE_2026.value,
} = {}) {
  const safeTrm = trm && trm > 0 ? trm : TRM_DEFAULT.value;
  const safeCostoCambio = Number.isFinite(costoCambio) && costoCambio >= 0 ? costoCambio : COSTO_CAMBIO_DEFAULT.value;
  const safeUvt = uvt && uvt > 0 ? uvt : UVT_2026.value;
  const safeSmmlv = smmlv && smmlv > 0 ? smmlv : SMMLV_2026.value;
  const safeAuxTransporte = auxTransporte && auxTransporte >= 0 ? auxTransporte : AUXILIO_TRANSPORTE_2026.value;
  const safeDiasVacaciones = Number.isFinite(diasVacaciones) && diasVacaciones >= 0 ? diasVacaciones : DIAS_VACACIONES_DEFAULT.value;

  // Billable months M per year
  const workingDaysPerMonth = DIAS_HABILES_MES.value;
  const billableMonths = vacacionesPagas
    ? 12
    : Math.max(0, 12 - safeDiasVacaciones / workingDaysPerMonth);

  // Social security contribution rates
  const independentSSRate =
    IBC_INDEPENDIENTE.value *
    (SALUD_INDEPENDIENTE.value + PENSION_INDEPENDIENTE.value + ARL_INDEPENDIENTE.value);

  const employeeContributionRate = integral
    ? (1 - FACTOR_PRESTACIONAL_INTEGRAL.value) * APORTE_EMPLEADO.value
    : APORTE_EMPLEADO.value;

  let salarioMensual = 0;
  let cobroMensualCOP = 0;
  let cobroMensualUSD = 0;
  let retencionEmpleado = 0;
  let provisionIndependiente = 0;
  let aportesMensuales = 0;
  let factor = 0;

  const numericMonto = Number(monto);
  if (!numericMonto || numericMonto <= 0 || !Number.isFinite(numericMonto)) {
    return {
      equivalenteCOP: 0,
      equivalenteUSD: 0,
      factor: 0,
      empleado: {
        salarioMensual: 0,
        ingresoAnual: 0,
        aportesMensuales: 0,
      },
      independiente: {
        cobroMensualCOP: 0,
        cobroMensualUSD: 0,
        ingresoAnual: 0,
        seguridadSocialMensual: 0,
        costosCambioMensual: 0,
      },
      retencionEmpleado: 0,
      provisionIndependiente: 0,
      obligadoADeclarar: false,
    };
  }

  if (modo === 'cop-to-usd') {
    salarioMensual = numericMonto;
    aportesMensuales = salarioMensual * employeeContributionRate;
    retencionEmpleado = retencionMensual(salarioMensual, aportesMensuales, safeUvt);

    const employeeAnnualNet = anualEmpleado(salarioMensual, integral, safeSmmlv, safeAuxTransporte);
    const targetAnnualNet = despuesDeRetencion
      ? employeeAnnualNet - 12 * retencionEmpleado
      : employeeAnnualNet;

    if (!despuesDeRetencion) {
      const netFactor = 1 - independentSSRate - safeCostoCambio;
      cobroMensualCOP = billableMonths > 0 && netFactor > 0
        ? targetAnnualNet / (billableMonths * netFactor)
        : 0;
    } else {
      // Binary search to solve:
      // netoIndependiente(B, billableMonths, safeCostoCambio) - billableMonths * provisionIndependiente(B) === targetAnnualNet
      let low = 0;
      let high = Math.max(targetAnnualNet * 2, 1000);
      const evalIndependentNet = (candidateB) => {
        const netBase = netoIndependiente(candidateB, billableMonths, safeCostoCambio);
        const candidateSS = candidateB * independentSSRate;
        const prov = retencionMensual(candidateB, candidateSS, safeUvt);
        return netBase - billableMonths * prov;
      };

      while (evalIndependentNet(high) < targetAnnualNet) {
        high *= 2;
      }

      for (let i = 0; i < 60; i++) {
        const mid = (low + high) / 2;
        if (evalIndependentNet(mid) < targetAnnualNet) {
          low = mid;
        } else {
          high = mid;
        }
      }
      cobroMensualCOP = (low + high) / 2;
    }

    cobroMensualUSD = cobroMensualCOP / safeTrm;
    factor = salarioMensual > 0 ? cobroMensualCOP / salarioMensual : 0;
    const independentSS = cobroMensualCOP * independentSSRate;
    provisionIndependiente = retencionMensual(cobroMensualCOP, independentSS, safeUvt);

    const independienteIngresoAnual = cobroMensualCOP * billableMonths;
    const isObligado = obligadoADeclarar(independienteIngresoAnual, safeUvt);

    return {
      equivalenteCOP: cobroMensualCOP,
      equivalenteUSD: cobroMensualUSD,
      factor,
      empleado: {
        salarioMensual,
        ingresoAnual: employeeAnnualNet,
        aportesMensuales,
      },
      independiente: {
        cobroMensualCOP,
        cobroMensualUSD,
        ingresoAnual: independienteIngresoAnual,
        seguridadSocialMensual: independentSS,
        costosCambioMensual: cobroMensualCOP * safeCostoCambio,
      },
      retencionEmpleado,
      provisionIndependiente,
      obligadoADeclarar: isObligado,
    };
  } else {
    // modo === 'usd-to-cop'
    cobroMensualUSD = numericMonto;
    cobroMensualCOP = cobroMensualUSD * safeTrm;

    const independentSS = cobroMensualCOP * independentSSRate;
    provisionIndependiente = retencionMensual(cobroMensualCOP, independentSS, safeUvt);

    const independentAnnualNet = netoIndependiente(cobroMensualCOP, billableMonths, safeCostoCambio);
    const targetAnnualNet = despuesDeRetencion
      ? independentAnnualNet - billableMonths * provisionIndependiente
      : independentAnnualNet;

    if (!despuesDeRetencion) {
      if (integral) {
        const integralFactor = 12 * (1 - employeeContributionRate);
        salarioMensual = integralFactor > 0 ? targetAnnualNet / integralFactor : 0;
      } else {
        const standardFactor =
          12 * (1 - APORTE_EMPLEADO.value) + 1 + 1 + INTERESES_CESANTIAS.value; // 13.16
        const preliminarySalary = targetAnnualNet / standardFactor;
        if (preliminarySalary <= 2 * safeSmmlv) {
          salarioMensual = Math.max(0, (targetAnnualNet - 12 * safeAuxTransporte) / standardFactor);
        } else {
          salarioMensual = preliminarySalary;
        }
      }
    } else {
      // Binary search to solve:
      // anualEmpleado(S, integral, safeSmmlv, safeAuxTransporte) - 12 * retencionEmpleado(S) === targetAnnualNet
      let low = 0;
      let high = Math.max(targetAnnualNet * 2, 1000);
      const evalEmployeeNet = (candidateS) => {
        const netBase = anualEmpleado(candidateS, integral, safeSmmlv, safeAuxTransporte);
        const candidateAportes = candidateS * employeeContributionRate;
        const ret = retencionMensual(candidateS, candidateAportes, safeUvt);
        return netBase - 12 * ret;
      };

      while (evalEmployeeNet(high) < targetAnnualNet) {
        high *= 2;
      }

      for (let i = 0; i < 60; i++) {
        const mid = (low + high) / 2;
        if (evalEmployeeNet(mid) < targetAnnualNet) {
          low = mid;
        } else {
          high = mid;
        }
      }
      salarioMensual = (low + high) / 2;
    }

    aportesMensuales = salarioMensual * employeeContributionRate;
    retencionEmpleado = retencionMensual(salarioMensual, aportesMensuales, safeUvt);
    factor = salarioMensual > 0 ? cobroMensualCOP / salarioMensual : 0;

    const employeeAnnualNet = anualEmpleado(salarioMensual, integral, safeSmmlv, safeAuxTransporte);
    const independienteIngresoAnual = cobroMensualCOP * billableMonths;
    const isObligado = obligadoADeclarar(independienteIngresoAnual, safeUvt);

    return {
      equivalenteCOP: salarioMensual,
      equivalenteUSD: salarioMensual / safeTrm,
      factor,
      empleado: {
        salarioMensual,
        ingresoAnual: employeeAnnualNet,
        aportesMensuales,
      },
      independiente: {
        cobroMensualCOP,
        cobroMensualUSD,
        ingresoAnual: independienteIngresoAnual,
        seguridadSocialMensual: independentSS,
        costosCambioMensual: cobroMensualCOP * safeCostoCambio,
      },
      retencionEmpleado,
      provisionIndependiente,
      obligadoADeclarar: isObligado,
    };
  }
}
