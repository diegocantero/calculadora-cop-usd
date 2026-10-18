import { useState } from 'react';
import { textos } from '../content/textos';
import { CheckIcon, LinkIcon } from './Icons';
import { track } from '../lib/analytics';

export default function Footer() {
  const [shared, setShared] = useState(false);
  const { legal, autor, linkedIn, repo, licencia, compartir, compartido } = textos.footer;

  const handleShare = async () => {
    track('share_click');
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

  const linkClass =
    'inline-flex min-h-11 items-center rounded-lg px-1 font-medium text-body transition-colors hover:text-brand-text hover:underline';

  return (
    <footer className="border-t border-line bg-surface py-3 text-xs text-muted">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-x-6 gap-y-1 px-4 sm:px-6 lg:flex-row">
        <p className="max-w-xl text-center leading-snug lg:text-left">{legal}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-3">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-1 font-medium text-body transition-colors hover:text-brand-text hover:underline"
          >
            {shared ? <CheckIcon className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
            <span>{shared ? compartido : compartir}</span>
          </button>
          <a href={linkedIn} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {autor}
          </a>
          <a href={repo} target="_blank" rel="noopener noreferrer" className={linkClass}>
            GitHub
          </a>
          <span className="font-mono">{licencia}</span>
        </div>
      </div>
    </footer>
  );
}
