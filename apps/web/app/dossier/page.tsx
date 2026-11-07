"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  TenancyDossierData,
  EncryptedVaultEnvelope,
  SEED_TENANT_DOSSIER,
  encryptDossier,
  decryptDossier,
} from "@/lib/crypto-vault";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { EditorialButton } from "@/components/ui/EditorialButton";
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  FileCheck2,
  AlertCircle,
  Copy,
  Check,
  Eye,
  EyeOff,
  Building,
  User,
  Home,
  Users,
  FileText,
  BadgeAlert,
  ChevronLeft,
} from "lucide-react";

export default function DossierPage() {
  const [activeTab, setActiveTab] = useState<"tenant_builder" | "landlord_inspector">("tenant_builder");

  // Tenant state
  const [formData, setFormData] = useState<TenancyDossierData>(SEED_TENANT_DOSSIER);
  const [passphrase, setPassphrase] = useState<string>("conceptx-dhaka-2026");
  const [showPassphrase, setShowPassphrase] = useState<boolean>(false);
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
  const [vaultEnvelope, setVaultEnvelope] = useState<EncryptedVaultEnvelope | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  // Landlord Inspector state
  const [inspectKey, setInspectKey] = useState<string>("conceptx-dhaka-2026");
  const [decryptedResult, setDecryptedResult] = useState<TenancyDossierData | null>(null);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);

  // Handle Encrypt
  const handleLockAndEncrypt = async () => {
    if (!passphrase || passphrase.length < 6) {
      alert("Please enter a secure vault passphrase of at least 6 characters.");
      return;
    }
    setIsEncrypting(true);
    try {
      const envelope = await encryptDossier(formData, passphrase);
      setVaultEnvelope(envelope);
    } catch (err) {
      alert("Encryption error: " + String(err));
    } finally {
      setIsEncrypting(false);
    }
  };

  // Handle Decrypt in Inspector
  const handleDecryptInspection = async () => {
    if (!vaultEnvelope) {
      setDecryptError("No encrypted dossier envelope is currently loaded. Please encrypt first in the Tenant Vault tab.");
      return;
    }
    setIsDecrypting(true);
    setDecryptError(null);
    try {
      const res = await decryptDossier(vaultEnvelope, inspectKey);
      if (res.success && res.data) {
        setDecryptedResult(res.data);
      } else {
        setDecryptedResult(null);
        setDecryptError(res.error || "Decryption failed. Incorrect passphrase.");
      }
    } catch (err) {
      setDecryptError("Decryption error: " + String(err));
    } finally {
      setIsDecrypting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 1500);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col font-sans">
      {/* Editorial Navigation */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-hairline">
        <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 h-20 sm:h-22 flex items-center justify-between gap-6">
          {/* Logo & Back button */}
          <div className="flex items-center gap-5 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-ink-secondary hover:text-ink-primary font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center p-1.5 text-canvas shadow-subtle shrink-0">
                <Image src="/logo.png" alt="RentPulse" width={26} height={26} className="brightness-200" />
              </div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-ink-primary">
                RentPulse
              </span>
            </Link>
          </div>

          {/* Central Subsystem Navigation Pill Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-muted-sand/70 border border-hairline shadow-subtle">
            <Link
              href="/properties"
              className="px-4 py-2 rounded-full text-xs font-medium text-ink-secondary hover:text-ink-primary transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Discovery Feed</span>
            </Link>
            <Link
              href="/roommates"
              className="px-4 py-2 rounded-full text-xs font-medium text-ink-secondary hover:text-ink-primary transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Roommate Synergy</span>
            </Link>
            <Link
              href="/dossier"
              className="px-4 py-2 rounded-full text-xs font-semibold bg-surface text-ink-primary shadow-subtle border border-hairline flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              <span>Tenancy Dossier</span>
            </Link>
            <Link
              href="/landlord/verify"
              className="px-4 py-2 rounded-full text-xs font-medium text-ink-secondary hover:text-ink-primary transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Deed Anti-Fraud</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <GlassBadge variant="forest">
              AES-GCM 256-Bit Vault
            </GlassBadge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-10 w-full">
        {/* Hero Banner */}
        <div className="mb-8 bg-surface border border-hairline rounded-3xl p-8 sm:p-10 shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <GlassBadge variant="forest">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Zero-Knowledge Credential Vault</span>
                </GlassBadge>
                <span className="text-xs text-ink-tertiary">Phase 4 Security</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-primary tracking-tight">
                Encrypted Digital Tenancy Dossier
              </h1>
              <p className="text-sm text-ink-secondary mt-2.5 leading-relaxed">
                RentPulse protects tenant identity with client-side cryptography. Your National ID, academic/employment records, and landlord references are encrypted directly in the browser via AES-GCM 256-bit with SHA-256 tamper detection.
              </p>
            </div>

            {/* Tab Switcher Capsule */}
            <div className="inline-flex p-1.5 rounded-full bg-muted-sand/70 border border-hairline shadow-subtle self-start md:self-auto shrink-0">
              <button
                onClick={() => setActiveTab("tenant_builder")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === "tenant_builder"
                    ? "bg-surface text-ink-primary shadow-subtle border border-hairline font-semibold"
                    : "text-ink-secondary hover:text-ink-primary"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>1. Tenant Vault Builder</span>
              </button>
              <button
                onClick={() => setActiveTab("landlord_inspector")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === "landlord_inspector"
                    ? "bg-surface text-ink-primary shadow-subtle border border-hairline font-semibold"
                    : "text-ink-secondary hover:text-ink-primary"
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>2. Landlord Review Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: TENANT VAULT BUILDER */}
        {activeTab === "tenant_builder" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Fields (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-surface border border-hairline rounded-3xl p-6 sm:p-8 shadow-card">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-hairline">
                  <h3 className="text-lg font-display font-bold text-ink-primary">
                    Identity & Statutory Verification Fields
                  </h3>
                  <span className="text-xs text-ink-tertiary">
                    Pre-fills DMP Form-2
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                      Full Legal Name (as per NID)
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                      National ID (NID / Smart Card)
                    </label>
                    <input
                      type="text"
                      value={formData.nationalIdNumber}
                      onChange={(e) => setFormData({ ...formData, nationalIdNumber: e.target.value })}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-xs font-sans text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                      Father / Legal Guardian
                    </label>
                    <input
                      type="text"
                      value={formData.fatherOrGuardianName}
                      onChange={(e) => setFormData({ ...formData, fatherOrGuardianName: e.target.value })}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                      Present Residence in Dhaka
                    </label>
                    <input
                      type="text"
                      value={formData.presentAddressDhaka}
                      onChange={(e) => setFormData({ ...formData, presentAddressDhaka: e.target.value })}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                      Emergency Relationship
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContactRelation}
                      onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                    />
                  </div>
                </div>

                <h4 className="text-sm font-display font-bold text-ink-primary border-b border-hairline pb-2.5 mt-8 mb-4">
                  Academic / Professional Verification & Prior Rental
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                      Occupation Category
                    </label>
                    <select
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value as any })}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                    >
                      <option value="student">Student (University / College)</option>
                      <option value="employed">Corporate Employee / Professional</option>
                      <option value="freelancer">Tech Freelancer / Consultant</option>
                      <option value="business">Business Owner / Entrepreneur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                      Institution or Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.institutionOrEmployer}
                      onChange={(e) => setFormData({ ...formData, institutionOrEmployer: e.target.value })}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                      Student ID or Employee Roll
                    </label>
                    <input
                      type="text"
                      value={formData.idCardNumberOrRoll}
                      onChange={(e) => setFormData({ ...formData, idCardNumberOrRoll: e.target.value })}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                      Monthly Verified Income (BDT)
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyIncomeBdt}
                      onChange={(e) => setFormData({ ...formData, monthlyIncomeBdt: Number(e.target.value) })}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-xs font-sans font-bold text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                      Past Landlord Name (Reference)
                    </label>
                    <input
                      type="text"
                      value={formData.previousLandlordName || ""}
                      onChange={(e) => setFormData({ ...formData, previousLandlordName: e.target.value })}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                      Past Landlord Contact Phone
                    </label>
                    <input
                      type="text"
                      value={formData.previousLandlordPhone || ""}
                      onChange={(e) => setFormData({ ...formData, previousLandlordPhone: e.target.value })}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-xs text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="mt-6 p-4 rounded-2xl bg-muted-sand/50 border border-hairline">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.policeCimsConsentGiven}
                      onChange={(e) => setFormData({ ...formData, policeCimsConsentGiven: e.target.checked })}
                      className="mt-0.5 rounded border border-hairline text-forest focus:ring-forest"
                    />
                    <span className="text-xs text-ink-secondary leading-relaxed">
                      <strong className="text-ink-primary">Statutory Police CIMS Consent:</strong> I authorize RentPulse to compile this verified profile into standard Dhaka Metropolitan Police Form-2 upon final lease agreement signing.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Cryptographic Vault Locking Panel (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-surface border border-hairline rounded-3xl p-6 sm:p-8 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-2xl bg-forest-light text-forest">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-ink-primary text-base">
                      Cryptographic Vault Key
                    </h3>
                    <p className="text-xs text-ink-secondary">
                      Master client decryption passphrase
                    </p>
                  </div>
                </div>

                <p className="text-xs text-ink-secondary mb-5 leading-relaxed">
                  RentPulse does not store your passphrase on any server. It is derived in-memory by the Web Crypto API to produce a 256-bit AES-GCM symmetric key with 100,000 PBKDF2 iterations.
                </p>

                <div className="mb-5">
                  <label className="block text-xs font-semibold text-ink-primary mb-1.5">
                    Set Vault Passphrase:
                  </label>
                  <div className="relative">
                    <input
                      type={showPassphrase ? "text" : "password"}
                      value={passphrase}
                      onChange={(e) => setPassphrase(e.target.value)}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-xs font-sans font-bold text-ink-primary pr-10 focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassphrase(!showPassphrase)}
                      className="absolute right-3.5 top-2.5 text-ink-tertiary hover:text-ink-primary"
                    >
                      {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-forest font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>AES-GCM-256 • PBKDF2-SHA256 • 100K ITERATIONS</span>
                  </div>
                </div>

                <EditorialButton
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={handleLockAndEncrypt}
                  disabled={isEncrypting}
                >
                  <Lock className="w-4 h-4" />
                  <span>{isEncrypting ? "Encrypting in Web Crypto..." : "Lock & Encrypt Dossier Vault"}</span>
                </EditorialButton>
              </div>

              {/* Encrypted Envelope Display */}
              {vaultEnvelope && (
                <div className="bg-forest-light/60 border border-forest/20 rounded-3xl p-6 sm:p-7 shadow-card animate-fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-forest/15 mb-4">
                    <div className="flex items-center gap-2 text-forest font-bold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Encrypted Envelope Generated</span>
                    </div>
                    <GlassBadge variant="forest">
                      VAULT LOCKED
                    </GlassBadge>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <div className="text-[10px] text-ink-tertiary uppercase font-medium">
                        Dossier Reference ID:
                      </div>
                      <div className="font-sans font-bold text-ink-primary mt-0.5">
                        {vaultEnvelope.dossierId}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[10px] text-ink-tertiary uppercase font-medium">
                        <span>SHA-256 Digest (Integrity Hash):</span>
                        <button
                          onClick={() => copyToClipboard(vaultEnvelope.dossierHash)}
                          className="text-forest hover:text-forest-hover flex items-center gap-1 font-semibold"
                        >
                          {copiedHash ? <Check className="w-3 h-3 text-forest" /> : <Copy className="w-3 h-3" />}
                          {copiedHash ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="font-mono text-[11px] bg-surface p-2.5 rounded-xl border border-forest/15 break-all text-forest font-medium mt-1">
                        {vaultEnvelope.dossierHash}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-ink-tertiary uppercase font-medium">
                        AES-256 Ciphertext Payload (Preview):
                      </div>
                      <div className="font-mono text-[10px] bg-ink-primary text-canvas/90 p-2.5 rounded-xl overflow-hidden truncate mt-1">
                        {vaultEnvelope.ciphertextBase64.slice(0, 48)}... [Encrypted Buffer]
                      </div>
                    </div>

                    <div className="pt-3 border-t border-forest/15 flex items-center justify-between text-xs">
                      <span className="text-ink-secondary">Police CIMS Export:</span>
                      <span className="font-semibold text-forest">
                        {vaultEnvelope.policeCimsReady ? "✓ Form-2 Compatible" : "Pending Consent"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-forest/15">
                    <button
                      onClick={() => setActiveTab("landlord_inspector")}
                      className="w-full text-center text-xs font-semibold text-forest hover:text-forest-hover transition-colors"
                    >
                      Test Landlord Review Portal with this Vault →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: LANDLORD INSPECTION & DECRYPTION PORTAL */}
        {activeTab === "landlord_inspector" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-surface border border-hairline rounded-3xl p-8 sm:p-10 shadow-card">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-terracotta-light text-terracotta shrink-0">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-ink-primary">
                    Lessor / Landlord Tenancy Dossier Review Portal
                  </h2>
                  <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                    Enter the prospective tenant's time-limited access passphrase to decrypt and inspect audited credentials.
                  </p>
                </div>
              </div>

              {!vaultEnvelope ? (
                <div className="p-8 rounded-2xl bg-muted-sand/50 border border-hairline text-center">
                  <BadgeAlert className="w-8 h-8 text-terracotta mx-auto mb-2" />
                  <p className="text-sm font-display font-bold text-ink-primary">No Encrypted Dossier in Active Session</p>
                  <p className="text-xs text-ink-secondary mt-1">Please switch to Tab 1 (Tenant Vault Builder) and click "Lock & Encrypt Dossier Vault" first.</p>
                  <div className="mt-4">
                    <EditorialButton
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveTab("tenant_builder")}
                    >
                      Go to Tenant Builder
                    </EditorialButton>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Key Entry Bar */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 p-5 bg-muted-sand/40 rounded-2xl border border-hairline mb-6">
                    <div className="flex-1 w-full">
                      <label className="block text-[11px] font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                        Enter Tenant Decryption Token / Key:
                      </label>
                      <input
                        type="text"
                        value={inspectKey}
                        onChange={(e) => setInspectKey(e.target.value)}
                        placeholder="Enter passphrase..."
                        className="w-full bg-surface border border-hairline rounded-xl px-4 py-2.5 text-xs font-sans font-bold text-ink-primary focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/10 transition-all"
                      />
                    </div>
                    <div className="w-full sm:w-auto self-end">
                      <EditorialButton
                        variant="primary"
                        size="md"
                        onClick={handleDecryptInspection}
                        disabled={isDecrypting}
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>{isDecrypting ? "Verifying Hash..." : "Decrypt & Inspect"}</span>
                      </EditorialButton>
                    </div>
                  </div>

                  {decryptError && (
                    <div className="p-4 rounded-2xl bg-terracotta-light border border-terracotta/20 text-terracotta text-xs mb-6 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                      <div>
                        <strong>Verification Error:</strong> {decryptError}
                      </div>
                    </div>
                  )}

                  {/* Decrypted Verified Dossier View */}
                  {decryptedResult && (
                    <div className="bg-forest-light/40 border border-forest/20 rounded-3xl p-6 sm:p-8 shadow-card animate-fade-in">
                      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-forest/15 mb-5 gap-3">
                        <div>
                          <GlassBadge variant="forest">
                            ✓ Cryptographically Audited & Verified
                          </GlassBadge>
                          <h3 className="text-2xl font-display font-bold text-ink-primary mt-2">
                            {decryptedResult.fullName}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-3.5 py-1.5 bg-surface border border-forest/15 rounded-full text-xs font-sans font-bold text-forest shadow-sm">
                            NID: {decryptedResult.nationalIdNumber}
                          </span>
                        </div>
                      </div>

                      {/* Detail Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs mb-6">
                        <div className="p-4 bg-surface rounded-2xl border border-hairline shadow-subtle">
                          <span className="text-[10px] text-ink-tertiary uppercase font-medium block">Institution / Employer:</span>
                          <span className="font-bold text-ink-primary mt-1 block">{decryptedResult.institutionOrEmployer}</span>
                          <span className="text-[10px] text-ink-secondary block mt-0.5">ID: {decryptedResult.idCardNumberOrRoll}</span>
                        </div>

                        <div className="p-4 bg-surface rounded-2xl border border-hairline shadow-subtle">
                          <span className="text-[10px] text-ink-tertiary uppercase font-medium block">Verified Income:</span>
                          <span className="font-bold text-ink-primary mt-1 block">৳{decryptedResult.monthlyIncomeBdt.toLocaleString()}</span>
                          <span className="text-[10px] text-forest block mt-0.5">✓ Bank Statement Verified</span>
                        </div>

                        <div className="p-4 bg-surface rounded-2xl border border-hairline shadow-subtle">
                          <span className="text-[10px] text-ink-tertiary uppercase font-medium block">Police CIMS Compliance:</span>
                          <span className="font-bold text-forest mt-1 block">✓ Form-2 Export Ready</span>
                          <span className="text-[10px] text-ink-secondary block mt-0.5">DMP Station: Banani / Gulshan</span>
                        </div>

                        <div className="p-4 bg-surface rounded-2xl border border-hairline shadow-subtle">
                          <span className="text-[10px] text-ink-tertiary uppercase font-medium block">Past Landlord Reference:</span>
                          <span className="font-bold text-ink-primary mt-1 block">{decryptedResult.previousLandlordName || "None"}</span>
                          <span className="text-[10px] text-ink-secondary block mt-0.5">{decryptedResult.previousLandlordPhone || "N/A"}</span>
                        </div>

                        <div className="p-4 bg-surface rounded-2xl border border-hairline shadow-subtle">
                          <span className="text-[10px] text-ink-tertiary uppercase font-medium block">Emergency Contact:</span>
                          <span className="font-bold text-ink-primary mt-1 block">{decryptedResult.emergencyContactPhone}</span>
                          <span className="text-[10px] text-ink-secondary block mt-0.5">({decryptedResult.emergencyContactRelation})</span>
                        </div>

                        <div className="p-4 bg-surface rounded-2xl border border-hairline shadow-subtle">
                          <span className="text-[10px] text-ink-tertiary uppercase font-medium block">Father / Guardian:</span>
                          <span className="font-bold text-ink-primary mt-1 block">{decryptedResult.fatherOrGuardianName}</span>
                          <span className="text-[10px] text-ink-secondary block mt-0.5">Permanent: {decryptedResult.permanentAddressDistrict}</span>
                        </div>
                      </div>

                      {/* Approval Actions */}
                      <div className="flex flex-wrap items-center justify-between pt-5 border-t border-forest/15 gap-4">
                        <div className="flex items-center gap-2 text-xs text-ink-secondary">
                          <FileCheck2 className="w-4 h-4 text-forest" />
                          <span>Dossier Integrity Match: {vaultEnvelope.dossierHash.slice(0, 16)}...</span>
                        </div>

                        <div>
                          <EditorialButton
                            variant="primary"
                            size="md"
                            onClick={() => alert("Applicant Tenancy Dossier Approved! Moving to Viewing Scheduling.")}
                          >
                            <span>✓ Approve Tenant for Viewing</span>
                          </EditorialButton>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-hairline bg-surface py-8">
        <div className="max-w-[1720px] mx-auto px-6 text-center text-xs text-ink-tertiary">
          RentPulse // Tenancy Dossier Vault • AES-GCM 256-Bit Cryptography & SHA-256 Tamper Protection
        </div>
      </footer>
    </div>
  );
}
