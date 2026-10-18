/**
 * RentPulse Spatial & PostGIS Geospatial Utilities
 * Coordinates and distance calculation for Dhaka Metropolitan Area
 */

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface DhakaLandmark {
  name: string;
  category: "university" | "commercial" | "metro_station" | "residential_hub";
  thana: string;
  location: GeoPoint;
}

/**
 * Key Dhaka Educational & Commercial Centroids (WGS-84)
 */
export const DHAKA_LANDMARKS: Record<string, DhakaLandmark> = {
  // University Clusters
  DU_CAMPUS: {
    name: "University of Dhaka (Curzon / Nilkhet)",
    category: "university",
    thana: "Shahbagh",
    location: { latitude: 23.7297, longitude: 90.3995 },
  },
  NSU_IUB_CLUSTER: {
    name: "North South University / IUB Campus",
    category: "university",
    thana: "Bashundhara R/A",
    location: { latitude: 23.8151, longitude: 90.4255 },
  },
  BRACU_CAMPUS: {
    name: "BRAC University New Merul Badda Campus",
    category: "university",
    thana: "Badda",
    location: { latitude: 23.7719, longitude: 90.4246 },
  },
  AIUB_CAMPUS: {
    name: "AIUB Permanent Campus Kuratoli",
    category: "university",
    thana: "Kuril",
    location: { latitude: 23.8222, longitude: 90.4278 },
  },
  DIU_DHANMONDI: {
    name: "Dhanmondi Education Hub (UIU/DIU Heritage Area)",
    category: "university",
    thana: "Dhanmondi",
    location: { latitude: 23.7516, longitude: 90.3776 },
  },

  // Commercial & Tech Districts
  GULSHAN_2_CIRCLE: {
    name: "Gulshan-2 Diplomatic / Corporate Zone",
    category: "commercial",
    thana: "Gulshan",
    location: { latitude: 23.7925, longitude: 90.4152 },
  },
  BANANI_11: {
    name: "Banani Road 11 Commercial Strip",
    category: "commercial",
    thana: "Banani",
    location: { latitude: 23.7937, longitude: 90.4043 },
  },
  KAWRAN_BAZAR_TECH: {
    name: "Kawran Bazar / Panthapath IT Cluster",
    category: "commercial",
    thana: "Tejgaon",
    location: { latitude: 23.7515, longitude: 90.3934 },
  },
  MOTIJHEEL_CUD: {
    name: "Motijheel Financial District",
    category: "commercial",
    thana: "Motijheel",
    location: { latitude: 23.7330, longitude: 90.4172 },
  },

  // MRT Line-6 Stations
  MRT_MIRPUR_10: {
    name: "Mirpur-10 Metro Rail Station",
    category: "metro_station",
    thana: "Mirpur",
    location: { latitude: 23.8069, longitude: 90.3687 },
  },
  MRT_UTTARA_NORTH: {
    name: "Uttara North Metro Station (Diabari)",
    category: "metro_station",
    thana: "Uttara",
    location: { latitude: 23.8741, longitude: 90.3842 },
  },
};

/**
 * Calculates Great-Circle distance between two coordinates in kilometers using Haversine formula
 */
export function calculateHaversineDistanceKm(
  point1: GeoPoint,
  point2: GeoPoint
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const dLon = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const lat1 = (point1.latitude * Math.PI) / 180;
  const lat2 = (point2.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c * 100) / 100; // Round to 2 decimal places
}

/**
 * Estimates peak Dhaka commute time in minutes based on distance and mode
 */
export function estimateDhakaCommuteMinutes(
  distanceKm: number,
  mode: "walk" | "rickshaw" | "metro" | "bus_or_car"
): number {
  switch (mode) {
    case "walk":
      return Math.round((distanceKm / 4.5) * 60); // 4.5 km/h walking speed
    case "rickshaw":
      return Math.round((distanceKm / 10) * 60 + 5); // 10 km/h + 5 min traffic factor
    case "metro":
      return Math.round((distanceKm / 35) * 60 + 7); // 35 km/h avg speed + station access
    case "bus_or_car":
      return Math.round((distanceKm / 12) * 60 + 15); // 12 km/h Dhaka peak traffic
  }
}

/**
 * Generates raw SQL clause for PostGIS ST_DWithin query (SRID 4326)
 */
export function buildPostGISRadiusQuery(
  center: GeoPoint,
  radiusMeters: number
): { sql: string; values: [number, number, number] } {
  return {
    sql: `ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)`,
    values: [center.longitude, center.latitude, radiusMeters],
  };
}
