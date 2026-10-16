import React from "react";
import { cn } from "@/lib/utils";

interface GlassBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "neutral" | "forest" | "terracotta";
  children: React.ReactNode;
}

export function GlassBadge({
  variant = "neutral",
  className,
  children,
  ...props
}: GlassBadgeProps) {
  const variantStyles = {
    neutral: "bg-white/80 border-white/60 text-ink-primary",
    forest: "bg-forest-light/90 border-forest/20 text-forest",
    terracotta: "bg-terracotta-light/90 border-terracotta/20 text-terracotta",
  }[variant];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-sm transition-all",
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
