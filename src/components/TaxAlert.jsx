import { textos } from '../content/textos';
import { formatCOP } from '../hooks/useCalculator';

export default function TaxAlert({ result, uvt }) {
  if (!result || !result.obligadoADeclarar) {
    return null;
  }

  const declaracionUmbralCOP = 1400 * (uvt || 49799);

  return (
    <div className="py-4" role="alert" aria-live="polite">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col gap-3 rounded-2xl border-2 border-amber-500/50 bg-amber-500/10 p-4.5 sm:flex-row sm:items-center sm:gap-4 dark:border-amber-500/40 dark:bg-amber-950/30">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-2xl text-amber-600 dark:text-amber-400">
            ⚠️
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                {textos.alerta.titulo} ({textos.alerta.tope} ≈ {formatCOP(declaracionUmbralCOP)} anuales)
              </h4>
              <span className="inline-flex rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                Tope DIAN superado
              </span>
            </div>
            <p className="mt-1 text-xs text-amber-800/90 sm:text-sm dark:text-amber-300/90">
              {textos.alerta.mensaje}
            </p>
          </div>

          <div className="shrink-0 pt-2 sm:pt-0">
            <a
              href="#alivios"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
            >
              Ver alivios tributarios
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
