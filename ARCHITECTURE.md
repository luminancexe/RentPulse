# RentPulse Platform Architecture & Engineering Specification

This document details the visual philosophy, technical architecture, planned stack, and phase delivery roadmap for the RentPulse ecosystem.

---

## 🎨 Editorial Design System & Visual Philosophy

RentPulse departs from generic, sterile SaaS templates in favor of a **tactile, warm editorial boutique hotel design language**:

```
Canvas Base         Card Surface        Muted Sand          Deep Espresso       Warm Taupe          Deep Forest (Accent)
#FAF8F5             #FFFFFF             #F3EFEA             #1C1A17             #736B64             #2C4A3E
[Warm Linen]        [Crisp Paper]       [Muted Container]   [Primary Ink]       [Secondary Meta]    [Boutique Evergreen]
```

- **Material Palette:** Warm Alabaster (`#FAF8F5`) linen canvas paired with crisp card surfaces (`#FFFFFF`) and delicate 1px hairline outlines (`rgba(28, 26, 23, 0.08)`). Zero muddy drop shadows.
- **Typographic Hierarchy:**
  - **Headings & Display:** *Fraunces* (Editorial Serif) or *Cabinet Grotesk* for high-character warmth.
  - **Body & Subtitles:** *Plus Jakarta Sans* or *Satoshi* for clean, modern readability.
  - **Prices & Numerals:** Tabular Figures (`font-feature-settings: 'tnum'`) with lightweight `/ month` suffixes.
  - **Micro-Badges:** 10–11px uppercase with wide letter-spacing (`tracking-widest`).
- **Cinematic Framing:** `16:10` widescreen photography containers with subtle horizontal edge-peeking (`16–24px`) to afford natural swipe gestures on mobile.
- **Frosted Overlays:** Glassmorphic status chips (`backdrop-blur-md bg-white/80`) with translucent hairline borders.
- **Ambient Physics:** Tactile hover elevation physics (`cubic-bezier(0.16, 1, 0.3, 1)`) with soft, diffuse shadow diffusion.

---

## 🏗️ Platform Architecture

RentPulse is organized into decoupled layers ensuring high horizontal scalability, strict data privacy, and sub-second geospatial query performance:

```text
                    ┌────────────────────────────────────────────────────────┐
                    │               Client Presentation Layer                │
                    │   Next.js 15 Web Portal  │  React Native Expo Mobile   │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                                ▼
                    ┌────────────────────────────────────────────────────────┐
                    │              API Gateway & Server Actions              │
                    │        Node.js / Express / Next.js API Routes          │
                    └───────────┬───────────────────────────────┬────────────┘
                                │                               │
               ┌────────────────┴───────────────┐               │
               ▼                                ▼               ▼
     Authentication & Dossier            Listing Pipeline  Cost Engine
     (JWT, AES-256 Vault)               (PostGIS Spatial)  (Itemized Breakdown)
               │                                │               │
               ├────────────────────────────────┴───────────────┤
               ▼                                                ▼
┌───────────────────────────────┐              ┌─────────────────────────────────┐
│  Python Matching Microservice │              │   PostgreSQL 16.2 + PostGIS 3.4 │
│  (FastAPI, NumPy Vector Math) │              │   (27 Normalized Tables / GiST) │
└───────────────────────────────┘              └────────────────┬────────────────┘
                                                                │
                               ┌────────────────────────────────┴────────────────┐
                               ▼                                                 ▼
                ┌───────────────────────────────┐              ┌─────────────────────────────────┐
                │    External Gateways & SMS    │              │    Statutory & MFS Gateways     │
                │  (Barikoi Maps, SSL Wireless) │              │   (DMP CIMS Export, bKash/Nagad)│
                └───────────────────────────────┘              └─────────────────────────────────┘
```

