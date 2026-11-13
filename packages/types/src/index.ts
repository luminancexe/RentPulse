/**
 * @rentpulse/types - Unified Type Definitions
 * Shared across RentPulse Next.js Web Portal, React Native Expo Mobile, and Services.
 */

// ============================================================================
// 1. Core Geographic & Property Types
// ============================================================================

export type PropertyMode = "ENTIRE_APARTMENT" | "SHARED_ROOM";

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

export interface TransitProximity {
  hubId: string;
  hubName: string;
  distanceKm: number;
  walkingMinutes: number;
  bufferCategory: "500m" | "1km" | "2km" | "outer";
}

export interface UtilityBreakdown {
  baseRentBdt: number;
  serviceChargeBdt: number;
  electricityEstimateBdt: number;
  gasEstimateBdt: number;
  waterEstimateBdt: number;
  internetBdt: number;
  totalMonthlyEstimatedBdt: number;
  securityDepositMonths: number;
  securityDepositTotalBdt: number;
  moveInCapitalRequiredBdt: number;
}

export interface PropertyListing {
  id: string;
  title: string;
  slug: string;
  mode: PropertyMode;
  locationName: string;
  neighborhood: string;
  coordinates: GeoCoordinate;
  bhkConfig?: string; // e.g. "3 BHK / 3 Bath"
  seatType?: string;  // e.g. "Master Bedroom with Attached Balcony"
  monthlyRentBdt: number;
  isVerifiedLessor: boolean;
  transitSummary: string;
  nearestTransit: TransitProximity;
  coverImage: string;
  galleryImages: string[];
  amenities: string[];
  utilities: UtilityBreakdown;
  availableFrom: string;
  roommateSynergyTags?: string[];
}

// ============================================================================
// 2. Cohabitation Synergy & Roommate Matching
// ============================================================================

export interface LifestyleVector {
  sleepChronotype: number;   // 1 (5am Early Bird) to 5 (4am Night Owl)
  cleanlinessRigor: number;  // 1 (Casual/Flexible) to 5 (Surgical Daily)
  studyNoiseTolerance: number; // 1 (Silent Study) to 5 (Social/Music)
  guestPolicy: number;       // 1 (Private Sanctuary) to 5 (Open Host)
  dietaryHabits: number;     // 1 (Strict/Halal/Vegan) to 5 (Completely Open)
  isSmoker: boolean;
}

export interface RadarVertex {
  axisLabel: string;
  tenantScore: number;
  candidateScore: number;
  delta: number;
  x: number;
  y: number;
}

export type CompatibilityTier = "EXCELLENT" | "STRONG" | "BALANCED" | "FRICTION";

export interface RoommateCandidate {
  id: string;
  name: string;
  occupationOrCampus: string;
  area: string;
  avatarUrl: string;
  vector: LifestyleVector;
  bio: string;
  verifiedStudentOrEmployee: boolean;
}

export interface CompatibilityResult {
  candidateId: string;
  candidateName: string;
  percentageScore: number;
  tier: CompatibilityTier;
  euclideanCloseness: number;
  cosineSimilarity: number;
  conflictPenaltyApplied: boolean;
  strengths: string[];
  watchouts: string[];
  radarVertices: RadarVertex[];
}

// ============================================================================
// 3. Zero-Knowledge Tenancy Dossier Vault
// ============================================================================

export interface DecryptedDossierPayload {
  tenantFullName: string;
  nidOrPassportNumber: string;
  universityOrEmployer: string;
  designationOrId: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  declaredMonthlyIncomeBdt: number;
  verifiedBadges: string[];
}

export interface EncryptedDossierVault {
  vaultId: string;
  algorithm: "AES-GCM-256";
  pbkdf2Iterations: number;
  saltHex: string;
  ivHex: string;
  ciphertextBase64: string;
  sha256PlaintextHash: string;
  createdAt: string;
  isLocked: boolean;
}

