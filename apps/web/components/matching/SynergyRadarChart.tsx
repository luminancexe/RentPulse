"use client";

import React, { useState } from "react";
import { RadarPoint, RADAR_AXES } from "@/lib/matching";

interface SynergyRadarChartProps {
  radarPoints: RadarPoint[];
  userName?: string;
  candidateName?: string;
  size?: number;
  showDeltas?: boolean;
}

export function SynergyRadarChart({
  radarPoints,
  userName = "You",
  candidateName = "Candidate",
  size = 320,
  showDeltas = true,
}: SynergyRadarChartProps) {
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);

  const center = 160;
  const maxRadius = 100;
  const numAxes = 5;

  // Compute background concentric pentagon rings at 20%, 40%, 60%, 80%, 100%
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const gridPolygons = gridLevels.map((lvl) => {
    const pts = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / numAxes;
      const r = lvl * maxRadius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  });

  // Calculate polygon points for Candidate
  const candidatePolygon = radarPoints
    .map((p) => {
      const angle = -Math.PI / 2 + (radarPoints.indexOf(p) * 2 * Math.PI) / numAxes;
      const r = (p.candidateValue / 5) * maxRadius;
      return `${(center + r * Math.cos(angle)).toFixed(1)},${(center + r * Math.sin(angle)).toFixed(1)}`;
    })
    .join(" ");

  // Calculate polygon points for User
  const userPolygon = radarPoints
    .map((p) => {
      const angle = -Math.PI / 2 + (radarPoints.indexOf(p) * 2 * Math.PI) / numAxes;
      const r = (p.userValue / 5) * maxRadius;
      return `${(center + r * Math.cos(angle)).toFixed(1)},${(center + r * Math.sin(angle)).toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 320 320"
          className="w-full h-full overflow-visible select-none"
        >
          {/* Subtle Circular Glow */}
          <circle cx={center} cy={center} r={maxRadius} fill="#FAF8F5" />

          {/* Concentric Pentagon Webs */}
          {gridPolygons.map((pts, idx) => (
            <polygon
              key={`web-${idx}`}
              points={pts}
              fill={idx % 2 === 0 ? "rgba(31, 48, 43, 0.02)" : "transparent"}
              stroke="rgba(28, 26, 23, 0.12)"
              strokeWidth={idx === gridPolygons.length - 1 ? "1.5" : "0.75"}
              strokeDasharray={idx === gridPolygons.length - 1 ? undefined : "3 3"}
            />
          ))}

          {/* Axis Spoke Lines */}
          {radarPoints.map((p, idx) => {
            const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / numAxes;
            const x2 = center + maxRadius * Math.cos(angle);
            const y2 = center + maxRadius * Math.sin(angle);
            const isHovered = hoveredAxis === p.axis;

            return (
              <g key={`spoke-${idx}`}>
                <line
                  x1={center}
                  y1={center}
                  x2={x2}
                  y2={y2}
                  stroke={isHovered ? "#BD5338" : "rgba(28, 26, 23, 0.18)"}
                  strokeWidth={isHovered ? "1.8" : "1"}
                  className="transition-colors duration-150"
                />
              </g>
            );
          })}

          {/* User Polygon (Forest Green fill) */}
          <polygon
            points={userPolygon}
            fill="rgba(31, 48, 43, 0.22)"
            stroke="#1F302B"
            strokeWidth="2"
            strokeDasharray="4 2"
            className="transition-all duration-300"
          />

          {/* Candidate Polygon (Terracotta fill) */}
          <polygon
            points={candidatePolygon}
            fill="rgba(189, 83, 56, 0.32)"
            stroke="#BD5338"
            strokeWidth="2.2"
            className="transition-all duration-300"
          />

          {/* Interactive Vertex Dots */}
          {radarPoints.map((p, idx) => {
            const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / numAxes;
            const rU = (p.userValue / 5) * maxRadius;
            const rC = (p.candidateValue / 5) * maxRadius;
            const xU = center + rU * Math.cos(angle);
            const yU = center + rU * Math.sin(angle);
            const xC = center + rC * Math.cos(angle);
            const yC = center + rC * Math.sin(angle);

            return (
              <g key={`dots-${idx}`}>
                {/* User Dot */}
                <circle
                  cx={xU}
                  cy={yU}
                  r={3.5}
                  fill="#1F302B"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                {/* Candidate Dot */}
                <circle
                  cx={xC}
                  cy={yC}
                  r={4.5}
                  fill="#BD5338"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* Axis Labels Around Outer Perimeter */}
          {radarPoints.map((p, idx) => {
            const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / numAxes;
            const labelRadius = maxRadius + 24;
            const xL = center + labelRadius * Math.cos(angle);
            const yL = center + labelRadius * Math.sin(angle);
            const isHovered = hoveredAxis === p.axis;

            let textAnchor: "middle" | "start" | "end" = "middle";
            if (Math.cos(angle) > 0.3) textAnchor = "start";
            else if (Math.cos(angle) < -0.3) textAnchor = "end";

            return (
              <g
                key={`label-${idx}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredAxis(p.axis)}
                onMouseLeave={() => setHoveredAxis(null)}
              >
                <text
                  x={xL}
                  y={yL}
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                  fontSize="10"
                  fontWeight={isHovered ? "700" : "600"}
                  fill={isHovered ? "#BD5338" : "#1C1A17"}
                  className="transition-colors duration-150 font-sans tracking-wide"
                >
                  {p.label} ({p.candidateValue}/5)
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Sync Metric */}
      <div className="flex items-center justify-center gap-6 mt-2 text-xs font-medium text-stone-700">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1F302B] ring-2 ring-stone-200" />
          <span>{userName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#BD5338] ring-2 ring-orange-200" />
          <span>{candidateName}</span>
        </div>
      </div>

      {/* Dimension Delta Metrics */}
      {showDeltas && (
        <div className="grid grid-cols-5 gap-1.5 w-full mt-4 pt-3 border-t border-stone-200/80 text-center">
          {radarPoints.map((p, idx) => {
            const delta = p.delta;
            const isMatch = delta <= 1;
            return (
              <div
                key={`metric-${idx}`}
                className={`py-1.5 px-1 rounded-md text-[10px] transition-all ${
                  hoveredAxis === p.axis
                    ? "bg-amber-100/70 ring-1 ring-amber-300"
                    : isMatch
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200/60"
                    : "bg-stone-50 text-stone-600 border border-stone-200"
                }`}
                onMouseEnter={() => setHoveredAxis(p.axis)}
                onMouseLeave={() => setHoveredAxis(null)}
              >
                <div className="font-semibold truncate">{p.label}</div>
                <div className="text-[11px] font-bold mt-0.5">
                  {p.userValue} vs {p.candidateValue}
                </div>
                <div className={`text-[9px] font-mono ${delta === 0 ? "text-emerald-700 font-bold" : delta <= 1 ? "text-emerald-600" : "text-amber-700"}`}>
                  {delta === 0 ? "✓ EXACT" : delta === 1 ? "±1 CLOSE" : `Δ ${delta}`}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
