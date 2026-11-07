"use client";

import React, { useState } from "react";
import { SynergyMatchResult } from "@/lib/matching";
import { SynergyRadarChart } from "./SynergyRadarChart";
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Building2,
  MapPin,
  Calendar,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";

interface RoommateCandidateCardProps {
  match: SynergyMatchResult;
  userName?: string;
  onConnectRequest?: (candidateId: string) => void;
}

export function RoommateCandidateCard({
  match,
  userName = "You",
  onConnectRequest,
}: RoommateCandidateCardProps) {
  const [showRadarModal, setShowRadarModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { candidate, overallSynergyScore, tier, strengths, watchOuts, radarPoints } = match;

  const handleConnect = () => {
    setIsConnected(true);
    if (onConnectRequest) onConnectRequest(candidate.id);
  };

  // Badge background styling
  const isHighSynergy = overallSynergyScore >= 85;
  const badgeBg = isHighSynergy
    ? "bg-emerald-100 text-emerald-900 border-emerald-300"
    : overallSynergyScore >= 70
    ? "bg-blue-100 text-blue-900 border-blue-300"
    : "bg-amber-100 text-amber-900 border-amber-300";

  return (
    <div className="bg-[#FAF8F5] border-2 border-[#1F302B] rounded-2xl overflow-hidden shadow-[4px_4px_0_#1F302B] transition-all hover:-translate-y-0.5">
      {/* Top Banner with Synergy Score */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#1F302B] text-amber-300 flex items-center justify-center font-bold text-sm font-serif">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif font-bold text-stone-900 text-base leading-tight">
                {candidate.name}
              </h3>
              {candidate.verifiedStudentOrEmployee && (
                <span title="Verified Student or Employee NID">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              {candidate.occupation}
            </p>
          </div>
        </div>

        {/* Dynamic Synergy Badge */}
        <div className="flex flex-col items-end">
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${badgeBg}`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{overallSynergyScore}% SYNERGY</span>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-wider text-stone-500 mt-0.5 font-semibold">
            {tier}
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5">
        {/* Institutional & Neighborhood Details */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-stone-600 mb-3 pb-3 border-b border-stone-200/80">
          <div className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-medium">{candidate.institutionOrCompany}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#BD5338]" />
            <span>{candidate.preferredNeighborhood}</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-stone-400">Budget:</span>
            <span className="font-mono font-bold text-stone-900">
              ৳{candidate.budgetMonthlyBdt.toLocaleString()}
            </span>
            <span className="text-[10px] text-stone-500">/mo</span>
          </div>
        </div>

        {/* Bio quote */}
        <p className="text-xs text-stone-700 leading-relaxed mb-4 italic bg-white/70 p-3 rounded-xl border border-stone-200/60">
          "{candidate.bio}"
        </p>

        {/* Behavioral Highlights (Strengths & Watch-outs) */}
        <div className="space-y-1.5 mb-4">
          {strengths.slice(0, 2).map((str, idx) => (
            <div key={`str-${idx}`} className="flex items-start gap-1.5 text-xs text-emerald-900 bg-emerald-50/90 px-2.5 py-1.5 rounded-lg border border-emerald-200/50">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{str}</span>
            </div>
          ))}
          {watchOuts.slice(0, 1).map((wo, idx) => (
            <div key={`wo-${idx}`} className="flex items-start gap-1.5 text-xs text-amber-900 bg-amber-50/90 px-2.5 py-1.5 rounded-lg border border-amber-200/50">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{wo}</span>
            </div>
          ))}
        </div>

        {/* Collapsible 5-Axis Radar Chart */}
        <div className="pt-2 border-t border-stone-200">
          <button
            type="button"
            onClick={() => setShowRadarModal(!showRadarModal)}
            className="flex items-center justify-between w-full py-2 text-xs font-bold text-[#1F302B] hover:text-[#BD5338] transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <span>📊 5-Axis Cohabitation Radar Visualizer</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-stone-200 rounded text-stone-700">
                SVG Engine
              </span>
            </span>
            {showRadarModal ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showRadarModal && (
            <div className="mt-3 p-4 bg-white rounded-xl border border-stone-200">
              <SynergyRadarChart
                radarPoints={radarPoints}
                userName={userName}
                candidateName={candidate.name.split(" ")[0]}
                size={280}
              />
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="flex items-center justify-between px-5 py-3 bg-stone-100/80 border-t border-stone-200">
        <div className="flex items-center gap-1 text-[11px] text-stone-500 font-mono">
          <span>Diet: <strong className="text-stone-800 uppercase">{candidate.dietaryPreference}</strong></span>
          <span>•</span>
          <span>{candidate.smokingPolicy === "strictly_non_smoking" ? "Smoke-Free" : "Balcony OK"}</span>
        </div>

        <button
          type="button"
          onClick={handleConnect}
          disabled={isConnected}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isConnected
              ? "bg-emerald-700 text-white cursor-default"
              : "bg-[#1F302B] text-white hover:bg-[#2C4A3E] shadow-[2px_2px_0_#BD5338]"
          }`}
        >
          {isConnected ? (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Intro Sent</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>Connect Roommate</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
