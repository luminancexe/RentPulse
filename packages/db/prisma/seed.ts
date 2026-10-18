/**
 * RentPulse Database Seed Script
 * Executes full hydration of 27 tables with realistic Dhaka rental inventory
 */

import { PrismaClient } from "@prisma/client";
import { DHAKA_SEED_USERS, DHAKA_SEED_PROPERTIES } from "../src/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting RentPulse database hydration...");

  // 1. Seed Users & Profiles
  for (const u of DHAKA_SEED_USERS) {
    console.log(`  Creating user: ${u.fullName} (${u.role})`);
    const createdUser = await prisma.user.upsert({
      where: { phoneNumber: u.phoneNumber },
      update: {},
      create: {
        id: u.id,
        phoneNumber: u.phoneNumber,
        email: u.email,
        fullName: u.fullName,
        passwordHash: u.passwordHash,
        role: u.role,
        isPhoneVerified: u.isPhoneVerified,
        isNidVerified: u.isNidVerified,
        status: u.status,
      },
    });

    if ("landlordProfile" in u && u.landlordProfile) {
      await prisma.landlordProfile.upsert({
        where: { userId: createdUser.id },
        update: {},
        create: {
          userId: createdUser.id,
          nidNumber: u.landlordProfile.nidNumber,
          totalRegisteredProperties: u.landlordProfile.totalRegisteredProperties,
          isTrustBadgeAwarded: u.landlordProfile.isTrustBadgeAwarded,
          trustScore: u.landlordProfile.trustScore,
        },
      });
    }

    if ("renterProfile" in u && u.renterProfile) {
      await prisma.renterProfile.upsert({
        where: { userId: createdUser.id },
        update: {},
        create: {
          userId: createdUser.id,
          personaType: u.renterProfile.personaType,
          institutionOrCompany: u.renterProfile.institutionOrCompany,
          occupationTitle: u.renterProfile.occupationTitle,
          monthlyIncome: u.renterProfile.monthlyIncome,
          maritalStatus: u.renterProfile.maritalStatus,
          emergencyContactName: u.renterProfile.emergencyContactName,
          emergencyContactPhone: u.renterProfile.emergencyContactPhone,
          bio: u.renterProfile.bio,
        },
      });
    }

    if ("questionnaire" in u && u.questionnaire) {
      await prisma.roommateQuestionnaire.upsert({
        where: { renterId: createdUser.id },
        update: {},
        create: {
          renterId: createdUser.id,
          sleepScheduleScore: u.questionnaire.sleepScheduleScore,
          cleanlinessHabitsScore: u.questionnaire.cleanlinessHabitsScore,
          socialGuestTolerance: u.questionnaire.socialGuestTolerance,
          noiseTolerance: u.questionnaire.noiseTolerance,
          dietaryLifestyle: u.questionnaire.dietaryLifestyle,
          smokingToleranceScore: u.questionnaire.smokingToleranceScore,
          sharingMindsetScore: u.questionnaire.sharingMindsetScore,
          studyFocusPriority: u.questionnaire.studyFocusPriority,
          compatibilityVector: u.questionnaire.compatibilityVector,
        },
      });
    }
  }

  // 2. Seed Properties, Amenities, Listings & Cost Breakdowns
  for (const p of DHAKA_SEED_PROPERTIES) {
    console.log(`  Creating property: ${p.title} (${p.thana})`);
    const createdProperty = await prisma.property.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        landlordId: p.landlordId,
        title: p.title,
        description: p.description,
        buildingName: p.buildingName,
        holdingNumber: p.holdingNumber,
        roadNumber: p.roadNumber,
        blockSector: p.blockSector,
        thana: p.thana,
        district: p.district,
        postalCode: p.postalCode,
        latitude: p.latitude,
        longitude: p.longitude,
        geom: `POINT(${p.longitude} ${p.latitude})`,
        totalFloors: p.totalFloors,
        yearBuilt: p.yearBuilt,
        isActive: true,
      },
    });

    // Amenities
    await prisma.propertyAmenity.upsert({
      where: { propertyId: createdProperty.id },
      update: {},
      create: {
        propertyId: createdProperty.id,
        hasLift: p.amenities.hasLift,
        hasStandbyGenerator: p.amenities.hasStandbyGenerator,
        hasCctvSurveillance: p.amenities.hasCctvSurveillance,
        hasDedicatedSecurityGuard: p.amenities.hasDedicatedSecurityGuard,
        hasCarParking: p.amenities.hasCarParking,
        hasMotorcycleParking: p.amenities.hasMotorcycleParking,
        gasSupply: p.amenities.gasSupply,
        hasWasaWaterSupply: p.amenities.hasWasaWaterSupply,
        hasRooftopAccess: p.amenities.hasRooftopAccess,
        hasIntercom: p.amenities.hasIntercom,
      },
    });

    // Listing
    const createdListing = await prisma.listing.upsert({
      where: { id: p.listing.id },
      update: {},
      create: {
        id: p.listing.id,
        propertyId: createdProperty.id,
        landlordId: p.landlordId,
        listingType: p.listing.listingType,
        unitNumber: p.listing.unitNumber,
        floorLevel: p.listing.floorLevel,
        bedRooms: p.listing.bedRooms,
        bathRooms: p.listing.bathRooms,
        balconies: p.listing.balconies,
        carpetAreaSqft: p.listing.carpetAreaSqft,
        furnishing: p.listing.furnishing,
        preferredPersona: p.listing.preferredPersona,
        availableFrom: p.listing.availableFrom,
        isNegotiable: p.listing.isNegotiable,
        listingStatus: "active",
      },
    });

    // Cost Breakdown
    await prisma.propertyCostBreakdown.upsert({
      where: { listingId: createdListing.id },
      update: {},
      create: {
        listingId: createdListing.id,
        baseRent: p.listing.costBreakdown.baseRent,
        serviceCharge: p.listing.costBreakdown.serviceCharge,
        electricityBilling: p.listing.costBreakdown.electricityBilling,
        gasFee: p.listing.costBreakdown.gasFee,
        wasaWaterFee: p.listing.costBreakdown.wasaWaterFee,
        wasteCollectionFee: p.listing.costBreakdown.wasteCollectionFee,
        broadbandInternetFee: p.listing.costBreakdown.broadbandInternetFee,
        securityDepositMonths: p.listing.costBreakdown.securityDepositMonths,
        advanceRentMonths: p.listing.costBreakdown.advanceRentMonths,
        estimatedGrossMonthlyCost:
          p.listing.costBreakdown.estimatedGrossMonthlyCost,
      },
    });

    // Listing Media
    for (const m of p.listing.media) {
      await prisma.listingMedia.create({
        data: {
          listingId: createdListing.id,
          mediaType: m.mediaType,
          mediaUrl: m.mediaUrl,
          displayOrder: m.displayOrder,
          isCoverPhoto: m.isCoverPhoto,
        },
      });
    }
  }

  // 3. Seed Sample Compatibility Match
  console.log("  Creating roommate compatibility evaluation...");
  await prisma.roommateCompatibilityMatch.upsert({
    where: {
      renterAId_renterBId: {
        renterAId: "usr-renter-student-01",
        renterBId: "usr-renter-student-02",
      },
    },
    update: {},
    create: {
      renterAId: "usr-renter-student-01",
      renterBId: "usr-renter-student-02",
      aggregateCompatibilityScore: 94.25,
      sleepVectorDelta: 0.0,
      cleanlinessVectorDelta: 0.2,
      socialVectorDelta: 0.0,
      noiseVectorDelta: 0.0,
      dietVectorDelta: 0.0,
      radarChartPayload: {
        axes: ["Sleep Schedule", "Cleanliness", "Social Guest", "Quiet Study", "Diet"],
        scoresA: [80, 100, 40, 40, 100],
        scoresB: [80, 80, 40, 40, 100],
      },
      status: "calculated",
    },
  });

  console.log("✅ RentPulse database hydration complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
