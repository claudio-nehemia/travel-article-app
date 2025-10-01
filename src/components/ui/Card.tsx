import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
}) => {
  return (
    <div
      className={`rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-sm shadow-sm transition-all duration-200 ${
        hover ? "hover:-translate-y-1 hover:shadow-md" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};