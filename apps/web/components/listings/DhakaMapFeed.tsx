"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Compass, Layers, ShieldCheck, Sparkles, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PropertyListingItem } from "./types";
import { GlassBadge } from "@/components/ui/GlassBadge";

interface DhakaMapFeedProps {
  properties: PropertyListingItem[];
  selectedProperty: PropertyListingItem | null;
  onSelectProperty: (property: PropertyListingItem | null) => void;
  onOpenCostBreakdown?: (property: PropertyListingItem) => void;
  className?: string;
}

// Dhaka Landmark Nodes mapped to SVG viewBox (0,0 to 1000, 1000)
// Real coordinates bounds approx: Lat 23.70 to 23.88, Lng 90.35 to 90.45
function projectCoords(lat: number, lng: number): { x: number; y: number } {
  const minLat = 23.72;
  const maxLat = 23.88;
  const minLng = 90.35;
  const maxLng = 90.44;

  const x = ((lng - minLng) / (maxLng - minLng)) * 800 + 100;
  const y = (1 - (lat - minLat) / (maxLat - minLat)) * 800 + 100;
  return { x, y };
}

export function DhakaMapFeed({
  properties,
  selectedProperty,
  onSelectProperty,
  onOpenCostBreakdown,
  className,
}: DhakaMapFeedProps) {
  const [hoveredProperty, setHoveredProperty] = useState<PropertyListingItem | null>(null);

  // Key Dhaka Landmark Nodes
  const landmarks = [
    { name: "Uttara North Metro", lat: 23.8683, lng: 90.3984, type: "transit" },
    { name: "Mirpur-10 Metro", lat: 23.807, lng: 90.3685, type: "transit" },
    { name: "NSU & IUB", lat: 23.8151, lng: 90.4255, type: "university" },
    { name: "BRAC University", lat: 23.7738, lng: 90.4257, type: "university" },
    { name: "Dhaka University", lat: 23.7335, lng: 90.3929, type: "university" },
    { name: "Gulshan-2 Circle", lat: 23.7925, lng: 90.4167, type: "hub" },
    { name: "Dhanmondi Lake", lat: 23.7461, lng: 90.3752, type: "nature" },
    { name: "Motijheel CBD", lat: 23.733, lng: 90.4175, type: "hub" },
  ];

  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[500px] rounded-3xl overflow-hidden bg-[#F5F2EB] border border-hairline shadow-card flex flex-col",
        className
      )}
    >
      {/* Map Control Bar Top */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-surface/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-hairline shadow-subtle text-xs font-sans text-ink-primary">
          <Compass className="w-3.5 h-3.5 text-forest" />
          <span className="font-semibold">Dhaka Spatial Matrix</span>
          <span className="text-ink-tertiary">• WGS-84 PostGIS</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-hairline shadow-subtle text-[11px] font-sans text-ink-secondary">
          <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
          <span>MRT-6 Metro & Campus Radiuses</span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full flex-1 overflow-hidden select-none">
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full object-cover"
          style={{ background: "#F6F3EC" }}
        >
          <defs>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(28, 26, 23, 0.03)"
                strokeWidth="1"
              />
            </pattern>
            {/* Soft gradient glow for clusters */}
            <radialGradient id="transitGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2C4A3E" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#2C4A3E" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="1000" height="1000" fill="url(#gridPattern)" />

          {/* Stylized Dhaka River & Lakes */}
          {/* Turag / Buriganga River path outline */}
          <path
            d="M 120 50 Q 80 300 110 500 T 160 800 T 250 950"
            fill="none"
            stroke="#DDE6E2"
            strokeWidth="32"
            strokeLinecap="round"
          />
          {/* Gulshan / Banani Lake */}
          <path
            d="M 640 320 Q 660 440 650 560 T 670 650"
            fill="none"
            stroke="#E1EBE7"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Dhanmondi Lake */}
          <path
            d="M 330 650 Q 320 700 350 740 T 360 800"
            fill="none"
            stroke="#E1EBE7"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* MRT-6 Metro Line (Uttara to Motijheel) */}
          <path
            d="M 520 120 L 460 260 L 310 440 L 320 550 L 440 680 L 580 820"
            fill="none"
            stroke="#2C4A3E"
            strokeWidth="3"
            strokeDasharray="6 4"
            opacity="0.35"
          />

          {/* Major Road Arterials */}
          {/* Airport Road / Pragati Sarani */}
          <path
            d="M 540 80 L 530 250 L 620 400 L 680 600 L 640 850"
            fill="none"
            stroke="#ECE7DE"
            strokeWidth="6"
          />
          {/* Mirpur Road */}
          <path
            d="M 280 350 L 290 520 L 310 720 L 350 860"
            fill="none"
            stroke="#ECE7DE"
            strokeWidth="5"
          />

          {/* Landmark Anchor Markers & Radiuses */}
          {landmarks.map((lm, idx) => {
            const p = projectCoords(lm.lat, lm.lng);
            return (
              <g key={idx} transform={`translate(${p.x}, ${p.y})`}>
                {/* 1.5km Transit Radius circle */}
                <circle r="42" fill="url(#transitGlow)" />
                <circle
                  r="4"
                  fill={lm.type === "transit" ? "#2C4A3E" : lm.type === "university" ? "#BD5338" : "#736B64"}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <text
                  x="8"
                  y="4"
                  fontFamily="system-ui, sans-serif"
                  fontSize="10"
                  fontWeight="600"
                  fill="#736B64"
                  opacity="0.85"
                >
                  {lm.name}
                </text>
              </g>
            );
          })}

          {/* Property Pins */}
          {properties.map((prop) => {
            const pos = projectCoords(prop.latitude, prop.longitude);
            const isSelected = selectedProperty?.id === prop.id;
            const isHovered = hoveredProperty?.id === prop.id;
            const isShared = prop.mode === "shared_room";
            const priceText = `৳${(prop.costBreakdown.baseRent / 1000).toFixed(prop.costBreakdown.baseRent % 1000 === 0 ? 0 : 1)}k`;

            return (
              <g
                key={prop.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectProperty(prop)}
                onMouseEnter={() => setHoveredProperty(prop)}
                onMouseLeave={() => setHoveredProperty(null)}
              >
                {/* Ping animation when active */}
                {(isSelected || isHovered) && (
                  <circle
                    r="24"
                    fill={isShared ? "#BD5338" : "#2C4A3E"}
                    opacity="0.25"
                    className="animate-ping"
                  />
                )}

                {/* Pill Shape for Price Pin */}
                <rect
                  x="-32"
                  y="-18"
                  width="64"
                  height="26"
                  rx="13"
                  fill={
                    isSelected
                      ? "#1C1A17"
                      : isHovered
                      ? isShared
                        ? "#BD5338"
                        : "#2C4A3E"
                      : "#FFFFFF"
                  }
                  stroke={isSelected ? "#1C1A17" : "rgba(28, 26, 23, 0.12)"}
                  strokeWidth="1.5"
                  filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.08))"
                />

                {/* Micro Icon / Dot */}
                <circle
                  cx="-18"
                  cy="-5"
                  r="3.5"
                  fill={
                    isSelected || isHovered
                      ? "#FAF8F5"
                      : isShared
                      ? "#BD5338"
                      : "#2C4A3E"
                  }
                />

                {/* Price Label */}
                <text
                  x="3"
                  y="-1"
                  textAnchor="middle"
                  fontFamily="system-ui, sans-serif"
                  fontSize="11"
                  fontWeight="700"
                  fill={isSelected || isHovered ? "#FFFFFF" : "#1C1A17"}
                >
                  {priceText}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Property Floating Bottom Preview Card */}
        {selectedProperty && (
          <div className="absolute bottom-4 left-4 right-4 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="bg-surface rounded-2xl p-3.5 border border-hairline shadow-2xl flex items-center justify-between gap-3 max-w-md mx-auto">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden relative flex-shrink-0 bg-muted-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedProperty.images[0]}
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {selectedProperty.isVerifiedLessor && (
                      <span className="text-[10px] font-sans font-semibold text-forest bg-forest-light px-1.5 py-0.2 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Verified
                      </span>
                    )}
                    <span className="text-[11px] text-ink-secondary truncate">
                      {selectedProperty.blockSector}, {selectedProperty.thana}
                    </span>
                  </div>
                  <h4 className="font-display text-sm font-normal text-ink-primary truncate">
                    {selectedProperty.title}
                  </h4>
                  <div className="text-xs font-sans font-bold text-ink-primary tabular-nums mt-0.5">
                    ৳{selectedProperty.costBreakdown.baseRent.toLocaleString()}
                    <span className="font-normal text-[11px] text-ink-tertiary"> /mo</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenCostBreakdown?.(selectedProperty)}
                  className="px-2.5 py-1.5 rounded-full text-xs font-sans font-medium bg-forest text-canvas hover:bg-forest-hover transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onSelectProperty(null)}
                  aria-label="Close card preview"
                  className="p-1 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-muted-sand transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="px-4 py-2.5 bg-surface/90 border-t border-hairline flex flex-wrap items-center justify-between gap-3 text-[11px] text-ink-secondary font-sans">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-forest" />
            <span>Entire Flat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
            <span>Shared Flat / Seat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-forest border-dashed" />
            <span>MRT-6 Metro Route</span>
          </div>
        </div>

        <span className="text-ink-tertiary">
          Click any pin to inspect pricing & commute radiuses
        </span>
      </div>
    </div>
  );
}
