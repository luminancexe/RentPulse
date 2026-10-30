"use client";

import React, { useEffect } from "react";
import { X, ShieldCheck, Info, CheckCircle2, Zap, Flame, Droplets, Trash2, Wifi, Building2 } from "lucide-react";
import { EditorialButton } from "@/components/ui/EditorialButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { PropertyListingItem } from "./types";

interface CostBreakdownDrawerProps {
  listing: PropertyListingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onScheduleViewing?: (listing: PropertyListingItem) => void;
}

export function CostBreakdownDrawer({
  listing,
  isOpen,
  onClose,
  onScheduleViewing,
}: CostBreakdownDrawerProps) {
  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !listing) return null;

  const { costBreakdown } = listing;

  const depositTotal =
    costBreakdown.baseRent * (costBreakdown.securityDepositMonths || 1);
  const advanceTotal =
    costBreakdown.baseRent * (costBreakdown.advanceRentMonths || 1);
  const initialMoveInOutlay = depositTotal + advanceTotal;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ink-primary/50 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-lg bg-canvas h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-hairline">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-hairline flex items-start justify-between bg-surface">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-forest bg-forest-light px-2.5 py-0.5 rounded-full">
                Transparent Itemized Breakdown
              </span>
              {listing.isVerifiedLessor && (
                <GlassBadge variant="forest" className="py-0.5 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Title Deed
                </GlassBadge>
              )}
            </div>
            <h3 className="font-display text-xl font-normal text-ink-primary leading-tight">
              {listing.title}
            </h3>
            <p className="text-xs text-ink-secondary mt-0.5">
              {listing.unitNumber ? `${listing.unitNumber} • ` : ""}
              {listing.roadNumber}, {listing.blockSector}, {listing.thana}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cost breakdown"
            className="p-2 rounded-full hover:bg-muted-sand text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Monthly Operating Expense Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-tertiary">
                Monthly Recurring Expenses
              </h4>
              <span className="text-xs text-ink-secondary">Billed Monthly</span>
            </div>

            <div className="bg-surface rounded-2xl p-4 border border-hairline space-y-3.5 shadow-subtle">
              {/* Base Rent */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-forest-light flex items-center justify-center text-forest">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-ink-primary block leading-none">
                      Base Rental
                    </span>
                    <span className="text-[11px] text-ink-tertiary">
                      Exclusive residential usage
                    </span>
                  </div>
                </div>
                <span className="font-sans font-bold text-base text-ink-primary tabular-nums">
                  ৳{costBreakdown.baseRent.toLocaleString()}
                </span>
              </div>

              <div className="border-t border-hairline/60" />

              {/* Service Charge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-muted-sand flex items-center justify-center text-ink-secondary">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-ink-primary block leading-none">
                      Building Service Charge
                    </span>
                    <span className="text-[11px] text-ink-tertiary">
                      Lift, generator backup, security guard, cleaner
                    </span>
                  </div>
                </div>
                <span className="font-sans font-semibold text-sm text-ink-primary tabular-nums">
                  ৳{costBreakdown.serviceCharge.toLocaleString()}
                </span>
              </div>

              {/* Gas Fee */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-muted-sand flex items-center justify-center text-ink-secondary">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-ink-primary block leading-none">
                      Gas Utility
                    </span>
                    <span className="text-[11px] text-ink-tertiary">
                      {costBreakdown.gasSupplyType === "government_pipeline"
                        ? "Titas Government Pipeline (Double Burner)"
                        : "LPG Cylinder replenishment"}
                    </span>
                  </div>
                </div>
                <span className="font-sans font-semibold text-sm text-ink-primary tabular-nums">
                  ৳{costBreakdown.gasFee.toLocaleString()}
                </span>
              </div>

              {/* WASA Water */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-muted-sand flex items-center justify-center text-ink-secondary">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-ink-primary block leading-none">
                      WASA Water Supply
                    </span>
                    <span className="text-[11px] text-ink-tertiary">
                      Municipal metered allocation
                    </span>
                  </div>
                </div>
                <span className="font-sans font-semibold text-sm text-ink-primary tabular-nums">
                  ৳{costBreakdown.wasaWaterFee.toLocaleString()}
                </span>
              </div>

              {/* Electricity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-muted-sand flex items-center justify-center text-ink-secondary">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-ink-primary block leading-none">
                      Electricity Billing
                    </span>
                    <span className="text-[11px] text-ink-tertiary">
                      {costBreakdown.electricityBilling === "prepaid_card"
                        ? "DPDC / DESCO Prepaid Smart Card (pay-as-you-use)"
                        : "Postpaid sub-meter reading"}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-medium text-forest bg-forest-light px-2 py-0.5 rounded-full">
                  Prepaid Card
                </span>
              </div>

              {/* Waste & Cleaner */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-muted-sand flex items-center justify-center text-ink-secondary">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-ink-primary block leading-none">
                      Municipal Waste Collection
                    </span>
                    <span className="text-[11px] text-ink-tertiary">
                      City Corporation daily door collection
                    </span>
                  </div>
                </div>
                <span className="font-sans font-semibold text-sm text-ink-primary tabular-nums">
                  ৳{costBreakdown.wasteCollectionFee.toLocaleString()}
                </span>
              </div>

              {/* Broadband if present */}
              {costBreakdown.broadbandInternetFee && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-muted-sand flex items-center justify-center text-ink-secondary">
                      <Wifi className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-ink-primary block leading-none">
                        Shared Fiber Broadband
                      </span>
                      <span className="text-[11px] text-ink-tertiary">
                        50 Mbps optical fiber connection
                      </span>
                    </div>
                  </div>
                  <span className="font-sans font-semibold text-sm text-ink-primary tabular-nums">
                    ৳{costBreakdown.broadbandInternetFee.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Gross Monthly Total Callout */}
          <div className="bg-forest-light/60 border border-forest/20 rounded-2xl p-4.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-forest uppercase tracking-wider block">
                Total Estimated Monthly Outlay
              </span>
              <span className="text-[11px] text-ink-secondary">
                No hidden service charges upon signing
              </span>
            </div>
            <div className="text-right">
              <span className="font-display text-2xl font-normal text-forest tabular-nums">
                ৳{costBreakdown.estimatedGrossMonthlyCost.toLocaleString()}
              </span>
              <span className="text-xs text-forest/80 block">/ month</span>
            </div>
          </div>

          {/* Upfront Initial Move-in Requirements */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-tertiary">
                Initial Move-in Escrow & Advances
              </h4>
              <span className="text-[11px] text-ink-secondary">Due at signing</span>
            </div>

            <div className="bg-surface rounded-2xl p-4 border border-hairline space-y-3 shadow-subtle">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-secondary">
                  Security Deposit ({costBreakdown.securityDepositMonths || 2} Months)
                </span>
                <span className="font-sans font-semibold text-ink-primary tabular-nums">
                  ৳{depositTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-secondary">
                  Advance Rent ({costBreakdown.advanceRentMonths || 1} Month)
                </span>
                <span className="font-sans font-semibold text-ink-primary tabular-nums">
                  ৳{advanceTotal.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-hairline/60 pt-2 flex items-center justify-between text-sm font-bold">
                <span className="text-ink-primary">Total Move-in Capital Required</span>
                <span className="font-sans text-forest tabular-nums text-base">
                  ৳{initialMoveInOutlay.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Escrow Guarantee Pill */}
            <div className="mt-3 flex items-start gap-2 text-[12px] text-ink-secondary bg-muted-sand/50 p-3 rounded-xl border border-hairline">
              <Info className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
              <span>
                <strong>Deposit Protection:</strong> Security deposits are documented in the digital lease agreement and refundable within 14 days of move-out following mutual condition audit.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-hairline bg-surface flex items-center gap-3">
          <EditorialButton
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Back to Listings
          </EditorialButton>
          <EditorialButton
            variant="primary"
            className="flex-1"
            onClick={() => {
              onScheduleViewing?.(listing);
              onClose();
            }}
          >
            Book Viewing
          </EditorialButton>
        </div>
      </div>
    </div>
  );
}
