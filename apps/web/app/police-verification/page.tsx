"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DMPCimsForm2Data,
  DHAKA_POLICE_THANAS,
  populateDmpFromDossier,
  validateDmpForm,
} from "@/lib/dmp-cims";
import { SEED_TENANT_DOSSIER } from "@/lib/crypto-vault";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { EditorialButton } from "@/components/ui/EditorialButton";
import { EcosystemNavMenu } from "@/components/navigation";
import {
  ShieldCheck,
  Printer,
  FileCheck2,
  Download,
  Building,
  User,
  Phone,
  Home,
  Users,
  CalendarCheck,
  Scale,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function PoliceVerificationPage() {
  const [formData, setFormData] = useState<DMPCimsForm2Data>(() =>
    populateDmpFromDossier(SEED_TENANT_DOSSIER)
  );
  const [selectedThana, setSelectedThana] = useState(DHAKA_POLICE_THANAS[0].name);
  const [isAutofilled, setIsAutofilled] = useState(true);

  const validation = validateDmpForm(formData);

  const handlePrint = () => {
    window.print();
  };

  const handleReSyncDossier = () => {
    setFormData(populateDmpFromDossier(SEED_TENANT_DOSSIER, selectedThana));
    setIsAutofilled(true);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col font-sans print:bg-white print:text-black">
      {/* Top Header (Hidden in Print) */}
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
            <EcosystemNavMenu currentPath="/police-verification" />
            <GlassBadge variant="forest">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DMP CIMS Gateway</span>
            </GlassBadge>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-10 w-full print:p-0 print:m-0 print:max-w-none">
        {/* Hero Card (Hidden in Print) */}
        <div className="mb-8 bg-surface border border-hairline rounded-3xl p-8 sm:p-10 shadow-card print:hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <GlassBadge variant="forest">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Statutory Police Verification</span>
                </GlassBadge>
                <span className="text-xs text-ink-tertiary">
                  Dhaka Metropolitan Police (ডিএমপি) CIMS Form-2
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-primary tracking-tight">
                DMP Citizen Information Management (Form-2)
              </h1>
              <p className="text-sm text-ink-secondary mt-2.5 leading-relaxed">
                By statutory DMP order, every tenant in Dhaka must be registered with their jurisdiction Thana within 7 days of tenancy commencement. RentPulse automatically pulls verified identity credentials from your Encrypted Dossier to generate a compliant, print-ready Form-2.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <EditorialButton variant="outline" size="sm" onClick={handleReSyncDossier}>
                <Sparkles className="w-4 h-4 text-forest" />
                <span>Sync From Dossier</span>
              </EditorialButton>
              <EditorialButton variant="primary" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4" />
                <span>Print Official Form-2</span>
              </EditorialButton>
            </div>
          </div>
        </div>

        {/* Form Controls Banner (Hidden in Print) */}
        <div className="mb-8 bg-muted-sand/40 border border-hairline rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 print:hidden shadow-subtle">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-ink-primary uppercase tracking-wider">
              Select Jurisdiction Thana:
            </span>
            <select
              value={selectedThana}
              onChange={(e) => {
                setSelectedThana(e.target.value);
                setFormData((prev) => ({ ...prev, submissionThana: e.target.value }));
              }}
              className="bg-surface border border-hairline rounded-xl px-3 py-1.5 text-xs font-semibold text-ink-primary focus:outline-none focus:border-forest"
            >
              {DHAKA_POLICE_THANAS.map((th) => (
                <option key={th.id} value={th.name}>
                  {th.name} — {th.zone}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {validation.isValid ? (
              <span className="inline-flex items-center gap-1.5 text-forest font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Statutory Fields 100% Complete
              </span>
            ) : (
              <span className="text-terracotta font-semibold">
                {validation.errors.length} Required Fields Missing
              </span>
            )}
          </div>
        </div>

        {/* Printable Official DMP Form-2 Document */}
        <div className="max-w-4xl mx-auto">
          <article className="bg-surface border border-hairline rounded-3xl p-8 sm:p-14 shadow-card text-ink-primary print:border-none print:shadow-none print:p-0">
            {/* Header: Official Police Monogram & Title */}
            <div className="text-center pb-6 border-b-2 border-ink-primary/20 relative">
              {/* Photo Box Placeholder */}
              <div className="absolute right-0 top-0 w-24 h-28 border-2 border-dashed border-ink-primary/30 rounded-lg flex flex-col items-center justify-center p-2 text-center text-[10px] text-ink-tertiary print:border-solid">
                <User className="w-6 h-6 text-ink-tertiary mb-1" />
                <span>ভাড়াটিয়ার পাসপোর্ট সাইজ ছবি</span>
              </div>

              <div className="font-serif text-sm font-bold uppercase tracking-wider text-ink-secondary">
                ঢাকা মেট্রোপলিটন পুলিশ (DMP)
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-ink-primary mt-1">
                নাগরিক তথ্য সংগ্রহ ফরম (ভাড়াটিয়া নিবন্ধন)
              </h2>
              <div className="font-mono text-xs font-bold text-forest mt-1">
                ফরম নং-২ • Citizen Information Management System (CIMS)
              </div>
              <p className="text-[11px] text-ink-secondary mt-1">
                থানা: <strong>{formData.submissionThana}</strong> • ট্র্যাকিং আইডি: <span className="font-mono">{formData.formTrackingId}</span>
              </p>
            </div>

            {/* 1. Tenant Bio Data */}
            <div className="py-5 border-b border-hairline space-y-3">
              <h3 className="font-semibold text-xs text-forest uppercase tracking-wider">
                ১. ভাড়াটিয়ার ব্যক্তিগত বিবরণ (Tenant Profile)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                <div>
                  <span className="text-ink-tertiary">পূর্ণ নাম (ইংরেজি ও বাংলায়):</span>
                  <div className="font-bold text-ink-primary">{formData.tenantFullName}</div>
                </div>
                <div>
                  <span className="text-ink-tertiary">জাতীয় পরিচয়পত্র / স্মার্ট কার্ড নং (NID):</span>
                  <div className="font-mono font-bold text-ink-primary">{formData.nationalId}</div>
                </div>
                <div>
                  <span className="text-ink-tertiary">পিতার নাম:</span>
                  <div className="font-semibold text-ink-primary">{formData.tenantFatherName}</div>
                </div>
                <div>
                  <span className="text-ink-tertiary">মাতার নাম:</span>
                  <div className="font-semibold text-ink-primary">{formData.tenantMotherName}</div>
                </div>
                <div>
                  <span className="text-ink-tertiary">জন্ম তারিখ ও ধর্ম:</span>
                  <div className="text-ink-primary">{formData.dateOfBirth} • {formData.religion}</div>
                </div>
                <div>
                  <span className="text-ink-tertiary">মোবাইল নম্বর ও ইমেইল:</span>
                  <div className="text-ink-primary">{formData.mobileNumber} • {formData.emailAddress}</div>
                </div>
              </div>
            </div>

            {/* 2. Professional / Academic */}
            <div className="py-5 border-b border-hairline space-y-3">
              <h3 className="font-semibold text-xs text-forest uppercase tracking-wider">
                ২. পেশা ও শিক্ষা/কর্মক্ষেত্রের বিবরণ (Academic / Employment)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                <div>
                  <span className="text-ink-tertiary">পেশার ধরণ:</span>
                  <div className="font-semibold text-ink-primary capitalize">{formData.occupationCategory}</div>
                </div>
                <div>
                  <span className="text-ink-tertiary">প্রতিষ্ঠান / বিশ্ববিদ্যালয়ের নাম:</span>
                  <div className="font-bold text-ink-primary">{formData.institutionOrCompany}</div>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-ink-tertiary">কর্মক্ষেত্র / অধ্যয়নরত ক্যাম্পাসের ঠিকানা ও ফোন:</span>
                  <div className="text-ink-primary">{formData.workplaceAddress} (Tel: {formData.workplacePhone})</div>
                </div>
              </div>
            </div>

            {/* 3. Permanent Address */}
            <div className="py-5 border-b border-hairline space-y-3">
              <h3 className="font-semibold text-xs text-forest uppercase tracking-wider">
                ৩. স্থায়ী ঠিকানা (Permanent Address)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-muted-sand/20 p-3.5 rounded-2xl border border-hairline">
                <div>
                  <span className="text-ink-tertiary block">গ্রাম / মহল্লা</span>
                  <strong className="text-ink-primary">{formData.permanentVillageRoad}</strong>
                </div>
                <div>
                  <span className="text-ink-tertiary block">ডাকঘর</span>
                  <strong className="text-ink-primary">{formData.permanentPostOffice}</strong>
                </div>
                <div>
                  <span className="text-ink-tertiary block">থানা</span>
                  <strong className="text-ink-primary">{formData.permanentThana}</strong>
                </div>
                <div>
                  <span className="text-ink-tertiary block">জেলা</span>
                  <strong className="text-ink-primary">{formData.permanentDistrict}</strong>
                </div>
              </div>
            </div>

            {/* 4. Current Demised Residence in Dhaka */}
            <div className="py-5 border-b border-hairline space-y-3">
              <h3 className="font-semibold text-xs text-forest uppercase tracking-wider">
                ৪. বর্তমান ভাড়াকৃত বাসার তথ্য ও বাড়িওয়ালা (Present Dhaka Residence)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                <div>
                  <span className="text-ink-tertiary">ভাড়াকৃত ফ্ল্যাট ও হোল্ডিং নং:</span>
                  <div className="font-bold text-ink-primary">{formData.currentFlatUnit}, {formData.currentHolding}</div>
                </div>
                <div>
                  <span className="text-ink-tertiary">রাস্তা ও এলাকা/থানা:</span>
                  <div className="text-ink-primary">{formData.currentRoad}, {formData.currentBlockSector}, {formData.currentThana}</div>
                </div>
                <div>
                  <span className="text-ink-tertiary">বাড়িওয়ালার নাম:</span>
                  <div className="font-semibold text-ink-primary">{formData.landlordName}</div>
                </div>
                <div>
                  <span className="text-ink-tertiary">বাড়িওয়ালার মোবাইল নম্বর:</span>
                  <div className="font-mono text-ink-primary">{formData.landlordPhone}</div>
                </div>
              </div>
            </div>

            {/* 5. Emergency Contact */}
            <div className="py-5 border-b border-hairline space-y-3">
              <h3 className="font-semibold text-xs text-forest uppercase tracking-wider">
                ৫. জরুরী যোগাযোগ (Emergency Contact)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-ink-tertiary block">নাম:</span>
                  <strong className="text-ink-primary">{formData.emergencyName}</strong>
                </div>
                <div>
                  <span className="text-ink-tertiary block">সম্পর্ক:</span>
                  <span className="text-ink-primary">{formData.emergencyRelation}</span>
                </div>
                <div>
                  <span className="text-ink-tertiary block">মোবাইল নম্বর:</span>
                  <span className="font-mono text-ink-primary">{formData.emergencyPhone}</span>
                </div>
              </div>
            </div>

            {/* 6. Cohabitants / Roommates Table */}
            <div className="py-5 border-b border-hairline space-y-3">
              <h3 className="font-semibold text-xs text-forest uppercase tracking-wider">
                ৬. পরিবারের সদস্য / সহবাসকারী ব্যক্তিবর্গের বিবরণ (Cohabitants / Flatmates)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-hairline rounded-xl overflow-hidden">
                  <thead className="bg-muted-sand/60 text-ink-secondary">
                    <tr>
                      <th className="p-2.5 font-semibold">ক্র. নং</th>
                      <th className="p-2.5 font-semibold">নাম</th>
                      <th className="p-2.5 font-semibold">বয়স</th>
                      <th className="p-2.5 font-semibold">সম্পর্ক</th>
                      <th className="p-2.5 font-semibold">পেশা</th>
                      <th className="p-2.5 font-semibold">এনআইডি নং</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {formData.familyMembers.map((m, idx) => (
                      <tr key={idx} className="hover:bg-muted-sand/20">
                        <td className="p-2.5 font-mono">{idx + 1}</td>
                        <td className="p-2.5 font-semibold text-ink-primary">{m.name}</td>
                        <td className="p-2.5">{m.age} বছর</td>
                        <td className="p-2.5">{m.relation}</td>
                        <td className="p-2.5">{m.occupation}</td>
                        <td className="p-2.5 font-mono text-[11px]">{m.nidOrBirthCert}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 7. Signatures & Official Thana Stamp */}
            <div className="pt-10 space-y-12">
              <div className="grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="border-b border-ink-primary/60 pb-10 mb-2" />
                  <strong className="text-ink-primary block">{formData.tenantFullName}</strong>
                  <span className="text-ink-tertiary">ভাড়াটিয়ার স্বাক্ষর ও তারিখ (Tenant)</span>
                </div>
                <div>
                  <div className="border-b border-ink-primary/60 pb-10 mb-2" />
                  <strong className="text-ink-primary block">{formData.landlordName}</strong>
                  <span className="text-ink-tertiary">বাড়িওয়ালার স্বাক্ষর ও তারিখ (Landlord)</span>
                </div>
              </div>

              {/* Thana Verification Box */}
              <div className="p-5 rounded-2xl border-2 border-dashed border-ink-primary/30 text-center text-xs space-y-2">
                <div className="font-semibold text-ink-primary uppercase tracking-wider">
                  শুধুমাত্র সংশ্লিষ্ট থানা ব্যবহারের জন্য (For Police Station Use Only)
                </div>
                <p className="text-[11px] text-ink-tertiary max-w-md mx-auto">
                  ফরম-২ জমাদানকারী নাগরিকের তথ্য সিআইএমএস সার্ভারে এন্ট্রি সম্পন্ন হইল।
                </p>
                <div className="pt-8 grid grid-cols-2 gap-8 text-center text-[11px] text-ink-secondary">
                  <div>ডিউটি অফিসারের স্বাক্ষর ও নাম</div>
                  <div>ভারপ্রাপ্ত কর্মকর্তা (OC) সীল ও স্বাক্ষর</div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
