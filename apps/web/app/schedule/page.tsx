"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ViewingAppointment,
  INITIAL_VIEWING_APPOINTMENTS,
  generateIcsCalendar,
} from "@/lib/viewing-calendar";
import { MOCK_PROPERTIES } from "@/lib/property-data";
import { PropertyListingItem } from "@/components/listings/types";
import { ViewingCalendarModal } from "@/components/viewing";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { EditorialButton } from "@/components/ui/EditorialButton";
import { PillChip } from "@/components/ui/PillChip";
import { EcosystemNavMenu } from "@/components/navigation";
import {
  Calendar,
  CalendarCheck,
  Clock,
  MapPin,
  User,
  Phone,
  ShieldCheck,
  Download,
  Plus,
  Home,
  Users,
  FileText,
  ChevronLeft,
  XCircle,
  Building2,
  FileCheck,
  Scale,
  FileCheck2,
  CreditCard,
} from "lucide-react";

export default function ViewingSchedulePage() {
  const [appointments, setAppointments] = useState<ViewingAppointment[]>(INITIAL_VIEWING_APPOINTMENTS);
  const [selectedPropertyForModal, setSelectedPropertyForModal] = useState<PropertyListingItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "dhanmondi" | "bashundhara" | "gulshan">("all");

  const filteredProperties = MOCK_PROPERTIES.filter((p) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "dhanmondi") return p.thana.toLowerCase().includes("dhanmondi");
    if (activeFilter === "bashundhara") return p.blockSector.toLowerCase().includes("bashundhara");
    if (activeFilter === "gulshan") return p.thana.toLowerCase().includes("gulshan");
    return true;
  });

  const handleBooked = (newAppointment: ViewingAppointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "cancelled" } : app))
    );
  };

  const handleDownloadIcs = (app: ViewingAppointment) => {
    const icsContent = generateIcsCalendar(app);
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${app.bookingRef}-viewing.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeAppointments = appointments.filter((a) => a.status === "confirmed");

  return (
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col font-sans">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-hairline">
        <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 h-20 sm:h-22 flex items-center justify-between gap-6">
          {/* Logo & Back */}
          <div className="flex items-center gap-5 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-ink-secondary hover:text-ink-primary font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center p-1.5 text-canvas shadow-subtle shrink-0">
                <Image src="/logo.png" alt="RentPulse" width={26} height={26} className="brightness-200" />
              </div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-ink-primary">
                RentPulse
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <EcosystemNavMenu currentPath="/schedule" />
            <GlassBadge variant="forest">
              Anti-Collision Active
            </GlassBadge>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-10 w-full">
        {/* Hero Card */}
        <div className="mb-8 bg-surface border border-hairline rounded-3xl p-8 sm:p-10 shadow-card">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <GlassBadge variant="forest">
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Viewing Appointment Engine</span>
                </GlassBadge>
                <span className="text-xs text-ink-tertiary">Real-Time Collision Prevention</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-primary tracking-tight">
                In-Person Property Inspection Schedule
              </h1>
              <p className="text-sm text-ink-secondary mt-2.5 leading-relaxed">
                Coordinate residential visits across Dhaka without double-booking or scheduling friction. Each inspection window is locked in real-time, pre-linked with encrypted tenant credentials, and synchronized directly with your digital calendar via standard .ICS export.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="p-5 rounded-2xl bg-muted-sand/40 border border-hairline flex items-center gap-6 shrink-0">
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-forest">
                  {activeAppointments.length}
                </div>
                <div className="text-[10px] uppercase font-semibold text-ink-secondary tracking-wider mt-0.5">
                  Confirmed Visits
                </div>
              </div>
              <div className="h-8 w-[1px] bg-hairline" />
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-ink-primary">
                  {MOCK_PROPERTIES.length}
                </div>
                <div className="text-[10px] uppercase font-semibold text-ink-secondary tracking-wider mt-0.5">
                  Properties Open
                </div>
              </div>
              <div className="h-8 w-[1px] bg-hairline" />
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-forest">
                  100%
                </div>
                <div className="text-[10px] uppercase font-semibold text-ink-secondary tracking-wider mt-0.5">
                  Collision-Free
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmed Appointments Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-display font-bold text-ink-primary tracking-tight">
                Scheduled Inspections ({activeAppointments.length})
              </h2>
              <p className="text-xs text-ink-secondary mt-0.5">
                Upcoming property viewing reservations with confirmed landlord hosts
              </p>
            </div>
          </div>

          {activeAppointments.length === 0 ? (
            <div className="bg-surface rounded-3xl border border-hairline p-10 text-center shadow-card">
              <Calendar className="w-10 h-10 text-ink-tertiary mx-auto mb-3" />
              <h3 className="font-display font-bold text-base text-ink-primary">
                No active viewing appointments
              </h3>
              <p className="text-xs text-ink-secondary mt-1 max-w-sm mx-auto">
                Select an open residence below to reserve an anti-collision inspection slot.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.map((app) => {
                const isCancelled = app.status === "cancelled";
                return (
                  <div
                    key={app.id}
                    className={`bg-surface rounded-3xl border border-hairline p-6 shadow-card transition-all flex flex-col justify-between ${
                      isCancelled ? "opacity-60 bg-muted-sand/20" : "hover:shadow-hover"
                    }`}
                  >
                    <div>
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-hairline mb-4">
                        <div>
                          <span className="font-mono text-xs font-bold text-forest bg-forest-light px-2 py-0.5 rounded-lg border border-forest/20">
                            {app.bookingRef}
                          </span>
                          <h3 className="font-display font-bold text-base text-ink-primary mt-2 leading-snug">
                            {app.propertyTitle}
                          </h3>
                        </div>
                        <GlassBadge
                          variant={isCancelled ? "terracotta" : "forest"}
                        >
                          {isCancelled ? "Cancelled" : "Confirmed"}
                        </GlassBadge>
                      </div>

                      {/* Details */}
                      <div className="space-y-2.5 text-xs text-ink-secondary mb-5">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0 mt-0.5" />
                          <span className="leading-snug">{app.propertyAddress}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-ink-tertiary shrink-0" />
                          <span className="font-semibold text-ink-primary">{app.date}</span>
                          <span className="text-ink-tertiary">({app.timeSlot})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-ink-tertiary shrink-0" />
                          <span>Host: <strong className="text-ink-primary">{app.landlordName}</strong> ({app.landlordPhone})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-ink-tertiary shrink-0" />
                          <span>Visitor: <strong className="text-ink-primary">{app.tenantName}</strong></span>
                        </div>
                        {app.dossierShared && (
                          <div className="flex items-center gap-1.5 text-forest font-medium pt-1">
                            <FileCheck className="w-3.5 h-3.5 shrink-0" />
                            <span>Encrypted Dossier Pre-Verified</span>
                          </div>
                        )}
                        {app.notes && (
                          <p className="text-[11px] text-ink-tertiary italic bg-muted-sand/40 p-2.5 rounded-xl border border-hairline mt-2">
                            "{app.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {!isCancelled && (
                      <div className="pt-3 border-t border-hairline flex items-center justify-between gap-2">
                        <EditorialButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadIcs(app)}
                          className="text-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>.ICS Calendar</span>
                        </EditorialButton>
                        <button
                          type="button"
                          onClick={() => handleCancelAppointment(app.id)}
                          className="text-xs text-terracotta hover:underline font-medium px-2 py-1"
                        >
                          Cancel Slot
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Open Properties & Booking Launcher Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-hairline gap-4">
            <div>
              <h2 className="text-xl font-display font-bold text-ink-primary tracking-tight">
                Open Dhaka Residences Available for Viewing
              </h2>
              <p className="text-xs text-ink-secondary mt-0.5">
                Select a verified listing to inspect available calendar windows and reserve a visit
              </p>
            </div>

            {/* Neighborhood Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <PillChip
                active={activeFilter === "all"}
                variant="forest"
                onClick={() => setActiveFilter("all")}
              >
                All Hubs
              </PillChip>
              <PillChip
                active={activeFilter === "dhanmondi"}
                variant="forest"
                onClick={() => setActiveFilter("dhanmondi")}
              >
                Dhanmondi
              </PillChip>
              <PillChip
                active={activeFilter === "bashundhara"}
                variant="forest"
                onClick={() => setActiveFilter("bashundhara")}
              >
                Bashundhara R/A
              </PillChip>
              <PillChip
                active={activeFilter === "gulshan"}
                variant="forest"
                onClick={() => setActiveFilter("gulshan")}
              >
                Gulshan
              </PillChip>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-surface rounded-3xl border border-hairline p-6 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-hairline mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-forest bg-forest-light px-2.5 py-0.5 rounded-full">
                      {property.mode === "entire_apartment" ? "Full Residence" : "Shared Room / Seat"}
                    </span>
                    {property.isVerifiedLessor && (
                      <span className="flex items-center gap-1 text-[11px] text-forest font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Lessor
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-lg text-ink-primary leading-snug">
                    {property.title}
                  </h3>
                  <p className="text-xs text-ink-secondary mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                    <span>
                      {property.holdingNumber}, {property.roadNumber}, {property.thana}
                    </span>
                  </p>

                  <div className="mt-4 p-3 rounded-2xl bg-muted-sand/40 border border-hairline flex items-center justify-between text-xs">
                    <div>
                      <span className="text-ink-tertiary block">Monthly Rent</span>
                      <span className="font-bold font-sans text-ink-primary">
                        ৳{property.costBreakdown.baseRent.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-ink-tertiary block">Host / Landlord</span>
                      <span className="font-semibold text-ink-primary">
                        {property.landlordName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-hairline flex items-center justify-between">
                  <span className="text-xs text-ink-tertiary">Anti-Collision Protected</span>
                  <EditorialButton
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedPropertyForModal(property)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Schedule Inspection</span>
                  </EditorialButton>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer info banner */}
        <div className="mt-14 pt-8 border-t border-hairline text-center text-xs text-ink-tertiary">
          RentPulse Viewing Schedule Engine • Anti-Collision Lock & Standard RFC 5545 iCalendar Synchronizer
        </div>
      </main>

      {/* Viewing Calendar Modal */}
      <ViewingCalendarModal
        property={selectedPropertyForModal}
        isOpen={!!selectedPropertyForModal}
        onClose={() => setSelectedPropertyForModal(null)}
        existingAppointments={appointments}
        onAppointmentBooked={handleBooked}
      />
    </div>
  );
}
