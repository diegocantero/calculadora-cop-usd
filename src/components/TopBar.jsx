import { textos } from '../content/textos';

export default function TopBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <a
          href="#"
          className="group flex items-center gap-2.5 text-base font-bold text-slate-900 transition-colors hover:text-emerald-600 dark:text-slate-100 dark:hover:text-emerald-400"
          aria-label={textos.appName}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-lg text-white shadow-sm shadow-emerald-600/30">
            ⇄
          </span>
          <span className="tracking-tight">{textos.appName}</span>
        </a>

        <nav aria-label="Navegación principal">
          <ul className="flex items-center gap-1 sm:gap-2">
            <li>
              <a
                href="#como-funciona"
                className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:text-sm"
              >
                {textos.topBar.comoFuncionaLink}
              </a>
            </li>
            <li>
              <a
                href="#ajustes"
                className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:text-sm"
              >
                {textos.topBar.ajustesLink}
              </a>
            </li>
            <li>
              <a
                href="#fuentes"
                className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:text-sm"
              >
                {textos.topBar.fuentesLink}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
