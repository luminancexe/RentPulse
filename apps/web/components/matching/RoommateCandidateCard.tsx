"use client";

import React, { useState } from "react";
import { SynergyMatchResult } from "@/lib/matching";
import { SynergyRadarChart } from "./SynergyRadarChart";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { EditorialButton } from "@/components/ui/EditorialButton";
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Building2,
  MapPin,
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

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConnected(true);
    if (onConnectRequest) onConnectRequest(candidate.id);
  };

  const isHighSynergy = overallSynergyScore >= 85;

  return (
    <article className="group flex flex-col bg-surface rounded-3xl border border-hairline overflow-hidden shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
      {/* Top Header Row with Avatar & Synergy Badge */}
      <div className="flex items-start justify-between p-6 pb-4 border-b border-hairline">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-forest-light text-forest flex items-center justify-center font-display font-bold text-lg shadow-sm border border-forest/15">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-bold text-ink-primary text-base sm:text-lg leading-tight group-hover:text-forest transition-colors">
                {candidate.name}
              </h3>
              {candidate.verifiedStudentOrEmployee && (
                <span title="Verified Student or Corporate NID">
                  <ShieldCheck className="w-4 h-4 text-forest" />
                </span>
              )}
            </div>
            <p className="text-xs text-ink-secondary mt-0.5 font-medium">
              {candidate.occupation}
            </p>
          </div>
        </div>

        {/* Dynamic Synergy Badge */}
        <div className="flex flex-col items-end">
          <GlassBadge variant={isHighSynergy ? "forest" : overallSynergyScore >= 70 ? "neutral" : "terracotta"}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{overallSynergyScore}% SYNERGY</span>
          </GlassBadge>
          <span className="text-[10px] font-sans text-ink-tertiary mt-1 font-medium">
            {tier}
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Institutional & Neighborhood Details */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-ink-secondary mb-4 pb-3 border-b border-hairline">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-ink-tertiary" />
              <span className="font-medium text-ink-primary">{candidate.institutionOrCompany}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-terracotta" />
              <span>{candidate.preferredNeighborhood}</span>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-ink-tertiary">Budget:</span>
              <span className="font-sans font-bold text-ink-primary">
                ৳{candidate.budgetMonthlyBdt.toLocaleString()}
              </span>
              <span className="text-[10px] text-ink-tertiary">/mo</span>
            </div>
          </div>

          {/* Bio statement */}
          <p className="text-xs text-ink-secondary leading-relaxed mb-5 italic bg-muted-sand/40 p-3.5 rounded-2xl border border-hairline">
            "{candidate.bio}"
          </p>

          {/* Behavioral Compatibility Highlights */}
          <div className="space-y-2 mb-5">
            {strengths.slice(0, 2).map((str, idx) => (
              <div
                key={`str-${idx}`}
                className="flex items-start gap-2 text-xs text-forest bg-forest-light/60 px-3 py-2 rounded-xl border border-forest/15"
              >
                <CheckCircle className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                <span className="leading-tight">{str}</span>
              </div>
            ))}
            {watchOuts.slice(0, 1).map((wo, idx) => (
              <div
                key={`wo-${idx}`}
                className="flex items-start gap-2 text-xs text-terracotta bg-terracotta-light/60 px-3 py-2 rounded-xl border border-terracotta/15"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-terracotta shrink-0 mt-0.5" />
                <span className="leading-tight">{wo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Collapsible 5-Axis Radar Chart */}
        <div className="pt-3 border-t border-hairline">
          <button
            type="button"
            onClick={() => setShowRadarModal(!showRadarModal)}
            className="flex items-center justify-between w-full py-1 text-xs font-semibold text-ink-primary hover:text-forest transition-colors"
          >
            <span className="flex items-center gap-2">
              <span>5-Axis Cohabitation Radar Visualizer</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted-sand text-ink-secondary font-medium border border-hairline">
                Interactive SVG
              </span>
            </span>
            {showRadarModal ? (
              <ChevronUp className="w-4 h-4 text-ink-tertiary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-ink-tertiary" />
            )}
          </button>

          {showRadarModal && (
            <div className="mt-4 p-4 bg-muted-sand/30 rounded-2xl border border-hairline animate-fade-in">
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
      <div className="flex items-center justify-between px-6 py-4 bg-muted-sand/30 border-t border-hairline">
        <div className="flex items-center gap-2 text-[11px] text-ink-tertiary font-sans">
          <span>Diet: <strong className="text-ink-primary uppercase">{candidate.dietaryPreference}</strong></span>
          <span>•</span>
          <span>{candidate.smokingPolicy === "strictly_non_smoking" ? "100% Smoke-Free" : "Balcony OK"}</span>
        </div>

        <EditorialButton
          variant={isConnected ? "outline" : "primary"}
          size="sm"
          onClick={handleConnect}
          disabled={isConnected}
        >
          {isConnected ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-forest" />
              <span className="text-forest font-semibold">Intro Sent</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Connect</span>
            </>
          )}
        </EditorialButton>
      </div>
    </article>
  );
}
