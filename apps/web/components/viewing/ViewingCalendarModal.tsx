"use client";

import React, { useState, useMemo } from "react";
import {
  ViewingSlot,
  ViewingAppointment,
  generateUpcomingViewingSlots,
  checkSlotCollision,
  bookViewingAppointment,
  generateIcsCalendar,
  TIME_SLOT_DEFINITIONS,
} from "@/lib/viewing-calendar";
import { PropertyListingItem } from "@/components/listings/types";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { EditorialButton } from "@/components/ui/EditorialButton";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  MapPin,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Download,
  CalendarCheck,
  FileCheck,
} from "lucide-react";

interface ViewingCalendarModalProps {
  property: PropertyListingItem | null;
  isOpen: boolean;
  onClose: () => void;
  existingAppointments: ViewingAppointment[];
  onAppointmentBooked: (appointment: ViewingAppointment) => void;
}

export function ViewingCalendarModal({
  property,
  isOpen,
  onClose,
  existingAppointments,
  onAppointmentBooked,
}: ViewingCalendarModalProps) {
  // Calendar slot selection state
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [selectedSlotLabel, setSelectedSlotLabel] = useState<string | null>(null);

  // Tenant Intake Form State
  const [tenantName, setTenantName] = useState("");
  const [tenantPhone, setTenantPhone] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [shareDossier, setShareDossier] = useState(true);

  // Status feedback
  const [collisionWarning, setCollisionWarning] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<ViewingAppointment | null>(null);

  // Generate 7 upcoming days
  const upcomingDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isoDate = d.toISOString().split("T")[0];
      const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = d.getDate();
      const monthStr = d.toLocaleDateString("en-US", { month: "short" });
      days.push({
        index: i,
        isoDate,
        weekday,
        dayNum,
        monthStr,
        isToday: i === 0,
      });
    }
    return days;
  }, []);

  const selectedDateStr = upcomingDays[selectedDayIndex]?.isoDate || "";

  // Generate slots for this property across 7 days
  const allSlots = useMemo(() => {
    if (!property) return [];
    return generateUpcomingViewingSlots(property.id, existingAppointments, 7);
  }, [property, existingAppointments]);

  // Filter slots for active selected day
  const slotsForActiveDay = useMemo(() => {
    return allSlots.filter((s) => s.date === selectedDateStr);
  }, [allSlots, selectedDateStr]);

  if (!isOpen || !property) return null;

  const handleSelectSlot = (slot: ViewingSlot) => {
    if (slot.isBooked) {
      setCollisionWarning(
        `Collision Alert: This slot is already locked under booking ${slot.bookedByRef || "RP-VIEW-XXXX"}. Please choose an open window.`
      );
      return;
    }
    setCollisionWarning(null);
    setSelectedSlotLabel(slot.timeSlot);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotLabel) {
      setCollisionWarning("Please select an available viewing time window first.");
      return;
    }

    const result = bookViewingAppointment(
      {
        id: property.id,
        title: property.title,
        holdingNumber: property.holdingNumber || "",
        roadNumber: property.roadNumber || "",
        blockSector: property.blockSector,
        thana: property.thana,
        landlordName: property.landlordName,
        landlordPhone: "+880 1711-892341",
      },
      selectedDateStr,
      selectedSlotLabel,
      {
        tenantName,
        tenantPhone,
        tenantEmail,
        notes,
        dossierVaultShared: shareDossier,
      },
      existingAppointments
    );

    if (!result.success || !result.appointment) {
      setCollisionWarning(result.error || "Booking failed due to timeslot conflict.");
      return;
    }

    setCollisionWarning(null);
    setConfirmedAppointment(result.appointment);
    onAppointmentBooked(result.appointment);
  };

  const handleDownloadIcs = () => {
    if (!confirmedAppointment) return;
    const icsString = generateIcsCalendar(confirmedAppointment);
    const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${confirmedAppointment.bookingRef}-viewing.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetAndClose = () => {
    setConfirmedAppointment(null);
    setCollisionWarning(null);
    setSelectedSlotLabel(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink-primary/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-hairline rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-card flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 sm:p-8 border-b border-hairline bg-surface sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GlassBadge variant="forest">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Anti-Collision Viewing Calendar</span>
              </GlassBadge>
              {property.isVerifiedLessor && (
                <span className="inline-flex items-center gap-1 text-[11px] text-forest font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Lessor
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-ink-primary tracking-tight">
              Schedule Property Viewing
            </h2>
            <p className="text-xs text-ink-secondary mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
              <span>
                {property.title} — {property.holdingNumber}, {property.roadNumber}, {property.thana}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-2 rounded-full text-ink-tertiary hover:text-ink-primary hover:bg-muted-sand transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {confirmedAppointment ? (
            /* Confirmation Screen */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-forest-light text-forest mx-auto flex items-center justify-center shadow-subtle border border-forest/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-forest font-sans">
                  Viewing Confirmed & Reserved
                </span>
                <h3 className="text-2xl font-display font-bold text-ink-primary mt-1">
                  Slot Locked Successfully
                </h3>
                <p className="text-xs text-ink-secondary mt-1.5 max-w-md mx-auto leading-relaxed">
                  The anti-collision lock has secured your appointment. The landlord has been notified and duplicate reservations are blocked.
                </p>
              </div>

              {/* Booking Reference Card */}
              <div className="bg-muted-sand/40 border border-hairline rounded-2xl p-5 max-w-md mx-auto text-left space-y-3 shadow-subtle">
                <div className="flex items-center justify-between pb-3 border-b border-hairline">
                  <span className="text-xs text-ink-secondary font-medium">Booking Reference</span>
                  <span className="font-mono font-bold text-sm text-forest bg-forest-light px-2.5 py-0.5 rounded-lg border border-forest/20">
                    {confirmedAppointment.bookingRef}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-ink-tertiary block">Date</span>
                    <span className="font-semibold text-ink-primary mt-0.5 block">
                      {confirmedAppointment.date}
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-tertiary block">Time Window</span>
                    <span className="font-semibold text-ink-primary mt-0.5 block">
                      {confirmedAppointment.timeSlot}
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-tertiary block">Host / Landlord</span>
                    <span className="font-semibold text-ink-primary mt-0.5 block">
                      {confirmedAppointment.landlordName}
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-tertiary block">Tenant</span>
                    <span className="font-semibold text-ink-primary mt-0.5 block">
                      {confirmedAppointment.tenantName}
                    </span>
                  </div>
                </div>

                {confirmedAppointment.dossierShared && (
                  <div className="pt-2 border-t border-hairline flex items-center gap-1.5 text-xs text-forest">
                    <FileCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Encrypted Tenancy Dossier Linked for Landlord Fast-Track</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <EditorialButton variant="primary" size="md" onClick={handleDownloadIcs}>
                  <Download className="w-4 h-4" />
                  <span>Download .ICS Calendar Event</span>
                </EditorialButton>
                <EditorialButton variant="outline" size="md" onClick={handleResetAndClose}>
                  <span>Done</span>
                </EditorialButton>
              </div>
            </div>
          ) : (
            /* Booking Flow */
            <form onSubmit={handleConfirmBooking} className="space-y-6">
              {/* Collision Warning Alert */}
              {collisionWarning && (
                <div className="p-4 rounded-2xl bg-terracotta-light border border-terracotta/20 text-terracotta text-xs font-medium flex items-center justify-between shadow-subtle">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-terracotta shrink-0" />
                    <span>{collisionWarning}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCollisionWarning(null)}
                    className="text-terracotta/60 hover:text-terracotta font-bold"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 1: Horizontal 7-Day Date Picker */}
              <div>
                <label className="block text-xs font-sans font-semibold text-ink-primary uppercase tracking-wider mb-2.5">
                  1. Select Inspection Date
                </label>
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {upcomingDays.map((day) => {
                    const isSelected = selectedDayIndex === day.index;
                    return (
                      <button
                        key={day.isoDate}
                        type="button"
                        onClick={() => {
                          setSelectedDayIndex(day.index);
                          setSelectedSlotLabel(null);
                          setCollisionWarning(null);
                        }}
                        className={`p-2 sm:p-2.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                          isSelected
                            ? "bg-forest text-canvas border-forest shadow-card"
                            : "bg-muted-sand/30 border-hairline hover:border-hairline-hover hover:bg-muted-sand text-ink-secondary"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-medium opacity-80">
                          {day.weekday}
                        </span>
                        <span className="text-base sm:text-lg font-bold font-display mt-0.5">
                          {day.dayNum}
                        </span>
                        <span className="text-[9px] opacity-70">{day.monthStr}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Time Slot Matrix */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-sans font-semibold text-ink-primary uppercase tracking-wider">
                    2. Select Viewing Window ({selectedDateStr})
                  </label>
                  <span className="text-[11px] text-ink-tertiary">
                    {slotsForActiveDay.filter((s) => !s.isBooked).length} slots available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {slotsForActiveDay.map((slot) => {
                    const isSelected = selectedSlotLabel === slot.timeSlot;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={slot.isBooked}
                        onClick={() => handleSelectSlot(slot)}
                        className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          slot.isBooked
                            ? "bg-muted-sand/20 border-hairline text-ink-tertiary cursor-not-allowed opacity-60"
                            : isSelected
                            ? "bg-forest-light border-forest/40 text-forest shadow-sm"
                            : "bg-surface border-hairline hover:border-hairline-hover text-ink-primary hover:bg-muted-sand/20"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock
                            className={`w-4 h-4 ${
                              isSelected ? "text-forest" : "text-ink-tertiary"
                            }`}
                          />
                          <div>
                            <div className="text-xs font-semibold font-sans">{slot.timeSlot}</div>
                            <div className="text-[10px] text-ink-tertiary capitalize mt-0.5">
                              {slot.period} Window
                            </div>
                          </div>
                        </div>

                        {slot.isBooked ? (
                          <span className="text-[10px] font-semibold text-terracotta bg-terracotta-light px-2 py-0.5 rounded-full border border-terracotta/20">
                            Booked
                          </span>
                        ) : isSelected ? (
                          <span className="text-[10px] font-semibold text-forest bg-forest-light px-2 py-0.5 rounded-full border border-forest/20">
                            Selected
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-ink-secondary bg-muted-sand px-2 py-0.5 rounded-full">
                            Available
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Tenant Intake Form */}
              <div className="pt-4 border-t border-hairline space-y-4">
                <label className="block text-xs font-sans font-semibold text-ink-primary uppercase tracking-wider">
                  3. Prospective Tenant Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-ink-secondary block mb-1">
                      Full Legal Name *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-ink-tertiary absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Abdullah Al Noman"
                        value={tenantName}
                        onChange={(e) => setTenantName(e.target.value)}
                        className="w-full bg-muted-sand/40 border border-hairline rounded-xl pl-9 pr-3.5 py-2 text-xs text-ink-primary focus:outline-none focus:border-forest"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-ink-secondary block mb-1">
                      Mobile Phone (+880) *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-ink-tertiary absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="+880 1711-234567"
                        value={tenantPhone}
                        onChange={(e) => setTenantPhone(e.target.value)}
                        className="w-full bg-muted-sand/40 border border-hairline rounded-xl pl-9 pr-3.5 py-2 text-xs text-ink-primary focus:outline-none focus:border-forest"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-ink-secondary block mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-ink-tertiary absolute left-3 top-3" />
                      <input
                        type="email"
                        placeholder="tenant@domain.com"
                        value={tenantEmail}
                        onChange={(e) => setTenantEmail(e.target.value)}
                        className="w-full bg-muted-sand/40 border border-hairline rounded-xl pl-9 pr-3.5 py-2 text-xs text-ink-primary focus:outline-none focus:border-forest"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-ink-secondary block mb-1">
                      Inspection Notes / Vehicle Parking
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bringing car, need parking test"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-3.5 py-2 text-xs text-ink-primary focus:outline-none focus:border-forest"
                    />
                  </div>
                </div>

                {/* Dossier Linking Checkbox */}
                <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-forest-light/40 border border-forest/15 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={shareDossier}
                    onChange={(e) => setShareDossier(e.target.checked)}
                    className="mt-0.5 rounded border border-hairline text-forest focus:ring-forest"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-forest block">
                      Fast-Track via Encrypted Tenancy Dossier
                    </span>
                    <span className="text-[11px] text-ink-secondary leading-snug block mt-0.5">
                      Shares cryptographic proof of student or employment standing with the landlord for priority consideration.
                    </span>
                  </div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-hairline">
                <EditorialButton variant="outline" size="sm" onClick={handleResetAndClose}>
                  Cancel
                </EditorialButton>
                <EditorialButton
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={!selectedSlotLabel}
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Lock & Reserve Viewing Slot</span>
                </EditorialButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
