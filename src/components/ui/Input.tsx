import React from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
  name,
  id,
  required,
  disabled,
}) => {
  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          id={id}
          required={required}
          disabled={disabled}
          className={`w-full rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm transition-colors focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:ring-offset-0 ${
            icon ? "pl-12" : ""
          } ${disabled ? "cursor-not-allowed bg-slate-100 text-slate-400" : ""} ${
            error ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""
          }`}
        />
      </div>
      {error && <p className="mt-1 ml-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};