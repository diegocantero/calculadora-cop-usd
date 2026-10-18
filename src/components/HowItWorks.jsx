import { textos } from '../content/textos';

export default function HowItWorks() {
  const { steps, subtitle } = textos.comoFunciona;

  return (
    <div>
      <p className="text-[13px] leading-snug text-muted">{subtitle}</p>
      <ol className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {steps.map((step, idx) => (
          <li key={idx} className="flex items-start gap-3 rounded-xl bg-sunken p-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-on-brand">
              {idx + 1}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-ink">
                <span aria-hidden="true">{step.icon} </span>
                {step.title}
              </h3>
              <p className="mt-0.5 text-xs leading-snug text-muted">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
