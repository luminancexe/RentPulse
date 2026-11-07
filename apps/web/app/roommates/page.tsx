"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DHAKA_ROOMMATE_CANDIDATES,
  DEFAULT_USER_PROFILE,
  CohabitationProfile,
  computeSynergyMatch,
  SynergyMatchResult,
} from "@/lib/matching";
import {
  CohabitationQuiz,
  RoommateCandidateCard,
} from "@/components/matching";
import { PillChip } from "@/components/ui/PillChip";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { EditorialButton } from "@/components/ui/EditorialButton";
import {
  Sparkles,
  SlidersHorizontal,
  Home,
  Users,
  ShieldCheck,
  FileText,
  CheckCircle2,
  ChevronLeft,
  X,
} from "lucide-react";

export default function RoommatesPage() {
  const [userProfile, setUserProfile] = useState<CohabitationProfile>(DEFAULT_USER_PROFILE);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("all");
  const [minSynergy, setMinSynergy] = useState<number>(0);
  const [smokeFreeOnly, setSmokeFreeOnly] = useState<boolean>(false);
  const [connectionNotifs, setConnectionNotifs] = useState<string[]>([]);

  // Compute live synergy matches against all candidates
  const matches: SynergyMatchResult[] = useMemo(() => {
    return DHAKA_ROOMMATE_CANDIDATES.map((cand) =>
      computeSynergyMatch(userProfile, cand)
    ).sort((a, b) => b.overallSynergyScore - a.overallSynergyScore);
  }, [userProfile]);

  // Filter candidates
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      if (selectedNeighborhood !== "all") {
        if (!m.candidate.preferredNeighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase())) {
          return false;
        }
      }
      if (m.overallSynergyScore < minSynergy) {
        return false;
      }
      if (smokeFreeOnly && m.candidate.smokingPolicy !== "strictly_non_smoking") {
        return false;
      }
      return true;
    });
  }, [matches, selectedNeighborhood, minSynergy, smokeFreeOnly]);

  const handleConnectRequest = (candidateId: string) => {
    const cand = DHAKA_ROOMMATE_CANDIDATES.find((c) => c.id === candidateId);
    if (cand) {
      setConnectionNotifs((prev) => [
        `Introductory connection invitation dispatched to ${cand.name} (${cand.institutionOrCompany})`,
        ...prev,
      ]);
    }
  };

  const neighborhoods = [
    { id: "all", label: "All Dhaka Hubs" },
    { id: "bashundhara", label: "Bashundhara R/A (NSU/IUB)" },
    { id: "dhanmondi", label: "Dhanmondi (DU/UIU)" },
    { id: "gulshan", label: "Gulshan / Niketan" },
    { id: "banani", label: "Banani DOHS" },
    { id: "uttara", label: "Uttara (MRT-6)" },
    { id: "green road", label: "Panthapath / Green Rd" },
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col font-sans">
      {/* Editorial Boutique Navigation Bar */}
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
              className="px-4 py-2 rounded-full text-xs font-semibold bg-surface text-ink-primary shadow-subtle border border-hairline flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-forest" />
              <span>Roommate Synergy</span>
            </Link>
            <Link
              href="/dossier"
              className="px-4 py-2 rounded-full text-xs font-medium text-ink-secondary hover:text-ink-primary transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
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

          {/* Right Action */}
          <div className="flex items-center gap-3 shrink-0">
            <EditorialButton
              variant={isQuizOpen ? "outline" : "primary"}
              size="sm"
              onClick={() => setIsQuizOpen(!isQuizOpen)}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isQuizOpen ? "Close Assessment" : "Edit My 5 Habits"}</span>
            </EditorialButton>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-10 w-full">
        {/* Notifications Toast */}
        {connectionNotifs.length > 0 && (
          <div className="mb-6 space-y-2">
            {connectionNotifs.map((msg, idx) => (
              <div
                key={`notif-${idx}`}
                className="flex items-center justify-between p-4 rounded-2xl bg-forest-light border border-forest/20 text-forest text-xs font-medium shadow-card animate-fade-in"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                  <span>{msg}</span>
                </div>
                <button
                  onClick={() => setConnectionNotifs((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-forest/60 hover:text-forest font-bold ml-2 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Hero Header Card */}
        <div className="mb-8 bg-surface border border-hairline rounded-3xl p-8 sm:p-10 shadow-card">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <GlassBadge variant="forest">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Roommate Synergy Engine</span>
                </GlassBadge>
                <span className="text-xs text-ink-tertiary">Vector Space Model</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-primary tracking-tight">
                Cohabitation Matching via 5-Axis Vectors
              </h1>
              <p className="text-sm text-ink-secondary mt-2.5 leading-relaxed">
                Replace informal, unvetted social media searches with mathematical cohabitation compatibility. RentPulse models sleep chronotypes, cleaning standards, study noise boundaries, guest rhythms, and dietary culture using vector cosine similarity.
              </p>
            </div>

            {/* User Vector Profile Summary */}
            <div className="p-5 rounded-2xl bg-muted-sand/40 border border-hairline flex flex-col gap-3 shrink-0">
              <div className="text-xs font-sans text-ink-secondary font-semibold uppercase tracking-wider">
                Your Current Habit Vector
              </div>
              <div className="grid grid-cols-5 gap-2 text-center">
                <div className="px-3 py-1.5 bg-surface rounded-xl border border-hairline shadow-subtle">
                  <div className="text-[10px] text-ink-tertiary uppercase font-medium">Sleep</div>
                  <div className="text-sm font-bold text-ink-primary mt-0.5">{userProfile.vector.sleepChronotype}/5</div>
                </div>
                <div className="px-3 py-1.5 bg-surface rounded-xl border border-hairline shadow-subtle">
                  <div className="text-[10px] text-ink-tertiary uppercase font-medium">Clean</div>
                  <div className="text-sm font-bold text-ink-primary mt-0.5">{userProfile.vector.cleanlinessRigor}/5</div>
                </div>
                <div className="px-3 py-1.5 bg-surface rounded-xl border border-hairline shadow-subtle">
                  <div className="text-[10px] text-ink-tertiary uppercase font-medium">Noise</div>
                  <div className="text-sm font-bold text-ink-primary mt-0.5">{userProfile.vector.noiseTolerance}/5</div>
                </div>
                <div className="px-3 py-1.5 bg-surface rounded-xl border border-hairline shadow-subtle">
                  <div className="text-[10px] text-ink-tertiary uppercase font-medium">Guest</div>
                  <div className="text-sm font-bold text-ink-primary mt-0.5">{userProfile.vector.guestRhythm}/5</div>
                </div>
                <div className="px-3 py-1.5 bg-surface rounded-xl border border-hairline shadow-subtle">
                  <div className="text-[10px] text-ink-tertiary uppercase font-medium">Habit</div>
                  <div className="text-sm font-bold text-ink-primary mt-0.5">{userProfile.vector.lifestyleMindset}/5</div>
                </div>
              </div>
              <button
                onClick={() => setIsQuizOpen(true)}
                className="mt-1 text-center text-xs font-semibold text-forest hover:text-forest-hover transition-colors"
              >
                Adjust My Habit Questionnaire →
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Questionnaire Section */}
        {isQuizOpen && (
          <div className="mb-8 animate-fade-in">
            <CohabitationQuiz
              initialProfile={userProfile}
              onProfileChange={(updated) => {
                setUserProfile(updated);
              }}
              onClose={() => setIsQuizOpen(false)}
            />
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="bg-surface border border-hairline rounded-3xl p-5 mb-8 shadow-card flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-ink-secondary mr-2">
              Neighborhood:
            </span>
            {neighborhoods.map((nb) => (
              <PillChip
                key={nb.id}
                active={selectedNeighborhood === nb.id}
                variant="forest"
                onClick={() => setSelectedNeighborhood(nb.id)}
              >
                {nb.label}
              </PillChip>
            ))}
          </div>

          <div className="flex items-center gap-5 text-xs font-medium text-ink-secondary">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={smokeFreeOnly}
                onChange={(e) => setSmokeFreeOnly(e.target.checked)}
                className="rounded border border-hairline text-forest focus:ring-forest"
              />
              <span className="text-ink-primary">100% Smoke-Free</span>
            </label>

            <div className="flex items-center gap-2">
              <span>Min Score:</span>
              <select
                value={minSynergy}
                onChange={(e) => setMinSynergy(Number(e.target.value))}
                className="bg-muted-sand/50 border border-hairline rounded-xl px-3 py-1.5 text-xs font-semibold text-ink-primary focus:outline-none focus:border-forest"
              >
                <option value={0}>All Scores</option>
                <option value={70}>70%+ (Balanced)</option>
                <option value={80}>80%+ (Strong Harmony)</option>
                <option value={90}>90%+ (Top Synergy)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between text-xs text-ink-tertiary font-sans">
          <span>
            SHOWING <strong className="text-ink-primary">{filteredMatches.length}</strong> COMPATIBLE DHAKA ROOMMATE CANDIDATES
          </span>
          <span>SORTED BY HIGHEST VECTOR SYNERGY</span>
        </div>

        {/* Candidate Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredMatches.map((m) => (
            <RoommateCandidateCard
              key={m.candidate.id}
              match={m}
              userName="Your Habits"
              onConnectRequest={handleConnectRequest}
            />
          ))}
        </div>

        {filteredMatches.length === 0 && (
          <div className="p-16 text-center bg-surface border border-dashed border-hairline rounded-3xl shadow-card">
            <p className="text-base font-display font-bold text-ink-primary">No roommate candidates match this filter threshold.</p>
            <p className="text-xs text-ink-secondary mt-1.5">Try lowering the minimum synergy score or selecting 'All Dhaka Hubs'.</p>
            <div className="mt-5">
              <EditorialButton
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedNeighborhood("all");
                  setMinSynergy(0);
                  setSmokeFreeOnly(false);
                }}
              >
                Reset Filters
              </EditorialButton>
            </div>
          </div>
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="mt-auto border-t border-hairline bg-surface py-8">
        <div className="max-w-[1720px] mx-auto px-6 text-center text-xs text-ink-tertiary">
          RentPulse // Roommate Synergy Engine • 5-Vector Cosine Similarity & Dynamic SVG Radar Visualizer
        </div>
      </footer>
    </div>
  );
}
