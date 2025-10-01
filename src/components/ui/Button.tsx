import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  className = "",
  isLoading = false,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--accent-secondary)] disabled:pointer-events-none disabled:opacity-50";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-sm hover:shadow-md hover:brightness-[1.02]",
    secondary:
      "border border-[var(--accent-primary)]/40 bg-white text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]",
    danger:
      "bg-gradient-to-r from-rose-500 to-rose-400 text-white shadow-sm hover:shadow-md",
    ghost:
      "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};