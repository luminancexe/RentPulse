/**
 * @rentpulse/db - Master Database & Persistence Layer
 * Powered by PostgreSQL 16.2 + PostGIS 3.4
 */

export * from "./spatial";
export * from "./seed-data";

// Re-export Prisma Client types once generated
export type {
  UserRole,
  PersonaType,
  ListingType,
  FurnishingStatus,
  GasSupplyType,
  ElectricityBilling,
  ViewingMode,
  ViewingStatus,
  DossierStatus,
  DeedAuditStatus,
  AgreementStatus,
  PaymentType,
  PaymentChannel,
  PaymentStatus,
  LedgerStatus,
  CimsExportStatus,
  DisputeStatus,
  MatchStatus,
  DietaryPreference,
} from "@prisma/client";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
