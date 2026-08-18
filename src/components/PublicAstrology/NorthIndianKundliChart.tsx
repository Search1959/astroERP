/**
 * High-Precision North Indian Vedic Kundali (Lagna Chart) SVG Visualizer
 * Accurately plots all 12 Bhavas (Houses), Rashi numbers (1-12),
 * and placed Grahas with Glyphs, Retrogression flags, and House Karakatwas.
 */

import React, { useState } from 'react';
import { AstrologyChartData, PlanetPosition } from '../../types';
import { ZODIAC_SIGNS } from '../../utils/ephemerisEngine';
import { LanguageCode, getPlanetName, getSignName, getTranslation } from '../../utils/indianLanguages';
import { Sparkles, Info } from 'lucide-react';

interface NorthIndianKundliChartProps {
  chartData: AstrologyChartData;
  size?: number;
  selectedLanguage?: LanguageCode;
  className?: string;
  onSelectHouse?: (houseNum: number) => void;
}

// Vedic House Significations (Karakatwas)
const HOUSE_SIGNIFICATIONS: Record<number, { title: string; hindi: string; significations: string; karaka: string }> = {
  1: { title: 'Tanu Bhava (Self / Lagna)', hindi: 'तनु भाव (लग्न)', significations: 'Physical Body, Character, Longevity, General Vitality', karaka: 'Sun' },
  2: { title: 'Dhana Bhava (Wealth / Kutumba)', hindi: 'धन भाव (कुटुम्ब)', significations: 'Family Wealth, Speech, Lineage, Food, Face, Eyes', karaka: 'Jupiter' },
  3: { title: 'Bhratri Bhava (Courage / Siblings)', hindi: 'भ्रातृ भाव (पराक्रम)', significations: 'Courage, Younger Siblings, Short Journeys, Communication', karaka: 'Mars' },
  4: { title: 'Matru Bhava (Mother / Happiness)', hindi: 'मातृ भाव (सुख)', significations: 'Mother, Conveyances, Real Estate, Inner Peace, Home', karaka: 'Moon' },
  5: { title: 'Putra Bhava (Children / Intellect)', hindi: 'पुत्र भाव (बुद्धि)', significations: 'Intelligence, Progeny, Purva Punya, Speculation, Creativity', karaka: 'Jupiter' },
  6: { title: 'Shatru Bhava (Enemies / Health)', hindi: 'शत्रु भाव (रोग/ऋण)', significations: 'Debts, Diseases, Legal Battles, Service, Daily Routine', karaka: 'Mars / Saturn' },
  7: { title: 'Jaya Bhava (Spouse / Partnership)', hindi: 'जाया भाव (विवाह)', significations: 'Spouse, Marriage, Business Partnerships, Public Standing', karaka: 'Venus' },
  8: { title: 'Ayu Bhava (Longevity / Occult)', hindi: 'आयु भाव (मृत्यु/गूढ़)', significations: 'Longevity, Sudden Events, Inheritance, Mysticism, Transformation', karaka: 'Saturn' },
  9: { title: 'Dharma Bhava (Fortune / Father)', hindi: 'धर्म भाव (भाग्य)', significations: 'Higher Wisdom, Guru, Father, Pilgrimage, Fortune, Morality', karaka: 'Jupiter / Sun' },
  10: { title: 'Karma Bhava (Career / Profession)', hindi: 'कर्म भाव (व्यवसाय)', significations: 'Status, Honor, Profession, Authority, Government Relations', karaka: 'Sun / Mercury' },
  11: { title: 'Labha Bhava (Gains / Fulfillment)', hindi: 'लाभ भाव (आय)', significations: 'Income, Cash Flow, Elder Siblings, Aspirations, Social Circle', karaka: 'Jupiter' },
  12: { title: 'Vyaya Bhava (Expenditure / Moksha)', hindi: 'व्यय भाव (मोक्ष)', significations: 'Foreign Travels, Spiritual Liberation, Secret Expenses, Sleep', karaka: 'Saturn / Ketu' },
};

