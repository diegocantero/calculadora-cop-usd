import { useState } from 'react';
import { textos } from '../content/textos';
import { ChevronDownIcon } from './Icons';

export default function FAQ() {
  const { items } = textos.faq;
  const [openIndices, setOpenIndices] = useState([0]); // First item open by default

  const toggleIndex = (index) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-1.5">
      {items.map((item, index) => {
        const isOpen = openIndices.includes(index);
        return (
          <div
            key={index}
            className={`overflow-hidden rounded-xl border bg-surface transition-colors ${
              isOpen ? 'border-brand-line' : 'border-line hover:border-line-strong'
            }`}
          >
            <h3>
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                className="flex min-h-11 w-full items-center justify-between gap-3 px-3.5 py-2 text-left"
              >
                <span className="text-sm font-semibold text-ink">{item.q}</span>
                <ChevronDownIcon
                  className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </h3>

            {isOpen && (
              <div
                id={`faq-panel-${index}`}
                className="anim-in px-3.5 pb-3 text-[13px] leading-relaxed text-body"
              >
                <p>{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
