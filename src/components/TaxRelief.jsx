import { useState } from 'react';
import { textos } from '../content/textos';

export default function TaxRelief() {
  const [isOpen, setIsOpen] = useState(false);
  const { title, subtitle, columnas, verFuente, limiteGlobal, items } = textos.alivios;

  return (
    <section className="py-8 sm:py-12 border-t border-slate-200/60 dark:border-slate-800/60" id="alivios">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
          {/* Accordion Header / Trigger */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            className="flex w-full min-h-[64px] items-center justify-between p-6 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-xl text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                🛡️
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                  {title}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                  {subtitle}
                </p>
              </div>
            </div>

            <div className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform duration-200 dark:bg-slate-800 dark:text-slate-300">
              <span className={`transform transition-transform text-xs font-bold ${isOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>
          </button>

          {/* Accordion Content */}
          {isOpen && (
            <div className="border-t border-slate-200 p-6 dark:border-slate-800">
              {/* Global Limit Banner */}
              <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                📌 <strong>Regla general:</strong> {limiteGlobal}
              </div>

              {/* Table Container with horizontal scroll on small screens */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
                    <tr>
                      {columnas.map((col, idx) => (
                        <th key={idx} className="p-3.5 font-bold">
                          {col}
                        </th>
                      ))}
                      <th className="p-3.5 font-bold text-right">Norma</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {items &&
                      items.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="p-3.5">
                            <span className="font-semibold text-slate-900 dark:text-white block">
                              {item.nombre}
                            </span>
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              {item.nota}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">
                            {item.limiteUvt}
                          </td>
                          <td className="p-3.5 font-bold text-emerald-700 dark:text-emerald-400">
                            {item.valor2026}
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400">
                            {item.clasificacion}
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs hover:border-emerald-500 hover:text-emerald-700 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-emerald-400"
                              title={`Consultar ${item.articulo} en Estatuto Tributario`}
                            >
                              <span>{verFuente}</span>
                              <span className="text-[10px]">↗</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
