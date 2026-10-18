import { textos } from '../content/textos';

export default function HowItWorks() {
  const { steps } = textos.comoFunciona;

  return (
    <section className="py-12 sm:py-16 border-t border-slate-200/60 dark:border-slate-800/60" id="como-funciona">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Paso a paso
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {textos.comoFunciona.title}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
            {textos.comoFunciona.subtitle}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="absolute -top-3.5 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white shadow-sm">
                {idx + 1}
              </div>

              <div className="mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-3xl dark:bg-slate-800">
                {step.icon}
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                {step.title}
              </h3>

              <p className="mt-2 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
