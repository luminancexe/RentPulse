"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
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
import {
  Sparkles,
  SlidersHorizontal,
  Home,
  Users,
  ShieldCheck,
  FileText,
  Search,
  CheckCircle2,
  Filter,
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1A17] flex flex-col font-sans">
      {/* Top Editorial Navigation */}
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
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1F302B] text-white font-bold"
              >
                <Users className="w-3.5 h-3.5 text-amber-300" />
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
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Deed Anti-Fraud
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsQuizOpen(!isQuizOpen)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#BD5338] hover:bg-[#a6452d] border border-[#1F302B] shadow-[2px_2px_0_#1F302B] transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-200" />
              <span>{isQuizOpen ? "Close Quiz" : "Edit My 5 Habits"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Notifications Toast */}
        {connectionNotifs.length > 0 && (
          <div className="mb-6 space-y-2">
            {connectionNotifs.map((msg, idx) => (
              <div
                key={`notif-${idx}`}
                className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border-2 border-emerald-600 text-emerald-950 text-xs font-medium shadow-[2px_2px_0_#1F302B] animate-fade-in"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{msg}</span>
                </div>
                <button
                  onClick={() => setConnectionNotifs(prev => prev.filter((_, i) => i !== idx))}
                  className="text-stone-400 hover:text-stone-700 font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Hero Header */}
        <div className="mb-8 bg-white border-2 border-[#1F302B] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0_#1F302B]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>PHASE 4 // ALGORITHMIC ROOMMATE SYNERGY ENGINE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#1F302B] tracking-tight">
                Cohabitation Matching via 5-Axis Vectors
              </h1>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                Replace unvetted Facebook group posts with mathematical compatibility. RentPulse models sleep chronotypes, cleaning standards, study noise boundaries, guest policies, and dietary habits using vector cosine similarity.
              </p>
            </div>

            {/* Quick Profile Summary Badge */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 flex flex-col gap-2 shrink-0">
              <div className="text-xs font-mono text-stone-500 uppercase tracking-wider font-semibold">
                Your Current Vector Profile
              </div>
              <div className="grid grid-cols-5 gap-1.5 text-center">
                <div className="px-2 py-1 bg-white rounded border border-stone-200">
                  <div className="text-[9px] text-stone-500">SLEEP</div>
                  <div className="text-xs font-bold text-stone-900">{userProfile.vector.sleepChronotype}/5</div>
                </div>
                <div className="px-2 py-1 bg-white rounded border border-stone-200">
                  <div className="text-[9px] text-stone-500">CLEAN</div>
                  <div className="text-xs font-bold text-stone-900">{userProfile.vector.cleanlinessRigor}/5</div>
                </div>
                <div className="px-2 py-1 bg-white rounded border border-stone-200">
                  <div className="text-[9px] text-stone-500">NOISE</div>
                  <div className="text-xs font-bold text-stone-900">{userProfile.vector.noiseTolerance}/5</div>
                </div>
                <div className="px-2 py-1 bg-white rounded border border-stone-200">
                  <div className="text-[9px] text-stone-500">GUEST</div>
                  <div className="text-xs font-bold text-stone-900">{userProfile.vector.guestRhythm}/5</div>
                </div>
                <div className="px-2 py-1 bg-white rounded border border-stone-200">
                  <div className="text-[9px] text-stone-500">HABIT</div>
                  <div className="text-xs font-bold text-stone-900">{userProfile.vector.lifestyleMindset}/5</div>
                </div>
              </div>
              <button
                onClick={() => setIsQuizOpen(true)}
                className="mt-1 text-center text-xs font-bold text-[#BD5338] hover:underline"
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
        <div className="bg-white border-2 border-[#1F302B] rounded-2xl p-4 mb-8 shadow-[4px_4px_0_#1F302B] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-stone-600 flex items-center gap-1 mr-2">
              <Filter className="w-3.5 h-3.5" /> Neighborhood:
            </span>
            {neighborhoods.map((nb) => (
              <button
                key={nb.id}
                onClick={() => setSelectedNeighborhood(nb.id)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  selectedNeighborhood === nb.id
                    ? "bg-[#1F302B] text-white font-bold"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {nb.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-stone-700">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={smokeFreeOnly}
                onChange={(e) => setSmokeFreeOnly(e.target.checked)}
                className="rounded text-[#BD5338] focus:ring-[#BD5338]"
              />
              <span>100% Smoke-Free Only</span>
            </label>

            <div className="flex items-center gap-1.5">
              <span>Min Score:</span>
              <select
                value={minSynergy}
                onChange={(e) => setMinSynergy(Number(e.target.value))}
                className="bg-stone-50 border border-stone-300 rounded px-2 py-1 text-xs font-bold text-stone-900"
              >
                <option value={0}>All Scores</option>
                <option value={70}>70%+ (Balanced)</option>
                <option value={80}>80%+ (Strong)</option>
                <option value={90}>90%+ (Top Synergy)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Candidate Results Grid */}
        <div className="mb-6 flex items-center justify-between text-xs text-stone-600 font-mono">
          <span>
            SHOWING <strong>{filteredMatches.length}</strong> COMPATIBLE DHAKA ROOMMATE CANDIDATES
          </span>
          <span>SORTED BY: HIGHEST VECTOR SYNERGY ↓</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="p-12 text-center bg-white border-2 border-dashed border-stone-300 rounded-2xl">
            <p className="text-base font-bold text-stone-700">No roommate candidates match this filter threshold.</p>
            <p className="text-xs text-stone-500 mt-1">Try lowering the minimum synergy score or selecting 'All Dhaka Hubs'.</p>
            <button
              onClick={() => {
                setSelectedNeighborhood("all");
                setMinSynergy(0);
                setSmokeFreeOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-[#1F302B] text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="mt-auto border-t-2 border-[#1F302B] bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-stone-500 font-mono">
          RentPulse Phase 4 // Roommate Synergy Engine • 5-Vector Cosine Similarity & Dynamic SVG Radar Visualizer
        </div>
      </footer>
    </div>
  );
}
