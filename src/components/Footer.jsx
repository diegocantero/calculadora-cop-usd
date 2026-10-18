import { useState } from 'react';
import { textos } from '../content/textos';

export default function Footer() {
  const [shared, setShared] = useState(false);
  const { legal, autor, linkedIn, repo, licencia, compartir, compartido } = textos.footer;

  const handleShare = async () => {
    const shareData = {
      title: 'Calculadora COP ↔ USD para Independientes',
      text: 'Calcula tu salario equivalente entre pesos colombianos y dólares para contratos remotos.',
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Share error:', err);
        }
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2200);
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }
  };

  return (
    <footer className="border-t border-slate-200/80 bg-white py-12 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
                ⇄
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {textos.appName}
              </span>
            </div>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {legal}
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:border-emerald-500 hover:text-emerald-700 transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
            >
              <span>{shared ? '✓' : '🔗'}</span>
              <span>{shared ? compartido : compartir}</span>
            </button>

            <div className="flex items-center gap-4 text-xs">
              <a
                href={linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-600 hover:text-emerald-600 hover:underline dark:text-slate-300 dark:hover:text-emerald-400"
              >
                {autor}
              </a>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <a
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-600 hover:text-emerald-600 hover:underline dark:text-slate-300 dark:hover:text-emerald-400"
              >
                GitHub
              </a>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="font-mono text-slate-500">{licencia}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-[11px] text-slate-400 dark:border-slate-800/80 dark:text-slate-500">
          Desarrollado para la comunidad de desarrolladores y profesionales remotos en Colombia • 2026
        </div>
      </div>
    </footer>
  );
}
