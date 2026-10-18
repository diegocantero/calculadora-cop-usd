import { textos } from '../content/textos';
import { ExternalIcon, InfoIcon } from './Icons';

export default function TaxRelief() {
  const { columnas, verFuente, limiteGlobal, items } = textos.alivios;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2.5 rounded-xl border border-brand-line bg-brand-soft p-3 text-[13px] leading-snug text-body">
        <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" />
        <p>
          <strong className="text-ink">Regla general:</strong> {limiteGlobal}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead className="bg-sunken text-xs uppercase tracking-wider text-muted">
            <tr>
              {columnas.map((col, idx) => (
                <th key={idx} scope="col" className="px-3 py-2 font-semibold">
                  {col}
                </th>
              ))}
              <th scope="col" className="px-3 py-2 text-right font-semibold">
                Norma
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((item, idx) => (
              <tr key={idx} className="transition-colors hover:bg-sunken/50">
                <td className="px-3 py-2">
                  <span className="block font-semibold text-ink">{item.nombre}</span>
                  <span className="block text-xs text-muted">{item.nota}</span>
                </td>
                <td className="px-3 py-2 font-mono text-body">{item.limiteUvt}</td>
                <td className="px-3 py-2 font-bold tabular-nums text-ok-text">{item.valor2026}</td>
                <td className="px-3 py-2 text-body">{item.clasificacion}</td>
                <td className="whitespace-nowrap px-3 py-2 text-right">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-brand-text hover:underline"
                    title={`Consultar ${item.articulo} en Estatuto Tributario`}
                  >
                    <span>{verFuente}</span>
                    <ExternalIcon className="h-3.5 w-3.5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
