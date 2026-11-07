"use client";

import React, { useState } from "react";
import { CohabitationVector, DietaryPreference, SmokingPolicy, CohabitationProfile } from "@/lib/matching";
import { Sparkles, CheckCircle2, Moon, Sparkle, Volume2, Users, UtensilsCrossed, Cigarette } from "lucide-react";

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
    }, 1200);
  };

  const currentStepData = steps[activeStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="bg-[#FAF8F5] border-2 border-[#1F302B] rounded-2xl p-6 shadow-[4px_4px_0_#1F302B]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 rounded font-semibold">
              Phase 4 // Algorithmic Quiz
            </span>
            <span className="text-xs text-stone-500 font-mono">
              Vector Space: 5 Dimensions
            </span>
          </div>
          <h2 className="text-xl font-serif font-bold text-[#1F302B] mt-1">
            5-Vector Cohabitation Questionnaire
          </h2>
        </div>

        {/* Step Indicator Tabs */}
        <div className="flex items-center gap-1.5">
          {steps.map((st, idx) => (
            <button
              key={st.id}
              onClick={() => setActiveStep(idx)}
              className={`w-7 h-7 rounded-full text-xs font-mono font-bold transition-all ${
                idx === activeStep
                  ? "bg-[#1F302B] text-white ring-2 ring-[#BD5338]"
                  : vector[st.dimension]
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-stone-200 text-stone-600"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Active Step Container */}
      <div className="my-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-300/80 text-[#BD5338]">
            <StepIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif">
              {currentStepData.title}
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              {currentStepData.description}
            </p>
          </div>
        </div>

        {/* Rating Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
          {currentStepData.options.map((opt) => {
            const isSelected = vector[currentStepData.dimension] === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => handleOptionSelect(currentStepData.dimension, opt.val)}
                className={`flex flex-col text-left p-3 rounded-xl border-2 transition-all relative ${
                  isSelected
                    ? "bg-[#1F302B] text-white border-[#1F302B] shadow-[2px_2px_0_#BD5338]"
                    : "bg-white text-stone-800 border-stone-200 hover:border-stone-400 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isSelected ? "bg-white/20 text-white font-bold" : "bg-stone-100 text-stone-600 font-medium"
                  }`}>
                    SCORE {opt.val}/5
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />}
                </div>
                <div className={`text-xs font-bold ${isSelected ? "text-white" : "text-stone-900"}`}>
                  {opt.label}
                </div>
                <div className={`text-[10px] mt-1 leading-tight ${isSelected ? "text-stone-200" : "text-stone-500"}`}>
                  {opt.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dietary & Smoking Policy Constraints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white border border-stone-200 mb-6">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-stone-900 mb-2">
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#BD5338]" />
            Dietary Culture & Kitchen Preference:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(["halal", "vegetarian", "vegan", "non_veg", "no_preference"] as DietaryPreference[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDietary(d)}
                className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                  dietary === d
                    ? "bg-[#1F302B] text-white border-[#1F302B] font-semibold"
                    : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                }`}
              >
                {d.toUpperCase().replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-stone-900 mb-2">
            <Cigarette className="w-3.5 h-3.5 text-[#BD5338]" />
            Smoking Policy in Flat:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(["strictly_non_smoking", "balcony_only", "flexible"] as SmokingPolicy[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSmoking(s)}
                className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                  smoking === s
                    ? "bg-[#BD5338] text-white border-[#BD5338] font-semibold"
                    : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
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
      <div className="flex items-center justify-between pt-4 border-t border-stone-200">
        <div className="flex items-center gap-2">
          {activeStep > 0 && (
            <button
              type="button"
              onClick={() => setActiveStep(activeStep - 1)}
              className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50"
            >
              ← Previous Dimension
            </button>
          )}
          {activeStep < steps.length - 1 && (
            <button
              type="button"
              onClick={() => setActiveStep(activeStep + 1)}
              className="px-3.5 py-1.5 text-xs font-semibold text-stone-900 bg-amber-100 border border-amber-300 rounded-lg hover:bg-amber-200"
            >
              Next Dimension →
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isSaved && (
            <span className="flex items-center gap-1 text-xs text-emerald-700 font-bold animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> Vector Profile Saved!
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveAndApply}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#1F302B] rounded-xl border border-[#1F302B] shadow-[2px_2px_0_#BD5338] hover:bg-[#2C4A3E] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Recalculate Synergy Matches
          </button>
        </div>
      </div>
    </div>
  );
}
