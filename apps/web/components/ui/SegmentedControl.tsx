"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md";
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  size = "md",
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      className={cn(
        "inline-flex items-center p-1.5 rounded-full bg-muted-sand/90 border border-hairline backdrop-blur-md select-none shrink-0 shadow-subtle",
        size === "sm" ? "h-10" : "h-12 sm:h-13",
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative inline-flex items-center justify-center gap-2.5 rounded-full font-sans transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 h-full",
              size === "sm" ? "px-3.5 text-xs" : "px-5 sm:px-6 text-sm",
              isSelected
                ? "bg-surface text-ink-primary shadow-sm border border-hairline font-semibold"
                : "text-ink-secondary hover:text-ink-primary hover:bg-surface/50 font-medium"
            )}
          >
            {opt.icon && <span className="opacity-80 shrink-0">{opt.icon}</span>}
            <span className="whitespace-nowrap leading-none tracking-tight">{opt.label}</span>
            {opt.badge && (
              <span
                className={cn(
                  "ml-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold leading-none whitespace-nowrap shrink-0 transition-colors",
                  isSelected
                    ? "bg-forest/10 text-forest"
                    : "bg-ink-primary/5 text-ink-secondary"
                )}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
