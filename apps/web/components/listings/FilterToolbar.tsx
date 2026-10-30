"use client";

import React from "react";
import { SlidersHorizontal, ArrowUpDown, MapPin, X } from "lucide-react";
import { PillChip } from "@/components/ui/PillChip";
import { cn } from "@/lib/utils";

export interface FilterState {
  neighborhood: string;
  bedrooms: string;
  sortBy: "recommended" | "price_asc" | "price_desc" | "synergy";
  verifiedOnly: boolean;
}

interface FilterToolbarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  totalResults: number;
  className?: string;
  isSharedMode?: boolean;
}

export const DHAKA_NEIGHBORHOODS = [
  { id: "all", label: "All Neighborhoods" },
  { id: "Dhanmondi", label: "Dhanmondi" },
  { id: "Bashundhara", label: "Bashundhara R/A" },
  { id: "Gulshan", label: "Gulshan-2" },
  { id: "Banani", label: "Banani" },
  { id: "Mirpur", label: "Mirpur DOHS" },
  { id: "Uttara", label: "Uttara" },
];

export function FilterToolbar({
  filters,
  onChange,
  totalResults,
  className,
  isSharedMode = false,
}: FilterToolbarProps) {
  const handleNeighborhoodChange = (neighborhood: string) => {
    onChange({ ...filters, neighborhood });
  };

  const handleBedroomsChange = (bedrooms: string) => {
    onChange({ ...filters, bedrooms: filters.bedrooms === bedrooms ? "all" : bedrooms });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, sortBy: e.target.value as FilterState["sortBy"] });
  };

  const handleVerifiedToggle = () => {
    onChange({ ...filters, verifiedOnly: !filters.verifiedOnly });
  };

  const hasActiveFilters =
    filters.neighborhood !== "all" ||
    filters.bedrooms !== "all" ||
    filters.verifiedOnly;

  const handleResetFilters = () => {
    onChange({
      neighborhood: "all",
      bedrooms: "all",
      sortBy: "recommended",
      verifiedOnly: false,
    });
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Top Row: Neighborhood Quick Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {DHAKA_NEIGHBORHOODS.map((nh) => (
          <PillChip
            key={nh.id}
            active={filters.neighborhood === nh.id}
            variant="forest"
            onClick={() => handleNeighborhoodChange(nh.id)}
            className="flex-shrink-0"
          >
            {nh.id !== "all" && <MapPin className="w-3 h-3 opacity-70" />}
            <span>{nh.label}</span>
          </PillChip>
        ))}
      </div>

      {/* Second Row: Detailed Controls & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-hairline/60">
        <div className="flex flex-wrap items-center gap-2">
          {/* Bed / Seat Filters */}
          <span className="text-xs font-sans text-ink-tertiary mr-1">
            {isSharedMode ? "Seats:" : "Bedrooms:"}
          </span>
          {["1", "2", "3", "4+"].map((beds) => (
            <button
              key={beds}
              type="button"
              onClick={() => handleBedroomsChange(beds)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-sans font-medium transition-all cursor-pointer border",
                filters.bedrooms === beds
                  ? "bg-ink-primary text-canvas border-ink-primary"
                  : "bg-surface text-ink-secondary border-hairline hover:border-hairline-hover hover:text-ink-primary"
              )}
            >
              {beds} {isSharedMode ? "Seat" : "Bed"}
            </button>
          ))}

          <span className="text-hairline mx-1">|</span>

          {/* Verified Landlord Filter */}
          <button
            type="button"
            onClick={handleVerifiedToggle}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-sans font-medium transition-all cursor-pointer border flex items-center gap-1.5",
              filters.verifiedOnly
                ? "bg-forest-light text-forest border-forest/30 font-semibold"
                : "bg-surface text-ink-secondary border-hairline hover:text-ink-primary"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                filters.verifiedOnly ? "bg-forest" : "bg-ink-tertiary"
              )}
            />
            <span>Verified Title Deed</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-ink-tertiary hover:text-ink-primary px-2 py-1 rounded-full hover:bg-muted-sand transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right Side: Results Counter & Sort */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-secondary font-sans tabular-nums">
            <strong className="text-ink-primary font-semibold">{totalResults}</strong> listings found
          </span>

          <div className="relative inline-flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-ink-secondary absolute left-3 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              aria-label="Sort listings"
              className="appearance-none pl-8 pr-7 py-1.5 rounded-full text-xs font-sans font-medium bg-surface text-ink-primary border border-hairline hover:border-hairline-hover focus:outline-none focus:ring-1 focus:ring-forest cursor-pointer shadow-subtle"
            >
              <option value="recommended">Featured / Curated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              {isSharedMode && <option value="synergy">Highest Roommate Synergy</option>}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
