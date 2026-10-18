import { useState } from 'react';
import { textos } from '../content/textos';
import { mesesFacturables } from '../lib/calc';
import { track } from '../lib/analytics';
import { formatCOP, formatUSD, formatNumber } from '../hooks/useCalculator';
import { CheckIcon, CopyIcon, XIcon, ArrowRightIcon, SparkIcon } from './Icons';
import Switch from './Switch';

function Stat({ label, value, tone = 'text-ink' }) {
  return (
    <div className="min-w-0 rounded-xl bg-sunken px-3 py-2">
      <div className="truncate text-[11px] font-medium leading-tight text-muted">{label}</div>
      <div className={`mt-0.5 truncate text-sm font-bold tabular-nums ${tone}`}>{value}</div>
    </div>
  );
}

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
  children, // advanced settings disclosure, rendered inside the input card
}) {
  const [copied, setCopied] = useState(false);
  const displayValue = amount && amount > 0 ? formatNumber(amount) : '';

  const handleInputChange = (e) => {
    const cleanDigits = e.target.value.replace(/\D/g, '');
    setAmount(cleanDigits ? parseInt(cleanDigits, 10) : 0);
  };

  const handleCopyResult = async () => {
    track('copy_result', { direction });
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

  // Same formula as calc.js: 12 months minus unpaid vacation days / working days per month.
  const billableMonths = mesesFacturables(false, vacationDays);
  const billableMonthsLabel = billableMonths.toLocaleString('es-CO', { maximumFractionDigits: 1 });

  const isEmpty = !amount || amount <= 0;

  const tabClass = (active) =>
    `flex min-h-12 flex-col items-center justify-center rounded-xl px-2 py-1.5 text-center transition-all ${
      active ? 'bg-surface text-ink shadow-card ring-1 ring-line' : 'text-muted hover:text-ink'
    }`;

  const chipClass =
    'inline-flex min-h-11 items-center rounded-full border border-line-strong bg-surface px-3 text-sm font-medium text-body tabular-nums transition hover:border-brand hover:bg-brand-soft hover:text-brand-text active:scale-[0.97] sm:min-h-9';

  const presets =
    direction === 'copToUsd'
      ? [
          [2000000, '$ 2.000.000'],
          [3000000, '$ 3.000.000'],
          [5000000, '$ 5.000.000'],
        ]
      : [
          [1000, 'USD 1.000'],
          [1500, 'USD 1.500'],
          [2500, 'USD 2.500'],
        ];

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
      {/* LEFT: inputs */}
      <div className="card rounded-2xl p-4 sm:p-5">
        <div
          role="group"
          aria-label="Dirección de la conversión"
          className="grid grid-cols-2 gap-1 rounded-xl bg-sunken p-1"
        >
          <button
            type="button"
            aria-pressed={direction === 'copToUsd'}
            onClick={() => {
              if (direction !== 'copToUsd') {
                track('direction_change', { direction: 'copToUsd' });
                setDirection('copToUsd');
                if (!amount || amount < 100000) setAmount(3000000);
              }
            }}
            className={tabClass(direction === 'copToUsd')}
          >
            <span className="flex items-center gap-1.5 text-sm font-bold">
              <span>🇨🇴 COP</span>
              <ArrowRightIcon className="h-3.5 w-3.5 opacity-60" />
              <span>🇺🇸 USD</span>
            </span>
            <span className="text-[11px] font-medium">Asalariado a Remoto</span>
          </button>

          <button
            type="button"
            aria-pressed={direction === 'usdToCop'}
            onClick={() => {
              if (direction !== 'usdToCop') {
                track('direction_change', { direction: 'usdToCop' });
                setDirection('usdToCop');
                if (!amount || amount > 50000) setAmount(1000);
              }
            }}
            className={tabClass(direction === 'usdToCop')}
          >
            <span className="flex items-center gap-1.5 text-sm font-bold">
              <span>🇺🇸 USD</span>
              <ArrowRightIcon className="h-3.5 w-3.5 opacity-60" />
              <span>🇨🇴 COP</span>
            </span>
            <span className="text-[11px] font-medium">Tarifa Remota a Asalariado</span>
          </button>
        </div>

        <div className="mt-4">
          <label htmlFor="salary-input" className="block text-sm font-semibold text-ink">
            {direction === 'copToUsd' ? textos.hero.inputLabelCOP : textos.hero.inputLabelUSD}
          </label>

          <div className="relative mt-1.5">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-lg font-bold text-muted">
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
              className={`min-h-14 w-full rounded-xl border-2 border-line-strong bg-canvas/60 py-2 pr-12 text-2xl font-bold tracking-tight text-ink tabular-nums outline-none transition placeholder:text-muted/60 focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/20 ${
                direction === 'copToUsd' ? 'pl-9' : 'pl-[4.25rem]'
              }`}
            />
            {displayValue && (
              <button
                type="button"
                onClick={() => setAmount(0)}
                aria-label="Limpiar campo"
                className="absolute inset-y-0 right-1 flex w-11 items-center justify-center"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sunken text-muted transition hover:bg-line-strong hover:text-ink">
                  <XIcon className="h-3.5 w-3.5" />
                </span>
              </button>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">{textos.hero.quickLabel}</span>
            {presets.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  track('amount_preset', { direction });
                  setAmount(value);
                }}
                className={chipClass}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-line bg-sunken/60 px-3 py-1.5">
          <div className="flex flex-wrap items-center justify-between gap-x-3">
            <Switch
              id="vacation-switch"
              checked={paidVacation}
              onChange={(paid) => {
                track('vacation_toggle', { paid });
                setPaidVacation(paid);
              }}
            >
              {textos.hero.vacacionesSwitch}
            </Switch>

            {!paidVacation && (
              <div className="flex items-center gap-2 pb-1.5 sm:pb-0">
                <label htmlFor="vacation-days-input" className="text-sm text-muted">
                  {textos.hero.diasVacaciones}:
                </label>
                <input
                  id="vacation-days-input"
                  type="number"
                  min="1"
                  max="60"
                  value={vacationDays}
                  onChange={(e) => setVacationDays(Math.max(1, parseInt(e.target.value, 10) || 15))}
                  className="field w-16 text-center"
                />
              </div>
            )}
          </div>
          <p className="pb-1.5 text-xs leading-relaxed text-muted" aria-live="polite">
            {paidVacation
              ? textos.hero.vacacionesIncluidas
              : (direction === 'copToUsd'
                  ? textos.hero.vacacionesNoIncluidasCopToUsd
                  : textos.hero.vacacionesNoIncluidasUsdToCop)(vacationDays, billableMonthsLabel)}
          </p>
        </div>

        {children}
      </div>

      {/* RIGHT: sticky result + summary strip */}
      <div className="lg:sticky lg:top-16">
        {isEmpty ? (
          <div className="rounded-2xl border-2 border-dashed border-line-strong p-6 text-center">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-text">
              <SparkIcon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-base font-semibold text-ink">{textos.hero.emptyState}</p>
            <button
              type="button"
              onClick={() => setAmount(textos.hero.exampleAmount)}
              className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-on-brand shadow-sm transition hover:brightness-110 active:scale-[0.98]"
            >
              {textos.hero.examplePrompt}
            </button>
          </div>
        ) : (
          <div
            className="result-card relative overflow-hidden rounded-2xl p-4 text-white shadow-hero sm:p-5"
            aria-live="polite"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/80">
              {direction === 'copToUsd' ? textos.hero.resultLabelCOP : textos.hero.resultLabelUSD}
            </span>

            <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-4xl font-extrabold leading-none tracking-tight tabular-nums sm:text-5xl">
                {textos.hero.resultPrefix}{' '}
                {direction === 'copToUsd'
                  ? formatUSD(result.equivalenteUSD)
                  : formatCOP(result.empleado.salarioMensual)}
              </span>
              <span className="text-base font-medium text-white/80">{textos.hero.resultSuffix}</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-bold tabular-nums ring-1 ring-white/25">
                {direction === 'copToUsd'
                  ? `${result.factor.toLocaleString('es-CO')}x ${textos.hero.factor}`
                  : `Factor de equivalencia: ${result.factor.toLocaleString('es-CO')}x`}
              </span>
              <span className="text-sm tabular-nums text-white/85">
                {direction === 'copToUsd'
                  ? `(Equivalente a ${formatCOP(result.equivalenteCOP)}/mes)`
                  : `(De los ${formatUSD(amount)} brutos de tu factura)`}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/20 pt-3">
              <span className="text-sm tabular-nums text-white/85">
                {textos.hero.trmLine}: {formatCOP(trm)}
              </span>
              <button
                type="button"
                onClick={handleCopyResult}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0a2463] shadow-md transition hover:bg-white/90 active:scale-[0.97]"
              >
                {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                <span>{copied ? textos.hero.copiedResult : textos.hero.copyResult}</span>
              </button>
            </div>
          </div>
        )}

        {!isEmpty && (
          <>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Stat label={textos.resumen.empleadoAnual} value={formatCOP(result.empleado.ingresoAnual)} />
              <Stat
                label={textos.resumen.independienteAnual}
                value={formatCOP(result.independiente.ingresoAnual)}
                tone="text-brand-text"
              />
              <Stat
                label={textos.resumen.provision}
                value={formatCOP(result.provisionIndependiente)}
                tone="text-warn-text"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
