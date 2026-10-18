import { useState } from 'react';
import { textos } from '../content/textos';
import { formatCOP } from '../hooks/useCalculator';

export default function AdvancedSettings({
  trm,
  setTrm,
  exchangeCostPct,
  setExchangeCostPct,
  uvt,
  setUvt,
  isIntegral,
  setIsIntegral,
  resetDefaults,
  defaults,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const smmlv2026 = defaults.smmlv || 1423500;
  const umbralIntegral = smmlv2026 * 13;
  const umbralTransporte = smmlv2026 * 2;

  return (
    <section className="py-6" id="ajustes">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
          {/* Header Accordion Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            className="flex w-full min-h-[58px] items-center justify-between p-5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-lg dark:bg-slate-800">
                ⚙️
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">
                  {textos.avanzado.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {textos.avanzado.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {isOpen ? 'Ocultar ajustes' : 'Editar parámetros'}
              </span>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 transition-transform duration-200 dark:bg-slate-800 dark:text-slate-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </div>
          </button>

          {/* Form Fields Content */}
          {isOpen && (
            <div className="border-t border-slate-200 p-5 sm:p-6 dark:border-slate-800">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* TRM Field */}
                <div>
                  <label
                    htmlFor="trm-input"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    {textos.avanzado.trm}
                  </label>
                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-semibold text-slate-400">
                      $
                    </span>
                    <input
                      id="trm-input"
                      type="number"
                      step="10"
                      min="2000"
                      max="10000"
                      value={trm}
                      onChange={(e) => setTrm(Number(e.target.value) || 4000)}
                      className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white py-2 pl-8 pr-4 text-sm font-semibold text-slate-900 shadow-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <span className="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">
                    Por defecto: ${defaults.trm.toLocaleString('es-CO')}
                  </span>
                </div>

                {/* Exchange Cost % Field */}
                <div>
                  <label
                    htmlFor="exchange-cost-input"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    {textos.avanzado.costoCambio}
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="exchange-cost-input"
                      type="number"
                      step="0.1"
                      min="0"
                      max="15"
                      value={exchangeCostPct}
                      onChange={(e) => setExchangeCostPct(Number(e.target.value) || 0)}
                      className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white py-2 pl-4 pr-9 text-sm font-semibold text-slate-900 shadow-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-sm font-semibold text-slate-400">
                      %
                    </span>
                  </div>
                  <span className="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">
                    Comisión por retiro y spread cambiario (Promedio: 1.5% - 3.5%)
                  </span>
                </div>

                {/* UVT Value Field */}
                <div>
                  <label
                    htmlFor="uvt-input"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    {textos.avanzado.uvt}
                  </label>
                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-semibold text-slate-400">
                      $
                    </span>
                    <input
                      id="uvt-input"
                      type="number"
                      step="500"
                      value={uvt}
                      onChange={(e) => setUvt(Number(e.target.value) || defaults.uvt)}
                      className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white py-2 pl-8 pr-4 text-sm font-semibold text-slate-900 shadow-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <span className="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">
                    Unidad de Valor Tributario oficial fijada por la DIAN
                  </span>
                </div>

                {/* Salario Integral Toggle */}
                <div className="flex flex-col justify-center">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Modalidad laboral
                  </span>
                  <label
                    htmlFor="integral-switch"
                    className="mt-2.5 flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <div className="relative inline-flex items-center">
                      <input
                        id="integral-switch"
                        type="checkbox"
                        checked={isIntegral}
                        onChange={(e) => setIsIntegral(e.target.checked)}
                        className="peer sr-only"
                        role="switch"
                        aria-checked={isIntegral}
                      />
                      <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-emerald-600 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500 peer-focus-visible:ring-offset-2 dark:bg-slate-700" />
                      <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5 shadow-sm" />
                    </div>
                    <span>{textos.avanzado.integral}</span>
                  </label>
                  <span className="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">
                    Aplica desde 13 SMMLV (≥ {formatCOP(umbralIntegral)}/mes)
                  </span>
                </div>
              </div>

              {/* Informational Notes on SMMLV, Integral, and Transport Allowance */}
              <div className="mt-6 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <p>
                    <strong>Salario Integral:</strong> {textos.avanzado.avisoIntegral} Umbral mínimo legal: <strong>{formatCOP(umbralIntegral)}</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <p>
                    <strong>Auxilio de transporte:</strong> {textos.avanzado.avisoTransporte} Tope máximo legal para devengarlo: <strong>{formatCOP(umbralTransporte)}</strong> (2 SMMLV).
                  </p>
                </div>
              </div>

              {/* Reset to Defaults Button */}
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={resetDefaults}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <span>↺</span>
                  <span>{textos.avanzado.restablecerValores}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
