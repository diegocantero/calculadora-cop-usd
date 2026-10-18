import { useEffect, useState } from 'react';
import { textos } from '../content/textos';
import { formatCOP } from '../hooks/useCalculator';
import { SlidersIcon, ChevronDownIcon, ResetIcon } from './Icons';
import Switch from './Switch';

const labelClass = 'block text-xs font-semibold text-ink';
const hintClass = 'mt-1 block text-xs leading-snug text-muted';
const adornment =
  'pointer-events-none absolute inset-y-0 flex items-center text-sm font-semibold text-muted';

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

  // Anchor links (#ajustes) open the disclosure.
  useEffect(() => {
    const apply = () => {
      if (window.location.hash !== '#ajustes') return;
      setIsOpen(true);
      requestAnimationFrame(() => document.getElementById('ajustes')?.scrollIntoView());
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  return (
    <div className="mt-3 rounded-xl border border-line" id="ajustes">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="ajustes-panel"
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-3 text-left transition hover:bg-sunken/60"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <SlidersIcon className="h-4 w-4 shrink-0 text-brand-text" />
          <span className="truncate text-sm font-semibold text-ink">{textos.topBar.ajustesLink}</span>
          <span className="hidden truncate text-xs text-muted min-[480px]:inline">
            {textos.avanzado.resumen}
          </span>
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sunken text-body transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <ChevronDownIcon className="h-4 w-4" />
        </span>
      </button>

      {isOpen && (
        <div id="ajustes-panel" className="anim-in border-t border-line p-3 sm:p-4">
          <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
            <div>
              <label htmlFor="trm-input" className={labelClass}>
                {textos.avanzado.trm}
              </label>
              <div className="relative mt-1">
                <span className={`${adornment} left-3.5`}>$</span>
                <input
                  id="trm-input"
                  type="number"
                  step="10"
                  min="2000"
                  max="10000"
                  value={trm}
                  onChange={(e) => setTrm(Number(e.target.value) || 4000)}
                  className="field pl-8"
                />
              </div>
              <span className={hintClass}>Por defecto: ${defaults.trm.toLocaleString('es-CO')}</span>
            </div>

            <div>
              <label htmlFor="exchange-cost-input" className={labelClass}>
                {textos.avanzado.costoCambio}
              </label>
              <div className="relative mt-1">
                <input
                  id="exchange-cost-input"
                  type="number"
                  step="0.1"
                  min="0"
                  max="15"
                  value={exchangeCostPct}
                  onChange={(e) => setExchangeCostPct(Number(e.target.value) || 0)}
                  className="field pr-9"
                />
                <span className={`${adornment} right-3.5`}>%</span>
              </div>
              <span className={hintClass}>Spread y comisión de retiro (promedio 1.5% - 3.5%)</span>
            </div>

            <div>
              <label htmlFor="uvt-input" className={labelClass}>
                {textos.avanzado.uvt}
              </label>
              <div className="relative mt-1">
                <span className={`${adornment} left-3.5`}>$</span>
                <input
                  id="uvt-input"
                  type="number"
                  step="500"
                  value={uvt}
                  onChange={(e) => setUvt(Number(e.target.value) || defaults.uvt)}
                  className="field pl-8"
                />
              </div>
              <span className={hintClass}>Valor oficial fijado por la DIAN</span>
            </div>

            <div>
              <span className={labelClass}>Modalidad laboral</span>
              <Switch id="integral-switch" checked={isIntegral} onChange={setIsIntegral}>
                {textos.avanzado.integral}
              </Switch>
              <span className={hintClass}>
                Aplica desde 13 SMMLV (≥ {formatCOP(umbralIntegral)}/mes)
              </span>
            </div>
          </div>

          <ul className="mt-3 space-y-1.5 rounded-xl bg-sunken p-3 text-xs leading-relaxed text-body">
            <li>
              <strong className="text-ink">Salario Integral:</strong> {textos.avanzado.avisoIntegral}{' '}
              Umbral mínimo legal: <strong className="text-ink">{formatCOP(umbralIntegral)}</strong>.
            </li>
            <li>
              <strong className="text-ink">Auxilio de transporte:</strong>{' '}
              {textos.avanzado.avisoTransporte} Tope máximo legal para devengarlo:{' '}
              <strong className="text-ink">{formatCOP(umbralTransporte)}</strong> (2 SMMLV).
            </li>
          </ul>

          <div className="mt-3 flex justify-end">
            <button type="button" onClick={resetDefaults} className="btn-ghost">
              <ResetIcon className="h-4 w-4" />
              <span>{textos.avanzado.restablecerValores}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
