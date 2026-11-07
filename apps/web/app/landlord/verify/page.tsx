"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DeedRecord,
  DocumentType,
  DOCUMENT_TYPE_LABELS,
  SEED_DEED_REGISTRY,
  computeFileHash,
} from "@/lib/deed-verifier";
import {
  ShieldCheck,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Home,
  Users,
  Search,
  Building2,
  Copy,
  Check,
  Hash,
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1A17] flex flex-col font-sans">
      {/* Navigation */}
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
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Tenancy Dossier
              </Link>
              <Link
                href="/landlord/verify"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1F302B] text-white font-bold"
              >
                <FileText className="w-3.5 h-3.5 text-amber-300" />
                Deed Anti-Fraud
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-mono bg-amber-100 text-amber-900 border border-amber-300 rounded-md font-bold">
              ANTI-FRAUD GATE
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Banner */}
        <div className="mb-8 bg-white border-2 border-[#1F302B] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0_#1F302B]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>PHASE 4 // TITLE DEED CRYPTOGRAPHIC AUDITING</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#1F302B] tracking-tight">
              Lessor Ownership & Anti-Fraud Gate
            </h1>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              To eradicate fake middleman brokers and ghost listings in Dhaka, RentPulse requires property owners to submit ownership documents. Every document is cryptographically hashed with SHA-256 before verification, conferring the verified lessor trust badge.
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border-2 border-emerald-600 text-emerald-950 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-stone-400 hover:text-stone-700 font-bold">
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Deed Submission Form (5 Cols) */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSubmitDeed} className="bg-white border-2 border-[#1F302B] rounded-2xl p-6 shadow-[4px_4px_0_#1F302B]">
              <h2 className="text-lg font-serif font-bold text-stone-900 pb-3 mb-4 border-b border-stone-200">
                Register Property Title Deed
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Property Title / Unit Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunset Residency, Flat 4B"
                    value={propertyTitle}
                    onChange={(e) => setPropertyTitle(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Landlord Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Engr. Asaduzzaman"
                      value={landlordName}
                      onChange={(e) => setLandlordName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      placeholder="+880 1711-..."
                      value={landlordPhone}
                      onChange={(e) => setLandlordPhone(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Dhaka Ward / Thana
                    </label>
                    <select
                      value={thana}
                      onChange={(e) => setThana(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
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
                    <label className="block font-bold text-stone-700 mb-1">
                      Holding / Plot # *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Plot 24, Road 5"
                      value={holdingNumber}
                      onChange={(e) => setHoldingNumber(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Ownership Document Category *
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as DocumentType)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1F302B]"
                  >
                    {Object.entries(DOCUMENT_TYPE_LABELS).map(([k, label]) => (
                      <option key={k} value={k}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload Box with Real-time Client Hashing */}
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Upload Document PDF / Scanned Copy *
                  </label>
                  <div className="relative border-2 border-dashed border-stone-300 rounded-xl p-4 text-center bg-[#FAF8F5] hover:bg-stone-50 transition-colors">
                    <input
                      type="file"
                      required
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-6 h-6 text-stone-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-stone-700">
                      {selectedFile ? selectedFile.name : "Click to select or drag deed PDF/image"}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      PDF, JPG, PNG up to 15MB
                    </p>
                  </div>
                </div>

                {/* Hashing Status & Duplicate Warning */}
                {isHashing && (
                  <div className="p-2.5 bg-amber-50 rounded-lg text-amber-900 font-mono text-[11px] flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Computing SHA-256 Digest in Web Crypto API...</span>
                  </div>
                )}

                {calculatedHash && !isHashing && (
                  <div className="p-3 bg-stone-900 text-stone-200 rounded-xl font-mono text-[11px] space-y-1">
                    <div className="text-[9px] text-amber-300 uppercase tracking-wider font-bold flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      Computed SHA-256 Digest:
                    </div>
                    <div className="break-all text-emerald-400 text-[10px] font-bold">
                      {calculatedHash}
                    </div>
                  </div>
                )}

                {isDuplicate && (
                  <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>ANTI-FRAUD ALERT:</strong> This exact document hash already exists in our registry. Duplicate submission will be flagged for investigation.
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isHashing || !calculatedHash}
                  className="w-full py-2.5 px-4 bg-[#1F302B] text-white font-bold rounded-xl shadow-[2px_2px_0_#BD5338] hover:bg-[#2C4A3E] transition-all disabled:opacity-50"
                >
                  Submit Deed for Cryptographic Audit
                </button>
              </div>
            </form>
          </div>

          {/* Registry & Audit Table (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white border-2 border-[#1F302B] rounded-2xl p-6 shadow-[4px_4px_0_#1F302B]">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                <div>
                  <h2 className="text-lg font-serif font-bold text-stone-900">
                    Municipal Title Deed Audit Registry
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    Live verification status across Dhaka properties
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-stone-100 rounded-md text-stone-700">
                  {registry.length} DEEDS RECORDED
                </span>
              </div>

              <div className="space-y-4">
                {registry.map((record) => {
                  const isApproved = record.auditStatus === "approved_verified";
                  const isFlagged = record.auditStatus === "flagged_duplicate";

                  return (
                    <div
                      key={record.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isApproved
                          ? "bg-emerald-50/50 border-emerald-300"
                          : isFlagged
                          ? "bg-red-50/60 border-red-300"
                          : "bg-[#FAF8F5] border-stone-300"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-stone-900 text-sm">
                              {record.propertyTitle}
                            </span>
                            {record.trustBadgeConferred && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-800 text-white">
                                <ShieldCheck className="w-3 h-3" /> VERIFIED LESSOR
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-600">
                            Owner: <strong>{record.landlordName}</strong> ({record.thana}) • {record.holdingNumber}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                              isApproved
                                ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                : isFlagged
                                ? "bg-red-100 text-red-900 border-red-300"
                                : "bg-amber-100 text-amber-900 border-amber-300"
                            }`}
                          >
                            {record.auditStatus.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-stone-700 bg-white p-2.5 rounded-lg border border-stone-200/80 space-y-1 mb-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-stone-500">Doc Category:</span>
                          <span className="font-semibold">{DOCUMENT_TYPE_LABELS[record.documentType]}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-stone-500">File Name:</span>
                          <span className="font-mono text-stone-800">{record.fileName}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-stone-500">SHA-256 Digest:</span>
                          <button
                            type="button"
                            onClick={() => copyHash(record.sha256Hash)}
                            className="text-stone-700 hover:text-stone-900 flex items-center gap-1 font-bold"
                          >
                            <span>{record.sha256Hash.slice(0, 14)}...</span>
                            {copiedHash === record.sha256Hash ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      {record.auditorNotes && (
                        <p className="text-[11px] text-stone-600 italic">
                          <strong>Note:</strong> {record.auditorNotes}
                        </p>
                      )}

                      {/* Admin Demo Control Toggle */}
                      <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between">
                        <span className="text-[10px] text-stone-400 font-mono">
                          ID: {record.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAdminApproveToggle(record.id)}
                          className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                            isApproved
                              ? "bg-stone-200 text-stone-700 hover:bg-stone-300 border-stone-300"
                              : "bg-emerald-700 text-white hover:bg-emerald-800 border-emerald-800"
                          }`}
                        >
                          {isApproved ? "Revoke Verification" : "Simulate Admin Verification"}
                        </button>
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
      <footer className="mt-auto border-t-2 border-[#1F302B] bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-stone-500 font-mono">
          RentPulse Phase 4 // Landlord Anti-Fraud Gate • SHA-256 Cryptographic Digest & Municipal Registry Verification
        </div>
      </footer>
    </div>
  );
}
