import { useEffect, useRef } from 'react';

/**
 * Accessible tabs (WAI-ARIA tabs pattern, automatic activation).
 * Each tab id doubles as the id of its tabpanel, so URL anchors such as
 * `#retencion` can target the panel directly.
 */
export default function Tabs({ tabs, active, onChange, ariaLabel, panels }) {
  const refs = useRef({});

  const focusTab = (id) => {
    onChange(id);
    refs.current[id]?.focus();
  };

  const onKeyDown = (e, index) => {
    const last = tabs.length - 1;
    let next = null;
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    focusTab(tabs[next].id);
  };

  return (
    <>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5"
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={tab.id}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={`inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-xl px-3.5 text-sm font-semibold transition-colors ${
                selected
                  ? 'bg-brand-soft text-brand-text ring-1 ring-brand-line'
                  : 'text-muted hover:bg-sunken hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={active}
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
        className="anim-in mt-3 rounded-xl outline-none focus-visible:outline-2 focus-visible:outline-brand"
        key={active}
      >
        {panels[active]}
      </div>
    </>
  );
}

/**
 * Opens the tab matching `location.hash` (map: hash -> tab id) on load and on
 * hashchange, then scrolls the surrounding section into view.
 */
export function useHashTabs(map, setActive) {
  const mapRef = useRef(map);
  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash.replace('#', '');
      const target = mapRef.current[hash];
      if (!target) return;
      setActive(target);
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        (el?.closest('section') ?? el)?.scrollIntoView();
      });
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, [setActive]);
}
