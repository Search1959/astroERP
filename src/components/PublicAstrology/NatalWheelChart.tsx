/**
 * Interactive SVG Natal Wheel Chart Component
 * Visualizes the 12 Zodiac signs, 12 Placidus/Whole Sign houses,
 * planetary glyphs, exact degrees, and aspect chords.
 */

import React, { useState } from 'react';
import { AstrologyChartData, PlanetPosition } from '../../types';
import { ZODIAC_SIGNS } from '../../utils/ephemerisEngine';

interface NatalWheelChartProps {
  chartData: AstrologyChartData;
  size?: number;
  interactive?: boolean;
}

export const NatalWheelChart: React.FC<NatalWheelChartProps> = ({
  chartData,
  size = 560,
  interactive = true,
}) => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetPosition | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetPosition | null>(null);

  const center = size / 2;
  const radius = size * 0.44;
  const innerRadius = size * 0.35;
  const houseInnerRadius = size * 0.22;
  const aspectRadius = size * 0.20;

  // Chart rotation so Ascendant is at 180 degrees (9 o'clock position / Eastern horizon)
  const ascendantLon = chartData.ascendant;
  const rotateToAsc = (deg: number) => {
    return (180 - (deg - ascendantLon) + 360) % 360;
  };

  const getCoordinates = (deg: number, r: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-800">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[560px] h-auto select-none transition-all duration-300"
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="wheelCenterGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#020617" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#1e1b4b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#312e81" stopOpacity="0.8" />
          </radialGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Center Background Circle */}
        <circle cx={center} cy={center} r={radius + 10} fill="url(#ringGrad)" stroke="#3730a3" strokeWidth="1.5" />
        <circle cx={center} cy={center} r={innerRadius} fill="url(#wheelCenterGrad)" stroke="#334155" strokeWidth="1" />
        <circle cx={center} cy={center} r={houseInnerRadius} fill="#020617" stroke="#1e293b" strokeWidth="1" />

        {/* 12 Zodiac Sign Segments (30° each) */}
        {ZODIAC_SIGNS.map((sign, idx) => {
          const startDeg = rotateToAsc(idx * 30);
          const endDeg = rotateToAsc((idx + 1) * 30);
          const midDeg = rotateToAsc(idx * 30 + 15);

          const p1 = getCoordinates(startDeg, radius);
          const p2 = getCoordinates(endDeg, radius);
          const p3 = getCoordinates(endDeg, innerRadius);
          const p4 = getCoordinates(startDeg, innerRadius);

          const pathD = `
            M ${p1.x} ${p1.y}
            A ${radius} ${radius} 0 0 0 ${p2.x} ${p2.y}
            L ${p3.x} ${p3.y}
            A ${innerRadius} ${innerRadius} 0 0 1 ${p4.x} ${p4.y}
            Z
          `;

          const symbolPos = getCoordinates(midDeg, (radius + innerRadius) / 2);

          return (
            <g key={sign.name} className="transition-opacity duration-200">
              <path
                d={pathD}
                fill={idx % 2 === 0 ? 'rgba(30, 27, 75, 0.6)' : 'rgba(49, 46, 129, 0.4)'}
                stroke="#4338ca"
                strokeWidth="0.75"
                className="hover:fill-indigo-700/50 cursor-pointer"
              />
              <text
                x={symbolPos.x}
                y={symbolPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={sign.color}
                fontSize={size * 0.034}
                fontWeight="bold"
                className="pointer-events-none drop-shadow"
              >
                {sign.symbol}
              </text>
            </g>
          );
        })}

        {/* 12 House Boundary Lines & Labels */}
        {chartData.houses.map((house, idx) => {
          const cuspDeg = rotateToAsc(house.cuspLongitude);
          const outerP = getCoordinates(cuspDeg, innerRadius);
          const innerP = getCoordinates(cuspDeg, houseInnerRadius);

          // Calculate middle of house for number badge
          const nextHouseCusp = chartData.houses[(idx + 1) % 12].cuspLongitude;
          const nextDeg = rotateToAsc(nextHouseCusp);
          let midDeg = (cuspDeg + nextDeg) / 2;
          if (Math.abs(cuspDeg - nextDeg) > 180) midDeg += 180;
          const numPos = getCoordinates(midDeg, (houseInnerRadius + innerRadius * 0.65) / 2);

          const isCardinalAxis = house.houseNumber === 1 || house.houseNumber === 4 || house.houseNumber === 7 || house.houseNumber === 10;

          return (
            <g key={`house-${house.houseNumber}`}>
              <line
                x1={innerP.x}
                y1={innerP.y}
                x2={outerP.x}
                y2={outerP.y}
                stroke={isCardinalAxis ? '#f59e0b' : '#475569'}
                strokeWidth={isCardinalAxis ? 1.8 : 0.8}
                strokeDasharray={isCardinalAxis ? 'none' : '2,2'}
              />
              <text
                x={numPos.x}
                y={numPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isCardinalAxis ? '#fbbf24' : '#94a3b8'}
                fontSize={size * 0.022}
                fontWeight="bold"
              >
                {house.houseNumber}
              </text>
            </g>
          );
        })}

        {/* Major Axis Labels: ASC, DSC, MC, IC */}
        {(() => {
          const ascCoord = getCoordinates(rotateToAsc(chartData.ascendant), radius + 14);
          const mcCoord = getCoordinates(rotateToAsc(chartData.midheaven), radius + 14);
          const dscCoord = getCoordinates(rotateToAsc((chartData.ascendant + 180) % 360), radius + 14);
          const icCoord = getCoordinates(rotateToAsc((chartData.midheaven + 180) % 360), radius + 14);

          return (
            <g key="major-axis-labels">
              <text x={ascCoord.x} y={ascCoord.y} textAnchor="middle" dominantBaseline="central" fill="#38bdf8" fontSize={size * 0.026} fontWeight="bold">
                ASC
              </text>
              <text x={mcCoord.x} y={mcCoord.y} textAnchor="middle" dominantBaseline="central" fill="#fbbf24" fontSize={size * 0.026} fontWeight="bold">
                MC
              </text>
              <text x={dscCoord.x} y={dscCoord.y} textAnchor="middle" dominantBaseline="central" fill="#94a3b8" fontSize={size * 0.022}>
                DSC
              </text>
              <text x={icCoord.x} y={icCoord.y} textAnchor="middle" dominantBaseline="central" fill="#94a3b8" fontSize={size * 0.022}>
                IC
              </text>
            </g>
          );
        })()}

        {/* Aspect Lines inside Center Disc */}
        {chartData.aspects.map((asp, idx) => {
          const p1 = chartData.planets.find(p => p.name === asp.planet1);
          const p2 = chartData.planets.find(p => p.name === asp.planet2);
          if (!p1 || !p2) return null;

          const c1 = getCoordinates(rotateToAsc(p1.longitude), aspectRadius);
          const c2 = getCoordinates(rotateToAsc(p2.longitude), aspectRadius);

          const isHighlighted = hoveredPlanet && (hoveredPlanet.name === p1.name || hoveredPlanet.name === p2.name);

          const strokeColor =
            asp.nature === 'Harmonious' ? '#10b981' :
            asp.nature === 'Dynamic' ? '#ef4444' :
            '#8b5cf6';

          return (
            <line
              key={`asp-${idx}`}
              x1={c1.x}
              y1={c1.y}
              x2={c2.x}
              y2={c2.y}
              stroke={strokeColor}
              strokeWidth={isHighlighted ? 2.5 : 0.8}
              strokeOpacity={isHighlighted ? 0.9 : 0.4}
              className="transition-all duration-200"
            />
          );
        })}

        {/* Planet Glyphs & Marker Dots */}
        {chartData.planets.map((planet) => {
          const planetAngle = rotateToAsc(planet.longitude);
          const markerPos = getCoordinates(planetAngle, innerRadius * 0.86);
          const dotPos = getCoordinates(planetAngle, innerRadius);

          const isHovered = hoveredPlanet?.name === planet.name;
          const isSelected = selectedPlanet?.name === planet.name;

          return (
            <g
              key={planet.name}
              className="cursor-pointer group"
              onMouseEnter={() => interactive && setHoveredPlanet(planet)}
              onMouseLeave={() => interactive && setHoveredPlanet(null)}
              onClick={() => interactive && setSelectedPlanet(isSelected ? null : planet)}
            >
              {/* Radial tick to zodiac edge */}
              <line
                x1={dotPos.x}
                y1={dotPos.y}
                x2={getCoordinates(planetAngle, innerRadius - 6).x}
                y2={getCoordinates(planetAngle, innerRadius - 6).y}
                stroke="#6366f1"
                strokeWidth={1.5}
              />

              {/* Planet Background Aura on hover */}
              {(isHovered || isSelected) && (
                <circle
                  cx={markerPos.x}
                  cy={markerPos.y}
                  r={size * 0.03}
                  fill="#4f46e5"
                  opacity={0.5}
                  filter="url(#glow)"
                />
              )}

              {/* Planet Symbol */}
              <circle
                cx={markerPos.x}
                cy={markerPos.y}
                r={size * 0.022}
                fill={isHovered || isSelected ? '#4338ca' : '#1e1b4b'}
                stroke={planet.isRetrograde ? '#f43f5e' : '#818cf8'}
                strokeWidth={1.2}
              />
              <text
                x={markerPos.x}
                y={markerPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={planet.isRetrograde ? '#fda4af' : '#e0e7ff'}
                fontSize={size * 0.026}
                fontWeight="bold"
                className="select-none"
              >
                {planet.symbol}
              </text>

              {/* Retrograde 'R' indicator */}
              {planet.isRetrograde && (
                <text
                  x={markerPos.x + 8}
                  y={markerPos.y - 7}
                  fill="#f43f5e"
                  fontSize={size * 0.016}
                  fontWeight="bold"
                >
                  ℞
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Interactive Tooltip Bar */}
      <div className="w-full mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-700 min-h-[44px]">
        {hoveredPlanet || selectedPlanet ? (
          (() => {
            const active = hoveredPlanet || selectedPlanet!;
            return (
              <div className="flex flex-wrap items-center gap-3 w-full justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base text-indigo-600 font-bold">{active.symbol}</span>
                  <span className="font-semibold text-slate-900">{active.name}</span>
                  <span className="text-slate-500">in</span>
                  <span className="font-semibold text-indigo-700">{active.sign}</span>
                  <span className="font-mono text-indigo-600">({active.formattedDegrees})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-medium">
                    House {active.house}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-medium ${
                    active.dignity === 'Rulership' || active.dignity === 'Exalted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    active.dignity === 'Fall' || active.dignity === 'Detriment' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {active.dignity}
                  </span>
                  {active.isRetrograde && (
                    <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200 font-medium">
                      Retrograde
                    </span>
                  )}
                </div>
              </div>
            );
          })()
        ) : (
          <div className="text-slate-500 flex items-center justify-between w-full">
            <span>✨ Hover over any planet glyph or house to inspect exact astronomical coordinates</span>
            <span className="text-indigo-600 font-medium">Ascendant: {chartData.interpretations.coreAscendant.sign} ({chartData.planets.find(p=>p.name==='Sun')?.sign} Sun)</span>
          </div>
        )}
      </div>
    </div>
  );
};