export const NorthIndianKundliChart: React.FC<NorthIndianKundliChartProps> = ({
  chartData,
  size = 360,
  selectedLanguage = 'en',
  className = '',
  onSelectHouse,
}) => {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(1);

  // Determine Ascendant Sign Index (0 = Aries, 1 = Taurus, ... 11 = Pisces)
  const ascSignName = chartData.interpretations?.coreAscendant?.sign || 'Aries';
  const ascSignIndex = Math.max(
    0,
    ZODIAC_SIGNS.findIndex(s => s.name.toLowerCase() === ascSignName.toLowerCase())
  );

  // North Indian layout: Fixed House geometry on 360x360 SVG
  // House 1 is always Top Diamond
  // Rashi Number for house H (1..12) = ((ascSignIndex + H - 1) % 12) + 1
  const getRashiForHouse = (h: number) => {
    return ((ascSignIndex + (h - 1)) % 12) + 1;
  };

  // House Coordinates & Text Anchor Positions in SVG 360x360
  const houseData: Record<
    number,
    {
      polygonPoints: string;
      rashiPos: { x: number; y: number };
      planetAnchor: { x: number; y: number };
      houseNumberPos: { x: number; y: number };
    }
  > = {
    1: {
      polygonPoints: '180,0 270,90 180,180 90,90',
      rashiPos: { x: 180, y: 120 },
      planetAnchor: { x: 180, y: 70 },
      houseNumberPos: { x: 180, y: 35 },
    },
    2: {
      polygonPoints: '0,0 180,0 90,90',
      rashiPos: { x: 120, y: 40 },
      planetAnchor: { x: 75, y: 45 },
      houseNumberPos: { x: 30, y: 25 },
    },
    3: {
      polygonPoints: '0,0 0,180 90,90',
      rashiPos: { x: 40, y: 120 },
      planetAnchor: { x: 45, y: 75 },
      houseNumberPos: { x: 25, y: 30 },
    },
    4: {
      polygonPoints: '0,180 90,90 180,180 90,270',
      rashiPos: { x: 120, y: 180 },
      planetAnchor: { x: 70, y: 180 },
      houseNumberPos: { x: 35, y: 180 },
    },
    5: {
      polygonPoints: '0,180 0,360 90,270',
      rashiPos: { x: 40, y: 240 },
      planetAnchor: { x: 45, y: 285 },
      houseNumberPos: { x: 25, y: 330 },
    },
    6: {
      polygonPoints: '0,360 180,360 90,270',
      rashiPos: { x: 120, y: 320 },
      planetAnchor: { x: 75, y: 315 },
      houseNumberPos: { x: 30, y: 335 },
    },
    7: {
      polygonPoints: '180,180 270,270 180,360 90,270',
      rashiPos: { x: 180, y: 240 },
      planetAnchor: { x: 180, y: 290 },
      houseNumberPos: { x: 180, y: 325 },
    },
    8: {
      polygonPoints: '180,360 360,360 270,270',
      rashiPos: { x: 240, y: 320 },
      planetAnchor: { x: 285, y: 315 },
      houseNumberPos: { x: 330, y: 335 },
    },
    9: {
      polygonPoints: '360,180 360,360 270,270',
      rashiPos: { x: 320, y: 240 },
      planetAnchor: { x: 315, y: 285 },
      houseNumberPos: { x: 335, y: 330 },
    },
    10: {
      polygonPoints: '180,180 270,90 360,180 270,270',
      rashiPos: { x: 240, y: 180 },
      planetAnchor: { x: 290, y: 180 },
      houseNumberPos: { x: 325, y: 180 },
    },
    11: {
      polygonPoints: '360,0 360,180 270,90',
      rashiPos: { x: 320, y: 120 },
      planetAnchor: { x: 315, y: 75 },
      houseNumberPos: { x: 335, y: 30 },
    },
    12: {
      polygonPoints: '180,0 360,0 270,90',
      rashiPos: { x: 240, y: 40 },
      planetAnchor: { x: 285, y: 45 },
      houseNumberPos: { x: 330, y: 25 },
    },
  };

  // Group planets by house (1..12)
  const planetsByHouse: Record<number, PlanetPosition[]> = {};
  for (let h = 1; h <= 12; h++) {
    planetsByHouse[h] = [];
  }

  chartData.planets.forEach(p => {
    const h = p.house || 1;
    if (planetsByHouse[h]) {
      planetsByHouse[h].push(p);
    }
  });

  const getPlanetAbbr = (name: string) => {
    switch (name) {
      case 'Sun': return 'Su';
      case 'Moon': return 'Mo';
      case 'Mars': return 'Ma';
      case 'Mercury': return 'Me';
      case 'Jupiter': return 'Ju';
      case 'Venus': return 'Ve';
      case 'Saturn': return 'Sa';
      case 'Rahu':
      case 'North Node': return 'Ra';
      case 'Ketu':
      case 'South Node': return 'Ke';
      case 'Uranus': return 'Ur';
      case 'Neptune': return 'Ne';
      case 'Pluto': return 'Pl';
      default: return name.slice(0, 2);
    }
  };

  const handleHouseClick = (h: number) => {
    setSelectedHouse(h);
    if (onSelectHouse) onSelectHouse(h);
  };

  const activeHouseDetails = selectedHouse ? HOUSE_SIGNIFICATIONS[selectedHouse] : null;
  const activeHouseRashiNum = selectedHouse ? getRashiForHouse(selectedHouse) : 1;
  const activeHouseSign = ZODIAC_SIGNS[activeHouseRashiNum - 1];
  const activeHousePlanets = selectedHouse ? planetsByHouse[selectedHouse] || [] : [];

  return (
    <div className={`flex flex-col items-center select-none font-sans ${className}`}>
      {/* Chart Canvas Card */}
      <div className="w-full max-w-[360px] bg-[#0e0307] p-2 sm:p-3 rounded-3xl border border-red-950/80 shadow-2xl relative">
        <div className="flex items-center justify-between px-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit',sans-serif]">
              Lagna Kundali (लग्न चक्र)
            </span>
          </div>
          <span className="text-[10px] font-semibold text-orange-400 font-mono">
            {chartData.zodiacSystem === 'sidereal_lahiri' ? 'Lahiri Sidereal' : 'Tropical'}
          </span>
        </div>

        {/* SVG Vedic Chart Diagram */}
        <div className="relative w-full aspect-square flex items-center justify-center">
          <svg
            viewBox="0 0 360 360"
            className="w-full h-full drop-shadow-md transition-all duration-300"
          >
            <defs>
              <linearGradient id="houseGradNorm" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#120408" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#1a060e" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="houseGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b0d18" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#5c1524" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* Base Background */}
            <rect x="0" y="0" width="360" height="360" fill="#0c0205" rx="16" />

            {/* Interactive House Polygons */}
            {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const).map(h => {
              const data = houseData[h];
              const isSelected = selectedHouse === h;
              const rashiNum = getRashiForHouse(h);
              const planetsInThisHouse = planetsByHouse[h] || [];

              return (
                <g
                  key={h}
                  onClick={() => handleHouseClick(h)}
                  className="cursor-pointer transition-all duration-200"
                >
                  <polygon
                    points={data.polygonPoints}
                    fill={isSelected ? 'url(#houseGradActive)' : 'url(#houseGradNorm)'}
                    stroke={isSelected ? '#f97316' : '#7f1d1d'}
                    strokeWidth={isSelected ? '2.5' : '1.2'}
                    className="hover:fill-[#2d0912] transition-colors"
                  />

                  {/* Rashi Number in Orange/Gold */}
                  <text
                    x={data.rashiPos.x}
                    y={data.rashiPos.y}
                    fill="#fb923c"
                    fontSize="13"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-mono select-none"
                  >
                    {rashiNum}
                  </text>

                  {/* Ascendant Flag in House 1 */}
                  {h === 1 && (
                    <text
                      x={data.planetAnchor.x}
                      y={data.planetAnchor.y - 14}
                      fill="#38bdf8"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      Asc ({getSignName(ascSignName, selectedLanguage).split(' ')[0]})
                    </text>
                  )}

                  {/* Planets Placed in this House */}
                  {planetsInThisHouse.length > 0 && (
                    <g transform={`translate(${data.planetAnchor.x}, ${data.planetAnchor.y})`}>
                      {planetsInThisHouse.slice(0, 4).map((p, pIdx) => {
                        const offsetStep = 13;
                        const yOffset = (pIdx - (Math.min(planetsInThisHouse.length, 4) - 1) / 2) * offsetStep;
                        const isRetro = p.isRetrograde;
                        const isExalted = p.dignity === 'Exalted';
                        const isDebilitated = p.dignity === 'Fall';

                        let color = '#fef08a'; // Bright Amber
                        if (p.name === 'Sun') color = '#fb923c';
                        else if (p.name === 'Moon') color = '#e0e7ff';
                        else if (p.name === 'Mars') color = '#f87171';
                        else if (p.name === 'Jupiter') color = '#facc15';
                        else if (p.name === 'Venus') color = '#f472b6';
                        else if (p.name === 'Saturn') color = '#94a3b8';
                        else if (p.name.includes('Node') || p.name === 'Rahu' || p.name === 'Ketu') color = '#a855f7';

                        return (
                          <text
                            key={p.name}
                            x="0"
                            y={yOffset}
                            fill={color}
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="font-sans drop-shadow-xs"
                          >
                            {getPlanetAbbr(p.name)}
                            {isRetro && <tspan fill="#f43f5e" fontSize="8" fontWeight="bold">®</tspan>}
                            {isExalted && <tspan fill="#34d399" fontSize="8">↑</tspan>}
                            {isDebilitated && <tspan fill="#f87171" fontSize="8">↓</tspan>}
                          </text>
                        );
                      })}
                    </g>
                  )}
                </g>
              );
            })}

            {/* Inner Kundali Structural Frame Accent Lines */}
            <line x1="0" y1="0" x2="360" y2="360" stroke="#7f1d1d" strokeWidth="1.5" />
            <line x1="360" y1="0" x2="0" y2="360" stroke="#7f1d1d" strokeWidth="1.5" />
            <polygon points="180,0 360,180 180,360 0,180" fill="none" stroke="#ea580c" strokeWidth="1.8" />
            <rect x="0" y="0" width="360" height="360" fill="none" stroke="#991b1b" strokeWidth="2.5" rx="16" />
          </svg>
        </div>

        {/* Selected House Explanatory Footer */}
        {selectedHouse && activeHouseDetails && (
          <div className="mt-3 p-3 bg-[#16050b] rounded-2xl border border-red-900/60 text-xs space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-orange-600/30 text-orange-400 font-mono text-[11px] font-bold flex items-center justify-center border border-orange-500/50">
                  {selectedHouse}
                </span>
                <strong className="text-white font-['Outfit',sans-serif]">
                  {activeHouseDetails.title}
                </strong>
              </div>
              <span className="text-amber-300 font-bold font-mono">
                {activeHouseRashiNum}. {activeHouseSign.name} ({activeHouseSign.symbol})
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">
              {activeHouseDetails.significations}
            </p>

            <div className="flex flex-wrap items-center justify-between pt-1 border-t border-red-950/80 text-[10px] text-slate-400">
              <span>Lord: <strong className="text-orange-300">{activeHouseSign.ruler}</strong></span>
              <span>Karaka: <strong className="text-amber-300">{activeHouseDetails.karaka}</strong></span>
              <span>
                Planets:{' '}
                <strong className="text-emerald-300">
                  {activeHousePlanets.length > 0
                    ? activeHousePlanets.map(p => `${p.name} (${p.formattedDegrees})`).join(', ')
                    : 'None (Vacant)'}
                </strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
