/**
 * RentPulse Bilingual Statutory Tenancy Contract Generator
 *
 * Implements legal frameworks for Bangladeshi residential tenancies:
 * - Premises Rent Control Act, 1991 (বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১)
 * - Transfer of Property Act, 1882 (সম্পত্তি হস্তান্তর আইন, ১৮৮২)
 *
 * Features:
 * - True bilingual translation (Bangla / English)
 * - Demised premises legal schedule (তফসিল)
 * - Statutory advance rent covenants & notice period verification
 * - Dynamic party signature and witness blocks
 */

export interface LeaseParty {
  name: string;
  fatherName?: string;
  nid: string;
  phone: string;
  address: string;
  thana: string;
  district?: string;
  occupation?: string;
}

export interface LeasePremises {
  propertyTitle: string;
  unitNumber: string;
  holdingNumber: string;
  roadNumber: string;
  blockSector: string;
  thana: string;
  district: string;
  totalAreaSqft: number;
  bedrooms: number;
  bathrooms: number;
}

export interface FinancialTerms {
  monthlyRentBdt: number;
  securityDepositBdt: number;
  serviceChargeBdt: number;
  rentPaymentDueDay: number; // e.g. 7 or 10 of English month
  electricityType: "prepaid_meter" | "postpaid_split";
  gasType: "titas_pipeline" | "lpg_cylinder";
  wasaWaterBdt: number;
  noticePeriodDays: number; // Standard 30 or 60 days
}

export interface LeaseContractData {
  contractId: string;
  effectiveDate: string; // YYYY-MM-DD
  expiryDate: string;
  durationMonths: number;
  lessor: LeaseParty;
  lessee: LeaseParty;
  premises: LeasePremises;
  financialTerms: FinancialTerms;
  specialCovenants?: string[];
}

export interface LeaseClause {
  number: number;
  headingBn: string;
  headingEn: string;
  contentBn: string;
  contentEn: string;
}

/**
 * Generate full statutory clauses under Premises Rent Control Act, 1991
 */
