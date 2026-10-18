// Accessible toggle switch (native checkbox with role="switch").
export default function Switch({ id, checked, onChange, children, className = '' }) {
  return (
    <label
      htmlFor={id}
      className={`flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold text-ink ${className}`}
    >
      <span className="relative inline-flex shrink-0 items-center">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          aria-checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="h-7 w-12 rounded-full bg-line-strong transition-colors peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand" />
        <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
      </span>
      <span>{children}</span>
    </label>
  );
}
