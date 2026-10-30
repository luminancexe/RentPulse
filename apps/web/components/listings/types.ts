export type PersonaType = "student" | "young_professional" | "family" | "corporate";
export type ListingMode = "entire_apartment" | "shared_room";

export interface CostBreakdownData {
  baseRent: number;
  serviceCharge: number;
  electricityBilling: "prepaid_card" | "postpaid_meter" | "included_in_rent";
  estimatedElectricityCost?: number;
  gasFee: number;
  gasSupplyType?: "government_pipeline" | "lpg_cylinder" | "none";
  wasaWaterFee: number;
  wasteCollectionFee: number;
  broadbandInternetFee?: number;
  securityDepositMonths: number;
  advanceRentMonths: number;
  estimatedGrossMonthlyCost: number;
}

export interface RoommateSynergySummary {
  compatibilityScore: number; // e.g. 94%
  matchedFactors: string[];
  currentOccupantsCount: number;
  totalSeatsCount: number;
  dietaryPreference: "halal" | "vegetarian" | "any";
  sleepChronotype: "Early Bird" | "Night Owl" | "Flexible";
}

export interface PropertyListingItem {
  id: string;
  propertyId: string;
  title: string;
  subtitle: string;
  mode: ListingMode;
  preferredPersona: PersonaType;
  unitNumber?: string;
  holdingNumber?: string;
  roadNumber?: string;
  blockSector: string;
  thana: string;
  district: string;
  latitude: number;
  longitude: number;
  floorLevel: number;
  totalFloors?: number;
  bedRooms: number;
  bathRooms: number;
  balconies?: number;
  carpetAreaSqft: number;
  furnishing: "unfurnished" | "semi_furnished" | "fully_furnished";
  isVerifiedLessor: boolean;
  landlordName: string;
  landlordTrustScore: number;
  images: string[];
  amenities: {
    hasLift: boolean;
    hasStandbyGenerator: boolean;
    hasCctvSurveillance: boolean;
    hasDedicatedSecurityGuard: boolean;
    hasCarParking: boolean;
    hasRooftopAccess?: boolean;
    hasWasaWaterSupply?: boolean;
  };
  costBreakdown: CostBreakdownData;
  roommateSynergy?: RoommateSynergySummary;
  nearestLandmark?: {
    name: string;
    distanceKm: number;
    commuteMinutes: number;
  };
}