export function generateStatutoryClauses(data: LeaseContractData): LeaseClause[] {
  const { financialTerms, durationMonths, effectiveDate, expiryDate, premises } = data;

  return [
    {
      number: 1,
      headingBn: "চুক্তির মেয়াদ (Duration of Tenancy)",
      headingEn: "Tenancy Term & Duration",
      contentBn: `এই ভাড়ার চুক্তির মেয়াদ আগামী ${effectiveDate} ইং তারিখ হইতে ${expiryDate} ইং তারিখ পর্যন্ত মোট ${durationMonths} (${durationMonths === 11 ? "এগারো" : "বারো"}) মাসের জন্য বলবৎ থাকিবে। উভয় পক্ষের পারস্পরিক সম্মতি ও সন্তুষ্টি সাপেক্ষে মেয়াদান্তে নূতন চুক্তি সম্পাদনের মাধ্যমে মেয়াদ বৃদ্ধি করা যাইবে।`,
      contentEn: `The duration of this tenancy shall be for a total of ${durationMonths} months, commencing on ${effectiveDate} and expiring on ${expiryDate}. This tenancy may be renewed upon mutual written agreement and satisfaction of both parties prior to expiry.`,
    },
    {
      number: 2,
      headingBn: "মাসিক ভাড়া ও পরিশোধের নিয়ম (Monthly Rent & Payment)",
      headingEn: "Monthly Rent & Payment Terms",
      contentBn: `ভাড়াকৃত বাসার মাসিক ভাড়া বাবদ ৳${financialTerms.monthlyRentBdt.toLocaleString()} (টাকা) ধার্য করা হইল। ২য় পক্ষ (ভাড়াটিয়া) প্রতি ইংরেজি মাসের ${financialTerms.rentPaymentDueDay} (সাত) তারিখের মধ্যে ১ম পক্ষকে (মালিক) ব্যাংক হস্তান্তর, এমএফএস (বিকাশ/নগদ) অথবা মানি রিসিটের মাধ্যমে উক্ত ভাড়া পরিশোধ করিতে বাধ্য থাকিবেন।`,
      contentEn: `The monthly rent for the demised flat is agreed at BDT ${financialTerms.monthlyRentBdt.toLocaleString()}. The Lessee shall remit the rent to the Lessor on or before the ${financialTerms.rentPaymentDueDay}th day of each English calendar month via digital bank transfer, MFS (bKash/Nagad), or printed monetary receipt.`,
    },
    {
      number: 3,
      headingBn: "নিরাপত্তা জামানত ও অগ্রিম (Security Deposit & Advance)",
      headingEn: "Security Deposit & Statutory Advance",
      contentBn: `বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১ এর ধারা মোতাবেক ২য় পক্ষ ১ম পক্ষকে সর্বমোট ৳${financialTerms.securityDepositBdt.toLocaleString()} টাকা ফেরতযোগ্য নিরাপত্তা জামানত বাবদ প্রদান করিলেন। বাসা ছাড়িবার সময় বকেয়া ইউটিলিটি বিল ও ক্ষয়ক্ষতি সমন্বয়পূর্বক উক্ত জামানতের অর্থ ২য় পক্ষকে সম্পূর্ণ ফেরত প্রদান করা হইবে। জামানতের অর্থ মাসিক ভাড়ার সহিত সমন্বয়যোগ্য হইবে না।`,
      contentEn: `In compliance with the Premises Rent Control Act 1991, the Lessee has deposited an amount of BDT ${financialTerms.securityDepositBdt.toLocaleString()} as a refundable security deposit. Upon peaceful handover at tenancy expiration, this amount shall be refunded in full after deducting documented utility arrears or damage beyond reasonable wear and tear. The deposit cannot be adjusted as regular monthly rent.`,
    },
    {
      number: 4,
      headingBn: "ইউটিলিটি ও সার্ভিস চার্জ (Utilities & Service Charges)",
      headingEn: "Utilities & Maintenance Outlays",
      contentBn: `ভবনের মাসিক সার্ভিস চার্জ ৳${financialTerms.serviceChargeBdt.toLocaleString()} টাকা এবং ওয়াসা পানির বিল ৳${financialTerms.wasaWaterBdt.toLocaleString()} টাকা ২য় পক্ষ নিয়মিত পরিশোধ করিবেন। ভাড়াকৃত ফ্ল্যাটের বিদ্যুৎ খরচ (প্রিপেইড ডেসকো/ডিপিডিসি ডিজিটাল কার্ড রিচার্জ) এবং গ্যাস খরচ ২য় পক্ষ নিজ দায়িত্বে বহন করিবেন।`,
      contentEn: `The Lessee shall regularly discharge the monthly building service charge of BDT ${financialTerms.serviceChargeBdt.toLocaleString()} and Dhaka WASA water bill of BDT ${financialTerms.wasaWaterBdt.toLocaleString()}. Electrical consumption via dedicated prepaid meter (DESCO/DPDC) and domestic gas expenses shall be the direct responsibility of the Lessee.`,
    },
    {
      number: 5,
      headingBn: "ব্যবহারের উদ্দেশ্য ও বিধিনিষেধ (Permitted Residential Use)",
      headingEn: "Exclusively Residential Covenant & Restrictions",
      contentBn: `ভাড়াকৃত ফ্ল্যাটটি কেবলমাত্র পারিবারিক অথবা শিক্ষা/চাকুরিজীবী সহবাসের সৎ ও শান্তিপূর্ণ আবাসিক উদ্দেশ্যে ব্যবহৃত হইবে। কোন প্রকার অসামাজিক, অনৈতিক, বেআইনি কিংবা ব্যবসায়িক উদ্দেশ্যে ব্যবহার করা কঠোরভাবে নিষিদ্ধ। অন্য কাহারো নিকট সাবলেট (Sub-let) প্রদান করা সম্পূর্ণ নিষিদ্ধ।`,
      contentEn: `The demised premises shall be occupied exclusively for peaceful residential habitation (family or vetted professional cohabitation). No commercial, illicit, antisocial, or hazardous activity shall be permitted. Subletting any portion of the premises without prior written consent from the Lessor is strictly prohibited.`,
    },
    {
      number: 6,
      headingBn: "ডিএমপি সিআইএমএস পুলিশ ভেরিফিকেশন (DMP CIMS Police Compliance)",
      headingEn: "Statutory DMP Police Registration",
      contentBn: `ঢাকা মেট্রোপলিটন পুলিশের (ডিএমপি) আইন অনুযায়ী ফ্ল্যাটে বসবাসের ৭ (সাত) দিনের মধ্যে ২য় পক্ষকে সিআইএমএস ফরম-২ (ভাড়াটিয়া তথ্য নিবন্ধন ফরম) যথাযথভাবে পূরণপূর্বক স্থানীয় সংশ্লিষ্ট থানায় জমা প্রদান করিতে হইবে এবং রিসিট কপি ১ম পক্ষকে হস্তান্তর করিতে হইবে।`,
      contentEn: `Pursuant to Dhaka Metropolitan Police (DMP) statutory directives, the Lessee must furnish the completed CIMS Form-2 (Citizen Information Management System Tenant Profile) to the local Police Station within 7 (seven) days of occupancy and provide an official acknowledgment receipt to the Lessor.`,
    },
    {
      number: 7,
      headingBn: "চুক্তি অবসান ও নোটিশ (Notice Period & Termination)",
      headingEn: "Termination & Vacancy Notice",
      contentBn: `উভয় পক্ষের যে কোন পক্ষ চুক্তি মেয়াদের পূর্বে বাসা ত্যাগ করিতে বা করাইতে চাহিলে অন্য পক্ষকে অন্যূন ${financialTerms.noticePeriodDays} (${financialTerms.noticePeriodDays === 30 ? "ত্রিশ" : "ষাট"}) দিনের লিখিত অগ্রিম নোটিশ প্রদান করিতে হইবে। অন্যথায় সমপরিমাণ মাসিক ভাড়া ক্ষতিপূরণ বাবদ সমন্বয় করা হইবে।`,
      contentEn: `Either party wishing to terminate this lease prior to contractual expiry must serve at least ${financialTerms.noticePeriodDays} days written notice to the other party. In default of such statutory notice, compensation equivalent to that period's rental shall be forfeited or demanded.`,
    },
  ];
}