// ============================================================================
// 4. Anti-Collision Viewing Calendar
// ============================================================================

export type ViewingSlotStatus = "AVAILABLE" | "RESERVED" | "LOCKED";

export interface ViewingSlot {
  slotId: string;
  propertyId: string;
  dateStr: string;
  timeLabel: "10:00 AM" | "11:30 AM" | "02:30 PM" | "04:30 PM";
  status: ViewingSlotStatus;
  bookedByBookingRef?: string;
}

export interface ViewingAppointment {
  bookingRef: string; // e.g. "RP-VIEW-4182"
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  tenantName: string;
  tenantPhone: string;
  dateStr: string;
  timeLabel: string;
  confirmedAt: string;
  icsDownloadUrl?: string;
}

// ============================================================================
// 5. Bilingual Tenancy Contract & Police Compliance
// ============================================================================

export interface StatutoryCovenant {
  clauseNumber: number;
  titleEn: string;
  titleBn: string;
  contentEn: string;
  contentBn: string;
  statutoryActCitation?: string; // e.g. "Section 10, Premises Rent Control Act, 1991"
}

export interface TenancyAgreement {
  contractId: string; // e.g. "RP-LEASE-2026-9812"
  propertyTitle: string;
  landlordLegalName: string;
  tenantLegalName: string;
  agreedMonthlyRentBdt: number;
  advanceDepositBdt: number;
  tenancyCommencementDate: string;
  durationMonths: number;
  covenants: StatutoryCovenant[];
  isSignedByTenant: boolean;
  isSignedByLandlord: boolean;
  sha256AuditHash: string;
}

export interface DmpCimsFilingRecord {
  trackingId: string; // e.g. "DMP-CIMS-2026-242514"
  policeStationZone: string;
  tenantLegalName: string;
  tenantNid: string;
  institutionOrEmployer: string;
  flatAddress: string;
  cohabitantsRoster: Array<{
    name: string;
    relationship: string;
    nidOrStudentId: string;
  }>;
  filedAt: string;
  status: "VERIFIED" | "PENDING_POLICE_STAMP";
}

// ============================================================================
// 6. Multi-Rail Rent Ledger & Receipts
// ============================================================================

export type PaymentRail = "BKASH" | "NAGAD" | "VISA" | "MASTERCARD" | "AMEX";

export interface RentInvoice {
  invoiceNumber: string;
  billingMonth: string;
  rentAmountBdt: number;
  serviceChargeBdt: number;
  totalDueBdt: number;
  status: "PAID" | "UNPAID" | "OVERDUE";
  paidAt?: string;
  trxId?: string;
  receiptNumber?: string;
}

export interface RentReceipt {
  receiptNumber: string; // e.g. "RP-RCPT-656730"
  invoiceRef: string;
  tenantName: string;
  propertyTitle: string;
  amountPaidBdt: number;
  paymentRail: PaymentRail;
  trxId: string;
  issuedAt: string;
}

// ============================================================================
// 7. Mobile-Native Move-In Inspection & Photo Evidence
// ============================================================================

export type RoomCategory = "BEDROOM" | "KITCHEN" | "BATHROOM" | "LIVING_ROOM" | "BALCONY";
export type RoomConditionState = "PRISTINE" | "MINOR_WEAR" | "DAMAGED_NEEDS_REPAIR";

export interface InspectionItem {
  id: string;
  room: RoomCategory;
  featureName: string; // e.g. "Wall Paint", "Light Fixtures", "Water Faucet", "Tiles"
  condition: RoomConditionState;
  notes: string;
  photoUri?: string;
  tamperProofHash?: string;
  capturedAt: string;
}

export interface MoveInInspectionReport {
  reportId: string; // e.g. "RP-INSPECT-2026-881"
  propertyId: string;
  tenantId: string;
  tenantName: string;
  inspectionDate: string;
  items: InspectionItem[];
  isCountersignedByLandlord: boolean;
  totalPhotosCount: number;
  summaryNotes: string;
}
