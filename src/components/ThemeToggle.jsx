import { useState } from 'react';
import { SunIcon, MoonIcon } from './Icons';
import { textos } from '../content/textos';

const STORAGE_KEY = 'theme';

// Light is the default; dark only when the user chose it (saved in localStorage).
function getEffectiveTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getEffectiveTheme);
  const isDark = theme === 'dark';

  const toggle = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage may be unavailable (private mode); the choice still applies for this visit.
    }
    setTheme(next);
  };

  const label = isDark ? textos.topBar.temaClaro : textos.topBar.temaOscuro;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="ml-1 inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted transition-colors hover:bg-sunken hover:text-ink"
    >
      {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
