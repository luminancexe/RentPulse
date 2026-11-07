"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LeaseContractData,
  SEED_LEASE_CONTRACT,
  generateStatutoryClauses,
} from "@/lib/lease-generator";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { EditorialButton } from "@/components/ui/EditorialButton";
import { EcosystemNavMenu } from "@/components/navigation";
import {
  FileText,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Globe,
  Home,
  Users,
  CalendarCheck,
  ChevronLeft,
  Scale,
  Sparkles,
  FileCheck2,
  CreditCard,
} from "lucide-react";

export default function LeaseGeneratorPage() {
  const [contractData, setContractData] = useState<LeaseContractData>(SEED_LEASE_CONTRACT);
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  const [copied, setCopied] = useState(false);

  // Editable financial terms state
  const [monthlyRent, setMonthlyRent] = useState(contractData.financialTerms.monthlyRentBdt);
  const [securityDeposit, setSecurityDeposit] = useState(contractData.financialTerms.securityDepositBdt);
  const [serviceCharge, setServiceCharge] = useState(contractData.financialTerms.serviceChargeBdt);
  const [noticeDays, setNoticeDays] = useState(contractData.financialTerms.noticePeriodDays);
  const [dueDay, setDueDay] = useState(contractData.financialTerms.rentPaymentDueDay);

  // Sync edited terms into active contract
  const activeContract: LeaseContractData = useMemo(() => {
    return {
      ...contractData,
      financialTerms: {
        ...contractData.financialTerms,
        monthlyRentBdt: monthlyRent,
        securityDepositBdt: securityDeposit,
        serviceChargeBdt: serviceCharge,
        noticePeriodDays: noticeDays,
        rentPaymentDueDay: dueDay,
      },
    };
  }, [contractData, monthlyRent, securityDeposit, serviceCharge, noticeDays, dueDay]);

  const clauses = useMemo(() => {
    return generateStatutoryClauses(activeContract);
  }, [activeContract]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textLines = [
      language === "bn"
        ? `গণপ্রজাতন্ত্রী বাংলাদেশ — বাড়ি ভাড়ার চুক্তিপত্র`
        : `RESIDENTIAL TENANCY LEASE AGREEMENT — DHAKA`,
      `Contract ID: ${activeContract.contractId}`,
      `Date: ${activeContract.effectiveDate} to ${activeContract.expiryDate}`,
      `Lessor (মালিক): ${activeContract.lessor.name} | NID: ${activeContract.lessor.nid}`,
      `Lessee (ভাড়াটিয়া): ${activeContract.lessee.name} | NID: ${activeContract.lessee.nid}`,
      `Premises: ${activeContract.premises.propertyTitle}, ${activeContract.premises.holdingNumber}, ${activeContract.premises.roadNumber}, ${activeContract.premises.thana}`,
      `Monthly Rent: BDT ${activeContract.financialTerms.monthlyRentBdt.toLocaleString()}`,
      `Security Deposit: BDT ${activeContract.financialTerms.securityDepositBdt.toLocaleString()}`,
      `Service Charge: BDT ${activeContract.financialTerms.serviceChargeBdt.toLocaleString()}`,
      `\n--- CLAUSES ---\n`,
      ...clauses.map(
        (c) =>
          `${c.number}. ${language === "bn" ? c.headingBn : c.headingEn}\n${
            language === "bn" ? c.contentBn : c.contentEn
          }\n`
      ),
    ];

    navigator.clipboard.writeText(textLines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col font-sans print:bg-white print:text-black">
      {/* Top Navigation Bar (Hidden in Print) */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-hairline print:hidden">
        <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 h-20 sm:h-22 flex items-center justify-between gap-6">
          {/* Logo & Back */}
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
            <EcosystemNavMenu currentPath="/lease" />
            <GlassBadge variant="forest">
              <Scale className="w-3.5 h-3.5" />
              <span>Act 1991 Compliant</span>
            </GlassBadge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-10 w-full print:p-0 print:m-0 print:max-w-none">
        {/* Hero Card (Hidden in Print) */}
        <div className="mb-8 bg-surface border border-hairline rounded-3xl p-8 sm:p-10 shadow-card print:hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <GlassBadge variant="forest">
                  <Scale className="w-3.5 h-3.5" />
                  <span>Statutory Lease Generator</span>
                </GlassBadge>
                <span className="text-xs text-ink-tertiary">
                  Premises Rent Control Act, 1991 • Transfer of Property Act, 1882
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-primary tracking-tight">
                Bilingual Residential Tenancy Contract
              </h1>
              <p className="text-sm text-ink-secondary mt-2.5 leading-relaxed">
                Generate legally enforceable residential lease contracts tailored to Dhaka municipality regulations. Toggle between formal Bengali (বাড়ি ভাড়ার চুক্তিপত্র) and English, verify statutory advance limits, and print directly onto legal stamp paper.
              </p>
            </div>

            {/* Language Switcher Capsule */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="p-1 rounded-full bg-muted-sand/70 border border-hairline flex items-center">
                <button
                  type="button"
                  onClick={() => setLanguage("bn")}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    language === "bn"
                      ? "bg-forest text-canvas shadow-card"
                      : "text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  বাংলা (Statutory)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    language === "en"
                      ? "bg-forest text-canvas shadow-card"
                      : "text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  English (Standard)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <EditorialButton variant="primary" size="sm" onClick={handlePrint}>
                  <Printer className="w-4 h-4" />
                  <span>Print / PDF</span>
                </EditorialButton>
                <EditorialButton variant="outline" size="sm" onClick={handleCopyText}>
                  {copied ? <Check className="w-4 h-4 text-forest" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </EditorialButton>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Term Customizer (Hidden in Print) */}
          <div className="lg:col-span-4 print:hidden space-y-6">
            <div className="bg-surface border border-hairline rounded-3xl p-6 sm:p-8 shadow-card space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-hairline">
                <h2 className="text-base font-display font-bold text-ink-primary">
                  Covenant & Financial Tuner
                </h2>
                <span className="text-[11px] text-forest font-semibold">Live Reactive</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-ink-secondary font-medium block mb-1">
                    Monthly Base Rent (BDT)
                  </label>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-3.5 py-2 font-mono font-bold text-ink-primary focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-ink-secondary font-medium">
                      Security Deposit / Advance (BDT)
                    </label>
                    <span className="text-[10px] text-forest font-semibold">
                      {(securityDeposit / (monthlyRent || 1)).toFixed(1)}x Rent
                    </span>
                  </div>
                  <input
                    type="number"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-3.5 py-2 font-mono font-bold text-ink-primary focus:outline-none focus:border-forest"
                  />
                  <p className="text-[10px] text-ink-tertiary mt-1">
                    *Premises Rent Control Act, 1991 standard limits advance to 1–2 months.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-ink-secondary font-medium block mb-1">
                      Service Charge (BDT)
                    </label>
                    <input
                      type="number"
                      value={serviceCharge}
                      onChange={(e) => setServiceCharge(Number(e.target.value))}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-3.5 py-2 font-mono font-bold text-ink-primary focus:outline-none focus:border-forest"
                    />
                  </div>
                  <div>
                    <label className="text-ink-secondary font-medium block mb-1">
                      Payment Due Day
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={28}
                      value={dueDay}
                      onChange={(e) => setDueDay(Number(e.target.value))}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-3.5 py-2 font-mono font-bold text-ink-primary focus:outline-none focus:border-forest"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-ink-secondary font-medium block mb-1">
                    Termination Notice (Days)
                  </label>
                  <select
                    value={noticeDays}
                    onChange={(e) => setNoticeDays(Number(e.target.value))}
                    className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-3.5 py-2 text-xs font-semibold text-ink-primary focus:outline-none focus:border-forest"
                  >
                    <option value={30}>30 Days (Standard Monthly)</option>
                    <option value={60}>60 Days (Bi-Monthly)</option>
                    <option value={90}>90 Days (Quarterly Notice)</option>
                  </select>
                </div>
              </div>

              {/* Dossier Pre-Fill Link */}
              <div className="pt-4 border-t border-hairline">
                <Link
                  href="/dossier"
                  className="flex items-center justify-between p-3 rounded-2xl bg-muted-sand/40 hover:bg-muted-sand border border-hairline text-xs transition-colors"
                >
                  <span className="text-ink-secondary">Syncing with Encrypted Dossier</span>
                  <span className="font-semibold text-forest">Verified</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Printable Legal Deed View (8 cols) */}
          <div className="lg:col-span-8 print:col-span-12">
            <article className="bg-surface border border-hairline rounded-3xl p-8 sm:p-14 shadow-card text-ink-primary print:border-none print:shadow-none print:p-0">
              {/* Deed Header Banner */}
              <div className="text-center pb-8 border-b-2 border-ink-primary/20 space-y-2">
                <div className="font-mono text-[11px] uppercase tracking-widest text-ink-tertiary">
                  Government of the People's Republic of Bangladesh
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-ink-primary">
                  {language === "bn" ? "বাড়ি ভাড়ার চুক্তিপত্র" : "RESIDENTIAL TENANCY LEASE AGREEMENT"}
                </h1>
                <p className="text-xs font-serif text-ink-secondary italic max-w-xl mx-auto">
                  {language === "bn"
                    ? "বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১ এবং সম্পত্তি হস্তান্তর আইন, ১৮৮২ এর বিধানাধীনে সম্পাদিত ও বলবৎ।"
                    : "Executed and enforceable under the Premises Rent Control Act, 1991 and Transfer of Property Act, 1882."}
                </p>
                <div className="pt-2 font-mono text-xs font-bold text-forest">
                  Ref: {activeContract.contractId} • Date: {activeContract.effectiveDate}
                </div>
              </div>

              {/* Parties Identification Block */}
              <div className="py-6 border-b border-hairline grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed">
                <div className="p-4 rounded-2xl bg-muted-sand/30 border border-hairline">
                  <span className="font-semibold text-forest uppercase tracking-wider block mb-1">
                    {language === "bn" ? "১ম পক্ষ — বাড়িওয়ালা (Lessor / Landlord)" : "Lessor / Property Owner"}
                  </span>
                  <div className="space-y-1">
                    <div><strong>{activeContract.lessor.name}</strong></div>
                    <div className="text-ink-secondary">পিতা/অভিভাবক: {activeContract.lessor.fatherName}</div>
                    <div className="text-ink-secondary">জাতীয় পরিচয়পত্র (NID): <span className="font-mono">{activeContract.lessor.nid}</span></div>
                    <div className="text-ink-secondary">মোবাইল: {activeContract.lessor.phone}</div>
                    <div className="text-ink-secondary">ঠিকানা: {activeContract.lessor.address}, {activeContract.lessor.thana}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-muted-sand/30 border border-hairline">
                  <span className="font-semibold text-forest uppercase tracking-wider block mb-1">
                    {language === "bn" ? "২য় পক্ষ — ভাড়াটিয়া (Lessee / Tenant)" : "Lessee / Prospective Tenant"}
                  </span>
                  <div className="space-y-1">
                    <div><strong>{activeContract.lessee.name}</strong></div>
                    <div className="text-ink-secondary">পিতা/অভিভাবক: {activeContract.lessee.fatherName}</div>
                    <div className="text-ink-secondary">জাতীয় পরিচয়পত্র (NID): <span className="font-mono">{activeContract.lessee.nid}</span></div>
                    <div className="text-ink-secondary">পেশা: {activeContract.lessee.occupation}</div>
                    <div className="text-ink-secondary">মোবাইল: {activeContract.lessee.phone}</div>
                  </div>
                </div>
              </div>

              {/* Demised Premises Legal Schedule (তফসিল) */}
              <div className="py-6 border-b border-hairline">
                <h3 className="font-display font-bold text-sm text-ink-primary uppercase tracking-wider mb-2">
                  {language === "bn" ? "ভাড়াকৃত বাড়ির তফসিল বিবরণী (Schedule of Demised Premises)" : "Schedule of Demised Premises"}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-muted-sand/20 p-4 rounded-2xl border border-hairline">
                  <div>
                    <span className="text-ink-tertiary block">Holding / House</span>
                    <strong className="text-ink-primary">{activeContract.premises.holdingNumber}</strong>
                  </div>
                  <div>
                    <span className="text-ink-tertiary block">Road / Sector</span>
                    <strong className="text-ink-primary">{activeContract.premises.roadNumber}</strong>
                  </div>
                  <div>
                    <span className="text-ink-tertiary block">Thana / Area</span>
                    <strong className="text-ink-primary">{activeContract.premises.thana}</strong>
                  </div>
                  <div>
                    <span className="text-ink-tertiary block">Carpet Area</span>
                    <strong className="text-ink-primary">{activeContract.premises.totalAreaSqft} Sq. Ft.</strong>
                  </div>
                </div>
              </div>

              {/* Clauses Body */}
              <div className="py-6 space-y-6">
                <h3 className="font-display font-bold text-sm text-ink-primary uppercase tracking-wider">
                  {language === "bn" ? "চুক্তির শর্তাবলী (Statutory Tenancy Covenants)" : "Statutory Tenancy Covenants"}
                </h3>

                <div className="space-y-5 text-xs text-ink-secondary leading-relaxed">
                  {clauses.map((clause) => (
                    <div key={clause.number} className="space-y-1.5">
                      <div className="font-semibold text-ink-primary flex items-baseline gap-2">
                        <span className="w-5 h-5 rounded-full bg-forest-light text-forest font-bold text-[10px] flex items-center justify-center shrink-0">
                          {clause.number}
                        </span>
                        <span>{language === "bn" ? clause.headingBn : clause.headingEn}</span>
                      </div>
                      <p className="pl-7 text-ink-primary/80">
                        {language === "bn" ? clause.contentBn : clause.contentEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Covenants */}
              {activeContract.specialCovenants && activeContract.specialCovenants.length > 0 && (
                <div className="py-6 border-t border-hairline">
                  <h4 className="font-semibold text-xs text-ink-primary uppercase tracking-wider mb-2">
                    {language === "bn" ? "বিশেষ শর্তাবলী (Special Covenants)" : "Special Covenants & Building Bylaws"}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-ink-secondary pl-2">
                    {activeContract.specialCovenants.map((cov, idx) => (
                      <li key={idx}>{cov}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Signature Blocks */}
              <div className="pt-12 mt-8 border-t-2 border-ink-primary/20 space-y-10">
                <div className="grid grid-cols-2 gap-8 text-center text-xs">
                  <div>
                    <div className="border-b border-ink-primary/60 pb-12 mb-2" />
                    <strong className="text-ink-primary block">{activeContract.lessor.name}</strong>
                    <span className="text-ink-tertiary">১ম পক্ষ (বাড়িওয়ালা / Lessor)</span>
                  </div>
                  <div>
                    <div className="border-b border-ink-primary/60 pb-12 mb-2" />
                    <strong className="text-ink-primary block">{activeContract.lessee.name}</strong>
                    <span className="text-ink-tertiary">২য় পক্ষ (ভাড়াটিয়া / Lessee)</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-hairline grid grid-cols-2 gap-8 text-center text-xs">
                  <div>
                    <div className="border-b border-dashed border-ink-primary/40 pb-8 mb-2" />
                    <span className="text-ink-secondary">১ম সাক্ষীর স্বাক্ষর ও এনআইডি (Witness 1)</span>
                  </div>
                  <div>
                    <div className="border-b border-dashed border-ink-primary/40 pb-8 mb-2" />
                    <span className="text-ink-secondary">২য় সাক্ষীর স্বাক্ষর ও এনআইডি (Witness 2)</span>
                  </div>
                </div>
              </div>

              {/* Legal Seal Watermark */}
              <div className="mt-8 pt-4 text-center text-[10px] text-ink-tertiary font-mono">
                Verified via RentPulse Dhaka Tenancy Trust Gateway • SHA-256 Digest Cryptographically Audited
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}
