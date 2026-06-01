import React from "react";

interface HistoryCardProps {
  title: string;
  subtitle: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  rightElement?: React.ReactNode;
  variant?: "default" | "compact";
}

export function HistoryCard({
  title,
  subtitle,
  isActive = false,
  onClick,
  rightElement,
  variant = "default",
}: HistoryCardProps) {
  const padding = variant === "compact" ? "p-4" : "p-5";
  const titleSize = variant === "compact" ? "text-base" : "text-lg";
  
  const borderStyles = isActive
    ? "bg-primary/5 border-primary shadow-sm"
    : "bg-card border-border hover:border-primary/40 hover:bg-surface-fill";

  return (
    <div
      onClick={onClick}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border transition-all ${
        onClick ? "cursor-pointer" : ""
      } ${padding} ${borderStyles}`}
    >
      <div>
        <h4 className={`font-heading font-semibold text-foreground mb-1 line-clamp-1 ${titleSize}`}>
          {title}
        </h4>
        <div className="text-sm text-text-secondary">{subtitle}</div>
      </div>
      
      {rightElement && (
        <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-end">
          {rightElement}
        </div>
      )}
    </div>
  );
}