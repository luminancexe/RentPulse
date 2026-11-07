/**
 * RentPulse Roommate Synergy & Cohabitation Compatibility Engine
 * Implements Phase 4 Milestone 4.1 & 4.2
 *
 * Vector Space Model:
 * 5 Core Living Dimensions:
 * 1. Sleep Chronotype (1: Early Bird 5AM-10PM -> 5: Dedicated Night Owl 11AM-4AM)
 * 2. Cleanliness Rigor (1: Relaxed / Casual -> 5: Spotless Surgical Precision)
 * 3. Noise & Focus (1: Silent Monastery -> 5: Social / Background Audio)
 * 4. Guest & Social Rhythm (1: Strict Sanctuary -> 5: Open Door Frequent Host)
 * 5. Lifestyle Mindset (Dietary, Smoking, and Shared-Space Respect, 1-5)
 */

export interface CohabitationVector {
  sleepChronotype: number;   // 1 to 5
  cleanlinessRigor: number;  // 1 to 5
  noiseTolerance: number;    // 1 to 5
  guestRhythm: number;       // 1 to 5
  lifestyleMindset: number;  // 1 to 5
}

export type DietaryPreference = "halal" | "vegetarian" | "vegan" | "non_veg" | "no_preference";
export type SmokingPolicy = "strictly_non_smoking" | "balcony_only" | "flexible";

export interface CohabitationProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  occupation: string;
  institutionOrCompany: string;
  preferredNeighborhood: string;
  budgetMonthlyBdt: number;
  dietaryPreference: DietaryPreference;
  smokingPolicy: SmokingPolicy;
  vector: CohabitationVector;
  bio: string;
  verifiedStudentOrEmployee: boolean;
  interests: string[];
}

export interface RadarPoint {
  axis: string;
  label: string;
  userValue: number;
  candidateValue: number;
  maxValue: number;
  delta: number;
  xUser: number;
  yUser: number;
  xCandidate: number;
  yCandidate: number;
  xLabel: number;
  yLabel: number;
}

export interface SynergyMatchResult {
  candidate: CohabitationProfile;
  overallSynergyScore: number;     // e.g. 94 (0-100)
  tier: "EXCELLENT SYNERGY" | "STRONG HARMONY" | "BALANCED MATCH" | "POTENTIAL FRICTION";
  tierColor: string;
  cosineSimilarity: number;        // 0.0 - 1.0
  euclideanCloseness: number;      // 0.0 - 1.0
  vectorDeltas: {
    sleep: number;
    cleanliness: number;
    noise: number;
    guest: number;
    lifestyle: number;
  };
  strengths: string[];
  watchOuts: string[];
  radarPoints: RadarPoint[];
}

export const RADAR_AXES = [
  { key: "sleepChronotype", label: "Sleep Chronotype", short: "Sleep" },
  { key: "cleanlinessRigor", label: "Cleanliness Rigor", short: "Clean" },
  { key: "noiseTolerance", label: "Study & Noise", short: "Focus" },
  { key: "guestRhythm", label: "Guest Rhythm", short: "Social" },
  { key: "lifestyleMindset", label: "Lifestyle Mindset", short: "Habits" },
] as const;

/**
 * Calculates vector cosine similarity between two 5D vectors
 */
