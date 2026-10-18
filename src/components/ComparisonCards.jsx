import { textos } from '../content/textos';
import { formatCOP, formatUSD } from '../hooks/useCalculator';

export default function ComparisonCards({ result, isIntegral, trm }) {
  const { empleado, independiente } = result;

  // Monthly values for clear comparison
  const empleadoSalario = empleado.salarioMensual || 0;
  const empleadoSalud = Math.round(empleado.aportesMensuales / 2);
  const empleadoPension = Math.round(empleado.aportesMensuales / 2);
  const empleadoPrimaMensual = isIntegral ? 0 : Math.round(empleadoSalario / 12);
  const empleadoCesantiasMensual = isIntegral ? 0 : Math.round(empleadoSalario / 12);
  const empleadoInteresesMensual = isIntegral ? 0 : Math.round((empleadoSalario * 0.12) / 12);
  const empleadoNetoMensual = Math.max(0, empleadoSalario - empleado.aportesMensuales);

  const independienteCobroCOP = independiente.cobroMensualCOP || 0;
  const independienteCobroUSD = independiente.cobroMensualUSD || 0;
  const independienteSeguridadSocial = independiente.seguridadSocialMensual || 0;
  const independienteCostoCambio = independiente.costosCambioMensual || 0;
  const independienteDeduccionesTotal = independienteSeguridadSocial + independienteCostoCambio;
  const independienteNetoMensual = Math.max(0, independienteCobroCOP - independienteDeduccionesTotal);

  // Annual visual bar calculation
  const maxAnnual = Math.max(empleado.ingresoAnual, independiente.ingresoAnual, 1);
  const empleadoPercent = Math.min(100, Math.round((empleado.ingresoAnual / maxAnnual) * 100));
  const independientePercent = Math.min(100, Math.round((independiente.ingresoAnual / maxAnnual) * 100));

  return (
    <section className="py-8 sm:py-12" id="comparacion">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {textos.comparison.title}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
            {textos.comparison.subtitle}
          </p>
        </div>

        {/* Side-by-side cards (stacked on mobile) */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Empleado Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      👔
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {textos.comparison.empleado}
                    </h3>
                  </div>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    {textos.comparison.empleadoBadge}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Salario base</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatCOP(empleadoSalario)}
                  </span>
                </div>
              </div>

              {/* What you receive (Green section) */}
              <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4 dark:border-emerald-500/20 dark:bg-emerald-950/20">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {textos.comparison.loQueRecibes} (Prestaciones laborales)
                </div>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm">
                  <li className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>{textos.comparison.salarioMensual}</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {formatCOP(empleadoSalario)}
                    </span>
                  </li>
                  <li className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span className="text-slate-600 dark:text-slate-400">
                      {isIntegral ? 'Factor prestacional (incluido)' : textos.comparison.prima}
                    </span>
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">
                      {isIntegral ? 'Incluido' : `+ ${formatCOP(empleadoPrimaMensual)}/mes`}
                    </span>
                  </li>
                  <li className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span className="text-slate-600 dark:text-slate-400">
                      {isIntegral ? 'Cesantías (compensadas)' : textos.comparison.cesantias}
                    </span>
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">
                      {isIntegral ? 'Incluido' : `+ ${formatCOP(empleadoCesantiasMensual)}/mes`}
                    </span>
                  </li>
                  <li className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span className="text-slate-600 dark:text-slate-400">
                      {isIntegral ? 'Intereses (compensados)' : textos.comparison.interesesCesantias}
                    </span>
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">
                      {isIntegral ? 'Incluido' : `+ ${formatCOP(empleadoInteresesMensual)}/mes`}
                    </span>
                  </li>
                  <li className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span className="text-slate-600 dark:text-slate-400">
                      {textos.comparison.vacacionesPagas}
                    </span>
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">
                      Remuneradas
                    </span>
                  </li>
                </ul>
              </div>

              {/* What you pay (Gray section) */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  {textos.comparison.loQuePagas} (Deducciones nómina)
                </div>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm">
                  <li className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>{textos.comparison.aportesSalud}</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      - {formatCOP(empleadoSalud)}
                    </span>
                  </li>
                  <li className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>{textos.comparison.aportesPension}</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      - {formatCOP(empleadoPension)}
                    </span>
                  </li>
                  <li className="flex justify-between border-t border-slate-200 pt-2 font-medium text-slate-900 dark:border-slate-700 dark:text-white">
                    <span>Total descuentos obligatorios</span>
                    <span className="text-slate-600 dark:text-slate-400">
                      - {formatCOP(empleado.aportesMensuales)}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Annual Income Footer */}
            <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {textos.comparison.netoDeBolsillo}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatCOP(empleadoNetoMensual)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-100 px-3.5 py-2.5 dark:bg-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {textos.comparison.ingresoAnual}
                </span>
                <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                  {formatCOP(empleado.ingresoAnual)}
                </span>
              </div>
            </div>
          </div>

          {/* Independiente Card */}
          <div className="flex flex-col justify-between rounded-3xl border-2 border-emerald-500/40 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-emerald-500/30 dark:bg-slate-900">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      🌐
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {textos.comparison.independiente}
                    </h3>
                  </div>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    {textos.comparison.independienteBadge}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Cobro bruto</span>
                  <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    {formatUSD(independienteCobroUSD)}
                  </span>
                </div>
              </div>

              {/* What you receive (Green section) */}
              <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4 dark:border-emerald-500/20 dark:bg-emerald-950/20">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {textos.comparison.loQueRecibes} (Facturación neta cliente)
                </div>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm">
                  <li className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>{textos.comparison.cobroMensual} (USD)</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {formatUSD(independienteCobroUSD)}
                    </span>
                  </li>
                  <li className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Conversión en COP (TRM {formatCOP(trm)})</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {formatCOP(independienteCobroCOP)}
                    </span>
                  </li>
                  <li className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span className="text-slate-600 dark:text-slate-400">Prima / Cesantías</span>
                    <span className="font-medium text-slate-500 dark:text-slate-400">
                      No aplican (las asume tu tarifa)
                    </span>
                  </li>
                  <li className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span className="text-slate-600 dark:text-slate-400">Factor de compensación</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {result.factor.toLocaleString('es-CO')}x
                    </span>
                  </li>
                </ul>
              </div>

              {/* What you pay (Gray section) */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  {textos.comparison.loQuePagas} (Costos asumidos directamente)
                </div>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm">
                  <li className="flex justify-between text-slate-700 dark:text-slate-300">
                    <div>
                      <span>{textos.comparison.seguridadSocial}</span>
                      <span className="block text-[11px] text-slate-500">
                        Pensión 16% + Salud 12.5% + ARL s/ 40% IBC
                      </span>
                    </div>
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      - {formatCOP(independienteSeguridadSocial)}
                    </span>
                  </li>
                  <li className="flex justify-between text-slate-700 dark:text-slate-300 pt-1">
                    <div>
                      <span>{textos.comparison.costoCambio}</span>
                      <span className="block text-[11px] text-slate-500">
                        Spread bancario / plataformas
                      </span>
                    </div>
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      - {formatCOP(independienteCostoCambio)}
                    </span>
                  </li>
                  <li className="flex justify-between border-t border-slate-200 pt-2 font-medium text-slate-900 dark:border-slate-700 dark:text-white">
                    <span>Total deducciones mensuales</span>
                    <span className="text-slate-600 dark:text-slate-400">
                      - {formatCOP(independienteDeduccionesTotal)}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Annual Income Footer */}
            <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {textos.comparison.netoDeBolsillo}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatCOP(independienteNetoMensual)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-xl bg-emerald-500/10 px-3.5 py-2.5 dark:bg-emerald-950/40">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {textos.comparison.ingresoAnual}
                </span>
                <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                  {formatCOP(independiente.ingresoAnual)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Comparison Bar */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {textos.comparison.barraComparativa}
          </h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Comparativa gráfica de ingresos brutos anuales para alcanzar paridad real de bolsillo.
          </p>

          <div className="mt-4 space-y-3">
            {/* Empleado bar */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
                  {textos.comparison.empleado}
                </span>
                <span className="font-bold">{formatCOP(empleado.ingresoAnual)}</span>
              </div>
              <div className="h-3.5 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-slate-500 transition-all duration-500"
                  style={{ width: `${empleadoPercent}%` }}
                />
              </div>
            </div>

            {/* Independiente bar */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  {textos.comparison.independiente}
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {formatCOP(independiente.ingresoAnual)}
                </span>
              </div>
              <div className="h-3.5 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                  style={{ width: `${independientePercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
