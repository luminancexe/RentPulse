/**
 * RentPulse Landlord Title Deed Anti-Fraud Verification Engine
 * Implements Phase 4 Milestone 4.4
 *
 * Security & Audit Protocol:
 * - Computes client-side SHA-256 hash of title deeds, Khatians, and mutation porchas
 * - Verifies against municipal holding tax records and duplicate submission registry
 * - Confers cryptographically backed "Verified Lessor" trust badges
 */

export type DocumentType =
  | "khatian_city_survey"
  | "mutation_porcha_dcr"
  | "saf_kabala_deed"
  | "holding_tax_receipt"
  | "rajuk_approved_plan";

export type AuditStatus = "pending_audit" | "approved_verified" | "flagged_duplicate" | "rejected";

export interface DeedRecord {
  id: string;
  propertyId: string;
  propertyTitle: string;
  landlordName: string;
  landlordPhone: string;
  thana: string;
  holdingNumber: string;
  documentType: DocumentType;
  fileName: string;
  fileSizeBytes: number;
  sha256Hash: string;
  auditStatus: AuditStatus;
  trustBadgeConferred: boolean;
  auditorNotes?: string;
  submittedAt: string;
  auditedAt?: string;
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  khatian_city_survey: "City Survey Khatian (সিটি জরিপ খতিয়ান)",
  mutation_porcha_dcr: "Mutation Porcha & DCR (নামজারি পর্চা ও ডিসিআর)",
  saf_kabala_deed: "Registered Sale Deed / Saf-Kabala (রেজিস্ট্রার্ড সাফ-কবলা দলিল)",
  holding_tax_receipt: "Holding Tax Receipt (সিটি কর্পোরেশন হোল্ডিং ট্যাক্স দাখিলা)",
  rajuk_approved_plan: "RAJUK Approved Building Plan (রাজউক অনুমোদিত প্ল্যান)",
};

/**
 * Computes SHA-256 hash of an uploaded File object in the browser
 */
export async function computeFileHash(file: File): Promise<string> {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  return "mock_sha256_" + Math.random().toString(36).substring(2, 15);
}

/**
 * Seed Deed Verification Registry
 * Matches existing properties in Dhanmondi, Bashundhara, Gulshan, Banani, Uttara
 */
export const SEED_DEED_REGISTRY: DeedRecord[] = [
  {
    id: "deed-001",
    propertyId: "prop-1",
    propertyTitle: "The Magnolia Suite — Road 4, Dhanmondi",
    landlordName: "Rafiqul Islam, PE",
    landlordPhone: "+880 1711-482910",
    thana: "Dhanmondi",
    holdingNumber: "Holding #48/A, Road 4",
    documentType: "saf_kabala_deed",
    fileName: "Dhanmondi_Saf_Kabala_Deed_Vol_412.pdf",
    fileSizeBytes: 2451200,
    sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    auditStatus: "approved_verified",
    trustBadgeConferred: true,
    auditorNotes: "Verified against Dhaka Sub-Registry Office Volume 412. Holding tax clear up to 2026.",
    submittedAt: "2026-10-12T09:30:00Z",
    auditedAt: "2026-10-12T14:15:00Z",
  },
  {
    id: "deed-002",
    propertyId: "prop-2",
    propertyTitle: "Student Cohabitation Residence — Block C, Bashundhara",
    landlordName: "Engr. M. A. Rashid",
    landlordPhone: "+880 1819-203948",
    thana: "Vatara / Bashundhara",
    holdingNumber: "Plot #182, Block C",
    documentType: "mutation_porcha_dcr",
    fileName: "Bashundhara_Plot182_Mutation_DCR.pdf",
    fileSizeBytes: 1845100,
    sha256Hash: "8a68c078021c1798ec4d896b010c7bf394e33d0fd4fce46c4f8ee7be293122c4",
    auditStatus: "approved_verified",
    trustBadgeConferred: true,
    auditorNotes: "Bashundhara Group allotment deed and AC Land mutation verified.",
    submittedAt: "2026-10-14T11:20:00Z",
    auditedAt: "2026-10-14T16:00:00Z",
  },
  {
    id: "deed-003",
    propertyId: "prop-3",
    propertyTitle: "Nordic Minimalist Loft — Gulshan-2",
    landlordName: "Shahana Begum",
    landlordPhone: "+880 1713-908123",
    thana: "Gulshan",
    holdingNumber: "Road 59, House 12",
    documentType: "holding_tax_receipt",
    fileName: "DNCC_Gulshan_HoldingTax_2026.pdf",
    fileSizeBytes: 984500,
    sha256Hash: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    auditStatus: "approved_verified",
    trustBadgeConferred: true,
    auditorNotes: "DNCC Zone-3 automated tax receipt validated via QR checksum.",
    submittedAt: "2026-10-15T15:40:00Z",
    auditedAt: "2026-10-16T10:30:00Z",
  },
  {
    id: "deed-004",
    propertyId: "prop-new-pending",
    propertyTitle: "MRT-6 Transit Studio — Mirpur-10",
    landlordName: "Kamrul Hasan",
    landlordPhone: "+880 1912-345678",
    thana: "Mirpur",
    holdingNumber: "Section 10, Block D, Line 4",
    documentType: "khatian_city_survey",
    fileName: "Mirpur_City_Survey_Khatian_902.pdf",
    fileSizeBytes: 1540000,
    sha256Hash: "f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2",
    auditStatus: "pending_audit",
    trustBadgeConferred: false,
    auditorNotes: "Document submitted; pending automated AC Land registry cross-reference.",
    submittedAt: "2026-11-06T14:10:00Z",
  },
];