export function calculateCosineSimilarity(a: CohabitationVector, b: CohabitationVector): number {
  const vA = [a.sleepChronotype, a.cleanlinessRigor, a.noiseTolerance, a.guestRhythm, a.lifestyleMindset];
  const vB = [b.sleepChronotype, b.cleanlinessRigor, b.noiseTolerance, b.guestRhythm, b.lifestyleMindset];

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < 5; i++) {
    dotProduct += vA[i] * vB[i];
    normA += vA[i] * vA[i];
    normB += vB[i] * vB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Calculates normalized Euclidean distance closeness (1.0 = identical, 0.0 = furthest possible)
 */
export function calculateEuclideanCloseness(a: CohabitationVector, b: CohabitationVector): number {
  const vA = [a.sleepChronotype, a.cleanlinessRigor, a.noiseTolerance, a.guestRhythm, a.lifestyleMindset];
  const vB = [b.sleepChronotype, b.cleanlinessRigor, b.noiseTolerance, b.guestRhythm, b.lifestyleMindset];

  let sumSquaredDelta = 0;
  const maxPossibleSquaredDelta = 5 * Math.pow(4, 2); // 5 dimensions * (5 - 1)^2 = 80

  for (let i = 0; i < 5; i++) {
    const delta = vA[i] - vB[i];
    sumSquaredDelta += delta * delta;
  }

  const distanceRatio = Math.sqrt(sumSquaredDelta) / Math.sqrt(maxPossibleSquaredDelta);
  return Math.max(0, Math.min(1, 1 - distanceRatio));
}

/**
 * Generates coordinate geometry for SVG 5-axis Radar visualizer
 */
export function computeRadarGeometry(
  userVec: CohabitationVector,
  candidateVec: CohabitationVector,
  center = 200,
  maxRadius = 130
): RadarPoint[] {
  const userVals = [
    userVec.sleepChronotype,
    userVec.cleanlinessRigor,
    userVec.noiseTolerance,
    userVec.guestRhythm,
    userVec.lifestyleMindset,
  ];

  const candVals = [
    candidateVec.sleepChronotype,
    candidateVec.cleanlinessRigor,
    candidateVec.noiseTolerance,
    candidateVec.guestRhythm,
    candidateVec.lifestyleMindset,
  ];

  return RADAR_AXES.map((axis, i) => {
    // 5 vertices spaced evenly, starting from top (-PI/2)
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const uVal = userVals[i];
    const cVal = candVals[i];

    const rUser = (uVal / 5) * maxRadius;
    const rCand = (cVal / 5) * maxRadius;
    const rLabel = maxRadius + 32;

    return {
      axis: axis.key,
      label: axis.short,
      userValue: uVal,
      candidateValue: cVal,
      maxValue: 5,
      delta: Math.abs(uVal - cVal),
      xUser: center + rUser * Math.cos(angle),
      yUser: center + rUser * Math.sin(angle),
      xCandidate: center + rCand * Math.cos(angle),
      yCandidate: center + rCand * Math.sin(angle),
      xLabel: center + rLabel * Math.cos(angle),
      yLabel: center + rLabel * Math.sin(angle),
    };
  });
}

/**
 * Computes composite synergy score, strengths, and caution points
 */
export function computeSynergyMatch(
  user: CohabitationProfile,
  candidate: CohabitationProfile
): SynergyMatchResult {
  const cosine = calculateCosineSimilarity(user.vector, candidate.vector);
  const euclidean = calculateEuclideanCloseness(user.vector, candidate.vector);

  // Hard constraints check (e.g. non-smoker vs flexible smoker)
  let penaltyMultiplier = 1.0;
  const watchOuts: string[] = [];
  const strengths: string[] = [];

  if (
    user.smokingPolicy === "strictly_non_smoking" &&
    candidate.smokingPolicy !== "strictly_non_smoking"
  ) {
    penaltyMultiplier *= 0.85;
    watchOuts.push("Smoking policy divergence (smoke-free vs balcony friendly)");
  }

  // Dietary check
  if (
    user.dietaryPreference === "vegetarian" &&
    candidate.dietaryPreference === "non_veg"
  ) {
    watchOuts.push("Dietary divergence (shared cookware / fridge guidelines needed)");
  } else if (user.dietaryPreference === candidate.dietaryPreference) {
    strengths.push(`Shared ${user.dietaryPreference.toUpperCase()} food culture`);
  }

  // Dimension deltas
  const sleepDelta = Math.abs(user.vector.sleepChronotype - candidate.vector.sleepChronotype);
  const cleanDelta = Math.abs(user.vector.cleanlinessRigor - candidate.vector.cleanlinessRigor);
  const noiseDelta = Math.abs(user.vector.noiseTolerance - candidate.vector.noiseTolerance);
  const guestDelta = Math.abs(user.vector.guestRhythm - candidate.vector.guestRhythm);
  const lifeDelta = Math.abs(user.vector.lifestyleMindset - candidate.vector.lifestyleMindset);

  // Evaluate strengths
  if (sleepDelta === 0) strengths.push("Synchronized sleep schedules & alarm rhythms");
  else if (sleepDelta === 1) strengths.push("Compatible sleep & wake routine");
  else if (sleepDelta >= 3) watchOuts.push("Opposite chronotypes (Early Bird vs Night Owl)");

  if (cleanDelta === 0) strengths.push("Identical chore & kitchen cleanliness standards");
  else if (cleanDelta >= 3) watchOuts.push("Significant disparity in daily cleaning expectations");

  if (noiseDelta <= 1) strengths.push("Harmonious study noise & music volume tolerance");
  else if (noiseDelta >= 3) watchOuts.push("Study focus quietness preference difference");

  if (guestDelta <= 1) strengths.push("Aligned visitor & social guest hospitality boundaries");
  else if (guestDelta >= 3) watchOuts.push("Different weekend visitor and guest policies");

  // Weighted composite score (0-100)
  // 60% Euclidean closeness + 40% Cosine alignment
  const rawScore = (euclidean * 0.60 + cosine * 0.40) * 100 * penaltyMultiplier;
  const score = Math.round(Math.max(30, Math.min(99, rawScore)));

  let tier: SynergyMatchResult["tier"] = "BALANCED MATCH";
  let tierColor = "#2B6CB0"; // Blue

  if (score >= 90) {
    tier = "EXCELLENT SYNERGY";
    tierColor = "#1F302B"; // Forest Green
  } else if (score >= 78) {
    tier = "STRONG HARMONY";
    tierColor = "#2C4A3E"; // Dark Mint/Forest
  } else if (score < 65) {
    tier = "POTENTIAL FRICTION";
    tierColor = "#BD5338"; // Terracotta
  }

  const radarPoints = computeRadarGeometry(user.vector, candidate.vector);

  return {
    candidate,
    overallSynergyScore: score,
    tier,
    tierColor,
    cosineSimilarity: Math.round(cosine * 100) / 100,
    euclideanCloseness: Math.round(euclidean * 100) / 100,
    vectorDeltas: {
      sleep: sleepDelta,
      cleanliness: cleanDelta,
      noise: noiseDelta,
      guest: guestDelta,
      lifestyle: lifeDelta,
    },
    strengths: strengths.length ? strengths : ["Compatible urban rental budget and location"],
    watchOuts: watchOuts.length ? watchOuts : ["Standard communication around shared expenses advised"],
    radarPoints,
  };
}

/**
 * Curated Dhaka Roommate Candidates Dataset
 * Spanning key student universities and professional corporate clusters
 */
export const DHAKA_ROOMMATE_CANDIDATES: CohabitationProfile[] = [
  {
    id: "cand-1",
    name: "Abrar Fahim",
    avatarUrl: "/avatars/abrar.jpg",
    occupation: "Undergraduate Student (CSE)",
    institutionOrCompany: "North South University (NSU)",
    preferredNeighborhood: "Bashundhara R/A (Block C)",
    budgetMonthlyBdt: 9500,
    dietaryPreference: "halal",
    smokingPolicy: "strictly_non_smoking",
    vector: {
      sleepChronotype: 2,   // 6:30 AM wake, early studier
      cleanlinessRigor: 4,  // High cleanliness
      noiseTolerance: 2,    // Needs quiet for coding
      guestRhythm: 2,       // Low social guests
      lifestyleMindset: 4,  // High respect for shared amenities
    },
    bio: "Final year NSU CSE student. Looking for a quiet, organized master or attached-bath seat in Bashundhara. Dedicated to final capstone projects, sleep by 11:30 PM, respect kitchen hygiene.",
    verifiedStudentOrEmployee: true,
    interests: ["Competitive Programming", "Specialty Coffee", "Badminton", "Tech Podcasts"],
  },
  {
    id: "cand-2",
    name: "Tanvir Ahmed",
    avatarUrl: "/avatars/tanvir.jpg",
    occupation: "Software Engineer",
    institutionOrCompany: "Brain Station 23 / Mohakhali DOHS",
    preferredNeighborhood: "Gulshan-1 / Niketan",
    budgetMonthlyBdt: 14000,
    dietaryPreference: "halal",
    smokingPolicy: "balcony_only",
    vector: {
      sleepChronotype: 4,   // 1:30 AM night owl
      cleanlinessRigor: 3,  // Standard weekly cleaning
      noiseTolerance: 4,    // Listens to lo-fi / casual background audio
      guestRhythm: 3,       // Occasional weekend game nights
      lifestyleMindset: 3,  // Flexible sharing mindset
    },
    bio: "Full-stack dev working hybrid. Enjoys cooking on Fridays, respectful of shared utility costs, looking for an open-minded roommate in Gulshan/Niketan or Banani.",
    verifiedStudentOrEmployee: true,
    interests: ["Open Source", "Gaming", "Mechanical Keyboards", "Urban Cycling"],
  },
  {
    id: "cand-3",
    name: "Shafiqul Islam",
    avatarUrl: "/avatars/shafiq.jpg",
    occupation: "BBA Candidate",
    institutionOrCompany: "Institute of Business Administration (IBA, DU)",
    preferredNeighborhood: "Dhanmondi (Road 9/A - 15)",
    budgetMonthlyBdt: 11000,
    dietaryPreference: "halal",
    smokingPolicy: "strictly_non_smoking",
    vector: {
      sleepChronotype: 1,   // Very early morning routine (5:30 AM)
      cleanlinessRigor: 5,  // Spotless surgical hygiene
      noiseTolerance: 1,    // Strict silence preference
      guestRhythm: 1,       // Private sanctuary, no overnight guests
      lifestyleMindset: 5,  // Meticulous with chores and unbundled bills
    },
    bio: "IBA student balancing corporate case competitions. Seeking a mature, quiet flatmate who prioritizes discipline, early sleep, and impeccable bathroom and kitchen standards.",
    verifiedStudentOrEmployee: true,
    interests: ["Case Competitions", "Running at Dhanmondi Lake", "Productivity Systems"],
  },
  {
    id: "cand-4",
    name: "Nafis Kamal",
    avatarUrl: "/avatars/nafis.jpg",
    occupation: "Product Designer",
    institutionOrCompany: "Pathao / Gulshan",
    preferredNeighborhood: "Banani DOHS / Baridhara",
    budgetMonthlyBdt: 16500,
    dietaryPreference: "no_preference",
    smokingPolicy: "strictly_non_smoking",
    vector: {
      sleepChronotype: 3,   // Balanced (8 AM - 12:30 AM)
      cleanlinessRigor: 4,  // Tidy, aesthetic-minded
      noiseTolerance: 3,    // Moderate ambient sound
      guestRhythm: 3,       // Friends visit occasionally for dinner
      lifestyleMindset: 4,  // High cooperative spirit
    },
    bio: "UI/UX designer. Appreciates clean architectural interior design, good natural light, and transparent utility cost splitting via bKash. Non-smoker.",
    verifiedStudentOrEmployee: true,
    interests: ["Architectural Design", "Photography", "Espresso", "Graphic Novels"],
  },
  {
    id: "cand-5",
    name: "Zubair Hossain",
    avatarUrl: "/avatars/zubair.jpg",
    occupation: "Medical Officer / Resident",
    institutionOrCompany: "BIRDEM General Hospital / BSMMU",
    preferredNeighborhood: "Green Road / Panthapath",
    budgetMonthlyBdt: 12500,
    dietaryPreference: "halal",
    smokingPolicy: "strictly_non_smoking",
    vector: {
      sleepChronotype: 5,   // Shift worker, irregular hospital on-call hours
      cleanlinessRigor: 4,  // Medical-grade hygiene
      noiseTolerance: 1,    // Absolute blackout quiet needed after shifts
      guestRhythm: 1,       // Zero outside guests due to study/rest
      lifestyleMindset: 4,  // Highly punctual bill payments
    },
    bio: "Resident doctor at BIRDEM. Needs a peaceful room near Panthapath or Farmgate. Mostly at hospital or resting; strictly respectful and values quiet rest above all else.",
    verifiedStudentOrEmployee: true,
    interests: ["Medical Research", "Chess", "Reading", "Historical Non-Fiction"],
  },
  {
    id: "cand-6",
    name: "Arifur Rahman",
    avatarUrl: "/avatars/arif.jpg",
    occupation: "Senior Financial Analyst",
    institutionOrCompany: "Standard Chartered Bank (SCB)",
    preferredNeighborhood: "Uttara (Sector 4 / 7)",
    budgetMonthlyBdt: 15000,
    dietaryPreference: "halal",
    smokingPolicy: "strictly_non_smoking",
    vector: {
      sleepChronotype: 2,   // 6:30 AM early morning commute via MRT-6
      cleanlinessRigor: 4,  // Structured weekly schedules
      noiseTolerance: 3,    // Normal conversational tolerance
      guestRhythm: 2,       // Low social traffic
      lifestyleMindset: 5,  // Meticulous financial bookkeeping
    },
    bio: "Corporate banker commuting via MRT-6 Uttara North station. Looking for a high-integrity flatmate in a modern apartment with elevator and standby generator.",
    verifiedStudentOrEmployee: true,
    interests: ["Financial Modeling", "Squash", "Travel", "Classic Literature"],
  },
];

/**
 * Baseline Default User Profile for testing & initial questionnaire state
 */
export const DEFAULT_USER_PROFILE: CohabitationProfile = {
  id: "user-default",
  name: "You (Applicant Profile)",
  occupation: "Computer Science Student & Researcher",
  institutionOrCompany: "BRAC University / Mohakhali",
  preferredNeighborhood: "Bashundhara R/A or Niketan",
  budgetMonthlyBdt: 10000,
  dietaryPreference: "halal",
  smokingPolicy: "strictly_non_smoking",
  vector: {
    sleepChronotype: 2,   // Early studier
    cleanlinessRigor: 4,  // Clean counters, wash immediately
    noiseTolerance: 2,    // Prefers quiet focus
    guestRhythm: 2,       // Occasional study friend
    lifestyleMindset: 4,  // High respect for shared resources
  },
  bio: "Tech researcher looking for a focused, clean flat in Bashundhara or Mohakhali.",
  verifiedStudentOrEmployee: true,
  interests: ["Artificial Intelligence", "Reading", "Running", "Coffee"],
};
