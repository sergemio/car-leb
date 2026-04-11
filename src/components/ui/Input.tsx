import { forwardRef } from 'react';

// Minimal input — mono label eyebrow above, hairline border, ink focus ring

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--gray-4)]">
          {label}
        </label>
        <input
          ref={ref}
          className={`px-4 h-11 bg-white border rounded-xl text-[14px] text-[var(--ink)] placeholder:text-[var(--gray-3)] outline-none transition-colors focus:border-[var(--ink)] ${
            error ? 'border-[var(--lb-red)]' : 'border-[var(--gray-2)]'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-[var(--lb-red)]">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
