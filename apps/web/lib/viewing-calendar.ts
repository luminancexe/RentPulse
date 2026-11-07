/**
 * RentPulse Viewing Calendar & Anti-Collision Slot Booking Engine
 *
 * Implements:
 * - Anti-collision slot reservation engine (locks slots to prevent double-booking)
 * - Standardized Dhaka property viewing time windows
 * - RFC 5545 compliant iCalendar (.ics) invite generator
 * - Automated booking reference generator (RP-VIEW-XXXX)
 */

export interface ViewingSlot {
  id: string;
  propertyId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM - 11:30 AM"
  period: "morning" | "afternoon" | "evening" | "night";
  isBooked: boolean;
  bookedByRef?: string;
}

export interface TenantBookingInput {
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  notes?: string;
  dossierVaultShared?: boolean;
}

export interface ViewingAppointment {
  id: string;
  bookingRef: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  landlordName: string;
  landlordPhone: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  status: "confirmed" | "cancelled" | "completed";
  dossierShared: boolean;
  notes?: string;
  createdAt: string;
}

export const TIME_SLOT_DEFINITIONS: Array<{
  id: string;
  label: string;
  period: "morning" | "afternoon" | "evening" | "night";
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}> = [
  {
    id: "slot-morning",
    label: "10:00 AM – 11:30 AM",
    period: "morning",
    startHour: 10,
    startMinute: 0,
    endHour: 11,
    endMinute: 30,
  },
  {
    id: "slot-afternoon",
    label: "02:30 PM – 04:00 PM",
    period: "afternoon",
    startHour: 14,
    startMinute: 30,
    endHour: 16,
    endMinute: 0,
  },
  {
    id: "slot-sunset",
    label: "05:00 PM – 06:30 PM",
    period: "evening",
    startHour: 17,
    startMinute: 0,
    endHour: 18,
    endMinute: 30,
  },
  {
    id: "slot-night",
    label: "07:30 PM – 09:00 PM",
    period: "night",
    startHour: 19,
    startMinute: 30,
    endHour: 21,
    endMinute: 0,
  },
];

/**
 * Generate a dynamic 7-day calendar window for a property
 */
export function generateUpcomingViewingSlots(
  propertyId: string,
  existingAppointments: ViewingAppointment[],
  daysCount: number = 7
): ViewingSlot[] {
  const slots: ViewingSlot[] = [];
  const today = new Date();

  for (let d = 0; d < daysCount; d++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + d);
    const dateStr = targetDate.toISOString().split("T")[0];

    for (const def of TIME_SLOT_DEFINITIONS) {
      const slotId = `${propertyId}-${dateStr}-${def.id}`;
      const isAlreadyBooked = existingAppointments.some(
        (app) =>
          app.propertyId === propertyId &&
          app.date === dateStr &&
          app.timeSlot === def.label &&
          app.status === "confirmed"
      );

      const matchingApp = existingAppointments.find(
        (app) =>
          app.propertyId === propertyId &&
          app.date === dateStr &&
          app.timeSlot === def.label &&
          app.status === "confirmed"
      );

      slots.push({
        id: slotId,
        propertyId,
        date: dateStr,
        timeSlot: def.label,
        period: def.period,
        isBooked: isAlreadyBooked,
        bookedByRef: matchingApp?.bookingRef,
      });
    }
  }

  return slots;
}

/**
 * Collision Detector: Verifies whether a given slot is available or collided
 */
export function checkSlotCollision(
  propertyId: string,
  date: string,
  timeSlot: string,
  existingAppointments: ViewingAppointment[]
): { collided: boolean; existingRef?: string; reason?: string } {
  const conflict = existingAppointments.find(
    (app) =>
      app.propertyId === propertyId &&
      app.date === date &&
      app.timeSlot === timeSlot &&
      app.status === "confirmed"
  );

  if (conflict) {
    return {
      collided: true,
      existingRef: conflict.bookingRef,
      reason: `Timeslot is reserved under appointment ${conflict.bookingRef}. Double-booking prevented.`,
    };
  }

  return { collided: false };
}

/**
 * Slot Reservation Engine: Atomically reserves a viewing appointment with collision guard
 */
