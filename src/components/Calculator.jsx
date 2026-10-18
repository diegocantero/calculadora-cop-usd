import { useState } from 'react';
import { textos } from '../content/textos';
import { formatCOP, formatUSD, formatNumber } from '../hooks/useCalculator';

export default function Calculator({
  direction,
  setDirection,
  amount,
  setAmount,
  paidVacation,
  setPaidVacation,
  vacationDays,
  setVacationDays,
  result,
  trm,
}) {
  const [copied, setCopied] = useState(false);
  const displayValue = amount && amount > 0 ? formatNumber(amount) : '';

  const handleInputChange = (e) => {
    const raw = e.target.value;
    const cleanDigits = raw.replace(/\D/g, '');
    if (!cleanDigits) {
      setAmount(0);
      return;
    }
    const numericValue = parseInt(cleanDigits, 10);
    setAmount(numericValue);
  };

  const handleCopyResult = async () => {
    try {
      const summary =
        direction === 'copToUsd'
          ? `Para ganar lo mismo que un salario de ${formatCOP(result.empleado.salarioMensual)} como empleado en Colombia, debes cobrar ≈ ${formatUSD(result.equivalenteUSD)}/mes (${result.factor.toLocaleString('es-CO')}x tu salario) como independiente. Calculado con TRM ${formatCOP(trm)}.`
          : `Para una tarifa de ${formatUSD(amount)}/mes como contratista independiente en el exterior, el salario equivalente como empleado en Colombia es ≈ ${formatCOP(result.empleado.salarioMensual)}/mes. Calculado con TRM ${formatCOP(trm)}.`;

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(summary);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = summary;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.warn('Could not copy to clipboard:', err);
    }
  };

  const handleSetExample = (exampleValue) => {
    setAmount(exampleValue);
  };

  const isEmpty = !amount || amount <= 0;

  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-14 sm:pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Hero Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Parámetros fiscales 2026 • TRM oficial
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-white">
            {textos.hero.title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-400">
            {textos.hero.subtitle}
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="mt-8 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          {/* Direction Toggle Selector */}
          <div
            role="tablist"
            aria-label="Dirección de la conversión"
            className="grid grid-cols-1 gap-2 rounded-2xl bg-slate-100 p-1.5 sm:grid-cols-2 dark:bg-slate-800/80"
          >
            <button
              type="button"
              role="tab"
              aria-selected={direction === 'copToUsd'}
              onClick={() => {
                if (direction !== 'copToUsd') {
                  setDirection('copToUsd');
                  if (!amount || amount < 100000) setAmount(10000000);
                }
              }}
              className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                direction === 'copToUsd'
                  ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <span>🇨🇴 COP</span>
              <span className="text-slate-400">→</span>
              <span>🇺🇸 USD</span>
              <span className="hidden sm:inline text-xs opacity-75 font-normal">(Asalariado a Remoto)</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={direction === 'usdToCop'}
              onClick={() => {
                if (direction !== 'usdToCop') {
                  setDirection('usdToCop');
                  if (!amount || amount > 50000) setAmount(3200);
                }
              }}
              className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                direction === 'usdToCop'
                  ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <span>🇺🇸 USD</span>
              <span className="text-slate-400">→</span>
              <span>🇨🇴 COP</span>
              <span className="hidden sm:inline text-xs opacity-75 font-normal">(Tarifa Remota a Asalariado)</span>
            </button>
          </div>

          {/* Input Section */}
          <div className="mt-6">
            <label
              htmlFor="salary-input"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              {direction === 'copToUsd' ? textos.hero.inputLabelCOP : textos.hero.inputLabelUSD}
            </label>

            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 sm:pl-5 text-xl font-bold text-slate-400 sm:text-2xl">
                {direction === 'copToUsd' ? '$' : 'USD $'}
              </div>
              <input
                id="salary-input"
                type="text"
                inputMode="numeric"
                value={displayValue}
                onChange={handleInputChange}
                placeholder={
                  direction === 'copToUsd'
                    ? textos.hero.inputPlaceholderCOP
                    : textos.hero.inputPlaceholderUSD
                }
                className="w-full min-h-[58px] rounded-2xl border-2 border-slate-200 bg-slate-50/60 py-3 pl-12 pr-12 text-2xl font-bold tracking-tight text-slate-900 transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 sm:min-h-[68px] sm:py-4 sm:pl-16 sm:text-3xl md:text-4xl dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:border-emerald-400 dark:focus:bg-slate-800"
              />
              {displayValue && (
                <button
                  type="button"
                  onClick={() => setAmount(0)}
                  aria-label="Limpiar campo"
                  className="absolute inset-y-0 right-0 flex min-w-[44px] items-center justify-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300">
                    ✕
                  </span>
                </button>
              )}
            </div>

            {/* Quick Preset Buttons */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Sugerencias rápidas:</span>
              {direction === 'copToUsd' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleSetExample(5000000)}
                    className="min-h-[32px] rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 font-medium text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    $ 5.000.000
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetExample(10000000)}
                    className="min-h-[32px] rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 font-medium text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    $ 10.000.000
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetExample(15000000)}
                    className="min-h-[32px] rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 font-medium text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    $ 15.000.000
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleSetExample(2000)}
                    className="min-h-[32px] rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 font-medium text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    USD 2.000
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetExample(3210)}
                    className="min-h-[32px] rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 font-medium text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    USD 3.210
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetExample(5000)}
                    className="min-h-[32px] rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 font-medium text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    USD 5.000
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Paid Vacation Switch & Days Field */}
          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label
                htmlFor="vacation-switch"
                className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                <div className="relative inline-flex items-center">
                  <input
                    id="vacation-switch"
                    type="checkbox"
                    checked={paidVacation}
                    onChange={(e) => setPaidVacation(e.target.checked)}
                    className="peer sr-only"
                    role="switch"
                    aria-checked={paidVacation}
                  />
                  <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-emerald-600 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500 peer-focus-visible:ring-offset-2 dark:bg-slate-700" />
                  <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5 shadow-sm" />
                </div>
                <span>{textos.hero.vacacionesSwitch}</span>
              </label>

              {!paidVacation && (
                <div className="flex items-center gap-2 pt-2 sm:pt-0">
                  <label
                    htmlFor="vacation-days-input"
                    className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm"
                  >
                    {textos.hero.diasVacaciones}:
                  </label>
                  <input
                    id="vacation-days-input"
                    type="number"
                    min="1"
                    max="60"
                    value={vacationDays}
                    onChange={(e) => setVacationDays(Math.max(1, parseInt(e.target.value, 10) || 15))}
                    className="w-16 min-h-[44px] rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-center text-sm font-semibold text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              )}
            </div>
            {!paidVacation && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Al no tener vacaciones pagas, la tarifa requerida se ajusta para que puedas descansar {vacationDays} días hábiles al año sin perder ingresos.
              </p>
            )}
          </div>

          {/* Big Result Card or Empty State */}
          <div className="mt-8 overflow-hidden rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-5 sm:p-7 dark:border-emerald-500/20 dark:from-emerald-950/30 dark:via-emerald-950/10">
            {isEmpty ? (
              <div className="py-6 text-center">
                <span className="text-3xl">💡</span>
                <p className="mt-2 text-base font-semibold text-slate-700 dark:text-slate-300">
                  {textos.hero.emptyState}
                </p>
                <button
                  type="button"
                  onClick={() => handleSetExample(textos.hero.exampleAmount)}
                  className="mt-3 inline-flex min-h-[44px] items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                >
                  {textos.hero.examplePrompt}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    {direction === 'copToUsd'
                      ? 'Tarifa mensual recomendada en el exterior'
                      : 'Salario mensual equivalente como empleado'}
                  </span>
                  <div className="mt-1 flex flex-wrap items-baseline gap-2">
                    <span className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-white">
                      {textos.hero.resultPrefix}{' '}
                      {direction === 'copToUsd'
                        ? formatUSD(result.equivalenteUSD)
                        : formatCOP(result.empleado.salarioMensual)}
                    </span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {textos.hero.resultSuffix}
                    </span>
                  </div>

                  {direction === 'copToUsd' ? (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-lg bg-emerald-600/15 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        {result.factor.toLocaleString('es-CO')}x {textos.hero.factor}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        (Equivalente a {formatCOP(result.equivalenteCOP)}/mes)
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-lg bg-emerald-600/15 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        Factor de equivalencia: {result.factor.toLocaleString('es-CO')}x
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        (De los {formatUSD(amount)} brutos de tu factura)
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between pt-3 sm:pt-0 border-t border-emerald-500/20 sm:border-t-0">
                  <button
                    type="button"
                    onClick={handleCopyResult}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-slate-800 transition active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 sm:text-sm"
                  >
                    <span>{copied ? '✓' : '📋'}</span>
                    <span>{copied ? textos.hero.copiedResult : textos.hero.copyResult}</span>
                  </button>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    TRM: {formatCOP(trm)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
