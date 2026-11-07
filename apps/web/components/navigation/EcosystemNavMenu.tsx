"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Compass,
  ChevronDown,
  Home,
  Users,
  ShieldCheck,
  FileText,
  CalendarCheck,
  Scale,
  FileCheck2,
  CreditCard,
  Check,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const ECOSYSTEM_SERVICES: NavItem[] = [
  {
    href: "/properties",
    label: "Discovery Feed",
    icon: Home,
  },
  {
    href: "/roommates",
    label: "Roommate Synergy",
    icon: Users,
  },
  {
    href: "/dossier",
    label: "Tenancy Dossier",
    icon: ShieldCheck,
  },
  {
    href: "/landlord/verify",
    label: "Deed Anti-Fraud",
    icon: FileText,
  },
  {
    href: "/schedule",
    label: "Viewing Schedule",
    icon: CalendarCheck,
  },
  {
    href: "/lease",
    label: "Bilingual Lease",
    icon: Scale,
  },
  {
    href: "/police-verification",
    label: "DMP CIMS Form-2",
    icon: FileCheck2,
  },
  {
    href: "/ledger",
    label: "Rent Ledger",
    icon: CreditCard,
  },
];

interface EcosystemNavMenuProps {
  currentPath?: string;
  className?: string;
}

export function EcosystemNavMenu({ currentPath, className }: EcosystemNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative ${className || ""}`}>
      {/* Dropdown Toggle Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle Tenancy Ecosystem Portals"
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border select-none ${
          isOpen
            ? "bg-forest text-canvas border-forest shadow-md"
            : "bg-surface text-ink-primary border-hairline hover:border-hairline-hover hover:bg-muted-sand/50 shadow-subtle"
        }`}
      >
        <Compass className={`w-3.5 h-3.5 ${isOpen ? "text-canvas" : "text-forest"}`} />
        <span>Ecosystem Portals</span>
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            isOpen ? "bg-white/20 text-canvas" : "bg-muted-sand text-ink-secondary"
          }`}
        >
          8
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-canvas" : "text-ink-tertiary"
          }`}
        />
      </button>

      {/* Floating Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 sm:w-60 bg-surface border border-hairline rounded-2xl shadow-hover p-2 z-50 animate-fade-in backdrop-blur-xl">
          <div className="px-2.5 py-1.5 border-b border-hairline mb-1 flex items-center justify-between">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-ink-tertiary">
              Portals
            </span>
            <span className="text-[10px] text-forest font-semibold">RentPulse</span>
          </div>

          <div className="space-y-0.5 py-0.5">
            {ECOSYSTEM_SERVICES.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-forest-light text-forest font-semibold border border-forest/20 shadow-subtle"
                      : "hover:bg-muted-sand/60 text-ink-primary hover:translate-x-0.5"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? "bg-forest text-canvas"
                        : "bg-muted-sand text-ink-secondary"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <span className="text-xs font-sans flex-1 truncate">
                    {item.label}
                  </span>

                  {isActive && <Check className="w-3.5 h-3.5 text-forest shrink-0" />}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
