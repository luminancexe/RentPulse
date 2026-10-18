-- ============================================================================
-- RentPulse Enterprise PostgreSQL 16.2 + PostGIS 3.4 Migration
-- Creates all 27 Normalized Relational Tables across 8 Subsystems
-- Includes PostGIS Spatial Extensions, GiST Indices, and Enums
-- ============================================================================

-- Enable PostGIS Spatial Engine
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. ENUMS CATALOG
CREATE TYPE "user_role_enum" AS ENUM ('renter', 'landlord', 'admin');
CREATE TYPE "persona_type_enum" AS ENUM ('student', 'young_professional', 'family');
CREATE TYPE "listing_type_enum" AS ENUM ('entire_flat', 'single_room', 'shared_seat', 'sublet');
CREATE TYPE "furnishing_status_enum" AS ENUM ('unfurnished', 'semi_furnished', 'fully_furnished');
CREATE TYPE "gas_supply_type_enum" AS ENUM ('government_pipeline', 'lpg_cylinder', 'none');
CREATE TYPE "electricity_billing_enum" AS ENUM ('prepaid_card', 'postpaid_submeter', 'fixed_utility_share');
CREATE TYPE "viewing_mode_enum" AS ENUM ('in_person', 'virtual_call');
CREATE TYPE "viewing_status_enum" AS ENUM ('requested', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE "dossier_status_enum" AS ENUM ('draft', 'ready_locked', 'submitted', 'approved', 'rejected');
CREATE TYPE "deed_audit_status_enum" AS ENUM ('pending_audit', 'verified', 'rejected', 'fraud_flagged');
CREATE TYPE "agreement_status_enum" AS ENUM ('draft', 'pending_renter_signature', 'pending_landlord_signature', 'executed', 'active', 'expired', 'terminated');
CREATE TYPE "payment_type_enum" AS ENUM ('advance_booking_deposit', 'security_deposit', 'monthly_rent', 'itemized_utility_bill');
CREATE TYPE "payment_channel_enum" AS ENUM ('bkash', 'nagad', 'bank_transfer', 'card');
CREATE TYPE "payment_status_enum" AS ENUM ('initiated', 'processing', 'escrowed', 'released_to_landlord', 'refunded_to_renter', 'failed');
CREATE TYPE "ledger_status_enum" AS ENUM ('unpaid', 'partially_paid', 'paid', 'overdue');
CREATE TYPE "cims_export_status_enum" AS ENUM ('draft', 'encrypted_ready', 'dispatched_to_police', 'acknowledged_by_thana');
CREATE TYPE "dispute_status_enum" AS ENUM ('open', 'under_mediation', 'resolved_mutual', 'escalated_legal', 'dismissed');
CREATE TYPE "match_status_enum" AS ENUM ('calculated', 'contacted', 'cohabitating_accepted', 'dismissed');
CREATE TYPE "dietary_preference_enum" AS ENUM ('halal', 'vegetarian', 'non_vegetarian_flexible', 'strict_vegan');

-- 2. IDENTITY VAULT (SUB-01)
CREATE TABLE "users" (
    "id" VARCHAR(36) PRIMARY KEY,
    "phone_number" VARCHAR(20) NOT NULL UNIQUE,
    "email" VARCHAR(255) UNIQUE,
    "full_name" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "user_role_enum" NOT NULL DEFAULT 'renter',
    "is_phone_verified" BOOLEAN NOT NULL DEFAULT FALSE,
    "is_nid_verified" BOOLEAN NOT NULL DEFAULT FALSE,
    "avatar_url" VARCHAR(500),
    "status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "renter_profiles" (
    "id" VARCHAR(36) PRIMARY KEY,
    "user_id" VARCHAR(36) NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
    "persona_type" "persona_type_enum" NOT NULL,
    "institution_or_company" VARCHAR(200),
    "occupation_title" VARCHAR(150),
    "monthly_income" DECIMAL(12,2),
    "marital_status" VARCHAR(50),
    "emergency_contact_name" VARCHAR(150),
    "emergency_contact_phone" VARCHAR(20),
    "bio" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "landlord_profiles" (
    "id" VARCHAR(36) PRIMARY KEY,
    "user_id" VARCHAR(36) NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
    "nid_number" VARCHAR(30) NOT NULL UNIQUE,
    "trade_license_no" VARCHAR(100),
    "tax_identification_number" VARCHAR(50),
    "total_registered_properties" INT NOT NULL DEFAULT 0,
    "is_trust_badge_awarded" BOOLEAN NOT NULL DEFAULT FALSE,
    "trust_score" DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    "verified_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "otp_verifications" (
    "id" VARCHAR(36) PRIMARY KEY,
    "phone_number" VARCHAR(20) NOT NULL,
    "otp_code" VARCHAR(6) NOT NULL,
    "purpose" VARCHAR(50) NOT NULL,
    "attempt_count" INT NOT NULL DEFAULT 0,
    "is_consumed" BOOLEAN NOT NULL DEFAULT FALSE,
    "expires_at" TIMESTAMP NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "notification_preferences" (
    "id" VARCHAR(36) PRIMARY KEY,
    "user_id" VARCHAR(36) NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
    "sms_enabled" BOOLEAN NOT NULL DEFAULT TRUE,
    "email_enabled" BOOLEAN NOT NULL DEFAULT TRUE,
    "push_enabled" BOOLEAN NOT NULL DEFAULT TRUE,
    "vacancy_alerts_enabled" BOOLEAN NOT NULL DEFAULT TRUE,
    "chat_notifications_enabled" BOOLEAN NOT NULL DEFAULT TRUE,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. GEOSPATIAL SEARCH & INVENTORY (SUB-02 & SUB-05)
CREATE TABLE "properties" (
    "id" VARCHAR(36) PRIMARY KEY,
    "landlord_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "building_name" VARCHAR(150),
    "holding_number" VARCHAR(50),
    "road_number" VARCHAR(50),
    "block_sector" VARCHAR(50),
    "thana" VARCHAR(100) NOT NULL,
    "district" VARCHAR(100) NOT NULL DEFAULT 'Dhaka',
    "postal_code" VARCHAR(20),
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "geom" geometry(Point, 4326),
    "total_floors" INT NOT NULL DEFAULT 1,
    "building_type" VARCHAR(50) DEFAULT 'Residential Apartment',
    "year_built" INT,
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- PostGIS Spatial GiST Index for sub-millisecond radius search
CREATE INDEX "properties_geom_gist_idx" ON "properties" USING GIST ("geom");
CREATE INDEX "properties_thana_is_active_idx" ON "properties" ("thana", "is_active");

CREATE TABLE "property_amenities" (
    "id" VARCHAR(36) PRIMARY KEY,
    "property_id" VARCHAR(36) NOT NULL UNIQUE REFERENCES "properties"("id") ON DELETE CASCADE,
    "has_lift" BOOLEAN NOT NULL DEFAULT FALSE,
    "has_standby_generator" BOOLEAN NOT NULL DEFAULT FALSE,
    "has_cctv_surveillance" BOOLEAN NOT NULL DEFAULT FALSE,
    "has_dedicated_security_guard" BOOLEAN NOT NULL DEFAULT FALSE,
    "has_car_parking" BOOLEAN NOT NULL DEFAULT FALSE,
    "has_motorcycle_parking" BOOLEAN NOT NULL DEFAULT FALSE,
    "gas_supply" "gas_supply_type_enum" NOT NULL DEFAULT 'government_pipeline',
    "has_wasa_water_supply" BOOLEAN NOT NULL DEFAULT TRUE,
    "has_rooftop_access" BOOLEAN NOT NULL DEFAULT FALSE,
    "has_intercom" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "listings" (
    "id" VARCHAR(36) PRIMARY KEY,
    "property_id" VARCHAR(36) NOT NULL REFERENCES "properties"("id") ON DELETE CASCADE,
    "landlord_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "listing_type" "listing_type_enum" NOT NULL DEFAULT 'entire_flat',
    "unit_number" VARCHAR(50),
    "floor_level" INT NOT NULL,
    "bed_rooms" INT NOT NULL DEFAULT 1,
    "bath_rooms" INT NOT NULL DEFAULT 1,
    "balconies" INT NOT NULL DEFAULT 0,
    "carpet_area_sqft" INT NOT NULL,
    "furnishing" "furnishing_status_enum" NOT NULL DEFAULT 'unfurnished',
    "preferred_persona" "persona_type_enum" NOT NULL DEFAULT 'family',
    "available_from" DATE NOT NULL,
    "is_negotiable" BOOLEAN NOT NULL DEFAULT FALSE,
    "listing_status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "view_count" INT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "listings_type_persona_idx" ON "listings" ("listing_type", "preferred_persona");
CREATE INDEX "listings_available_from_idx" ON "listings" ("available_from");

CREATE TABLE "property_cost_breakdowns" (
    "id" VARCHAR(36) PRIMARY KEY,
    "listing_id" VARCHAR(36) NOT NULL UNIQUE REFERENCES "listings"("id") ON DELETE CASCADE,
    "base_rent" DECIMAL(12,2) NOT NULL,
    "service_charge" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "electricity_billing" "electricity_billing_enum" NOT NULL DEFAULT 'prepaid_card',
    "gas_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "wasa_water_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "waste_collection_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "broadband_internet_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "security_deposit_months" INT NOT NULL DEFAULT 2,
    "advance_rent_months" INT NOT NULL DEFAULT 1,
    "estimated_gross_monthly_cost" DECIMAL(12,2) NOT NULL
);

CREATE INDEX "cost_breakdowns_estimated_gross_idx" ON "property_cost_breakdowns" ("estimated_gross_monthly_cost");

CREATE TABLE "listing_media" (
    "id" VARCHAR(36) PRIMARY KEY,
    "listing_id" VARCHAR(36) NOT NULL REFERENCES "listings"("id") ON DELETE CASCADE,
    "media_type" VARCHAR(30) NOT NULL,
    "media_url" VARCHAR(500) NOT NULL,
    "thumbnail_url" VARCHAR(500),
    "display_order" INT NOT NULL DEFAULT 1,
    "is_cover_photo" BOOLEAN NOT NULL DEFAULT FALSE,
    "uploaded_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "shortlists" (
    "id" VARCHAR(36) PRIMARY KEY,
    "renter_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "listing_id" VARCHAR(36) NOT NULL REFERENCES "listings"("id") ON DELETE CASCADE,
    "custom_notes" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shortlists_renter_listing_unique" UNIQUE ("renter_id", "listing_id")
);

CREATE TABLE "vacancy_alerts" (
    "id" VARCHAR(36) PRIMARY KEY,
    "renter_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "target_thana" VARCHAR(100) NOT NULL,
    "max_budget" DECIMAL(12,2) NOT NULL,
    "desired_persona" "persona_type_enum" NOT NULL,
    "desired_bed_rooms" INT,
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "last_notified_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. ROOMMATE COMPATIBILITY ENGINE (SUB-03)
CREATE TABLE "roommate_questionnaires" (
    "id" VARCHAR(36) PRIMARY KEY,
    "renter_id" VARCHAR(36) NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
    "sleep_schedule_score" INT NOT NULL,
    "cleanliness_habits_score" INT NOT NULL,
    "social_guest_tolerance" INT NOT NULL,
    "noise_tolerance" INT NOT NULL,
    "dietary_lifestyle" "dietary_preference_enum" NOT NULL DEFAULT 'halal',
    "smoking_tolerance_score" INT NOT NULL,
    "sharing_mindset_score" INT NOT NULL DEFAULT 3,
    "study_focus_priority" INT NOT NULL DEFAULT 3,
    "compatibility_vector" JSONB NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "roommate_compatibility_matches" (
    "id" VARCHAR(36) PRIMARY KEY,
    "renter_a_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "renter_b_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "aggregate_compatibility_score" DECIMAL(5,2) NOT NULL,
    "sleep_vector_delta" DECIMAL(4,2) NOT NULL,
    "cleanliness_vector_delta" DECIMAL(4,2) NOT NULL,
    "social_vector_delta" DECIMAL(4,2) NOT NULL,
    "noise_vector_delta" DECIMAL(4,2) NOT NULL,
    "diet_vector_delta" DECIMAL(4,2) NOT NULL,
    "radar_chart_payload" JSONB NOT NULL,
    "status" "match_status_enum" NOT NULL DEFAULT 'calculated',
    "computed_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "matches_pair_unique" UNIQUE ("renter_a_id", "renter_b_id")
);

CREATE TABLE "roommate_connections" (
    "id" VARCHAR(36) PRIMARY KEY,
    "sender_renter_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "receiver_renter_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "introductory_message" TEXT,
    "is_accepted" BOOLEAN NOT NULL DEFAULT FALSE,
    "responded_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. TENANCY DOSSIERS & INSPECTION PIPELINE (SUB-04)
CREATE TABLE "tenancy_dossiers" (
    "id" VARCHAR(36) PRIMARY KEY,
    "renter_id" VARCHAR(36) NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
    "dossier_hash" VARCHAR(64) NOT NULL,
    "encrypted_vault_key_ref" VARCHAR(255) NOT NULL,
    "nid_front_image_url" VARCHAR(500) NOT NULL,
    "nid_back_image_url" VARCHAR(500) NOT NULL,
    "student_or_job_id_card_url" VARCHAR(500) NOT NULL,
    "proof_of_income_url" VARCHAR(500),
    "previous_landlord_reference_phone" VARCHAR(20),
    "police_cims_form_completed" BOOLEAN NOT NULL DEFAULT FALSE,
    "status" "dossier_status_enum" NOT NULL DEFAULT 'draft',
    "is_locked" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "dossier_submissions" (
    "id" VARCHAR(36) PRIMARY KEY,
    "dossier_id" VARCHAR(36) NOT NULL REFERENCES "tenancy_dossiers"("id") ON DELETE CASCADE,
    "listing_id" VARCHAR(36) NOT NULL REFERENCES "listings"("id") ON DELETE CASCADE,
    "landlord_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "submission_status" VARCHAR(30) NOT NULL DEFAULT 'submitted',
    "landlord_review_notes" TEXT,
    "reviewed_at" TIMESTAMP,
    "submitted_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "viewing_slots" (
    "id" VARCHAR(36) PRIMARY KEY,
    "listing_id" VARCHAR(36) NOT NULL REFERENCES "listings"("id") ON DELETE CASCADE,
    "landlord_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "slot_start_time" TIMESTAMP NOT NULL,
    "slot_end_time" TIMESTAMP NOT NULL,
    "viewing_mode" "viewing_mode_enum" NOT NULL DEFAULT 'in_person',
    "max_attendees" INT NOT NULL DEFAULT 1,
    "is_booked" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "viewing_appointments" (
    "id" VARCHAR(36) PRIMARY KEY,
    "slot_id" VARCHAR(36) NOT NULL REFERENCES "viewing_slots"("id") ON DELETE RESTRICT,
    "listing_id" VARCHAR(36) NOT NULL REFERENCES "listings"("id") ON DELETE CASCADE,
    "renter_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "landlord_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "appointment_code" VARCHAR(20) NOT NULL UNIQUE,
    "viewing_mode" "viewing_mode_enum" NOT NULL DEFAULT 'in_person',
    "virtual_meeting_url" VARCHAR(500),
    "status" "viewing_status_enum" NOT NULL DEFAULT 'requested',
    "confirmation_sms_dispatched" BOOLEAN NOT NULL DEFAULT FALSE,
    "scheduled_for" TIMESTAMP NOT NULL,
    "confirmed_at" TIMESTAMP,
    "completed_at" TIMESTAMP
);

-- 6. TRUST & ANTI-FRAUD GATEWAY (SUB-06)
CREATE TABLE "deed_verifications" (
    "id" VARCHAR(36) PRIMARY KEY,
    "property_id" VARCHAR(36) NOT NULL REFERENCES "properties"("id") ON DELETE CASCADE,
    "landlord_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "ownership_document_type" VARCHAR(100) NOT NULL,
    "document_url" VARCHAR(500) NOT NULL,
    "sha256_cryptographic_hash" VARCHAR(64) NOT NULL,
    "audit_status" "deed_audit_status_enum" NOT NULL DEFAULT 'pending_audit',
    "audited_by_admin_id" VARCHAR(36) REFERENCES "users"("id") ON DELETE SET NULL,
    "auditor_notes" TEXT,
    "trust_badge_conferred" BOOLEAN NOT NULL DEFAULT FALSE,
    "submitted_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audited_at" TIMESTAMP
);

CREATE INDEX "deed_hash_idx" ON "deed_verifications" ("sha256_cryptographic_hash");

CREATE TABLE "flagged_credentials" (
    "id" VARCHAR(36) PRIMARY KEY,
    "property_id" VARCHAR(36) NOT NULL REFERENCES "properties"("id") ON DELETE CASCADE,
    "reported_by_user_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "flag_reason" VARCHAR(100) NOT NULL,
    "evidence_description" TEXT NOT NULL,
    "evidence_url" VARCHAR(500),
    "resolution_status" VARCHAR(30) NOT NULL DEFAULT 'open',
    "investigated_by_admin_id" VARCHAR(36) REFERENCES "users"("id") ON DELETE SET NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP
);

-- 7. TENANCY AGREEMENTS, PAYMENTS & ESCROW (SUB-07)
CREATE TABLE "tenancy_agreements" (
    "id" VARCHAR(36) PRIMARY KEY,
    "listing_id" VARCHAR(36) NOT NULL REFERENCES "listings"("id") ON DELETE RESTRICT,
    "renter_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "landlord_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "agreement_serial_number" VARCHAR(64) NOT NULL UNIQUE,
    "contract_html_payload" TEXT NOT NULL,
    "monthly_rent_amount" DECIMAL(12,2) NOT NULL,
    "security_deposit_amount" DECIMAL(12,2) NOT NULL,
    "lease_start_date" DATE NOT NULL,
    "lease_end_date" DATE NOT NULL,
    "notice_period_days" INT NOT NULL DEFAULT 60,
    "status" "agreement_status_enum" NOT NULL DEFAULT 'draft',
    "renter_signature_hash" VARCHAR(64),
    "renter_signed_at" TIMESTAMP,
    "landlord_signature_hash" VARCHAR(64),
    "landlord_signed_at" TIMESTAMP,
    "executed_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "agreements_renter_status_idx" ON "tenancy_agreements" ("renter_id", "status");

CREATE TABLE "payment_transactions" (
    "id" VARCHAR(36) PRIMARY KEY,
    "agreement_id" VARCHAR(36) NOT NULL REFERENCES "tenancy_agreements"("id") ON DELETE RESTRICT,
    "payer_user_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "payee_user_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "payment_type" "payment_type_enum" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "platform_service_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "payment_channel" "payment_channel_enum" NOT NULL DEFAULT 'bkash',
    "merchant_transaction_id" VARCHAR(100) NOT NULL UNIQUE,
    "mfs_gateway_trx_id" VARCHAR(100),
    "status" "payment_status_enum" NOT NULL DEFAULT 'initiated',
    "initiated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "settled_at" TIMESTAMP
);

CREATE INDEX "payment_agreements_status_idx" ON "payment_transactions" ("agreement_id", "status");

CREATE TABLE "rent_ledgers" (
    "id" VARCHAR(36) PRIMARY KEY,
    "agreement_id" VARCHAR(36) NOT NULL REFERENCES "tenancy_agreements"("id") ON DELETE CASCADE,
    "billing_month" DATE NOT NULL,
    "base_rent_due" DECIMAL(12,2) NOT NULL,
    "utility_charges_due" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "total_billed" DECIMAL(12,2) NOT NULL,
    "total_paid" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "outstanding_balance" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "due_date" DATE NOT NULL,
    "status" "ledger_status_enum" NOT NULL DEFAULT 'unpaid',
    "last_payment_transaction_id" VARCHAR(36) REFERENCES "payment_transactions"("id") ON DELETE SET NULL,
    "reconciled_at" TIMESTAMP,
    CONSTRAINT "ledgers_agreement_month_unique" UNIQUE ("agreement_id", "billing_month")
);

-- 8. MUNICIPAL CIMS COMPLIANCE & GOVERNANCE (SUB-08)
CREATE TABLE "dmp_cims_exports" (
    "id" VARCHAR(36) PRIMARY KEY,
    "renter_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "agreement_id" VARCHAR(36) NOT NULL REFERENCES "tenancy_agreements"("id") ON DELETE RESTRICT,
    "dossier_id" VARCHAR(36) NOT NULL REFERENCES "tenancy_dossiers"("id") ON DELETE RESTRICT,
    "police_station_thana" VARCHAR(100) NOT NULL,
    "cims_tracking_number" VARCHAR(64) NOT NULL UNIQUE,
    "encrypted_cims_archive_url" VARCHAR(500) NOT NULL,
    "status" "cims_export_status_enum" NOT NULL DEFAULT 'draft',
    "exported_by_admin_id" VARCHAR(36) REFERENCES "users"("id") ON DELETE SET NULL,
    "dispatched_at" TIMESTAMP,
    "acknowledged_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "disputes" (
    "id" VARCHAR(36) PRIMARY KEY,
    "agreement_id" VARCHAR(36) NOT NULL REFERENCES "tenancy_agreements"("id") ON DELETE RESTRICT,
    "raised_by_user_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "respondent_user_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "dispute_category" VARCHAR(100) NOT NULL,
    "complaint_details" TEXT NOT NULL,
    "claimed_dispute_amount" DECIMAL(12,2),
    "status" "dispute_status_enum" NOT NULL DEFAULT 'open',
    "assigned_arbitrator_admin_id" VARCHAR(36) REFERENCES "users"("id") ON DELETE SET NULL,
    "arbitrator_resolution_summary" TEXT,
    "resolved_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "audit_logs" (
    "id" VARCHAR(36) PRIMARY KEY,
    "actor_user_id" VARCHAR(36) NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "action_type" VARCHAR(100) NOT NULL,
    "target_entity_type" VARCHAR(100) NOT NULL,
    "target_entity_id" VARCHAR(36) NOT NULL,
    "ip_address" VARCHAR(45) NOT NULL,
    "user_agent" TEXT,
    "change_payload" JSONB,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
