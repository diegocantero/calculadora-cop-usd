import { textos } from '../content/textos';
import { formatCOP } from '../hooks/useCalculator';
import { ExternalIcon } from './Icons';

export default function Sources({ trm, trmInfo }) {
  const { trmLabel, trmNota, portales } = textos.fuentes;
  const trmOrigen = trmInfo?.fuente ?? 'Superintendencia Financiera de Colombia';
  const trmVigencia = trmInfo?.vigenteDesde || 'sin dato';

  return (
    <div className="space-y-3">
      <div>
        <div className="rounded-xl border border-line bg-surface p-3.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            {trmLabel}
          </span>
          <div className="text-2xl font-extrabold tabular-nums text-brand-text">{formatCOP(trm)}</div>
          <p className="text-xs text-body">
            <span className="font-semibold text-ink">{trmOrigen}</span> · Vigente desde{' '}
            {trmVigencia}
          </p>
          <p className="mt-1 text-xs leading-snug text-muted">{trmNota}</p>
        </div>

      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          {textos.masInfo.portales}
        </h3>
        <ul className="mt-1.5 grid grid-cols-1 gap-1.5 md:grid-cols-2">
          {portales.map((portal, idx) => (
            <li key={idx}>
              <a
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-11 items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-1.5 transition hover:border-brand-line hover:bg-brand-soft/50"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink group-hover:text-brand-text">
                    {portal.nombre}
                  </span>
                  <span className="block text-xs leading-snug text-muted">{portal.tema}</span>
                </span>
                <ExternalIcon className="h-4 w-4 shrink-0 text-brand-text" />
                <span className="sr-only">{textos.masInfo.verFuente}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
