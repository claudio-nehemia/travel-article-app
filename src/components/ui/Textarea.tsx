import React from "react";

interface TextareaProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  placeholder,
  value,
  onChange,
  error,
  rows = 4,
  disabled = false,
  className = "",
}) => {
  return (
    <div className="w-full">
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        className={`w-full rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm transition-colors focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${
          error ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""
        } ${className}`}
      />
      {error && <p className="mt-1 ml-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};