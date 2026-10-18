import { useState } from 'react';
import { textos } from '../content/textos';

export default function FAQ() {
  const { title, subtitle, items } = textos.faq;
  const [openIndices, setOpenIndices] = useState([0]); // First item open by default

  const toggleIndex = (index) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="py-8 sm:py-12 border-t border-slate-200/60 dark:border-slate-800/60" id="faq">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Dudas comunes
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {title}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndices.includes(index);
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  aria-expanded={isOpen}
                  className="flex w-full min-h-[56px] items-center justify-between p-4.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:p-5"
                >
                  <span className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                    {item.q}
                  </span>
                  <span
                    className={`ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 transition-transform duration-200 dark:bg-slate-800 dark:text-slate-300 ${
                      isOpen ? 'rotate-180 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-5 pt-3 pb-5 text-xs text-slate-600 leading-relaxed sm:text-sm dark:border-slate-800/80 dark:text-slate-400">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