/**
 * Seed Lease Agreement (Majestine Lake Residence — Dhanmondi)
 */
export const SEED_LEASE_CONTRACT: LeaseContractData = {
  contractId: "RP-LEASE-2026-042",
  effectiveDate: "2026-11-15",
  expiryDate: "2027-10-14",
  durationMonths: 11,
  lessor: {
    name: "Alhaj Rafiqul Islam",
    fatherName: "Late Md. Nurul Huda",
    nid: "19582692014000318",
    phone: "+880 1711-892341",
    address: "House 42, Road 8A, Dhanmondi R/A",
    thana: "Dhanmondi",
    district: "Dhaka",
    occupation: "Retired Civil Engineer & Landlord",
  },
  lessee: {
    name: "Dr. Farhana Yasmin",
    fatherName: "Prof. Anisur Rahman",
    nid: "19882692019000842",
    phone: "+880 1819-456789",
    address: "House 12, Sector 4, Uttara, Dhaka",
    thana: "Uttara",
    district: "Dhaka",
    occupation: "Assistant Professor, BSMMU (Doctor)",
  },
  premises: {
    propertyTitle: "Majestine Lake Residence Flat 5-B",
    unitNumber: "Flat 5-B (5th Floor)",
    holdingNumber: "House 42",
    roadNumber: "Road 8A",
    blockSector: "Dhanmondi Residential Area",
    thana: "Dhanmondi",
    district: "Dhaka",
    totalAreaSqft: 2150,
    bedrooms: 4,
    bathrooms: 4,
  },
  financialTerms: {
    monthlyRentBdt: 42000,
    securityDepositBdt: 84000, // 2 months statutory advance
    serviceChargeBdt: 6000,
    rentPaymentDueDay: 7,
    electricityType: "prepaid_meter",
    gasType: "titas_pipeline",
    wasaWaterBdt: 1200,
    noticePeriodDays: 30,
  },
  specialCovenants: [
    "Tenant permitted 1 reserved basement parking slot (Bay #B-4).",
    "Rooftop garden accessible between 06:00 AM and 10:00 PM.",
    "Standby backup generator covers lights, fans, and 1 refrigerator circuit.",
  ],
};
