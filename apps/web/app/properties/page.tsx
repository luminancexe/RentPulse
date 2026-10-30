"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutGrid,
  Map as MapIcon,
  Home,
  Users,
  Search,
  CheckCircle2,
  CalendarCheck,
  ChevronLeft,
} from "lucide-react";
import { SegmentedControl, SegmentOption } from "@/components/ui/SegmentedControl";
import { EditorialButton } from "@/components/ui/EditorialButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import {
  PropertyCard,
  CostBreakdownDrawer,
  FilterToolbar,
  DhakaMapFeed,
  FilterState,
  PropertyListingItem,
} from "@/components/listings";
import { MOCK_PROPERTIES } from "@/lib/property-data";

type ModeType = "entire_apartment" | "shared_room";
type ViewLayout = "grid" | "split_map";

export default function PropertiesDiscoveryPage() {
  const [activeMode, setActiveMode] = useState<ModeType>("entire_apartment");
  const [viewLayout, setViewLayout] = useState<ViewLayout>("grid");
  const [activeBreakdownProperty, setActiveBreakdownProperty] = useState<PropertyListingItem | null>(null);
  const [selectedMapProperty, setSelectedMapProperty] = useState<PropertyListingItem | null>(null);
  const [bookingToast, setBookingToast] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    neighborhood: "all",
    bedrooms: "all",
    sortBy: "recommended",
    verifiedOnly: false,
  });

  const modeOptions: SegmentOption<ModeType>[] = [
    {
      value: "entire_apartment",
      label: "Entire Apartment",
      badge: "Family & Exec",
      icon: <Home className="w-4 h-4" />,
    },
    {
      value: "shared_room",
      label: "Shared Room / Seat",
      badge: "Students & Singles",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter((item) => {
      // 1. Filter by mode (Entire vs Shared)
      if (item.mode !== activeMode) return false;

      // 2. Filter by neighborhood
      if (filters.neighborhood !== "all") {
        const matchesThana = item.thana.toLowerCase().includes(filters.neighborhood.toLowerCase());
        const matchesBlock = item.blockSector.toLowerCase().includes(filters.neighborhood.toLowerCase());
        if (!matchesThana && !matchesBlock) return false;
      }

      // 3. Filter by bedrooms / seats
      if (filters.bedrooms !== "all") {
        if (filters.bedrooms === "4+") {
          if (item.bedRooms < 4) return false;
        } else {
          if (item.bedRooms !== parseInt(filters.bedrooms, 10)) return false;
        }
      }

      // 4. Verified Lessor
      if (filters.verifiedOnly && !item.isVerifiedLessor) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price_asc") {
        return a.costBreakdown.baseRent - b.costBreakdown.baseRent;
      }
      if (filters.sortBy === "price_desc") {
        return b.costBreakdown.baseRent - a.costBreakdown.baseRent;
      }
      if (filters.sortBy === "synergy" && a.roommateSynergy && b.roommateSynergy) {
        return b.roommateSynergy.compatibilityScore - a.roommateSynergy.compatibilityScore;
      }
      return 0; // Default curated order
    });
  }, [activeMode, filters]);

  const handleScheduleViewing = (prop: PropertyListingItem) => {
    setBookingToast(`Viewing request registered for ${prop.title}! Landlord SMS alert dispatched.`);
    setTimeout(() => setBookingToast(null), 5000);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col font-sans">
      {/* Top Notification Toast */}
      {bookingToast && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="bg-forest text-canvas px-4 py-3 rounded-2xl shadow-hover flex items-center gap-3 border border-forest-hover">
            <CalendarCheck className="w-5 h-5 text-canvas flex-shrink-0" />
            <p className="text-xs font-sans font-medium">{bookingToast}</p>
          </div>
        </div>
      )}

      {/* Primary Sticky Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Back button */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-ink-secondary hover:text-ink-primary font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center p-1.5 text-canvas shadow-subtle">
                <Image src="/logo.png" alt="RentPulse" width={24} height={24} className="brightness-200" />
              </div>
              <span className="font-display font-medium text-xl tracking-tight text-ink-primary">
                RentPulse
              </span>
            </Link>
          </div>

          {/* Central Dual-Mode Segmented Control */}
          <div className="flex-1 max-w-md mx-auto hidden md:flex justify-center">
            <SegmentedControl
              options={modeOptions}
              value={activeMode}
              onChange={(newMode) => {
                setActiveMode(newMode);
                setSelectedMapProperty(null);
              }}
            />
          </div>

          {/* View Mode Toggle (Grid vs Split Map) */}
          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 rounded-full bg-muted-sand/70 border border-hairline">
              <button
                type="button"
                onClick={() => setViewLayout("grid")}
                aria-label="Grid layout view"
                className={`p-2 rounded-full transition-all cursor-pointer ${
                  viewLayout === "grid"
                    ? "bg-surface text-ink-primary shadow-subtle border border-hairline"
                    : "text-ink-secondary hover:text-ink-primary"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewLayout("split_map")}
                aria-label="Split map view"
                className={`p-2 rounded-full transition-all cursor-pointer ${
                  viewLayout === "split_map"
                    ? "bg-surface text-ink-primary shadow-subtle border border-hairline"
                    : "text-ink-secondary hover:text-ink-primary"
                }`}
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dual-Mode Switcher */}
        <div className="md:hidden px-4 pb-3 flex justify-center">
          <SegmentedControl
            options={modeOptions}
            value={activeMode}
            onChange={(newMode) => {
              setActiveMode(newMode);
              setSelectedMapProperty(null);
            }}
            size="sm"
            className="w-full justify-between"
          />
        </div>
      </header>

      {/* Hero Sub-header */}
      <section className="bg-canvas border-b border-hairline/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-forest bg-forest-light px-2.5 py-0.5 rounded-full">
                {activeMode === "entire_apartment" ? "Exclusive Flat Leases" : "Roommate Cohabitation & Seats"}
              </span>
              <span className="text-xs text-ink-tertiary">• Zero Hidden Utility Surcharges</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl text-ink-primary font-normal tracking-tight mb-2">
              {activeMode === "entire_apartment"
                ? "Curated Residences in Dhaka's Prime Sectors"
                : "Verified Shared Flats & Cohabitation Seats"}
            </h1>

            <p className="text-sm sm:text-base text-ink-secondary font-sans leading-relaxed">
              {activeMode === "entire_apartment"
                ? "Explore verified family apartments across Dhanmondi, Gulshan, and Mirpur DOHS with full transparent utility unbundling and verified ownership deeds."
                : "Match with compatible students and young professionals based on sleep chronotypes, noise tolerance, and transit proximity to NSU, IUB, BRACU, and MRT-6."}
            </p>
          </div>

          {/* Filter Toolbar */}
          <div className="mt-6 pt-6 border-t border-hairline">
            <FilterToolbar
              filters={filters}
              onChange={setFilters}
              totalResults={filteredProperties.length}
              isSharedMode={activeMode === "shared_room"}
            />
          </div>
        </div>
      </section>

      {/* Main Content View (Grid or Split Map) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProperties.length === 0 ? (
          /* Empty State */
          <div className="bg-surface rounded-3xl p-12 text-center border border-hairline max-w-md mx-auto my-12 shadow-subtle">
            <div className="w-12 h-12 rounded-full bg-muted-sand flex items-center justify-center mx-auto mb-4 text-ink-tertiary">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-normal text-ink-primary mb-1">
              No matching properties found
            </h3>
            <p className="text-xs text-ink-secondary mb-6">
              Try relaxing your neighborhood or bedroom filters to see more verified residences.
            </p>
            <EditorialButton
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters({
                  neighborhood: "all",
                  bedrooms: "all",
                  sortBy: "recommended",
                  verifiedOnly: false,
                })
              }
            >
              Reset All Filters
            </EditorialButton>
          </div>
        ) : viewLayout === "grid" ? (
          /* 3-Column Responsive Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                listing={prop}
                onOpenCostBreakdown={(p) => setActiveBreakdownProperty(p)}
                onSelectProperty={(p) => setActiveBreakdownProperty(p)}
              />
            ))}
          </div>
        ) : (
          /* Split Map View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Property List (5 cols) */}
            <div className="lg:col-span-5 space-y-6 max-h-[820px] overflow-y-auto pr-2 no-scrollbar">
              {filteredProperties.map((prop) => (
                <div
                  key={prop.id}
                  className={
                    selectedMapProperty?.id === prop.id
                      ? "ring-2 ring-forest rounded-3xl"
                      : ""
                  }
                >
                  <PropertyCard
                    listing={prop}
                    onOpenCostBreakdown={(p) => setActiveBreakdownProperty(p)}
                    onSelectProperty={(p) => setSelectedMapProperty(p)}
                  />
                </div>
              ))}
            </div>

            {/* Right Column: Sticky Dhaka Map Feed (7 cols) */}
            <div className="lg:col-span-7 sticky top-28 h-[750px]">
              <DhakaMapFeed
                properties={filteredProperties}
                selectedProperty={selectedMapProperty}
                onSelectProperty={(p) => setSelectedMapProperty(p)}
                onOpenCostBreakdown={(p) => setActiveBreakdownProperty(p)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Itemized Cost Breakdown Drawer */}
      <CostBreakdownDrawer
        listing={activeBreakdownProperty}
        isOpen={Boolean(activeBreakdownProperty)}
        onClose={() => setActiveBreakdownProperty(null)}
        onScheduleViewing={handleScheduleViewing}
      />
    </div>
  );
}
