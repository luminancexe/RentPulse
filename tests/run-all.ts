/**
 * RentPulse Master Test Runner
 * Executes all subsystem test suites across the monorepo:
 * 1. Phase 2: Relational Database & PostGIS Spatial Layer
 * 2. Phase 4: Roommate Synergy Engine & Tenancy Dossier Vault
 * 3. Phase 5: Tenancy Lifecycle, Viewing Booking & Multi-Rail Rent Ledger
 */

import { runDatabaseVerification } from "./verify-database";
import { runPhase4Verification } from "./verify-phase4";
import { runPhase5Verification } from "./verify-phase5";

async function main() {
  const startTime = Date.now();

  console.log("\n╔═══════════════════════════════════════════════════════════════╗");
  console.log("║            RentPulse Master Automated Test Runner             ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝\n");

  let totalPassed = 0;
  let totalFailed = 0;

  // Run Suite 1: Database & PostGIS
  console.log("\n▶ RUNNING SUITE 1/3: Database & PostGIS Spatial Layer");
  const dbRes = runDatabaseVerification();
  totalPassed += dbRes.passed;
  totalFailed += dbRes.failed;

  // Run Suite 2: Roommate Synergy & Dossier Vault
  console.log("\n▶ RUNNING SUITE 2/3: Roommate Synergy & Encrypted Dossier");
  const p4Res = await runPhase4Verification();
  totalPassed += p4Res.passed;
  totalFailed += p4Res.failed;

  // Run Suite 3: Tenancy Lifecycle, Viewing & Multi-Rail Ledger
  console.log("\n▶ RUNNING SUITE 3/3: Tenancy Lifecycle, Viewing & Multi-Rail Ledger");
  const p5Res = runPhase5Verification();
  totalPassed += p5Res.passed;
  totalFailed += p5Res.failed;

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log("\n=================================================================");
  console.log("  RENTPULSE MASTER VERIFICATION SUMMARY");
  console.log("=================================================================");
  console.log(`  • Phase 2 (Database & Spatial Layer):   ${dbRes.passed} Passed, ${dbRes.failed} Failed`);
  console.log(`  • Phase 4 (Synergy & Encrypted Vault):  ${p4Res.passed} Passed, ${p4Res.failed} Failed`);
  console.log(`  • Phase 5 (Lifecycle & Multi-Rail):     ${p5Res.passed} Passed, ${p5Res.failed} Failed`);
  console.log("-----------------------------------------------------------------");
  console.log(`  TOTAL: ${totalPassed} Passed, ${totalFailed} Failed (${durationSec}s)`);
  console.log("=================================================================\n");

  if (totalFailed > 0) {
    console.error("❌ Test run failed with errors.");
    process.exit(1);
  } else {
    console.log("✅ All test suites passed successfully (100% pass rate)!\n");
  }
}

main().catch((err) => {
  console.error("Unhandled error during test run:", err);
  process.exit(1);
});
