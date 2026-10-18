/**
 * Tax, legal, and operational configuration constants for Colombia COP <-> USD calculator.
 * All constants include provenance metadata: { value, year, verified, source }.
 */

/**
 * UVT (Unidad de Valor Tributario) for tax year 2026.
 */
export const UVT_2026 = {
  value: 52374,
  year: 2026,
  verified: true,
  source: 'https://www.dian.gov.co/',
  description: 'Unidad de Valor Tributario fijada por la DIAN para el año gravable 2026.',
};

/**
 * Annual gross income threshold in UVT requiring an individual to file an income tax return (Art. 592 ET).
 */
export const TOPE_DECLARAR_UVT = {
  value: 1400,
  year: 2026,
  verified: true,
  source: 'https://estatuto.co/592',
  description: 'Umbral de ingresos brutos anuales en UVT para estar obligado a declarar renta (Art. 592 Estatuto Tributario).',
};

/**
 * Mandatory social security contribution rate for employees: 4% health + 4% pension (Ley 100 de 1993).
 */
export const APORTE_EMPLEADO = {
  value: 0.08,
  year: 2026,
  verified: true,
  source: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=5248',
  description: 'Aporte obligatorio del empleado a seguridad social: 4% salud + 4% pensión.',
};

/**
 * Annual mandatory interest rate on severance payments (cesantías) payable to employees (Ley 52 de 1975).
 */
export const INTERESES_CESANTIAS = {
  value: 0.12,
  year: 2026,
  verified: true,
  source: 'https://estatuto.co/ley-52-1975',
  description: 'Intereses sobre cesantías obligatorios (12% anual acumulado).',
};

/**
 * Independent contractor contribution base factor (Ingreso Base de Cotización - IBC) per Art. 89 Ley 2277 de 2022.
 */
export const IBC_INDEPENDIENTE = {
  value: 0.40,
  year: 2026,
  verified: true,
  source: 'https://estatuto.co/ley-2277-2022',
  description: 'Porcentaje base de cotización (IBC) para independientes (40% de los ingresos brutos).',
};

/**
 * Mandatory health contribution rate for independent contractors (12.5% of IBC).
 */
export const SALUD_INDEPENDIENTE = {
  value: 0.125,
  year: 2026,
  verified: true,
  source: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=5248',
  description: 'Tarifa obligatoria de salud para independientes (12.5% del IBC).',
};

/**
 * Mandatory pension contribution rate for independent contractors (16.0% of IBC).
 */
export const PENSION_INDEPENDIENTE = {
  value: 0.16,
  year: 2026,
  verified: true,
  source: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=5248',
  description: 'Tarifa obligatoria de pensión para independientes (16% del IBC).',
};

/**
 * Occupational risk insurance rate (ARL) for independent contractors under Risk Class I (0.522% of IBC).
 */
export const ARL_INDEPENDIENTE = {
  value: 0.00522,
  year: 2026,
  verified: true,
  source: 'https://estatuto.co/decreto-1772-1994',
  description: 'Tarifa de ARL para independientes en Riesgo Tipo I (0.522% del IBC).',
};

/**
 * Default foreign exchange and international transfer spread (3.0%).
 */
export const COSTO_CAMBIO_DEFAULT = {
  value: 0.03,
  year: 2026,
  verified: true,
  source: 'Promedio plataformas internacionales (Wise, Payoneer, banca colombiana)',
  description: 'Spread cambiario y comisión estimada de transferencia internacional.',
};

/**
 * Default reference exchange rate (TRM) in COP per USD.
 */
export const TRM_DEFAULT = {
  value: 4000,
  year: 2026,
  verified: true,
  source: 'https://www.superfinanciera.gov.co/publicacion/60819',
  description: 'Tasa Representativa del Mercado (TRM) de referencia.',
};

/**
 * Statutory Minimum Legal Monthly Wage (SMMLV) in Colombia for 2026.
 */
export const SMMLV_2026 = {
  value: 1423500,
  year: 2026,
  verified: true,
  source: 'Decreto de Salario Mínimo Mensual Legal Vigente',
  description: 'Salario Mínimo Mensual Legal Vigente (SMMLV).',
};

/**
 * Statutory transportation allowance (auxilio de transporte) for employees earning up to 2 SMMLV.
 */
export const AUXILIO_TRANSPORTE_2026 = {
  value: 200000,
  year: 2026,
  verified: true,
  source: 'Decreto de Auxilio de Transporte',
  description: 'Auxilio legal de transporte mensual para salarios de hasta 2 SMMLV.',
};

/**
 * Minimum SMMLV multiplier required to qualify for an integral salary (Art. 132 CST: 10 salary + 3 benefits).
 */
export const SALARIO_INTEGRAL_TOPE = {
  value: 13,
  year: 2026,
  verified: true,
  source: 'https://estatuto.co/cst/132',
  description: 'Tope mínimo en SMMLV para pactar salario integral (10 SMMLV base + 3 SMMLV prestacional).',
};

/**
 * Statutory benefit factor exempt from social security deductions in an integral salary (30% per Art. 132 CST).
 */
