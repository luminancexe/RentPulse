# RentPulse

### Intelligent Multi-Persona House Rental Discovery, Cohabitation Compatibility, and Tenancy Lifecycle Management System

RentPulse is an enterprise-grade PropTech ecosystem and Business Information System (BIS) engineered to eliminate structural trust deficits, information asymmetry, and cohabitation friction in urban residential rental markets. 

The project is architected as a modern multi-tier cloud platform with a strong focus on **geospatial search (PostGIS 3.4), vector-based compatibility matching (Python FastAPI), relational integrity (PostgreSQL 16, 27 normalized tables), cryptographic document verification, statutory police reporting (DMP CIMS), and a tactile editorial boutique hotel design system**.

---

## 🎯 Project Mission

In fast-growing metropolitan centers like Dhaka, finding and managing a rental home is an exhausting, inefficient, and risky process. Prospective renters spend weeks sifting through unvetted social media groups and torn street notices; landlords suffer protracted vacancy intervals averaging six weeks; ghost listings extort advance booking deposits; and nearly a quarter of shared flats dissolve prematurely due to lifestyle incompatibility between roommates.

RentPulse establishes an intelligent, rule-governed ecosystem where:

- Renters discover verified properties through dual-mode filtering (Entire Apartment vs. Shared Room/Seat)
- Flatmates are algorithmically paired based on 5 core living habits before signing a lease
- Landlords verify ownership deeds via cryptographic hashing to eradicate ghost listings
- Itemized monthly utility breakdowns eliminate hidden billing friction
- Renters submit pre-screened, encrypted 1-click digital tenancy dossiers
- Tenancy agreements are generated with digital audit timestamps
- Tenant records are automatically formatted for statutory law enforcement compliance (DMP CIMS)

The goal is not merely to list properties, but to orchestrate the entire residential tenancy lifecycle with **transparency, mutual verification, demographic alignment, and operational trust**.

---

## 🏙️ Urban Tenancy Domain & Lifecycle

RentPulse models the complete end-to-end urban rental and cohabitation lifecycle:

```text
Renter Persona Onboarding (Student / Young Professional / Family)
   ↓
Geospatial Exploration & Commute Radiuses (PostGIS 3.4 + Barikoi)
   ↓
5-Vector Cohabitation Assessment (Sleep, Hygiene, Noise, Guests, Habits)
   ↓
Algorithmic Roommate Synergy Scoring (FastAPI Vector Cosine Engine)
   ↓
1-Click Encrypted Tenancy Dossier Transmission (AES-256 Vault)
   ↓
Two-Way Anti-Fraud Verification Gate (SHA-256 Deed Hashing & NID Audit)
   ↓
Inspection Slot Booking & Calendar Sync (Automated Masking SMS)
   ↓
Bilingual Digital Lease Agreement Generation (Bangla & English PDF)
   ↓
DMP CIMS Statutory Police Gateway Compliance Export
   ↓
Rent Ledger Reconciliation & MFS Settlement (bKash / Nagad Switches)
```

The platform represents core real-world domain entities including:

- Renter Profiles (Students, Bachelors, Corporate Transferees, Families)
- Landlord Profiles & Verified Lessor Badges
- Properties & Geocoded Spatial Centroids
- Physical Amenities & Itemized Utility Cost Breakdowns
- Roommate Questionnaires & 5-Axis Compatibility Matches
- Encrypted Tenancy Dossiers & Verifiable Submission Passes
- Inspection Availability Slots & Booking Appointments
- Title Deed Verifications & SHA-256 Document Hashes
- Bilateral Tenancy Contracts & Rent Ledgers
- DMP CIMS Statutory Citizen Records & Audit Event Logs

---

## 🔎 Problems RentPulse Addresses

RentPulse directly resolves five systemic friction points inherent to urban residential rental markets:

### 1. Demographic Mismatch & Cohabitation Friction
- Generic portals treat student bachelors, corporate singles, and multi-generational families through identical, uncurated feeds.
- In shared flats and university mess rentals, conflicting sleep chronotypes, uneven cleaning rigor, and misaligned guest policies trigger early move-outs (24% traditional turnover rate).

### 2. Ghost Listings & Financial Deposit Fraud
- Unvetted classifieds allow malicious actors to scrape legitimate photos, post fictitious properties, and extort advance deposits over mobile networks without ownership proof.
- Lack of landlord identity verification creates acute safety vulnerabilities for female renters and young students.

### 3. Opaque Utility Billing & Hidden Cost Drag
- Advertised rents routinely omit building service charges, gas cylinder replenishment, variable electricity slabs, and water surcharges, causing payment friction after move-in.
- Security deposit deduction criteria remain ambiguous and dispute-prone without an immutable baseline condition log.

### 4. Fragmented Applications & Privacy Vulnerabilities
- Tenants repeatedly distribute unencrypted physical copies of National ID cards, student IDs, and salary slips across informal brokers, creating severe data-leak vectors.
- Application vetting drag prolongs average landlord vacancy intervals to 42 calendar days per turnover.

### 5. Statutory Police Compliance Deficits (DMP CIMS)
- Municipal mandates requiring mandatory tenant registration with the Dhaka Metropolitan Police (Citizen Information Management System - CIMS) are neglected due to paper-based friction, leaving landlords legally exposed.

---

## 🧩 Core Capabilities

The completed RentPulse ecosystem is planned to provide:

