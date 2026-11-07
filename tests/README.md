# RentPulse Test Suites

This directory contains automated verification and end-to-end test suites for the **RentPulse** monorepo.

---

## 📁 Test Suite Structure

```text
tests/
├── README.md                      # Documentation & command reference
├── run-all.ts                     # Unified master test runner executing all suites
├── verify-database.ts             # Phase 2: Relational schema, seed data, & PostGIS spatial calculations
├── verify-phase4.ts               # Phase 4: Roommate synergy cosine engine, radar geometry & AES-256 vault
└── verify-phase5.ts               # Phase 5: Anti-collision viewing calendar, bilingual lease & multi-rail ledger
```

---

## 🚀 Running Test Suites

You can run individual test suites or execute all suites at once using npm scripts configured at the root `package.json`:

### Run All Suites
```bash
npm run test:all
# or
npm test
```

### Run Subsystem-Specific Suites
```bash
# Phase 2: Database & PostGIS Spatial Layer
npm run test:db

# Phase 4: Roommate Synergy & Encrypted Tenancy Dossier
npm run test:phase4

# Phase 5: Viewing Calendar, Bilingual Leases & Multi-Rail Rent Ledger
npm run test:phase5
```

---

## 🧪 Test Coverage Breakdown

| Test Suite | Subsystems Verified | Test Count | Pass Rate |
| :--- | :--- | :---: | :---: |
| **`verify-database.ts`** | PostGIS distance, commute estimations, seed inventories, spatial radius SQL | 6 | 100% |
| **`verify-phase4.ts`** | Cosine similarity, Euclidean distance, 5-axis SVG radar math, AES-GCM 256 vault, deed anti-fraud | 53 | 100% |
| **`verify-phase5.ts`** | Anti-collision calendar, RFC 5545 .ics, Act 1991 leases, DMP Form-2, Card brand detection, MFS | 49 | 100% |
| **Total** | **Unified Full-Stack Verification** | **108 Tests** | **100%** |
