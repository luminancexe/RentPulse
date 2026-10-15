# RentPulse

<p align="center">
  <strong>An Intelligent Multi-Persona House Rental Discovery, Cohabitation Compatibility, and Tenancy Lifecycle Management System</strong>
</p>

<p align="center">
  <em>Designed for urban residential renters (students, young professionals, families) and verified property owners.</em>
</p>

---

## 🌟 Overview

**RentPulse** is an enterprise-grade PropTech ecosystem designed to solve structural trust deficits, information asymmetry, and cohabitation friction in urban residential rental markets such as Dhaka, Bangladesh. 

Rather than functioning as an unvetted classifieds feed, RentPulse combines:
1. **Dual-Mode Persona Discovery:** Seamless switching between leasing an **Entire Apartment** (for families/relocators) and securing a **Shared Flat / Roommate Seat** (for students/young bachelors).
2. **Roommate Synergy Engine:** A 5-vector habit compatibility matching algorithm (sleep chronotype, cleanliness, study noise, guest policy, diet/smoking) paired with interactive 5-axis radar charts.
3. **Two-Way Anti-Fraud Verification:** Landlord title deed / Khatian verification with cryptographic hashing and verified NID/student badges for renters.
4. **Transparent Cost Breakdown:** Itemized utility pricing showing base rent, building service charges, electricity estimates, gas, and water upfront.
5. **Encrypted Digital Tenancy Dossiers:** 1-click tenant application pass with time-limited viewing permissions.
6. **Statutory DMP CIMS Compliance:** Native export aligned with the Dhaka Metropolitan Police Citizen Information Management System mandate.

---

## 🎨 Visual Identity & Design System

RentPulse departs from generic, sterile SaaS templates in favor of a **warm, tactile editorial boutique hotel aesthetic**:

* **Canvas Background:** `#FAF8F5` (Warm Alabaster / Linen)
* **Card Surfaces:** `#FFFFFF` with delicate `1px` hairline borders (`rgba(28, 26, 23, 0.08)`)
* **Muted Containers:** `#F3EFEA` (Warm Sand)
* **Primary Typography:** `#1C1A17` (Deep Espresso Charcoal)
* **Secondary Typography:** `#736B64` (Warm Taupe)
* **Accents:** `#2C4A3E` (Boutique Forest Evergreen) & `#BD5338` (Terracotta)
* **Font Pairing:**
  * **Display & Headings:** *Fraunces* (Editorial Serif) or *Cabinet Grotesk*
  * **Body & UI:** *Plus Jakarta Sans* or *Satoshi*
  * **Prices & Stats:** Tabular figures (`font-feature-settings: 'tnum'`)
* **Card Proportions:** Cinematic `16:10` widescreen photography containers with frosted glass micro-badges (`backdrop-blur-md bg-white/80`).

---

## 🏛️ System Architecture & Technology Stack

RentPulse is built as a modular, cloud-native multi-tier architecture:

```
+---------------------------------------------------------------------------------------------------+
|                                      RENTPULSE PLATFORM ARCHITECTURE                              |
+---------------------------------------------------------------------------------------------------+
|  PRESENTATION LAYER                                                                               |
|  • Web Portal: Next.js 15 (React 19, App Router, Tailwind CSS, Lucide React, Framer Motion)       |
|  • Mobile App: React Native Expo (Cross-Platform iOS & Android, Native Camera Inspection)         |
+---------------------------------------------------------------------------------------------------+
|  BUSINESS LOGIC & API GATEWAY                                                                     |
|  • Node.js / Express / Next.js Server Actions & API Routes (TypeScript)                           |
|  • Python 3.11 + FastAPI Microservice (Euclidean & Cosine Vector Roommate Matching)               |
+---------------------------------------------------------------------------------------------------+
|  PERSISTENCE & SPATIAL ENGINE                                                                     |
|  • PostgreSQL 16.2 with PostGIS 3.4 Spatial Extension (27 Normalized Relational Tables)           |
|  • Prisma / Drizzle ORM with GiST spatial indexing for proximity queries                          |
|  • Redis for high-frequency session & search caching                                              |
+---------------------------------------------------------------------------------------------------+
|  GATEWAYS & LOCAL INTEGRATIONS                                                                    |
|  • Barikoi BD & Mapbox GL JS (Dhaka street-level geocoding & transit radiuses)                    |
|  • SSL Wireless / Greenweb (Domestic Masking SMS OTP & Viewing Alerts)                            |
|  • DMP CIMS Gateway (Statutory Police Verification Export)                                        |
|  • bKash / Nagad Mobile Financial Services (MFS) Deep-Linking Simulator                           |
+---------------------------------------------------------------------------------------------------+
```

---

## 📁 Repository Directory Structure

```
RentPulse/
├── apps/
│   ├── web/                         # Next.js 15 Web Platform (App Router, Editorial Hotel UI)
│   │   ├── app/                     # Routes: (auth), (discovery), (dossier), (landlord), api/
│   │   ├── components/              # UI Kit: ui/, listings/, matching/, booking/
│   │   ├── lib/                     # Utilities, PostGIS queries, auth tokens
│   │   └── styles/                  # Tailwind tokens, typography, CSS variables
│   └── mobile/                      # React Native Expo (Cross-Platform Mobile App)
├── packages/
│   ├── db/                          # Prisma / Drizzle ORM schema (27 PostgreSQL tables)
│   ├── matching-engine/             # Python FastAPI / TS vector roommate scoring
│   └── shared-types/                # Shared TypeScript DTOs and API interfaces
├── config/                          # Tailwind presets, ESLint configs, TypeScript base
├── .gitignore                       # Multi-stack ignore rules (Node, Next, Expo, Python)
└── README.md                        # Project documentation
```

---

## 🗺️ 6-Phase Implementation Roadmap

The project follows a 16-week agile engineering schedule:

1. **Phase 1: Scaffolding, Design Tokens & Tooling (Weeks 1–2):** Next.js 15 App Router setup, editorial design tokens, fonts (*Fraunces* + *Plus Jakarta Sans*), and base layout shells.
2. **Phase 2: Database Schema & PostGIS Spatial Layer (Weeks 3–4):** 27 relational tables across 8 subsystems, PostGIS GiST spatial indexing, and Dhaka mock seed datasets.
3. **Phase 3: Boutique UI Kit & Dual-Mode Discovery (Weeks 5–7):** Atomic UI kit (`<PillChip />`, `<GlassBadge />`, `<ImagePeekCarousel />`), dual-mode search, muted interactive map, and transparent cost breakdown calculator.
4. **Phase 4: Roommate Synergy Engine & Tenancy Dossier (Weeks 8–10):** 5-vector habit assessment, vector cosine matching microservice, 1-click encrypted tenancy dossier, and landlord title deed verification gate.
5. **Phase 5: Tenancy Lifecycle, Booking & DMP CIMS Gateway (Weeks 11–13):** Viewing calendar scheduler, bilingual (Bangla/English) digital lease generator, and DMP CIMS statutory export.
6. **Phase 6: Mobile Client Parity, QA & Production Deployment (Weeks 14–16):** React Native Expo parity, automated test suites (Jest, Playwright, PyTest >85% coverage), and cloud staging deployment.

---

## 👥 Authors & Maintainers

- **Noman** — [@luminancexe](https://github.com/luminancexe)
- **Abrar** — [@abrar-0992](https://github.com/abrar-0992)

---

## 📄 License

This project is proprietary and confidential. All rights reserved.

