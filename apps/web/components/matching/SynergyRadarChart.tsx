"use client";

import React, { useState } from "react";
import { RadarPoint } from "@/lib/matching";

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

  // Concentric pentagon rings
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

  // Calculate polygon points for Candidate (Terracotta #BD5338)
  const candidatePolygon = radarPoints
    .map((p) => {
      const angle = -Math.PI / 2 + (radarPoints.indexOf(p) * 2 * Math.PI) / numAxes;
      const r = (p.candidateValue / 5) * maxRadius;
      return `${(center + r * Math.cos(angle)).toFixed(1)},${(center + r * Math.sin(angle)).toFixed(1)}`;
    })
    .join(" ");

  // Calculate polygon points for User (Forest #2C4A3E)
  const userPolygon = radarPoints
    .map((p) => {
      const angle = -Math.PI / 2 + (radarPoints.indexOf(p) * 2 * Math.PI) / numAxes;
      const r = (p.userValue / 5) * maxRadius;
      return `${(center + r * Math.cos(angle)).toFixed(1)},${(center + r * Math.sin(angle)).toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 320 320"
          className="w-full h-full overflow-visible"
        >
          {/* Subtle Circular Canvas Surface */}
          <circle cx={center} cy={center} r={maxRadius + 4} fill="#F9F6F0" opacity={0.6} />

          {/* Concentric Pentagon Webs */}
          {gridPolygons.map((pts, idx) => (
            <polygon
              key={`web-${idx}`}
              points={pts}
              fill={idx % 2 === 0 ? "rgba(44, 74, 62, 0.02)" : "transparent"}
              stroke="rgba(28, 26, 23, 0.10)"
              strokeWidth={idx === gridPolygons.length - 1 ? "1.2" : "0.7"}
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
              <line
                key={`spoke-${idx}`}
                x1={center}
                y1={center}
                x2={x2}
                y2={y2}
                stroke={isHovered ? "#BD5338" : "rgba(28, 26, 23, 0.12)"}
                strokeWidth={isHovered ? "1.5" : "0.8"}
                className="transition-colors duration-200"
              />
            );
          })}

          {/* User Polygon (Forest #2C4A3E) */}
          <polygon
            points={userPolygon}
            fill="rgba(44, 74, 62, 0.20)"
            stroke="#2C4A3E"
            strokeWidth="1.8"
            strokeDasharray="4 2"
            className="transition-all duration-300"
          />

          {/* Candidate Polygon (Terracotta #BD5338) */}
          <polygon
            points={candidatePolygon}
            fill="rgba(189, 83, 56, 0.25)"
            stroke="#BD5338"
            strokeWidth="2"
            className="transition-all duration-300"
          />

          {/* Vertex Dots */}
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
                <circle
                  cx={xU}
                  cy={yU}
                  r={3}
                  fill="#2C4A3E"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <circle
                  cx={xC}
                  cy={yC}
                  r={4}
                  fill="#BD5338"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* Perimeter Labels */}
          {radarPoints.map((p, idx) => {
            const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / numAxes;
            const labelRadius = maxRadius + 22;
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
                  fontWeight={isHovered ? "600" : "500"}
                  fill={isHovered ? "#BD5338" : "#736B64"}
                  className="transition-colors duration-150 font-sans tracking-tight"
                >
                  {p.label} <tspan fill="#1C1A17" fontWeight="600">({p.candidateValue}/5)</tspan>
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-1 text-xs text-ink-secondary font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-forest ring-2 ring-forest-light" />
          <span>{userName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-terracotta ring-2 ring-terracotta-light" />
          <span>{candidateName}</span>
        </div>
      </div>

      {/* Dimension Delta Badges */}
      {showDeltas && (
        <div className="grid grid-cols-5 gap-2 w-full mt-4 pt-3 border-t border-hairline text-center">
          {radarPoints.map((p, idx) => {
            const delta = p.delta;
            const isMatch = delta <= 1;
            return (
              <div
                key={`metric-${idx}`}
                className={`py-2 px-1 rounded-xl text-[10px] transition-all border ${
                  hoveredAxis === p.axis
                    ? "bg-terracotta-light border-terracotta/30 text-terracotta"
                    : isMatch
                    ? "bg-forest-light/60 text-forest border-forest/15"
                    : "bg-muted-sand/50 text-ink-secondary border-hairline"
                }`}
                onMouseEnter={() => setHoveredAxis(p.axis)}
                onMouseLeave={() => setHoveredAxis(null)}
              >
                <div className="font-medium truncate text-ink-primary">{p.label}</div>
                <div className="text-[11px] font-semibold mt-0.5 text-ink-primary">
                  {p.userValue} vs {p.candidateValue}
                </div>
                <div className={`text-[9px] font-sans font-medium mt-0.5 ${delta === 0 ? "text-forest font-semibold" : delta <= 1 ? "text-forest" : "text-terracotta"}`}>
                  {delta === 0 ? "✓ Synchronized" : delta === 1 ? "±1 Compatible" : `Δ ${delta} Shift`}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
