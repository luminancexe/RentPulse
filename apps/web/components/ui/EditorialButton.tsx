import React from "react";
import { cn } from "@/lib/utils";

interface EditorialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function EditorialButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: EditorialButtonProps) {
  const variantStyles = {
    primary: "bg-forest hover:bg-forest-hover text-canvas shadow-subtle hover-glow border border-forest/20",
    secondary: "bg-ink-primary hover:bg-black text-canvas shadow-subtle hover-glow",
    outline: "bg-surface hover:bg-muted-sand/50 text-ink-primary border-hairline hover:border-hairline-hover",
    ghost: "bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-muted-sand/60",
  }[variant];

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded-full font-medium",
    md: "px-5 py-2.5 text-sm rounded-full font-medium",
    lg: "px-6 py-3 text-base rounded-full font-medium",
  }[size];

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-200 select-none cursor-pointer active:scale-[0.98]",
        sizeStyles,
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
