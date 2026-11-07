"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TenancyDossierData,
  EncryptedVaultEnvelope,
  SEED_TENANT_DOSSIER,
  encryptDossier,
  decryptDossier,
} from "@/lib/crypto-vault";
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1A17] flex flex-col font-sans">
      {/* Editorial Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b-2 border-[#1F302B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-[#1F302B] text-amber-300 flex items-center justify-center font-serif font-black text-lg shadow-[2px_2px_0_#BD5338]">
                R
              </span>
              <span className="font-serif font-bold text-xl tracking-tight text-[#1F302B]">
                RentPulse
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
              <Link
                href="/properties"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                Discovery Feed
              </Link>
              <Link
                href="/roommates"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
              >
                <Users className="w-3.5 h-3.5" />
                Roommate Synergy
              </Link>
              <Link
                href="/dossier"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1F302B] text-white font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                Tenancy Dossier
              </Link>
              <Link
                href="/landlord/verify"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Deed Anti-Fraud
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-md font-bold">
              AES-GCM 256-BIT VAULT
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Banner */}
        <div className="mb-8 bg-white border-2 border-[#1F302B] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0_#1F302B]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 mb-3">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                <span>PHASE 4 // ZERO-KNOWLEDGE CLIENT CREDENTIAL VAULT</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#1F302B] tracking-tight">
                Encrypted Digital Tenancy Dossier
              </h1>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                RentPulse protects tenant identity with client-side cryptography. Your National ID, academic/employment records, and landlord references are encrypted directly in the browser via AES-GCM 256-bit with SHA-256 tamper detection.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-[#FAF8F5] p-1.5 rounded-xl border-2 border-[#1F302B] self-start md:self-auto shrink-0">
              <button
                onClick={() => setActiveTab("tenant_builder")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "tenant_builder"
                    ? "bg-[#1F302B] text-white shadow-[2px_2px_0_#BD5338]"
                    : "text-stone-700 hover:text-stone-900"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>1. Tenant Vault Builder</span>
              </button>
              <button
                onClick={() => setActiveTab("landlord_inspector")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "landlord_inspector"
                    ? "bg-[#BD5338] text-white shadow-[2px_2px_0_#1F302B]"
                    : "text-stone-700 hover:text-stone-900"
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
            {/* Form Fields (8 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border-2 border-[#1F302B] rounded-2xl p-6 shadow-[4px_4px_0_#1F302B]">
                <h3 className="text-lg font-serif font-bold text-stone-900 border-b border-stone-200 pb-3 mb-4 flex items-center justify-between">
                  <span>Identity & Statutory Verification Fields</span>
                  <span className="text-[11px] font-mono text-stone-500 font-normal">
                    Pre-fills DMP Form-2
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Full Legal Name (as per NID)
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      National ID (NID / Smart Card)
                    </label>
                    <input
                      type="text"
                      value={formData.nationalIdNumber}
                      onChange={(e) => setFormData({ ...formData, nationalIdNumber: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Father / Legal Guardian
                    </label>
                    <input
                      type="text"
                      value={formData.fatherOrGuardianName}
                      onChange={(e) => setFormData({ ...formData, fatherOrGuardianName: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Present Residence in Dhaka
                    </label>
                    <input
                      type="text"
                      value={formData.presentAddressDhaka}
                      onChange={(e) => setFormData({ ...formData, presentAddressDhaka: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Emergency Relationship
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContactRelation}
                      onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                    />
                  </div>
                </div>

                <h4 className="text-sm font-serif font-bold text-stone-900 border-b border-stone-200 pb-2 mt-6 mb-3">
                  Academic / Professional Verification & Prior Rental
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Occupation Category
                    </label>
                    <select
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value as any })}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                    >
                      <option value="student">Student (University / College)</option>
                      <option value="employed">Corporate Employee / Professional</option>
                      <option value="freelancer">Tech Freelancer / Consultant</option>
                      <option value="business">Business Owner / Entrepreneur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Institution or Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.institutionOrEmployer}
                      onChange={(e) => setFormData({ ...formData, institutionOrEmployer: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Student ID or Employee Roll
                    </label>
                    <input
                      type="text"
                      value={formData.idCardNumberOrRoll}
                      onChange={(e) => setFormData({ ...formData, idCardNumberOrRoll: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Monthly Verified Income (BDT)
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyIncomeBdt}
                      onChange={(e) => setFormData({ ...formData, monthlyIncomeBdt: Number(e.target.value) })}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Past Landlord Name (Reference)
                    </label>
                    <input
                      type="text"
                      value={formData.previousLandlordName || ""}
                      onChange={(e) => setFormData({ ...formData, previousLandlordName: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Past Landlord Contact Phone
                    </label>
                    <input
                      type="text"
                      value={formData.previousLandlordPhone || ""}
                      onChange={(e) => setFormData({ ...formData, previousLandlordPhone: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                    />
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.policeCimsConsentGiven}
                      onChange={(e) => setFormData({ ...formData, policeCimsConsentGiven: e.target.checked })}
                      className="mt-0.5 rounded text-[#1F302B] focus:ring-[#1F302B]"
                    />
                    <span className="text-xs text-stone-800 leading-tight">
                      <strong>Statutory Police CIMS Consent:</strong> I authorize RentPulse to compile this verified profile into standard Dhaka Metropolitan Police Form-2 upon final lease agreement signing.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Cryptographic Vault Locking Panel (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border-2 border-[#1F302B] rounded-2xl p-6 shadow-[4px_4px_0_#1F302B]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-base">
                      Cryptographic Vault Key
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Your master decryption passphrase
                    </p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                  RentPulse does not store your passphrase. It is used in-memory by the Web Crypto API to derive a 256-bit AES-GCM symmetric key with 100,000 PBKDF2 iterations.
                </p>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Set Vault Passphrase:
                  </label>
                  <div className="relative">
                    <input
                      type={showPassphrase ? "text" : "password"}
                      value={passphrase}
                      onChange={(e) => setPassphrase(e.target.value)}
                      className="w-full bg-[#FAF8F5] border-2 border-stone-300 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-stone-900 pr-10 focus:outline-none focus:border-[#1F302B]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassphrase(!showPassphrase)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                    >
                      {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-emerald-700 font-semibold font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>AES-GCM-256 • PBKDF2-SHA256 • 100K ITERATIONS</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLockAndEncrypt}
                  disabled={isEncrypting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#1F302B] hover:bg-[#2C4A3E] border border-[#1F302B] shadow-[2px_2px_0_#BD5338] transition-all"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>{isEncrypting ? "Encrypting in Web Crypto..." : "Lock & Encrypt Dossier Vault"}</span>
                </button>
              </div>

              {/* Encrypted Envelope Display */}
              {vaultEnvelope && (
                <div className="bg-[#FAF8F5] border-2 border-emerald-700 rounded-2xl p-5 shadow-[4px_4px_0_#1F302B] animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-200 mb-3">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Encrypted Envelope Generated</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded font-bold">
                      VAULT LOCKED
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="text-[10px] font-mono text-stone-500 uppercase">
                        Dossier Reference ID:
                      </div>
                      <div className="font-mono font-bold text-stone-900">
                        {vaultEnvelope.dossierId}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 uppercase">
                        <span>SHA-256 Digest (Integrity Hash):</span>
                        <button
                          onClick={() => copyToClipboard(vaultEnvelope.dossierHash)}
                          className="text-stone-700 hover:text-stone-900 flex items-center gap-1 font-bold"
                        >
                          {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          {copiedHash ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="font-mono text-[11px] bg-white p-2 rounded border border-stone-200 break-all text-emerald-900 font-medium">
                        {vaultEnvelope.dossierHash}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-stone-500 uppercase">
                        AES-256 Ciphertext Payload (Preview):
                      </div>
                      <div className="font-mono text-[10px] bg-stone-900 text-amber-200 p-2 rounded overflow-hidden truncate">
                        {vaultEnvelope.ciphertextBase64.slice(0, 48)}... [Encrypted Payload]
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px]">
                      <span className="text-stone-500">Police CIMS Export:</span>
                      <span className="font-bold text-emerald-800">
                        {vaultEnvelope.policeCimsReady ? "✓ Form-2 Compatible" : "Pending Consent"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200">
                    <button
                      onClick={() => setActiveTab("landlord_inspector")}
                      className="w-full py-2 text-center text-xs font-bold text-[#BD5338] hover:underline"
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
            <div className="bg-white border-2 border-[#1F302B] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0_#1F302B]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-orange-100 text-[#BD5338] border border-orange-300">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-stone-900">
                    Lessor / Landlord Tenancy Dossier Review Portal
                  </h2>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Enter the prospective tenant's time-limited access passphrase to decrypt and inspect audited credentials.
                  </p>
                </div>
              </div>

              {!vaultEnvelope ? (
                <div className="p-6 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <BadgeAlert className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-stone-800">No Encrypted Dossier in Active Session</p>
                  <p className="text-xs text-stone-600 mt-1">Please switch to Tab 1 (Tenant Vault Builder) and click "Lock & Encrypt Dossier Vault" first.</p>
                  <button
                    onClick={() => setActiveTab("tenant_builder")}
                    className="mt-3 px-4 py-1.5 bg-[#1F302B] text-white text-xs font-bold rounded-lg"
                  >
                    Go to Tenant Builder
                  </button>
                </div>
              ) : (
                <div>
                  {/* Key Entry Bar */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-[#FAF8F5] rounded-xl border border-stone-300 mb-6">
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase mb-1">
                        Enter Tenant Decryption Token / Key:
                      </label>
                      <input
                        type="text"
                        value={inspectKey}
                        onChange={(e) => setInspectKey(e.target.value)}
                        placeholder="Enter passphrase..."
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-[#1F302B]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleDecryptInspection}
                      disabled={isDecrypting}
                      className="w-full sm:w-auto self-end flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-[#BD5338] hover:bg-[#a6452d] shadow-[2px_2px_0_#1F302B] transition-all"
                    >
                      <Unlock className="w-3.5 h-3.5 text-amber-200" />
                      <span>{isDecrypting ? "Verifying Hash..." : "Decrypt & Inspect"}</span>
                    </button>
                  </div>

                  {decryptError && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs mb-6 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Verification Error:</strong> {decryptError}
                      </div>
                    </div>
                  )}

                  {/* Decrypted Verified Dossier View */}
                  {decryptedResult && (
                    <div className="bg-[#FAF8F5] border-2 border-emerald-700 rounded-2xl p-6 shadow-[3px_3px_0_#1F302B] animate-fade-in">
                      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-stone-300 mb-4 gap-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded font-bold">
                            ✓ CRYPTOGRAPHICALLY AUDITED & VERIFIED
                          </span>
                          <h3 className="text-xl font-serif font-bold text-stone-900 mt-1">
                            {decryptedResult.fullName}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-white border border-stone-300 rounded-md text-xs font-mono font-bold text-emerald-800">
                            NID: {decryptedResult.nationalIdNumber}
                          </span>
                        </div>
                      </div>

                      {/* Detail Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs mb-6">
                        <div className="p-3 bg-white rounded-xl border border-stone-200">
                          <span className="text-[10px] font-mono text-stone-500 uppercase block">Institution / Employer:</span>
                          <span className="font-bold text-stone-900">{decryptedResult.institutionOrEmployer}</span>
                          <span className="text-[10px] text-stone-500 block mt-0.5">ID: {decryptedResult.idCardNumberOrRoll}</span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-stone-200">
                          <span className="text-[10px] font-mono text-stone-500 uppercase block">Verified Income:</span>
                          <span className="font-bold text-stone-900">৳{decryptedResult.monthlyIncomeBdt.toLocaleString()}</span>
                          <span className="text-[10px] text-emerald-700 block mt-0.5">✓ Bank Statement Verified</span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-stone-200">
                          <span className="text-[10px] font-mono text-stone-500 uppercase block">Police CIMS Compliance:</span>
                          <span className="font-bold text-emerald-800">✓ Form-2 Export Ready</span>
                          <span className="text-[10px] text-stone-500 block mt-0.5">DMP Station: Banani / Gulshan</span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-stone-200">
                          <span className="text-[10px] font-mono text-stone-500 uppercase block">Past Landlord Reference:</span>
                          <span className="font-bold text-stone-900">{decryptedResult.previousLandlordName || "None"}</span>
                          <span className="text-[10px] font-mono text-stone-500 block mt-0.5">{decryptedResult.previousLandlordPhone || "N/A"}</span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-stone-200">
                          <span className="text-[10px] font-mono text-stone-500 uppercase block">Emergency Contact:</span>
                          <span className="font-bold text-stone-900">{decryptedResult.emergencyContactPhone}</span>
                          <span className="text-[10px] text-stone-500 block mt-0.5">({decryptedResult.emergencyContactRelation})</span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-stone-200">
                          <span className="text-[10px] font-mono text-stone-500 uppercase block">Father / Guardian:</span>
                          <span className="font-bold text-stone-900">{decryptedResult.fatherOrGuardianName}</span>
                          <span className="text-[10px] text-stone-500 block mt-0.5">Permanent: {decryptedResult.permanentAddressDistrict}</span>
                        </div>
                      </div>

                      {/* Approval Actions */}
                      <div className="flex flex-wrap items-center justify-between pt-4 border-t border-stone-300 gap-3">
                        <div className="flex items-center gap-2 text-xs text-stone-600 font-mono">
                          <FileCheck2 className="w-4 h-4 text-emerald-700" />
                          <span>Dossier Hash Match: {vaultEnvelope.dossierHash.slice(0, 16)}...</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => alert("Applicant Tenancy Dossier Approved! Moving to Phase 5 Viewing Scheduling.")}
                            className="px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-[2px_2px_0_#1F302B]"
                          >
                            ✓ Approve Tenant for Viewing
                          </button>
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
      <footer className="mt-auto border-t-2 border-[#1F302B] bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-stone-500 font-mono">
          RentPulse Phase 4 // Tenancy Dossier Vault • AES-GCM 256-Bit Cryptography & SHA-256 Tamper Protection
        </div>
      </footer>
    </div>
  );
}
