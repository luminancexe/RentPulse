"use client";

import React, { useState } from "react";
import { CohabitationVector, DietaryPreference, SmokingPolicy, CohabitationProfile } from "@/lib/matching";
import { Sparkles, CheckCircle2, Moon, Sparkle, Volume2, Users, UtensilsCrossed, Cigarette, ArrowRight, ArrowLeft } from "lucide-react";
import { EditorialButton } from "@/components/ui/EditorialButton";
import { GlassBadge } from "@/components/ui/GlassBadge";

interface CohabitationQuizProps {
  initialProfile: CohabitationProfile;
  onProfileChange: (updated: CohabitationProfile) => void;
  onClose?: () => void;
}

export function CohabitationQuiz({
  initialProfile,
  onProfileChange,
  onClose,
}: CohabitationQuizProps) {
  const [vector, setVector] = useState<CohabitationVector>({ ...initialProfile.vector });
  const [dietary, setDietary] = useState<DietaryPreference>(initialProfile.dietaryPreference);
  const [smoking, setSmoking] = useState<SmokingPolicy>(initialProfile.smokingPolicy);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSaved, setIsSaved] = useState(false);

  const steps = [
    {
      id: "sleep",
      title: "1. Sleep Chronotype & Morning Rhythm",
      icon: Moon,
      dimension: "sleepChronotype" as keyof CohabitationVector,
      description: "When do your lights go out, and what time does your morning alarm ring?",
      options: [
        { val: 1, label: "5:00 AM – 9:30 PM", desc: "Extreme Early Riser / Morning Study" },
        { val: 2, label: "6:30 AM – 11:00 PM", desc: "Moderate Early / Structured Routine" },
        { val: 3, label: "8:00 AM – 12:00 AM", desc: "Balanced / Standard Professional Hours" },
        { val: 4, label: "9:30 AM – 1:30 AM", desc: "Late Sleeper / Night Study Sessions" },
        { val: 5, label: "11:00 AM – 4:00 AM", desc: "Dedicated Night Owl / Nocturnal Focus" },
      ],
    },
    {
      id: "clean",
      title: "2. Cleanliness & Hygiene Rigor",
      icon: Sparkle,
      dimension: "cleanlinessRigor" as keyof CohabitationVector,
      description: "What are your standards for shared kitchen, washroom, and common area upkeep?",
      options: [
        { val: 1, label: "Relaxed / Casual", desc: "Chores done whenever free time permits" },
        { val: 2, label: "Moderate Care", desc: "Tidied up on weekends or before visits" },
        { val: 3, label: "Scheduled Routine", desc: "Structured weekly chore rotation adhered to" },
        { val: 4, label: "High Standard", desc: "Dishes cleaned immediately, counters wiped daily" },
        { val: 5, label: "Surgical Precision", desc: "Spotless zero-clutter kitchen & washroom hygiene" },
      ],
    },
    {
      id: "noise",
      title: "3. Study Noise & Acoustic Boundary",
      icon: Volume2,
      dimension: "noiseTolerance" as keyof CohabitationVector,
      description: "How quiet does the living space need to be for your focus and calls?",
      options: [
        { val: 1, label: "Silent Sanctuary", desc: "Absolute quiet; headphones mandatory at all hours" },
        { val: 2, label: "Low Ambient", desc: "Quiet conversational tone, minimal audio bleed" },
        { val: 3, label: "Balanced Tone", desc: "Normal daytime talk, TV/podcasts at low volume" },
        { val: 4, label: "Lively Atmosphere", desc: "Background music, occasional shared media" },
        { val: 5, label: "Social Sound", desc: "Active shared entertainment, casual music sessions" },
      ],
    },
    {
      id: "guest",
      title: "4. Social Guest & Visitor Rhythm",
      icon: Users,
      dimension: "guestRhythm" as keyof CohabitationVector,
      description: "What is your comfort level with outside friends, family, or study groups visiting?",
      options: [
        { val: 1, label: "Strict Sanctuary", desc: "Zero outside visitors or overnight guests" },
        { val: 2, label: "Prior Notice Only", desc: "Occasional study peers with 24-hour advance notice" },
        { val: 3, label: "Weekend Friendly", desc: "Friends welcome on weekends for dinner/study" },
        { val: 4, label: "Open Door Rhythms", desc: "Frequent social hangouts and friendly peer drop-ins" },
        { val: 5, label: "Host Hub", desc: "Loves communal dinners, game nights, and entertaining" },
      ],
    },
    {
      id: "lifestyle",
      title: "5. Dietary, Smoking & Resource Mindset",
      icon: UtensilsCrossed,
      dimension: "lifestyleMindset" as keyof CohabitationVector,
      description: "Essential household boundaries and respect for unbundled bills and appliances.",
      options: [
        { val: 1, label: "Basic Sharing", desc: "Strictly separate groceries, utensils & supplies" },
        { val: 2, label: "Selective Split", desc: "Share only big items (salt, oil, dish soap)" },
        { val: 3, label: "Fair Cooperation", desc: "Split common grocery bills, respect quiet times" },
        { val: 4, label: "High Harmony", desc: "Collaborative, punctual bill payment, considerate" },
        { val: 5, label: "Seamless Synergy", desc: "Cook together, shared staples, proactive bill settler" },
      ],
    },
  ];

  const handleOptionSelect = (dimension: keyof CohabitationVector, val: number) => {
    const updated = { ...vector, [dimension]: val };
    setVector(updated);
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleSaveAndApply = () => {
    const updatedProfile: CohabitationProfile = {
      ...initialProfile,
      vector,
      dietaryPreference: dietary,
      smokingPolicy: smoking,
    };
    onProfileChange(updatedProfile);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      if (onClose) onClose();
    }, 1000);
  };

  const currentStepData = steps[activeStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="bg-surface border border-hairline rounded-3xl p-6 sm:p-8 shadow-card transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-hairline gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <GlassBadge variant="forest">
              Phase 4 // Algorithmic Quiz
            </GlassBadge>
            <span className="text-xs text-ink-tertiary font-sans">
              5-Dimensional Vector Space
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-ink-primary tracking-tight">
            Cohabitation Habit Assessment
          </h2>
        </div>

        {/* Step Indicator Tabs */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {steps.map((st, idx) => (
            <button
              key={st.id}
              onClick={() => setActiveStep(idx)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                idx === activeStep
                  ? "bg-forest text-canvas shadow-subtle ring-2 ring-forest/20 font-bold"
                  : vector[st.dimension]
                  ? "bg-forest-light text-forest font-semibold"
                  : "bg-muted-sand/70 text-ink-tertiary hover:text-ink-primary"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Active Step Container */}
      <div className="my-6">
        <div className="flex items-start gap-3.5 mb-5">
          <div className="p-3 rounded-2xl bg-muted-sand/80 text-forest shrink-0">
            <StepIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-ink-primary">
              {currentStepData.title}
            </h3>
            <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>
        </div>

        {/* Rating Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {currentStepData.options.map((opt) => {
            const isSelected = vector[currentStepData.dimension] === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => handleOptionSelect(currentStepData.dimension, opt.val)}
                className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-forest text-canvas border-forest shadow-hover"
                    : "bg-muted-sand/30 text-ink-primary border-hairline hover:bg-muted-sand/70 hover:border-hairline-hover"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-[10px] font-sans px-2 py-0.5 rounded-full ${
                    isSelected ? "bg-white/20 text-canvas font-semibold" : "bg-white/80 text-ink-secondary border border-hairline"
                  }`}>
                    Score {opt.val}/5
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-canvas" />}
                </div>
                <div className={`text-xs font-semibold ${isSelected ? "text-canvas" : "text-ink-primary"}`}>
                  {opt.label}
                </div>
                <div className={`text-[11px] mt-1 leading-normal ${isSelected ? "text-canvas/80" : "text-ink-secondary"}`}>
                  {opt.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dietary & Smoking Policy Constraints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-muted-sand/40 border border-hairline mb-6">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-ink-primary mb-2.5">
            <UtensilsCrossed className="w-3.5 h-3.5 text-forest" />
            Dietary Culture & Kitchen Preference:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(["halal", "vegetarian", "vegan", "non_veg", "no_preference"] as DietaryPreference[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDietary(d)}
                className={`px-3.5 py-1.5 text-xs rounded-full border transition-all ${
                  dietary === d
                    ? "bg-forest text-canvas border-forest font-medium shadow-sm"
                    : "bg-surface text-ink-secondary border-hairline hover:border-hairline-hover hover:text-ink-primary"
                }`}
              >
                {d.toUpperCase().replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-ink-primary mb-2.5">
            <Cigarette className="w-3.5 h-3.5 text-terracotta" />
            Flat Smoking Policy:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(["strictly_non_smoking", "balcony_only", "flexible"] as SmokingPolicy[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSmoking(s)}
                className={`px-3.5 py-1.5 text-xs rounded-full border transition-all ${
                  smoking === s
                    ? "bg-terracotta text-canvas border-terracotta font-medium shadow-sm"
                    : "bg-surface text-ink-secondary border-hairline hover:border-hairline-hover hover:text-ink-primary"
                }`}
              >
                {s === "strictly_non_smoking"
                  ? "100% Smoke-Free"
                  : s === "balcony_only"
                  ? "Balcony-Only OK"
                  : "Flexible"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-5 border-t border-hairline gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {activeStep > 0 && (
            <EditorialButton
              variant="outline"
              size="sm"
              onClick={() => setActiveStep(activeStep - 1)}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Dimension</span>
            </EditorialButton>
          )}
          {activeStep < steps.length - 1 && (
            <EditorialButton
              variant="outline"
              size="sm"
              onClick={() => setActiveStep(activeStep + 1)}
            >
              <span>Next Dimension</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </EditorialButton>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {isSaved && (
            <span className="flex items-center gap-1 text-xs text-forest font-semibold animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> Preferences Updated!
            </span>
          )}
          <EditorialButton
            variant="primary"
            size="md"
            onClick={handleSaveAndApply}
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Recalculate Synergy Matches</span>
          </EditorialButton>
        </div>
      </div>
    </div>
  );
}
