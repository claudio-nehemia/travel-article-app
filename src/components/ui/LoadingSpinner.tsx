import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  } as const;

  return (
    <div className="flex items-center justify-center py-2">
      <div
        className={`animate-spin rounded-full border-2 border-transparent border-t-[var(--accent-primary)] border-r-[var(--accent-secondary)] ${sizeClasses[size]}`}
      />
    </div>
  );
};