export const FACTOR_PRESTACIONAL_INTEGRAL = {
  value: 0.30,
  year: 2026,
  verified: true,
  source: 'https://estatuto.co/cst/132',
  description: 'Factor prestacional mínimo del salario integral (30% exento de cotización a seguridad social).',
};

/**
 * Average number of working business days per calendar month.
 */
export const DIAS_HABILES_MES = {
  value: 21,
  year: 2026,
  verified: true,
  source: 'Estándar laboral en Colombia',
  description: 'Días hábiles promedio por mes.',
};

/**
 * Statutory annual paid vacation days for employees (Art. 186 CST).
 */
export const DIAS_VACACIONES_DEFAULT = {
  value: 15,
  year: 2026,
  verified: true,
  source: 'https://estatuto.co/cst/186',
  description: 'Días hábiles de vacaciones remuneradas por año de servicio.',
};

/**
 * Percentage of net labor income exempt from income tax (Art. 206 numeral 10 ET).
 */
export const EXENCION_LABORAL_PORCENTAJE = {
  value: 0.25,
  year: 2026,
  verified: true,
  source: 'https://estatuto.co/206',
  description: 'Porcentaje de renta exenta laboral sobre el ingreso neto depurado (25%).',
};

/**
 * Annual ceiling in UVT for the 25% exempt labor income deduction (Art. 206 numeral 10 ET: 790 UVT/year).
 */
export const EXENCION_LABORAL_LIMITE_UVT = {
  value: 790,
  year: 2026,
  verified: true,
  source: 'https://estatuto.co/206',
  description: 'Límite anual máximo en UVT para la exención del 25% laboral.',
};

/**
 * Maximum global percentage cap on combined deductions and exempt income (Art. 336 ET: 40%).
 */
export const DEDUCCIONES_TOTALES_PORCENTAJE = {
  value: 0.40,
  year: 2026,
  verified: true,
  source: 'https://estatuto.co/336',
  description: 'Límite conjunto del 40% del ingreso neto para deducciones y rentas exentas.',
};

/**
 * Maximum annual global cap in UVT on combined deductions and exempt income (Art. 336 ET: 1,340 UVT/year).
 */
export const DEDUCCIONES_TOTALES_LIMITE_UVT = {
  value: 1340,
  year: 2026,
  verified: true,
  source: 'https://estatuto.co/336',
  description: 'Límite anual máximo conjunto en UVT para deducciones y rentas exentas.',
};

/**
 * Progressive monthly withholding tax brackets under Art. 383 of the Colombian Tax Statute (Estatuto Tributario).
 */
export const RETENCION_TABLA_383 = {
  year: 2026,
  verified: true,
  source: 'https://estatuto.co/383',
  description: 'Tabla de retención en la fuente para ingresos laborales y de independientes.',
  value: [
    { minUVT: 0, maxUVT: 95, marginalRate: 0, additionalUVT: 0 },
    { minUVT: 95, maxUVT: 150, marginalRate: 0.19, additionalUVT: 0 },
    { minUVT: 150, maxUVT: 360, marginalRate: 0.28, additionalUVT: 10 },
    { minUVT: 360, maxUVT: 640, marginalRate: 0.33, additionalUVT: 69 },
    { minUVT: 640, maxUVT: 945, marginalRate: 0.35, additionalUVT: 162 },
    { minUVT: 945, maxUVT: 2300, marginalRate: 0.37, additionalUVT: 268 },
    { minUVT: 2300, maxUVT: Infinity, marginalRate: 0.39, additionalUVT: 770 },
  ],
};

/**
 * Reference table of allowable Colombian personal income tax reliefs and deductions.
 */
export const ALIVIOS_TRIBUTARIOS = [
  {
    name: 'Renta exenta laboral del 25%',
    limitUvt: 790,
    withinGlobalLimit: true,
    sourceUrl: 'https://estatuto.co/206',
    description: 'Exención del 25% sobre el ingreso neto laboral depurado (tope de 790 UVT anuales).',
  },
  {
    name: 'Intereses de crédito hipotecario o leasing habitacional',
    limitUvt: 1200,
    withinGlobalLimit: true,
    sourceUrl: 'https://estatuto.co/387',
    description: 'Deducción de intereses de vivienda hasta 100 UVT mensuales (1.200 UVT anuales).',
  },
  {
    name: 'Deducción por dependientes económicos',
    limitUvt: 384,
    withinGlobalLimit: true,
    sourceUrl: 'https://estatuto.co/387',
    description: 'Hasta el 10% del ingreso bruto, limitado a 32 UVT mensuales por dependiente (máx. 384 UVT anuales).',
  },
  {
    name: 'Medicina prepagada y seguros privados de salud',
    limitUvt: 192,
    withinGlobalLimit: true,
    sourceUrl: 'https://estatuto.co/387',
    description: 'Pagos de planes adicionales de salud y medicina prepagada hasta 16 UVT mensuales (192 UVT anuales).',
  },
  {
    name: 'Aportes voluntarios a fondos de pensiones y cuentas AFC',
    limitUvt: 3800,
    withinGlobalLimit: true,
    sourceUrl: 'https://estatuto.co/126-1',
    description: 'Aportes voluntarios hasta el 30% del ingreso tributario, con tope de 3.800 UVT anuales.',
  },
];
