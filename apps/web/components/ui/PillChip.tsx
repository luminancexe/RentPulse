import React from "react";
import { cn } from "@/lib/utils";

interface PillChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: "default" | "forest";
  children: React.ReactNode;
}

export function PillChip({
  active = false,
  variant = "default",
  className,
  children,
  ...props
}: PillChipProps) {
  const activeStyles =
    variant === "forest"
      ? "bg-forest text-canvas border-forest shadow-sm"
      : "bg-ink-primary text-canvas border-ink-primary shadow-sm";

  const inactiveStyles =
    "bg-muted-sand/70 text-ink-secondary border-hairline hover:border-hairline-hover hover:text-ink-primary hover:bg-muted-sand";

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 select-none cursor-pointer",
        active ? activeStyles : inactiveStyles,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
