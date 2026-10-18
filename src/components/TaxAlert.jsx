import { textos } from '../content/textos';
import { formatCOP } from '../hooks/useCalculator';
import { UVT_2026, TOPE_DECLARAR_UVT } from '../config';
import { AlertIcon, ArrowRightIcon } from './Icons';

export default function TaxAlert({ result, uvt }) {
  if (!result || !result.obligadoADeclarar) {
    return null;
  }

  const umbralCOP = TOPE_DECLARAR_UVT.value * (uvt || UVT_2026.value);

  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex items-start gap-2.5 rounded-xl border border-warn-line border-l-4 border-l-warn bg-warn-soft p-3"
    >
      <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-warn-text" />
      <div className="min-w-0 flex-1 text-[13px] leading-snug text-body">
        <h4 className="text-sm font-bold text-ink">{textos.alerta.titulo}</h4>
        <p className="mt-0.5">{textos.alerta.mensaje(formatCOP(umbralCOP))}</p>
        <a
          href="#alivios"
          className="mt-1 inline-flex min-h-8 items-center gap-1.5 font-semibold text-warn-text hover:underline"
        >
          {textos.alerta.verAlivios}
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
