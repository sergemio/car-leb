// Minimal select — matches Input styling, mono eyebrow label

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
}

export function Select({
  label,
  options,
  placeholder,
  error,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--gray-4)]">
        {label}
      </label>
      <select
        className={`px-4 h-11 bg-white border rounded-xl text-[14px] text-[var(--ink)] outline-none transition-colors focus:border-[var(--ink)] appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:12px_8px] ${
          error ? 'border-[var(--lb-red)]' : 'border-[var(--gray-2)]'
        } ${className}`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%230A0A0A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
          paddingRight: '2.5rem',
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-[var(--lb-red)]">{error}</span>}
    </div>
  );
}