### Architectural Subsystems:
1. **Presentation Tier:** Next.js 15 App Router web client with React 19 SSR, paired with an Expo React Native mobile client sharing TypeScript interfaces.
2. **API & Workflow Layer:** Node.js TypeScript server actions and REST endpoints governing authentication, booking slots, and dossier permissions.
3. **Spatial Relational Engine:** PostgreSQL 16.2 with PostGIS 3.4 extensions, indexed with GiST spatial bounds for sub-millisecond radius and polygon filtering.
4. **Cohabitation Synergy Service:** Dedicated Python 3.11 FastAPI microservice computing normalized vector distances and cosine compatibility scores across 5 lifestyle dimensions.
5. **Security & Cryptographic Vault:** Web Crypto API client-side AES-256 encryption for tenant dossiers and SHA-256 deed fingerprinting.
6. **Regulatory Compliance Engine:** Statutory DMP CIMS export gateway generating audit-compliant police filing formats.

---

## 🛠️ Planned Technology Stack

| Area | Technology | Purpose & Specifications |
|---|---|---|
| **Web Client** | Next.js 15 (React 19, App Router) | High-performance editorial web platform, SSR & Server Actions |
| **Mobile Client** | React Native Expo (iOS & Android) | Cross-platform mobile app, native camera inspection & push alerts |
| **Styling & Icons** | Tailwind CSS + Lucide React | Boutique editorial tokens (`#FAF8F5`, `#1C1A17`), thin-stroke icons |
| **Typography** | `next/font` (Fraunces + Plus Jakarta Sans) | Variable serif display headings paired with geometric sans-serif |
| **API & Business Logic** | Node.js, Express, TypeScript | REST API endpoints, JWT authentication, and booking workflows |
| **Matching Microservice** | Python 3.11, FastAPI, NumPy | 5-vector Euclidean distance and cosine similarity calculations |
| **Primary Database** | PostgreSQL 16.2 | 27 normalized relational tables across 8 functional subsystems |
| **Spatial Engine** | PostGIS 3.4 | GiST indexing on `geometry(Point, 4326)` for radius filtering |
| **ORM & Data Layer** | Prisma / Drizzle ORM | Type-safe database queries and automated schema migrations |
| **Encryption & Security** | Web Crypto API (AES-256, SHA-256) | Client-side dossier encryption & cryptographic deed hashing |
| **Geospatial & Maps** | Barikoi BD API + Mapbox GL JS | Dhaka street-level geocoding, reverse geocoding & custom tiles |
| **Telecom Integration** | SSL Wireless / Greenweb SMS Gateway | Domestic masking SMS for OTP verification and booking confirmations |
| **Testing Frameworks** | Jest, Playwright, PyTest | Unit, end-to-end user journey, and vector algorithm test suites |

---

## 📋 Project Roadmap

RentPulse is structured as a 16-week agile engineering delivery across 6 sequential phases:

| Phase | Milestone Focus | Status | Deliverables & Verification |
|---|---|:---:|---|
| **Phase 1** | **Scaffolding, Editorial Tokens & Core Workspace** | [✅ Complete](reports/PHASE_1_COMPLETION_REPORT.md) | Next.js 15 App Router setup, boutique hotel design tokens, Fraunces/Jakarta typography loaders, landing page experience, and zero-error production build. |
| **Phase 2** | **Database Architecture & PostGIS Spatial Layer** | [✅ Complete](reports/PHASE_2_COMPLETION_REPORT.md) | 27 relational tables (Prisma), PostGIS 3.4 spatial extensions, GiST spatial indexes, Dhaka neighborhood centroids, and database migration test suite. |
| **Phase 3** | **Boutique UI Kit & Dual-Mode Discovery Experience** | 🔜 Next | Atomic components, 16:10 widescreen cards, interactive map feed, dual-mode filter switch, and transparent cost breakdown calculator. |
| **Phase 4** | **Roommate Synergy Engine & Tenancy Dossier** | ⏳ Planned | 5-vector habit quiz, Python vector matching microservice, radar chart visualizations, and client-side encrypted dossier vault. |
| **Phase 5** | **Tenancy Lifecycle, Viewing Booking & DMP CIMS Gateway** | ⏳ Planned | Inspection slot scheduler, bilingual digital lease generator, MFS payment redirection, and police compliance export. |
| **Phase 6** | **Mobile Client Parity, Quality Assurance & Cloud Staging** | ⏳ Planned | React Native Expo mobile app, Jest/Playwright testing (>85% coverage), automated CI/CD pipeline, and cloud release. |
