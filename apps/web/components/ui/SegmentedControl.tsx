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
        "inline-flex p-1 rounded-full bg-muted-sand/80 border border-hairline backdrop-blur-sm select-none",
        size === "sm" ? "h-9" : "h-11",
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
              "relative inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium transition-all duration-200 cursor-pointer",
              size === "sm" ? "px-3 text-xs" : "px-5 text-sm",
              isSelected
                ? "bg-surface text-ink-primary shadow-subtle border border-hairline font-semibold"
                : "text-ink-secondary hover:text-ink-primary hover:bg-surface/40"
            )}
          >
            {opt.icon && <span className="opacity-80">{opt.icon}</span>}
            <span>{opt.label}</span>
            {opt.badge && (
              <span
                className={cn(
                  "ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold leading-none",
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
