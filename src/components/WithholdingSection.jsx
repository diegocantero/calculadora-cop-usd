import { textos } from '../content/textos';
import { formatCOP } from '../hooks/useCalculator';

export default function WithholdingSection({
  result,
  compareAfterWithholding,
  setCompareAfterWithholding,
}) {
  const { empleado, independiente, retencionEmpleado, provisionIndependiente } = result;

  // Calculate net after withholding
  const empleadoNetoAntesRetencion = Math.max(0, empleado.salarioMensual - empleado.aportesMensuales);
  const empleadoNetoFinal = Math.max(0, empleadoNetoAntesRetencion - retencionEmpleado);

  const deduccionesIndependiente =
    (independiente.seguridadSocialMensual || 0) + (independiente.costosCambioMensual || 0);
  const independienteNetoAntesProvision = Math.max(
    0,
    independiente.cobroMensualCOP - deduccionesIndependiente
  );
  const independienteNetoFinal = Math.max(
    0,
    independienteNetoAntesProvision - provisionIndependiente
  );

  return (
    <section className="py-8 sm:py-10" id="retencion">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  🏛️
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {textos.retencion.title}
                </h3>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                {textos.retencion.subtitle}
              </p>
            </div>

            {/* Switch: Comparar después de retención */}
            <div className="flex items-center">
              <label
                htmlFor="withholding-switch"
                className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                <div className="relative inline-flex items-center">
                  <input
                    id="withholding-switch"
                    type="checkbox"
                    checked={compareAfterWithholding}
                    onChange={(e) => setCompareAfterWithholding(e.target.checked)}
                    className="peer sr-only"
                    role="switch"
                    aria-checked={compareAfterWithholding}
                  />
                  <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-emerald-600 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500 peer-focus-visible:ring-offset-2 dark:bg-slate-700" />
                  <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5 shadow-sm" />
                </div>
                <span>{textos.retencion.switch}</span>
              </label>
            </div>
          </div>

          {/* Side-by-side withholding boxes */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Empleado Withholding */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {textos.comparison.empleado}
              </div>
              <div className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                {textos.retencion.empleado}:
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl dark:text-white">
                ≈ {formatCOP(retencionEmpleado)}{' '}
                <span className="text-xs font-medium text-slate-500">{textos.retencion.porMes}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Calculada automáticamente por tu empleador sobre la tabla de retención en la fuente (Art. 383 E.T.).
              </p>

              {compareAfterWithholding && (
                <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-700">
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                    <span>Neto mensual en cuenta:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {formatCOP(empleadoNetoFinal)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Independiente Provision */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 dark:border-amber-500/20 dark:bg-amber-950/20">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                {textos.comparison.independiente}
              </div>
              <div className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                {textos.retencion.independiente}:
              </div>
              <div className="mt-2 text-2xl font-black text-amber-700 sm:text-3xl dark:text-amber-400">
                ≈ {formatCOP(provisionIndependiente)}{' '}
                <span className="text-xs font-medium text-slate-500">{textos.retencion.porMes}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Tu cliente en el exterior no retiene impuestos colombianos. Debes separar este monto cada mes para cuando declares renta.
              </p>

              {compareAfterWithholding && (
                <div className="mt-4 border-t border-amber-500/20 pt-3 dark:border-amber-500/20">
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                    <span>Neto mensual libre tras impuestos:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {formatCOP(independienteNetoFinal)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Explanation Footer Note */}
          <div className="mt-5 rounded-xl bg-slate-100 p-4 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
            <p>
              💡 <strong>Nota tributaria:</strong> {textos.retencion.explicacion}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