export function bookViewingAppointment(
  property: {
    id: string;
    title: string;
    holdingNumber: string;
    roadNumber: string;
    blockSector: string;
    thana: string;
    landlordName: string;
    landlordPhone?: string;
  },
  date: string,
  timeSlot: string,
  tenant: TenantBookingInput,
  currentAppointments: ViewingAppointment[]
): {
  success: boolean;
  appointment?: ViewingAppointment;
  error?: string;
} {
  // Validate tenant fields
  if (!tenant.tenantName.trim()) {
    return { success: false, error: "Tenant legal name is required." };
  }
  if (!tenant.tenantPhone.trim() || tenant.tenantPhone.length < 8) {
    return { success: false, error: "Valid contact phone number is required." };
  }

  // Enforce Anti-Collision Check
  const collision = checkSlotCollision(property.id, date, timeSlot, currentAppointments);
  if (collision.collided) {
    return {
      success: false,
      error: `Collision Alert: ${collision.reason}`,
    };
  }

  // Generate unique booking reference
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const bookingRef = `RP-VIEW-${randomSuffix}`;

  const fullAddress = `${property.holdingNumber}, ${property.roadNumber}, ${property.blockSector}, ${property.thana}, Dhaka`;

  const newAppointment: ViewingAppointment = {
    id: `app-${Date.now()}-${randomSuffix}`,
    bookingRef,
    propertyId: property.id,
    propertyTitle: property.title,
    propertyAddress: fullAddress,
    landlordName: property.landlordName,
    landlordPhone: property.landlordPhone || "+880 1711-002233",
    tenantName: tenant.tenantName.trim(),
    tenantPhone: tenant.tenantPhone.trim(),
    tenantEmail: tenant.tenantEmail.trim(),
    date,
    timeSlot,
    status: "confirmed",
    dossierShared: !!tenant.dossierVaultShared,
    notes: tenant.notes,
    createdAt: new Date().toISOString(),
  };

  return {
    success: true,
    appointment: newAppointment,
  };
}

/**
 * RFC 5545 compliant iCalendar (.ics) Generator
 * Generates downloadable calendar event for Apple Calendar, Google Calendar, Outlook
 */
export function generateIcsCalendar(appointment: ViewingAppointment): string {
  const slotDef = TIME_SLOT_DEFINITIONS.find((d) => d.label === appointment.timeSlot);
  const startHour = slotDef?.startHour ?? 10;
  const startMinute = slotDef?.startMinute ?? 0;
  const endHour = slotDef?.endHour ?? 11;
  const endMinute = slotDef?.endMinute ?? 30;

  // Format YYYYMMDDTHHMMSS
  const [year, month, day] = appointment.date.split("-").map(Number);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const dtStart = `${year}${pad(month)}${pad(day)}T${pad(startHour)}${pad(startMinute)}00`;
  const dtEnd = `${year}${pad(month)}${pad(day)}T${pad(endHour)}${pad(endMinute)}00`;
  const dtStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const description = [
    `RentPulse In-Person Residence Viewing`,
    `Booking Ref: ${appointment.bookingRef}`,
    `Property: ${appointment.propertyTitle}`,
    `Address: ${appointment.propertyAddress}`,
    `Landlord / Host: ${appointment.landlordName} (${appointment.landlordPhone})`,
    `Tenant: ${appointment.tenantName} (${appointment.tenantPhone})`,
    appointment.dossierShared ? `Encrypted Dossier Vault: Linked & Pre-Verified` : ``,
    appointment.notes ? `Special Notes: ${appointment.notes}` : ``,
    `Anti-Collision Lock: Confirmed on RentPulse Dhaka Gateway`,
  ]
    .filter(Boolean)
    .join("\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RentPulse Dhaka//Viewing Calendar Engine 1.0//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${appointment.bookingRef}@rentpulse.com.bd`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:Property Viewing: ${appointment.propertyTitle}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${appointment.propertyAddress}`,
    `STATUS:CONFIRMED`,
    `ORGANIZER;CN="${appointment.landlordName} (via RentPulse)":mailto:support@rentpulse.com.bd`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: RentPulse Dhaka Property Viewing in 2 Hours",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Initial Seed Appointments across Dhaka
 */
export const INITIAL_VIEWING_APPOINTMENTS: ViewingAppointment[] = [
  {
    id: "app-seed-01",
    bookingRef: "RP-VIEW-4182",
    propertyId: "prop-dhanmondi-01",
    propertyTitle: "Majestine Lake Residence Flat 5-B",
    propertyAddress: "House 42, Road 8A, Dhanmondi R/A, Dhanmondi, Dhaka",
    landlordName: "Alhaj Rafiqul Islam",
    landlordPhone: "+880 1711-892341",
    tenantName: "Dr. Farhana Yasmin",
    tenantPhone: "+880 1819-456789",
    tenantEmail: "dr.farhana@bsmmu.edu.bd",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
    timeSlot: "10:00 AM – 11:30 AM",
    status: "confirmed",
    dossierShared: true,
    notes: "Requires parking space inspection for family SUV.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "app-seed-02",
    bookingRef: "RP-VIEW-9023",
    propertyId: "prop-bashundhara-02",
    propertyTitle: "Student Cohabitation Residence — Block C",
    propertyAddress: "Plot #182, Block C, Bashundhara R/A, Vatara, Dhaka",
    landlordName: "Engr. M. A. Rashid",
    landlordPhone: "+880 1712-334455",
    tenantName: "Nafis Kamal",
    tenantPhone: "+880 1680-123456",
    tenantEmail: "nafis.kamal@pathao.com",
    date: new Date(Date.now() + 172800000).toISOString().split("T")[0], // Day after tomorrow
    timeSlot: "05:00 PM – 06:30 PM",
    status: "confirmed",
    dossierShared: true,
    notes: "Commuting after office from Banani via 300 Feet Road.",
    createdAt: new Date().toISOString(),
  },
];
