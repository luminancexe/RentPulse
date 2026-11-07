"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DeedRecord,
  DocumentType,
  DOCUMENT_TYPE_LABELS,
  SEED_DEED_REGISTRY,
  computeFileHash,
} from "@/lib/deed-verifier";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { EditorialButton } from "@/components/ui/EditorialButton";
import { EcosystemNavMenu } from "@/components/navigation";
import {
  ShieldCheck,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Home,
  Users,
  Building2,
  Copy,
  Check,
  Hash,
  ChevronLeft,
  X,
  CalendarCheck,
  Scale,
  FileCheck2,
  CreditCard,
} from "lucide-react";

export default function LandlordVerifyPage() {
  const [registry, setRegistry] = useState<DeedRecord[]>(SEED_DEED_REGISTRY);

  // Form states
  const [propertyTitle, setPropertyTitle] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [landlordPhone, setLandlordPhone] = useState("");
  const [thana, setThana] = useState("Bashundhara R/A");
  const [holdingNumber, setHoldingNumber] = useState("");
  const [docType, setDocType] = useState<DocumentType>("saf_kabala_deed");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [calculatedHash, setCalculatedHash] = useState<string>("");
  const [isHashing, setIsHashing] = useState<boolean>(false);
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // File selection & instant hashing
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsHashing(true);
    setIsDuplicate(false);

    try {
      const hash = await computeFileHash(file);
      setCalculatedHash(hash);

      // Duplicate check against existing registry
      const duplicateExists = registry.some((r) => r.sha256Hash === hash);
      if (duplicateExists) {
        setIsDuplicate(true);
      }
    } catch (err) {
      alert("Error hashing file: " + String(err));
    } finally {
      setIsHashing(false);
    }
  };

  const handleSubmitDeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyTitle || !landlordName || !holdingNumber || !selectedFile || !calculatedHash) {
      alert("Please fill in all required fields and upload an ownership document.");
      return;
    }

    const newRecord: DeedRecord = {
      id: `deed-${Date.now().toString().slice(-4)}`,
      propertyId: `prop-auto-${Date.now().toString().slice(-4)}`,
      propertyTitle,
      landlordName,
      landlordPhone: landlordPhone || "+880 1700-000000",
      thana,
      holdingNumber,
      documentType: docType,
      fileName: selectedFile.name,
      fileSizeBytes: selectedFile.size,
      sha256Hash: calculatedHash,
      auditStatus: isDuplicate ? "flagged_duplicate" : "pending_audit",
      trustBadgeConferred: false,
      auditorNotes: isDuplicate
        ? "FLAGGED: Cryptographic hash matches an existing registered property deed in registry."
        : "Initial upload verified. Queued for municipal land records validation.",
      submittedAt: new Date().toISOString(),
    };

    setRegistry([newRecord, ...registry]);
    setSuccessMsg(
      isDuplicate
        ? "Warning: Document submitted but flagged as a duplicate hash in the municipal registry."
        : `Deed successfully registered with SHA-256 hash: ${calculatedHash.slice(0, 16)}...`
    );

    // Reset inputs
    setPropertyTitle("");
    setHoldingNumber("");
    setSelectedFile(null);
    setCalculatedHash("");
  };

  const handleAdminApproveToggle = (id: string) => {
    setRegistry((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = item.auditStatus === "approved_verified" ? "pending_audit" : "approved_verified";
          return {
            ...item,
            auditStatus: newStatus,
            trustBadgeConferred: newStatus === "approved_verified",
            auditedAt: newStatus === "approved_verified" ? new Date().toISOString() : undefined,
            auditorNotes:
              newStatus === "approved_verified"
                ? "Manually audited and approved by Admin. Trust Badge conferred to listing."
                : "Reset to pending status.",
          };
        }
        return item;
      })
    );
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col font-sans">
      {/* Navigation */}
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

          <div className="flex items-center gap-3 shrink-0">
            <EcosystemNavMenu currentPath="/landlord/verify" />
            <GlassBadge variant="forest">
              Anti-Fraud Gate
            </GlassBadge>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-10 w-full">
        {/* Banner */}
        <div className="mb-8 bg-surface border border-hairline rounded-3xl p-8 sm:p-10 shadow-card">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <GlassBadge variant="forest">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Title Deed Verification Gate</span>
              </GlassBadge>
              <span className="text-xs text-ink-tertiary">Municipal Deed Verification</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-primary tracking-tight">
              Lessor Ownership & Anti-Fraud Gate
            </h1>
            <p className="text-sm text-ink-secondary mt-2.5 leading-relaxed">
              To eradicate fake middleman brokers and ghost listings in Dhaka, RentPulse requires property owners to submit ownership documents. Every document is cryptographically hashed with SHA-256 before verification, conferring the verified lessor trust badge.
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-forest-light border border-forest/20 text-forest text-xs font-medium flex items-center justify-between shadow-card">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-forest/60 hover:text-forest font-bold p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Deed Submission Form (5 Cols) */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSubmitDeed} className="bg-surface border border-hairline rounded-3xl p-6 sm:p-8 shadow-card">
              <h2 className="text-lg font-display font-bold text-ink-primary pb-3 mb-5 border-b border-hairline">
                Register Property Title Deed
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-ink-primary mb-1.5">
                    Property Title / Unit Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunset Residency, Flat 4B"
                    value={propertyTitle}
                    onChange={(e) => setPropertyTitle(e.target.value)}
                    className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-ink-primary mb-1.5">
                      Landlord Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Engr. Asaduzzaman"
                      value={landlordName}
                      onChange={(e) => setLandlordName(e.target.value)}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-ink-primary mb-1.5">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      placeholder="+880 1711-..."
                      value={landlordPhone}
                      onChange={(e) => setLandlordPhone(e.target.value)}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-ink-primary mb-1.5">
                      Dhaka Ward / Thana
                    </label>
                    <select
                      value={thana}
                      onChange={(e) => setThana(e.target.value)}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                    >
                      <option value="Bashundhara R/A">Bashundhara R/A</option>
                      <option value="Dhanmondi">Dhanmondi</option>
                      <option value="Gulshan">Gulshan-1 / 2</option>
                      <option value="Banani">Banani</option>
                      <option value="Uttara">Uttara</option>
                      <option value="Mirpur">Mirpur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-ink-primary mb-1.5">
                      Holding / Plot # *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Plot 24, Road 5"
                      value={holdingNumber}
                      onChange={(e) => setHoldingNumber(e.target.value)}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-ink-primary mb-1.5">
                    Ownership Document Category *
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as DocumentType)}
                    className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-4 py-2.5 text-ink-primary focus:outline-none focus:border-forest/50 focus:bg-surface focus:ring-2 focus:ring-forest/10 transition-all font-medium"
                  >
                    {Object.entries(DOCUMENT_TYPE_LABELS).map(([k, label]) => (
                      <option key={k} value={k}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload Box */}
                <div>
                  <label className="block font-semibold text-ink-primary mb-1.5">
                    Upload Document PDF / Scanned Copy *
                  </label>
                  <div className="relative border border-dashed border-hairline-hover rounded-2xl p-6 text-center bg-muted-sand/30 hover:bg-muted-sand/60 transition-colors">
                    <input
                      type="file"
                      required
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-8 h-8 text-ink-tertiary mx-auto mb-2" />
                    <p className="text-xs font-semibold text-ink-primary">
                      {selectedFile ? selectedFile.name : "Click to select or drag deed PDF/image"}
                    </p>
                    <p className="text-[11px] text-ink-tertiary mt-1">
                      PDF, JPG, PNG up to 15MB
                    </p>
                  </div>
                </div>

                {/* Hashing Status */}
                {isHashing && (
                  <div className="p-3 bg-muted-sand/60 rounded-xl text-ink-primary text-xs flex items-center gap-2">
                    <Clock className="w-4 h-4 text-forest animate-spin" />
                    <span>Computing SHA-256 Digest in Web Crypto API...</span>
                  </div>
                )}

                {calculatedHash && !isHashing && (
                  <div className="p-3.5 bg-ink-primary text-canvas rounded-2xl text-[11px] space-y-1">
                    <div className="text-[10px] text-amber-300 uppercase tracking-wider font-semibold flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5" />
                      Computed SHA-256 Digest:
                    </div>
                    <div className="break-all font-mono text-emerald-300 text-[10px]">
                      {calculatedHash}
                    </div>
                  </div>
                )}

                {isDuplicate && (
                  <div className="p-3.5 bg-terracotta-light border border-terracotta/20 rounded-2xl text-terracotta text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <strong>ANTI-FRAUD ALERT:</strong> This exact document hash already exists in our registry. Duplicate submission will be flagged for investigation.
                    </div>
                  </div>
                )}

                <EditorialButton
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full mt-2"
                  disabled={isHashing || !calculatedHash}
                >
                  Submit Deed for Cryptographic Audit
                </EditorialButton>
              </div>
            </form>
          </div>

          {/* Registry & Audit Table (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-surface border border-hairline rounded-3xl p-6 sm:p-8 shadow-card">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-hairline">
                <div>
                  <h2 className="text-lg font-display font-bold text-ink-primary">
                    Municipal Title Deed Audit Registry
                  </h2>
                  <p className="text-xs text-ink-secondary mt-0.5">
                    Live verification status across Dhaka properties
                  </p>
                </div>
                <GlassBadge variant="neutral">
                  {registry.length} Deeds Recorded
                </GlassBadge>
              </div>

              <div className="space-y-4">
                {registry.map((record) => {
                  const isApproved = record.auditStatus === "approved_verified";
                  const isFlagged = record.auditStatus === "flagged_duplicate";

                  return (
                    <div
                      key={record.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isApproved
                          ? "bg-forest-light/30 border-forest/20 shadow-subtle"
                          : isFlagged
                          ? "bg-terracotta-light/30 border-terracotta/20 shadow-subtle"
                          : "bg-surface border-hairline shadow-subtle"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-ink-primary text-base">
                              {record.propertyTitle}
                            </span>
                            {record.trustBadgeConferred && (
                              <GlassBadge variant="forest">
                                <ShieldCheck className="w-3.5 h-3.5" /> Verified Lessor
                              </GlassBadge>
                            )}
                          </div>
                          <p className="text-xs text-ink-secondary mt-0.5">
                            Owner: <strong className="text-ink-primary">{record.landlordName}</strong> ({record.thana}) • {record.holdingNumber}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div>
                          <GlassBadge variant={isApproved ? "forest" : isFlagged ? "terracotta" : "neutral"}>
                            {record.auditStatus.replace("_", " ")}
                          </GlassBadge>
                        </div>
                      </div>

                      <div className="text-xs text-ink-secondary bg-muted-sand/40 p-3.5 rounded-xl border border-hairline space-y-1.5 mb-3">
                        <div className="flex items-center justify-between text-[11px]">
                          <span>Document Category:</span>
                          <span className="font-semibold text-ink-primary">{DOCUMENT_TYPE_LABELS[record.documentType]}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span>File Name:</span>
                          <span className="font-sans text-ink-primary">{record.fileName}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span>SHA-256 Digest:</span>
                          <button
                            type="button"
                            onClick={() => copyHash(record.sha256Hash)}
                            className="text-forest hover:text-forest-hover flex items-center gap-1 font-semibold"
                          >
                            <span className="font-mono">{record.sha256Hash.slice(0, 14)}...</span>
                            {copiedHash === record.sha256Hash ? (
                              <Check className="w-3 h-3 text-forest" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      {record.auditorNotes && (
                        <p className="text-[11px] text-ink-secondary italic mb-3">
                          <strong>Note:</strong> {record.auditorNotes}
                        </p>
                      )}

                      {/* Admin Demo Control Toggle */}
                      <div className="pt-3 border-t border-hairline flex items-center justify-between">
                        <span className="text-[10px] text-ink-tertiary">
                          Reference ID: {record.id}
                        </span>
                        <EditorialButton
                          variant={isApproved ? "outline" : "primary"}
                          size="sm"
                          onClick={() => handleAdminApproveToggle(record.id)}
                        >
                          {isApproved ? "Revoke Verification" : "Simulate Admin Verification"}
                        </EditorialButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-hairline bg-surface py-8">
        <div className="max-w-[1720px] mx-auto px-6 text-center text-xs text-ink-tertiary">
          RentPulse Landlord Verification Gate • SHA-256 Cryptographic Digest & Municipal Registry Verification
        </div>
      </footer>
    </div>
  );
}
