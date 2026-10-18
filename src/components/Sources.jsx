import { textos } from '../content/textos';
import { formatCOP } from '../hooks/useCalculator';

export default function Sources({ trm }) {
  const { title, subtitle, trmLabel, trmOrigen, trmVigencia, avisoGeneral, portales } =
    textos.fuentes;

  return (
    <section className="py-12 sm:py-16 border-t border-slate-200/60 dark:border-slate-800/60" id="fuentes">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Transparencia y marco legal
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {title}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        {/* Current TRM badge & Disclaimer Warning */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:col-span-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {trmLabel}
            </span>
            <div className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {formatCOP(trm)}
            </div>
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold">{trmOrigen}</span>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Vigencia {trmVigencia} • Editable en ajustes
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 dark:border-amber-500/20 dark:bg-amber-950/20 sm:col-span-2 flex items-center">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  Advertencia sobre vigencia de parámetros
                </h4>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed sm:text-sm">
                  {avisoGeneral}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Official Portals List */}
        <div className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Portales e instituciones oficiales de consulta
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {portales.map((portal, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {portal.nombre}
                    </h4>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Oficial
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {portal.tema}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    <span>Ver fuente oficial</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
