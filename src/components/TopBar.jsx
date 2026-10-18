import { textos } from '../content/textos';
import { LogoIcon } from './Icons';
import ThemeToggle from './ThemeToggle';

const linkClass =
  'inline-flex min-h-11 items-center whitespace-nowrap rounded-lg px-2 text-xs font-medium text-muted transition-colors hover:bg-sunken hover:text-ink sm:px-3 sm:text-sm';

export default function TopBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-line/70 bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2 text-ink" aria-label={textos.appName}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-on-brand shadow-sm">
            <LogoIcon className="h-4 w-4" />
          </span>
          <span className="hidden text-sm font-bold tracking-tight min-[420px]:inline">
            {textos.appName}
          </span>
        </a>

        <nav aria-label="Navegación principal">
          <ul className="flex items-center">
            <li>
              <a href="#ajustes" className={linkClass}>
                {textos.topBar.ajustesLink}
              </a>
            </li>
            <li className="max-sm:hidden">
              <a href="#detalle" className={linkClass}>
                {textos.detalle.title}
              </a>
            </li>
            <li className="max-sm:hidden">
              <a href="#como-funciona" className={linkClass}>
                {textos.topBar.comoFuncionaLink}
              </a>
            </li>
            <li>
              <a href="#fuentes" className={linkClass}>
                {textos.topBar.fuentesLink}
              </a>
            </li>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