### Dual-Mode Persona Discovery
- **Entire Apartment Mode:** Curated multi-bedroom flat leases with school catchment zones, building security specs, and family-oriented amenities.
- **Shared Flat / Roommate Mode:** Seat and single-room rentals tailored for students and young executives, showcasing existing flatmate profiles.
- **Geospatial Transit Radiuses:** Commute-time boundary filtering relative to major universities (e.g., DU, NSU, AIUB, BRAC) and business districts (Gulshan, Motijheel).

### Roommate Synergy Engine
- **5-Vector Living Habit Quiz:** Normalized scoring across Sleep Chronotype, Cleanliness Rigor, Study/Work Noise Tolerance, Guest Policy, and Dietary/Smoking habits.
- **Vector Cosine Matching:** Real-time percentage compatibility calculations ($0.0 \le \text{Synergy} \le 1.0$) executed via Python microservice.
- **Interactive 5-Axis Radar Chart:** Visual comparison of candidate living styles side-by-side.

### Anti-Fraud & Title Verification Gate
- **Cryptographic Deed Hashing:** SHA-256 document fingerprinting to instantly detect forged, altered, or duplicate ownership deeds.
- **Verified Lessor Trust Badge:** Verified status issued only upon cross-referencing ownership papers with municipal holding records.
- **Dual-Party NID Verification:** Verified identity badges for both property owners and prospective tenants.

### Transparent Itemized Cost Engine
- **Full Monthly Cost Unbundling:** Real-time breakdown separating Base Rent, Service Charge, Electricity estimate, Gas (Pipeline vs. LPG), and Water.
- **Deposit Escrow Record:** Explicitly defined refund criteria and advance rent terms.

### Digital Tenancy Dossier & Inspection Scheduling
- **1-Click Encrypted Dossier:** AES-256 encrypted tenant application bundle with time-limited viewing tokens.
- **Inspection Calendar:** Real-time slot management with automated SMS confirmation alerts via domestic telecom gateways.

### Tenancy Agreements & DMP Police Compliance
- **Bilingual Lease Generation:** Legally structured PDF contracts in Bangla and English with digital signature timestamps.
- **DMP CIMS One-Click Export:** Automated generation of police tenant verification forms in full statutory format.
- **Rent Ledger & MFS Deep-Linking:** Monthly payment status tracking with direct redirection to bKash / Nagad mobile financial switches.

---

## 📐 Architecture, Design System & Roadmap

For in-depth technical documentation, design tokens, platform diagrams, and delivery schedules, see the dedicated [ARCHITECTURE.md](ARCHITECTURE.md) specification:

- 🎨 **[Editorial Design System & Visual Philosophy](ARCHITECTURE.md#-editorial-design-system--visual-philosophy)** — Warm alabaster palette tokens (`#FAF8F5`, `#1C1A17`), typography pairing (*Fraunces* + *Plus Jakarta Sans*), and widescreen layout physics.
- 🏗️ **[Platform Architecture & Subsystems](ARCHITECTURE.md#️-platform-architecture)** — Decoupled client presentation, Node.js API actions, PostgreSQL 16 / PostGIS 3.4 spatial layer, and Python vector matching microservice.
- 🛠️ **[Planned Technology Stack](ARCHITECTURE.md#️-planned-technology-stack)** — Detailed component breakdown (Next.js 15, React Native Expo, PostGIS, Barikoi Maps, Web Crypto AES-256).
- 📋 **[16-Week Project Roadmap & Milestones](ARCHITECTURE.md#-project-roadmap)** — Agile delivery across Phases 1 through 6.
- 📑 **[Milestone Completion Reports](reports/)** — Comprehensive phase delivery sign-offs, verification logs, and audit criteria across all roadmap phases.

---

## 📁 Directory Structure

```text
RentPulse/
├── apps/
│   ├── web/                         # Next.js 15 App Router (Editorial Hotel Web Platform)
│   │   ├── app/                     # Routes: (auth), (discovery), (dossier), (landlord), api/
│   │   ├── components/              # UI Kit: ui/, listings/, matching/, booking/
│   │   ├── lib/                     # Utilities, PostGIS queries, auth tokens
│   │   └── styles/                  # Tailwind tokens, typography, CSS variables
│   └── mobile/                      # React Native Expo (Cross-Platform Mobile App)
├── packages/
│   ├── db/                          # Prisma ORM schema (27 PostgreSQL tables & PostGIS spatial engine)
│   ├── matching-engine/             # Python FastAPI / TS vector roommate scoring
│   └── shared-types/                # Shared TypeScript DTOs and API interfaces
├── config/                          # Tailwind presets, ESLint configs, TypeScript base
├── reports/                         # Phase completion reports & audit artifacts
│   ├── README.md                    # Reports index and delivery governance guide
│   ├── PHASE_1_COMPLETION_REPORT.md # Phase 1 verification and deliverables sign-off
│   └── PHASE_2_COMPLETION_REPORT.md # Phase 2 database, PostGIS & seed verification
├── .gitignore                       # Multi-stack ignore rules (Node, Next, Expo, Python)
├── ARCHITECTURE.md                  # Design system, platform architecture, tech stack & roadmap
└── README.md                        # Master overview, mission, domain lifecycle & capabilities
```

---

## 👥 Authors & Maintainers

- **Noman** — [@luminancexe](https://github.com/luminancexe)
- **Abrar** — [@abrar-0992](https://github.com/abrar-0992)

---

## 📄 License

This project is proprietary and confidential. All rights reserved.
