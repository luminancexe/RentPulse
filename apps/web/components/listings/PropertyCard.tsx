"use client";

import React, { useState } from "react";
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  ShieldCheck,
  Heart,
  Sparkles,
  Receipt,
  Users,
  Compass,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { ImagePeekCarousel } from "@/components/ui/ImagePeekCarousel";
import { EditorialButton } from "@/components/ui/EditorialButton";
import { PropertyListingItem } from "./types";

interface PropertyCardProps {
  listing: PropertyListingItem;
  onOpenCostBreakdown?: (listing: PropertyListingItem) => void;
  onSelectProperty?: (listing: PropertyListingItem) => void;
  onScheduleViewing?: (listing: PropertyListingItem) => void;
  isShortlisted?: boolean;
  onToggleShortlist?: (listingId: string) => void;
  className?: string;
}

export function PropertyCard({
  listing,
  onOpenCostBreakdown,
  onSelectProperty,
  onScheduleViewing,
  isShortlisted = false,
  onToggleShortlist,
  className,
}: PropertyCardProps) {
  const [shortlisted, setShortlisted] = useState(isShortlisted);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShortlisted(!shortlisted);
    onToggleShortlist?.(listing.id);
  };

  const handleCardClick = () => {
    onSelectProperty?.(listing);
  };

  const isShared = listing.mode === "shared_room";

  return (
    <article
      onClick={handleCardClick}
      className={cn(
        "group flex flex-col bg-surface rounded-3xl border border-hairline overflow-hidden shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer",
        className
      )}
    >
      {/* 16:10 Media Container */}
      <div className="relative w-full">
        <ImagePeekCarousel
          images={listing.images}
          title={listing.title}
          aspectRatio="16/10"
        />

        {/* Floating Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10 pointer-events-none">
          {listing.isVerifiedLessor && (
            <GlassBadge variant="forest" className="shadow-sm text-[11px] py-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              Verified Lessor
            </GlassBadge>
          )}

          {isShared && listing.roommateSynergy && (
            <GlassBadge variant="terracotta" className="shadow-sm text-[11px] py-0.5">
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
              {listing.roommateSynergy.compatibilityScore}% Synergy
            </GlassBadge>
          )}

          {!isShared && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold backdrop-blur-md bg-white/80 border border-white/60 text-ink-primary shadow-sm">
              Entire Flat
            </span>
          )}
        </div>

        {/* Floating Top Right Heart Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md border border-hairline flex items-center justify-center shadow-subtle transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-10",
            shortlisted
              ? "bg-terracotta text-white border-terracotta"
              : "bg-surface/80 text-ink-primary hover:bg-surface"
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              shortlisted ? "fill-white text-white" : "text-ink-primary"
            )}
          />
        </button>

        {/* Floating Bottom Left: Seat Capacity if Shared */}
        {isShared && listing.roommateSynergy && (
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-sans font-medium bg-ink-primary/75 backdrop-blur-md text-canvas border border-white/10 flex items-center gap-1.5 shadow-sm">
              <Users className="w-3.5 h-3.5" />
              {listing.roommateSynergy.currentOccupantsCount} of {listing.roommateSynergy.totalSeatsCount} Seats Taken
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Landmark */}
          <div className="flex items-center justify-between text-xs text-ink-secondary mb-1">
            <div className="flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-ink-tertiary flex-shrink-0" />
              <span className="truncate">
                {listing.blockSector}, {listing.thana}
              </span>
            </div>

            {listing.nearestLandmark && (
              <span className="text-[11px] font-medium text-forest bg-forest-light/80 px-2 py-0.5 rounded-full flex-shrink-0">
                {listing.nearestLandmark.commuteMinutes}m to {listing.nearestLandmark.name}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display text-lg font-normal text-ink-primary group-hover:text-forest transition-colors leading-snug line-clamp-1 mb-2">
            {listing.title}
          </h3>

          {/* Property Specifications Row */}
          <div className="flex items-center gap-3 text-xs text-ink-secondary py-1 mb-3">
            <div className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-ink-tertiary" />
              <span>{listing.bedRooms} {isShared ? "Seats" : "Beds"}</span>
            </div>
            <span className="text-hairline">•</span>
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-ink-tertiary" />
              <span>{listing.bathRooms} Baths</span>
            </div>
            <span className="text-hairline">•</span>
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-ink-tertiary" />
              <span>{listing.carpetAreaSqft} sqft</span>
            </div>
            <span className="text-hairline">•</span>
            <span className="text-ink-tertiary">Fl. {listing.floorLevel}</span>
          </div>
        </div>

        {/* Pricing & Transparency Action */}
        <div className="pt-3 border-t border-hairline flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-sans font-bold text-xl text-ink-primary tabular-nums">
                ৳{listing.costBreakdown.baseRent.toLocaleString()}
              </span>
              <span className="text-xs text-ink-tertiary">/ mo</span>
            </div>
            <div className="text-[11px] text-ink-secondary flex items-center gap-1">
              <span className="text-forest font-medium tabular-nums">
                ~৳{listing.costBreakdown.estimatedGrossMonthlyCost.toLocaleString()}
              </span>
              <span>total est. outlay</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <EditorialButton
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCostBreakdown?.(listing);
              }}
              className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-sans hover:border-forest/40"
            >
              <Receipt className="w-3.5 h-3.5 text-forest" />
              <span>Breakdown</span>
            </EditorialButton>
            {onScheduleViewing && (
              <EditorialButton
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onScheduleViewing(listing);
                }}
                className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-sans"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Visit</span>
              </EditorialButton>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
