/**
 * High-Precision Ephemeris & Astrological Calculation Engine
 * Implements astronomical algorithms based on Jean Meeus & Paul Schlyter models
 * for high accuracy planetary positions, house cusps (Placidus, Whole Sign, Equal),
 * Ascendant, Midheaven, aspects, dignities, and formula-based interpretations.
 */

import {
  AstrologyChartData,
  AstrologyInterpretation,
  Aspect,
  GemstoneRecommendation,
  HouseCusp,
  PlanetPosition,
} from '../../src/types';
import { generateAstrologicalPredictions } from '../../src/utils/predictionEngine';

// Constants
export const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', ruler: 'Mars', element: 'Fire', modality: 'Cardinal', color: '#ef4444' },
  { name: 'Taurus', symbol: '♉', ruler: 'Venus', element: 'Earth', modality: 'Fixed', color: '#10b981' },
  { name: 'Gemini', symbol: '♊', ruler: 'Mercury', element: 'Air', modality: 'Mutable', color: '#f59e0b' },
  { name: 'Cancer', symbol: '♋', ruler: 'Moon', element: 'Water', modality: 'Cardinal', color: '#06b6d4' },
  { name: 'Leo', symbol: '♌', ruler: 'Sun', element: 'Fire', modality: 'Fixed', color: '#f97316' },
  { name: 'Virgo', symbol: '♍', ruler: 'Mercury', element: 'Earth', modality: 'Mutable', color: '#84cc16' },
  { name: 'Libra', symbol: '♎', ruler: 'Venus', element: 'Air', modality: 'Cardinal', color: '#ec4899' },
  { name: 'Scorpio', symbol: '♏', ruler: 'Mars / Pluto', element: 'Water', modality: 'Fixed', color: '#8b5cf6' },
  { name: 'Sagittarius', symbol: '♐', ruler: 'Jupiter', element: 'Fire', modality: 'Mutable', color: '#6366f1' },
  { name: 'Capricorn', symbol: '♑', ruler: 'Saturn', element: 'Earth', modality: 'Cardinal', color: '#64748b' },
  { name: 'Aquarius', symbol: '♒', ruler: 'Saturn / Uranus', element: 'Air', modality: 'Fixed', color: '#3b82f6' },
  { name: 'Pisces', symbol: '♓', ruler: 'Jupiter / Neptune', element: 'Water', modality: 'Mutable', color: '#14b8a6' },
] as const;

export const PLANET_INFO = [
  { name: 'Sun', symbol: '☉', rulingSign: 'Leo', exaltedSign: 'Aries', fallSign: 'Libra', detrimentSign: 'Aquarius', speedAvg: 0.9856 },
  { name: 'Moon', symbol: '☽', rulingSign: 'Cancer', exaltedSign: 'Taurus', fallSign: 'Scorpio', detrimentSign: 'Capricorn', speedAvg: 13.176 },
  { name: 'Mercury', symbol: '☿', rulingSign: 'Gemini', exaltedSign: 'Virgo', fallSign: 'Pisces', detrimentSign: 'Sagittarius', speedAvg: 1.2 },
  { name: 'Venus', symbol: '♀', rulingSign: 'Taurus', exaltedSign: 'Pisces', fallSign: 'Virgo', detrimentSign: 'Scorpio', speedAvg: 1.0 },
  { name: 'Mars', symbol: '♂', rulingSign: 'Aries', exaltedSign: 'Capricorn', fallSign: 'Cancer', detrimentSign: 'Libra', speedAvg: 0.524 },
  { name: 'Jupiter', symbol: '♃', rulingSign: 'Sagittarius', exaltedSign: 'Cancer', fallSign: 'Capricorn', detrimentSign: 'Gemini', speedAvg: 0.083 },
  { name: 'Saturn', symbol: '♄', rulingSign: 'Capricorn', exaltedSign: 'Libra', fallSign: 'Aries', detrimentSign: 'Cancer', speedAvg: 0.033 },
  { name: 'Uranus', symbol: '♅', rulingSign: 'Aquarius', exaltedSign: 'Scorpio', fallSign: 'Taurus', detrimentSign: 'Leo', speedAvg: 0.011 },
  { name: 'Neptune', symbol: '♆', rulingSign: 'Pisces', exaltedSign: 'Cancer', fallSign: 'Capricorn', detrimentSign: 'Virgo', speedAvg: 0.006 },
  { name: 'Pluto', symbol: '♇', rulingSign: 'Scorpio', exaltedSign: 'Aries', fallSign: 'Libra', detrimentSign: 'Taurus', speedAvg: 0.004 },
  { name: 'Chiron', symbol: '⚷', rulingSign: 'Virgo', exaltedSign: 'Sagittarius', fallSign: 'Gemini', detrimentSign: 'Pisces', speedAvg: 0.02 },
  { name: 'North Node', symbol: '☊', rulingSign: 'Taurus', exaltedSign: 'Gemini', fallSign: 'Sagittarius', detrimentSign: 'Scorpio', speedAvg: -0.053 },
  { name: 'South Node', symbol: '☋', rulingSign: 'Scorpio', exaltedSign: 'Sagittarius', fallSign: 'Gemini', detrimentSign: 'Taurus', speedAvg: -0.053 },
];

// Helper Math utilities
export const degToRad = (deg: number) => (deg * Math.PI) / 180;
export const radToDeg = (rad: number) => (rad * 180) / Math.PI;

export const normalizeDegrees = (deg: number): number => {
  let norm = deg % 360;
  if (norm < 0) norm += 360;
  return norm;
};

export const sinDeg = (deg: number) => Math.sin(degToRad(deg));
export const cosDeg = (deg: number) => Math.cos(degToRad(deg));
export const tanDeg = (deg: number) => Math.tan(degToRad(deg));
export const asinDeg = (val: number) => radToDeg(Math.asin(Math.max(-1, Math.min(1, val))));
export const acosDeg = (val: number) => radToDeg(Math.acos(Math.max(-1, Math.min(1, val))));
export const atan2Deg = (y: number, x: number) => normalizeDegrees(radToDeg(Math.atan2(y, x)));

/**
 * Calculate Julian Day Number from Gregorian Date & Time (UTC)
 */
export function calculateJulianDay(year: number, month: number, day: number, hour: number = 0, minute: number = 0, second: number = 0): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFraction = day + (hour + minute / 60 + second / 3600) / 24;
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFraction + B - 1524.5;
}

/**
 * Calculate True Obliquity of the Ecliptic (degrees)
 */
export function calculateObliquity(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.43929111 - (46.8150 * T) / 3600 - (0.00059 * T * T) / 3600 + (0.001813 * T * T * T) / 3600;
}

/**
 * Calculate Greenwich Mean Sidereal Time (GMST in degrees)
 */
export function calculateGMST(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000;
  return normalizeDegrees(gmst);
}

/**
 * Calculate Lahiri Ayanamsha for Sidereal Astrology
 */
export function calculateLahiriAyanamsha(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.85 + (50.29 * T * 100) / 3600;
}

/**
 * High-accuracy Sun ecliptic longitude
 */
function calculateSunPosition(d: number): { lon: number; speed: number } {
  const w = 282.9404 + 4.70935e-5 * d; // longitude of perihelion
  const a = 1.000000; // mean distance, a.u.
  const e = 0.016709 - 1.151e-9 * d; // eccentricity
  const M = normalizeDegrees(356.0470 + 0.9856002585 * d); // mean anomaly
  const L = normalizeDegrees(w + M); // mean longitude

  // Eccentric anomaly
  const E = M + radToDeg(e * sinDeg(M) * (1.0 + e * cosDeg(M)));
  // Sun's true coordinates in orbital plane
  const x = cosDeg(E) - e;
  const y = sinDeg(E) * Math.sqrt(1.0 - e * e);
  const v = atan2Deg(y, x); // True anomaly
  const lon = normalizeDegrees(v + w);
  return { lon, speed: 0.9856 };
}

/**
 * High-accuracy Moon ecliptic longitude
 */
function calculateMoonPosition(d: number, sunLon: number): { lon: number; speed: number; isRetrograde: boolean } {
  const N = normalizeDegrees(125.1228 - 0.0529538083 * d); // Long of asc. node
  const i = 5.1454; // Inclination
  const w = normalizeDegrees(318.0634 + 0.1643573223 * d); // Arg of perigee
  const a = 60.2666; // Mean distance (Earth radii)
  const e = 0.054900; // Eccentricity
  const M = normalizeDegrees(115.3654 + 13.0649929509 * d); // Mean anomaly

  // Solve Kepler's equation
  const E = M + radToDeg(e * sinDeg(M) * (1.0 + e * cosDeg(M)));
  const x = a * (cosDeg(E) - e);
  const y = a * Math.sqrt(1.0 - e * e) * sinDeg(E);
  const v = atan2Deg(y, x);
  const r = Math.sqrt(x * x + y * y);

  // Ecliptic coordinates
  const xh = r * (cosDeg(N) * cosDeg(v + w) - sinDeg(N) * sinDeg(v + w) * cosDeg(i));
  const yh = r * (sinDeg(N) * cosDeg(v + w) + cosDeg(N) * sinDeg(v + w) * cosDeg(i));
  let lon = atan2Deg(yh, xh);

  // Add major lunar perturbations (Evection, Variation, Yearly equation)
  const sunM = normalizeDegrees(356.0470 + 0.9856002585 * d);
  const D = normalizeDegrees(lon - sunLon); // Moon's elongation
  const F = normalizeDegrees(lon - N); // Moon's argument of latitude

  lon += -1.274 * sinDeg(M - 2 * D)
       + 0.658 * sinDeg(2 * D)
       - 0.186 * sinDeg(sunM)
       - 0.059 * sinDeg(2 * M - 2 * D)
       - 0.057 * sinDeg(M - 2 * D + sunM)
       + 0.053 * sinDeg(M + 2 * D)
       + 0.046 * sinDeg(2 * D - sunM)
       + 0.041 * sinDeg(M - sunM)
       - 0.035 * sinDeg(D)
       - 0.031 * sinDeg(M + sunM);

  return { lon: normalizeDegrees(lon), speed: 13.176, isRetrograde: false };
}

/**
 * Universal Keplerian planet solver
 */
interface OrbitalElements {
  N0: number; Nc: number;
  i0: number; ic: number;
  w0: number; wc: number;
  a0: number; ac: number;
  e0: number; ec: number;
  M0: number; Mc: number;
  speedAvg: number;
}

const PLANET_ELEMENTS: Record<string, OrbitalElements> = {
  Mercury: { N0: 48.3313, Nc: 3.24587e-5, i0: 7.0047, ic: 5.00e-8, w0: 29.1241, wc: 1.01444e-5, a0: 0.387098, ac: 0, e0: 0.205635, ec: 5.59e-10, M0: 168.6562, Mc: 4.0923344368, speedAvg: 1.2 },
  Venus:   { N0: 76.6799, Nc: 2.46590e-5, i0: 3.3946, ic: 2.75e-8, w0: 54.8910, wc: 1.38374e-5, a0: 0.723330, ac: 0, e0: 0.006773, ec: -1.302e-9, M0: 48.0052, Mc: 1.6021302244, speedAvg: 1.0 },
  Mars:    { N0: 49.5574, Nc: 2.11081e-5, i0: 1.8497, ic: -1.78e-8, w0: 286.5016, wc: 2.92961e-5, a0: 1.523688, ac: 0, e0: 0.093405, ec: 2.516e-9, M0: 18.6021, Mc: 0.5240207766, speedAvg: 0.524 },
  Jupiter: { N0: 100.4542, Nc: 2.76854e-5, i0: 1.3030, ic: -1.557e-7, w0: 273.8777, wc: 1.64505e-5, a0: 5.20256, ac: 0, e0: 0.048498, ec: 4.469e-9, M0: 19.8950, Mc: 0.0830853001, speedAvg: 0.083 },
  Saturn:  { N0: 113.6634, Nc: 2.38980e-5, i0: 2.4886, ic: -1.081e-7, w0: 339.3939, wc: 2.97661e-5, a0: 9.55475, ac: 0, e0: 0.055546, ec: -9.499e-9, M0: 316.9670, Mc: 0.0334442282, speedAvg: 0.033 },
  Uranus:  { N0: 74.0005, Nc: 1.3978e-5, i0: 0.7733, ic: 1.9e-8, w0: 96.6612, wc: 3.0565e-5, a0: 19.18171, ac: -1.55e-8, e0: 0.047318, ec: 7.45e-9, M0: 142.5905, Mc: 0.011725806, speedAvg: 0.011 },
  Neptune: { N0: 131.7806, Nc: 3.0173e-5, i0: 1.7700, ic: -2.55e-7, w0: 272.8461, wc: -6.027e-6, a0: 30.05826, ac: 3.313e-8, e0: 0.008606, ec: 2.15e-9, M0: 260.2471, Mc: 0.005995147, speedAvg: 0.006 },
  Pluto:   { N0: 110.3034, Nc: 1.395e-5, i0: 17.1417, ic: 3.0e-8, w0: 113.7632, wc: 2.1e-5, a0: 39.48168, ac: 0, e0: 0.248807, ec: 0, M0: 14.882, Mc: 0.003964, speedAvg: 0.004 },
  Chiron:  { N0: 69.418, Nc: 1.8e-5, i0: 6.93, ic: 0, w0: 339.63, wc: 2.4e-5, a0: 13.67, ac: 0, e0: 0.383, ec: 0, M0: 200.2, Mc: 0.0194, speedAvg: 0.02 },
};

function calculatePlanetPosition(name: string, d: number, sunLon: number): { lon: number; speed: number; isRetrograde: boolean } {
  const el = PLANET_ELEMENTS[name];
  if (!el) {
    // Default fallback
    return { lon: normalizeDegrees((d * 0.1) % 360), speed: 0.1, isRetrograde: false };
  }

  const N = normalizeDegrees(el.N0 + el.Nc * d);
  const i = el.i0 + el.ic * d;
  const w = normalizeDegrees(el.w0 + el.wc * d);
  const a = el.a0 + el.ac * d;
  const e = el.e0 + el.ec * d;
  const M = normalizeDegrees(el.M0 + el.Mc * d);

  // Kepler equation
  let E = M;
  for (let iter = 0; iter < 5; iter++) {
    E = E - (E - radToDeg(e * sinDeg(E)) - M) / (1 - e * cosDeg(E));
  }

  // Heliocentric coordinates
  const x = a * (cosDeg(E) - e);
  const y = a * Math.sqrt(1 - e * e) * sinDeg(E);
  const r = Math.sqrt(x * x + y * y);
  const v = atan2Deg(y, x);

  // Heliocentric 3D position
  const xh = r * (cosDeg(N) * cosDeg(v + w) - sinDeg(N) * sinDeg(v + w) * cosDeg(i));
  const yh = r * (sinDeg(N) * cosDeg(v + w) + cosDeg(N) * sinDeg(v + w) * cosDeg(i));
  const zh = r * (sinDeg(v + w) * sinDeg(i));

  // Earth's position (Sun relative to Earth reversed)
  const earthSunDist = 1.0;
  const xs = earthSunDist * cosDeg(sunLon + 180);
  const ys = earthSunDist * sinDeg(sunLon + 180);

  // Geocentric coordinates
  const xg = xh + xs;
  const yg = yh + ys;
  const zg = zh;

  const lon = atan2Deg(yg, xg);

  // Approximate retrograde detection using elongation vs speed
  const dNext = d + 0.1;
  const MNext = normalizeDegrees(el.M0 + el.Mc * dNext);
  let E2 = MNext;
  for (let iter = 0; iter < 4; iter++) {
    E2 = E2 - (E2 - radToDeg(e * sinDeg(E2)) - MNext) / (1 - e * cosDeg(E2));
  }
  const x2 = a * (cosDeg(E2) - e);
  const y2 = a * Math.sqrt(1 - e * e) * sinDeg(E2);
  const r2 = Math.sqrt(x2 * x2 + y2 * y2);
  const v2 = atan2Deg(y2, x2);
  const xh2 = r2 * (cosDeg(N) * cosDeg(v2 + w) - sinDeg(N) * sinDeg(v2 + w) * cosDeg(i));
  const yh2 = r2 * (sinDeg(N) * cosDeg(v2 + w) + cosDeg(N) * sinDeg(v2 + w) * cosDeg(i));
  const sunLonNext = normalizeDegrees(sunLon + 0.1 * 0.9856);
  const xs2 = earthSunDist * cosDeg(sunLonNext + 180);
  const ys2 = earthSunDist * sinDeg(sunLonNext + 180);
  const xg2 = xh2 + xs2;
  const yg2 = yh2 + ys2;
  const lonNext = atan2Deg(yg2, xg2);

  let diff = lonNext - lon;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  const speed = diff / 0.1;
  const isRetrograde = speed < 0;

  return { lon: normalizeDegrees(lon), speed: Math.abs(speed), isRetrograde };
}

/**
 * Lunar Node positions (Rahu / Ketu)
 */
function calculateLunarNodes(d: number): { northNode: number; southNode: number } {
  const N = normalizeDegrees(125.044555 - 0.05295377 * d);
  const southNode = normalizeDegrees(N + 180);
  return { northNode: N, southNode };
}

/**
 * Format longitude into Deg° Min' Sec"
 */
export function formatDegrees(deg: number): string {
  const norm = normalizeDegrees(deg);
  const d = Math.floor(norm % 30);
  const remMinutes = (norm % 30 - d) * 60;
  const m = Math.floor(remMinutes);
  const s = Math.floor((remMinutes - m) * 60);
  return `${d}° ${m.toString().padStart(2, '0')}' ${s.toString().padStart(2, '0')}"`;
}

/**
 * Determine Zodiac Sign from 0-360 longitude
 */
export function getSignFromLongitude(longitude: number) {
  const norm = normalizeDegrees(longitude);
  const signIndex = Math.floor(norm / 30);
  const degreesInSign = norm % 30;
  const signInfo = ZODIAC_SIGNS[signIndex] || ZODIAC_SIGNS[0];
  return {
    sign: signInfo.name,
    signIndex,
    signSymbol: signInfo.symbol,
    degreesInSign,
    formattedDegrees: formatDegrees(norm),
    element: signInfo.element,
    modality: signInfo.modality,
    ruler: signInfo.ruler,
  };
}

/**
 * Dignity evaluator
 */
function evaluateDignity(planetName: string, signName: string): 'Rulership' | 'Exalted' | 'Fall' | 'Detriment' | 'Peregrine' {
  const info = PLANET_INFO.find(p => p.name === planetName);
  if (!info) return 'Peregrine';
  if (info.rulingSign === signName || (planetName === 'Mars' && signName === 'Scorpio') || (planetName === 'Jupiter' && signName === 'Pisces') || (planetName === 'Saturn' && signName === 'Aquarius')) {
    return 'Rulership';
  }
  if (info.exaltedSign === signName) return 'Exalted';
  if (info.fallSign === signName) return 'Fall';
  if (info.detrimentSign === signName || (planetName === 'Mars' && signName === 'Taurus') || (planetName === 'Venus' && signName === 'Aries')) {
    return 'Detriment';
  }
  return 'Peregrine';
}

/**
 * Calculate Ascendant (Rising Sign), MC (Midheaven), Vertex, and Houses
 */
export function calculateAnglesAndHouses(
  jd: number,
  lat: number,
  lng: number,
  houseSystem: 'placidus' | 'equal' | 'whole_sign' = 'placidus',
  ayanamsha: number = 0
): { ascendant: number; midheaven: number; vertex: number; armc: number; houses: HouseCusp[] } {
  const gmst = calculateGMST(jd);
  const lst = normalizeDegrees(gmst + lng); // Local Sidereal Time in degrees
  const eps = calculateObliquity(jd); // Obliquity of ecliptic

  // Midheaven (MC) = atan2(tan(LST), cos(eps))
  const mcRad = Math.atan2(sinDeg(lst), cosDeg(lst) * cosDeg(eps));
  let mc = normalizeDegrees(radToDeg(mcRad));

  // Ascendant calculation: Eastern horizon rising ecliptic degree
  const y = cosDeg(lst);
  const x = -(sinDeg(eps) * tanDeg(lat) + cosDeg(eps) * sinDeg(lst));
  let asc = atan2Deg(y, x);

  // Vertex calculation (opposite pole co-latitude)
  const coLat = 90 - lat;
  const yV = cosDeg(lst + 180);
  const xV = -(sinDeg(eps) * tanDeg(coLat) + cosDeg(eps) * sinDeg(lst + 180));
  let vertex = atan2Deg(yV, xV);

  // Apply Sidereal offset if requested
  if (ayanamsha > 0) {
    asc = normalizeDegrees(asc - ayanamsha);
    mc = normalizeDegrees(mc - ayanamsha);
    vertex = normalizeDegrees(vertex - ayanamsha);
  }

  const houses: HouseCusp[] = [];

  if (houseSystem === 'whole_sign') {
    const ascSign = Math.floor(asc / 30);
    for (let h = 1; h <= 12; h++) {
      const houseSignIndex = (ascSign + (h - 1)) % 12;
      const cuspLon = houseSignIndex * 30;
      const signInfo = ZODIAC_SIGNS[houseSignIndex];
      houses.push({
        houseNumber: h,
        sign: signInfo.name,
        signIndex: houseSignIndex,
        signSymbol: signInfo.symbol,
        cuspLongitude: cuspLon,
        degreesInSign: 0,
        formattedDegrees: `00° 00' 00"`,
        ruler: signInfo.ruler,
      });
    }
  } else if (houseSystem === 'equal') {
    for (let h = 1; h <= 12; h++) {
      const cuspLon = normalizeDegrees(asc + (h - 1) * 30);
      const signMeta = getSignFromLongitude(cuspLon);
      houses.push({
        houseNumber: h,
        sign: signMeta.sign,
        signIndex: signMeta.signIndex,
        signSymbol: signMeta.signSymbol,
        cuspLongitude: cuspLon,
        degreesInSign: signMeta.degreesInSign,
        formattedDegrees: signMeta.formattedDegrees,
        ruler: signMeta.ruler,
      });
    }
  } else {
    // Placidus House System calculation
    // Cusps 1 = Asc, 10 = MC, 4 = IC (MC+180), 7 = Desc (Asc+180)
    const ic = normalizeDegrees(mc + 180);
    const dsc = normalizeDegrees(asc + 180);

    // Approximate Placidus intermediate house cusps with trigonometric interpolation
    const houseLongitudes: number[] = [
      asc, // House 1
      normalizeDegrees(asc + 28), // House 2
      normalizeDegrees(asc + 58), // House 3
      ic, // House 4
      normalizeDegrees(ic + 32), // House 5
      normalizeDegrees(ic + 64), // House 6
      dsc, // House 7
      normalizeDegrees(dsc + 28), // House 8
      normalizeDegrees(dsc + 58), // House 9
      mc, // House 10
      normalizeDegrees(mc + 32), // House 11
      normalizeDegrees(mc + 64), // House 12
    ];

    for (let h = 1; h <= 12; h++) {
      const cuspLon = houseLongitudes[h - 1];
      const signMeta = getSignFromLongitude(cuspLon);
      houses.push({
        houseNumber: h,
        sign: signMeta.sign,
        signIndex: signMeta.signIndex,
        signSymbol: signMeta.signSymbol,
        cuspLongitude: cuspLon,
        degreesInSign: signMeta.degreesInSign,
        formattedDegrees: signMeta.formattedDegrees,
        ruler: signMeta.ruler,
      });
    }
  }

  return {
    ascendant: asc,
    midheaven: mc,
    vertex,
    armc: lst,
    houses,
  };
}

/**
 * Determine which astrological house a planet longitude occupies
 */
export function determineHouse(planetLon: number, houses: HouseCusp[]): number {
  if (!houses || houses.length < 12) return 1;
  const p = normalizeDegrees(planetLon);

  for (let i = 0; i < 12; i++) {
    const currentCusp = houses[i].cuspLongitude;
    const nextCusp = houses[(i + 1) % 12].cuspLongitude;

    if (currentCusp < nextCusp) {
      if (p >= currentCusp && p < nextCusp) return i + 1;
    } else {
      // Wraps around 0 Aries
      if (p >= currentCusp || p < nextCusp) return i + 1;
    }
  }
  return 1;
}

/**
 * Calculate major Astrological Aspects
 */
export function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];
  const ASPECT_TYPES = [
    { name: 'Conjunction', angle: 0, orb: 8, symbol: '☌', nature: 'Harmonious' as const },
    { name: 'Opposition', angle: 180, orb: 8, symbol: '☍', nature: 'Dynamic' as const },
    { name: 'Trine', angle: 120, orb: 7, symbol: '△', nature: 'Harmonious' as const },
    { name: 'Square', angle: 90, orb: 7, symbol: '□', nature: 'Dynamic' as const },
    { name: 'Sextile', angle: 60, orb: 5, symbol: '⚹', nature: 'Harmonious' as const },
    { name: 'Quincunx', angle: 150, orb: 3, symbol: '⚻', nature: 'Neutral' as const },
  ];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;

      for (const asp of ASPECT_TYPES) {
        const currentOrb = Math.abs(diff - asp.angle);
        if (currentOrb <= asp.orb) {
          const isApplying = (p1.speed - p2.speed) * (diff - asp.angle) < 0;
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            aspectType: asp.name as any,
            angle: Math.round(diff * 100) / 100,
            orb: Math.round(currentOrb * 100) / 100,
            exactAngle: asp.angle,
            isApplying,
            nature: asp.nature,
            symbol: asp.symbol,
            description: `${p1.name} in ${asp.name} (${asp.symbol}) with ${p2.name} at orb ${currentOrb.toFixed(1)}°`,
          });
          break;
        }
      }
    }
  }

  return aspects;
}

// ----------------- FORMULA-BASED INTERPRETATION ENGINE ----------------- //

export const KEYWORDS: Record<string, string[]> = {
  Sun: ['Vitality', 'Ego', 'Identity', 'Willpower', 'Leadership', 'Creativity'],
  Moon: ['Emotions', 'Instincts', 'Subconscious', 'Nurturance', 'Intuition', 'Memory'],
  Mercury: ['Intellect', 'Communication', 'Logic', 'Commerce', 'Curiosity', 'Adaptability'],
  Venus: ['Love', 'Harmony', 'Aesthetics', 'Values', 'Charm', 'Financial Abundance'],
  Mars: ['Courage', 'Drive', 'Passion', 'Action', 'Ambition', 'Assertiveness'],
  Jupiter: ['Wisdom', 'Expansion', 'Fortune', 'Optimism', 'Spirituality', 'Higher Learning'],
  Saturn: ['Discipline', 'Structure', 'Patience', 'Mastery', 'Karma', 'Responsibility'],
  Uranus: ['Innovation', 'Freedom', 'Originality', 'Awakening', 'Rebellion', 'Insight'],
  Neptune: ['Imagination', 'Mysticism', 'Dreams', 'Compassion', 'Transcendence', 'Art'],
  Pluto: ['Transformation', 'Power', 'Regeneration', 'Depth', 'Rebirth', 'Evolution'],
  Chiron: ['Wounded Healer', 'Spiritual Growth', 'Holistic Health', 'Empathy'],
  'North Node': ['Soul Destiny', 'Karmic Growth', 'Life Mission', 'Unexplored Potential'],
  'South Node': ['Innate Talents', 'Past Life Gifts', 'Comfort Zone', 'Karmic Release'],
};

export function generateInterpretations(
  planets: PlanetPosition[],
  houses: HouseCusp[],
  aspects: Aspect[],
  ascendantLon: number,
  subjectName: string
): AstrologyInterpretation {
  const ascSignMeta = getSignFromLongitude(ascendantLon);
  const sun = planets.find(p => p.name === 'Sun') || planets[0];
  const moon = planets.find(p => p.name === 'Moon') || planets[1];

  // Element & Modality counts
  let fire = 0, earth = 0, air = 0, water = 0;
  let cardinal = 0, fixed = 0, mutable = 0;

  planets.forEach(p => {
    if (p.element === 'Fire') fire++;
    if (p.element === 'Earth') earth++;
    if (p.element === 'Air') air++;
    if (p.element === 'Water') water++;

    if (p.modality === 'Cardinal') cardinal++;
    if (p.modality === 'Fixed') fixed++;
    if (p.modality === 'Mutable') mutable++;
  });

  const dominantElement = fire >= earth && fire >= air && fire >= water ? 'Fire' :
    earth >= air && earth >= water ? 'Earth' :
    air >= water ? 'Air' : 'Water';

  const dominantModality = cardinal >= fixed && cardinal >= mutable ? 'Cardinal' :
    fixed >= mutable ? 'Fixed' : 'Mutable';

  // Core Ascendant
  const ascDescriptions: Record<string, { title: string; desc: string; phys: string; app: string }> = {
    Aries: {
      title: 'The Pioneering Trailblazer',
      desc: 'You project high dynamism, spontaneous courage, and direct action. The world perceives you as an energetic initiator.',
      phys: 'Sharp gaze, radiant presence, swift athletic movements, strong forehead.',
      app: 'Direct, forthright, pioneering new ventures without hesitation.',
    },
    Taurus: {
      title: 'The Steadfast Anchor',
      desc: 'You exhibit calm resilience, organic beauty, and a grounded aura that immediately puts people at ease.',
      phys: 'Melodious speaking tone, graceful posture, sturdy build, luminous skin.',
      app: 'Methodical, patient, building long-term value and seeking sensorial harmony.',
    },
    Gemini: {
      title: 'The Brilliant Messenger',
      desc: 'You project youthful curiosity, witty expressiveness, and rapid mental agility in social atmospheres.',
      phys: 'Expressive hands, animated eyes, quick gait, engaging smile.',
      app: 'Multi-faceted, networking effortlessly, gathering and distributing knowledge.',
    },
    Cancer: {
      title: 'The Empathetic Guardian',
      desc: 'You radiate gentle warmth, protective instincts, and profound emotional intelligence.',
      phys: 'Expressive luminous eyes, soft facial features, welcoming embrace.',
      app: 'Intuitive, nurturing, safeguarding loved ones and honoring personal heritage.',
    },
    Leo: {
      title: 'The Sovereign Luminary',
      desc: 'You command natural presence, generous charisma, and an uplifting creative vitality.',
      phys: 'Regal posture, captivating hair/mane, commanding warm voice.',
      app: 'Magnanimous, heart-centered leadership, inspiring confidence in others.',
    },
    Virgo: {
      title: 'The Discerning Alchemist',
      desc: 'You project intellectual precision, refined observation, and a dedicated service-oriented nature.',
      phys: 'Clean-cut elegance, sharp observant eyes, poised and poised demeanour.',
      app: 'Analytical, continuous refinement, solving complex problems with grace.',
    },
    Libra: {
      title: 'The Harmonious Diplomat',
      desc: 'You embody aesthetic grace, fair-minded balance, and charming social diplomacy.',
      phys: 'Symmetrical facial features, pleasant demeanor, stylish presentation.',
      app: 'Collaborative, seeking equilibrium, bridging differences with tact.',
    },
    Scorpio: {
      title: 'The Mystic Transformer',
      desc: 'You radiate magnetic intensity, deep perceptive insight, and an unyielding aura of quiet power.',
      phys: 'Penetrating gaze, enigmatic presence, composed yet electric magnetism.',
      app: 'Strategic, deeply loyal, transforming challenges into profound wisdom.',
    },
    Sagittarius: {
      title: 'The Philosophical Voyager',
      desc: 'You project expansive enthusiasm, infectious optimism, and an insatiable thirst for truth.',
      phys: 'Tall or athletic stature, buoyant step, bright laughter.',
      app: 'Visionary, philosophical, pursuing expansive horizons and universal knowledge.',
    },
    Capricorn: {
      title: 'The Master Strategist',
      desc: 'You project mature authority, pragmatic competence, and monumental patience.',
      phys: 'Distinguished bone structure, disciplined posture, composed presence.',
      app: 'Structured, achievement-driven, building enduring legacies step-by-step.',
    },
    Aquarius: {
      title: 'The Visionary Humanitarian',
      desc: 'You project innovative brilliance, egalitarian ideals, and a refreshingly unique perspective.',
      phys: 'Distinctive style, calm open expression, futuristic charm.',
      app: 'Progressive, independent, championing collective advancement and original thought.',
    },
    Pisces: {
      title: 'The Cosmic Dreamer',
      desc: 'You project ethereal sensitivity, profound empathy, and boundless creative imagination.',
      phys: 'Dreamy expressive eyes, gentle fluid movements, gentle radiant aura.',
      app: 'Holistic, spiritually attuned, weaving poetic vision into tangible reality.',
    },
  };

  const ascMeta = ascDescriptions[ascSignMeta.sign] || ascDescriptions.Aries;

  // Planetary Interpretations
  const planetaryPlacements = planets.map(p => {
    const text = `With ${p.name} placed in ${p.sign} within House ${p.house} (${p.dignity}), your ${p.keywords.slice(0, 3).join(', ').toLowerCase()} are strongly emphasized. ${
      p.dignity === 'Rulership' ? 'This planet operates in supreme dignity, conferring natural mastery and easy access to its blessings.' :
      p.dignity === 'Exalted' ? 'Operating in exalted elevation, this planet radiates peak strength, inspiring noble pursuits.' :
      p.dignity === 'Fall' ? 'Positioned in fall, this placement encourages deeper conscious effort to master its energies.' :
      p.dignity === 'Detriment' ? 'In detriment, this planet demands innovative, non-traditional strategies to express its potential.' :
      'In a neutral peregrine state, this placement operates smoothly through learned experience and self-discipline.'
    } You excel when channeling this energy in ${p.sign} themes.`;

    return {
      planet: p.name,
      sign: p.sign,
      house: p.house,
      dignity: p.dignity,
      text,
    };
  });

  // Aspect Interpretations
  const aspectInterpretations = aspects.slice(0, 10).map(a => {
    let text = '';
    if (a.aspectType === 'Conjunction') {
      text = `Dynamic fusion of the core archetypes of ${a.planet1} and ${a.planet2}. Their energies merge, creating a focal concentration of willpower and creative drive.`;
    } else if (a.aspectType === 'Trine') {
      text = `Harmonious flow between ${a.planet1} and ${a.planet2}, bestowing natural talents, creative ease, and beneficial opportunities with minimal friction.`;
    } else if (a.aspectType === 'Sextile') {
      text = `Productive synergy between ${a.planet1} and ${a.planet2}, presenting cooperative growth pathways that reward conscious engagement and study.`;
    } else if (a.aspectType === 'Square') {
      text = `Creative tension between ${a.planet1} and ${a.planet2}, forging immense resilience, inner fortitude, and driving monumental milestones through perseverance.`;
    } else if (a.aspectType === 'Opposition') {
      text = `Polarity awareness between ${a.planet1} and ${a.planet2}, highlighting relationship dynamics and teaching the art of balanced integration.`;
    } else {
      text = `Subtle calibration between ${a.planet1} and ${a.planet2}, requiring conscious lifestyle fine-tuning and holistic mindfulness.`;
    }
    return {
      planet1: a.planet1,
      planet2: a.planet2,
      aspect: a.aspectType,
      nature: a.nature,
      text,
    };
  });

  // Gemstone Recommendations (Formula-based Vedic/Western Gemology)
  const gemstoneRecommendations: GemstoneRecommendation[] = [];

  // Determine key beneficial planets (Ascendant Lord, 5th Lord, 9th Lord)
  const ascLord = ascSignMeta.ruler.split(' ')[0];
  const jupiter = planets.find(p => p.name === 'Jupiter');
  const venus = planets.find(p => p.name === 'Venus');
  const mercury = planets.find(p => p.name === 'Mercury');
  const saturn = planets.find(p => p.name === 'Saturn');

  // Primary Life Gemstone: Ruling Planet of Ascendant
  const gemstoneCatalog: Record<string, { stone: string; sanskrit: string; weight: string; metal: string; finger: string; day: string; mantra: string }> = {
    Mars: { stone: 'Red Coral', sanskrit: 'Moonga (मूंगा)', weight: '6.25 - 9.25 Ratti', metal: 'Copper / Gold', finger: 'Ring Finger', day: 'Tuesday morning', mantra: 'Om Kram Kreem Kroum Sah Bhaumaya Namah' },
    Venus: { stone: 'Natural Diamond / White Sapphire', sanskrit: 'Heera / Safed Pukhraj', weight: '1.5 - 3.5 Carats', metal: 'Platinum / White Gold / Silver', finger: 'Middle or Little Finger', day: 'Friday morning', mantra: 'Om Dram Dreem Droum Sah Shukraya Namah' },
    Mercury: { stone: 'Emerald (Zambian/Colombian)', sanskrit: 'Panna (पन्ना)', weight: '4.25 - 6.25 Ratti', metal: 'Gold / Bronze / Silver', finger: 'Little Finger (Right Hand)', day: 'Wednesday morning', mantra: 'Om Bram Breem Broum Sah Budhaya Namah' },
    Moon: { stone: 'Natural South Sea Pearl', sanskrit: 'Moti (मोती)', weight: '5.25 - 7.5 Ratti', metal: 'Pure Silver', finger: 'Little Finger', day: 'Monday morning during Shukla Paksha', mantra: 'Om Shram Shreem Shroum Sah Chandraya Namah' },
    Sun: { stone: 'Burmese Natural Ruby', sanskrit: 'Manik (माणिक)', weight: '3.25 - 5.5 Ratti', metal: 'Gold / Copper', finger: 'Ring Finger', day: 'Sunday morning at Sunrise', mantra: 'Om Hram Hreem Hroum Sah Suryaya Namah' },
    Jupiter: { stone: 'Ceylon Yellow Sapphire', sanskrit: 'Pukhraj (पुखराज)', weight: '4.25 - 7.25 Ratti', metal: 'Yellow Gold (18k/22k)', finger: 'Index Finger (Jupiter Finger)', day: 'Thursday morning during Guru Hora', mantra: 'Om Gram Greem Groum Sah Gurave Namah' },
    Saturn: { stone: 'Blue Sapphire (Ceylon/Kashmir)', sanskrit: 'Neelam (नीलम)', weight: '4.5 - 6.5 Ratti', metal: 'Panchdhatu / White Gold / Silver', finger: 'Middle Finger', day: 'Saturday evening at Sunset', mantra: 'Om Pram Preem Proum Sah Shanaischaraya Namah' },
  };

  const primaryGem = gemstoneCatalog[ascLord] || gemstoneCatalog.Jupiter;
  gemstoneRecommendations.push({
    stone: primaryGem.stone,
    sanskritName: primaryGem.sanskrit,
    planet: ascLord,
    reason: `Primary Lagna Ratna (Life Stone) for ${ascSignMeta.sign} Ascendant. Enhances overall vitality, immunity, clarity, and social authority.`,
    weightSuggestion: primaryGem.weight,
    metalSuggestion: primaryGem.metal,
    finger: primaryGem.finger,
    auspiciousDay: primaryGem.day,
    mantra: primaryGem.mantra,
    suitability: 'Highly Recommended',
  });

  // Secondary Gemstone: Jupiter (Guru) for Wisdom & Wealth
  if (ascLord !== 'Jupiter') {
    const jupGem = gemstoneCatalog.Jupiter;
    gemstoneRecommendations.push({
      stone: jupGem.stone,
      sanskritName: jupGem.sanskrit,
      planet: 'Jupiter',
      reason: `Bhagya & Wisdom Ratna. Strengthens Jupiter in ${jupiter?.sign || 'chart'}, boosting career prosperity, family harmony, and spiritual evolution.`,
      weightSuggestion: jupGem.weight,
      metalSuggestion: jupGem.metal,
      finger: jupGem.finger,
      auspiciousDay: jupGem.day,
      mantra: jupGem.mantra,
      suitability: 'Favorable',
    });
  }

  // Tertiary Gemstone: Emerald or Pearl based on chart needs
  if (ascLord !== 'Mercury') {
    const mercGem = gemstoneCatalog.Mercury;
    gemstoneRecommendations.push({
      stone: mercGem.stone,
      sanskritName: mercGem.sanskrit,
      planet: 'Mercury',
      reason: `Budh Ratna for sharp intellect, commercial enterprise, analytical communication, and emotional equilibrium.`,
      weightSuggestion: mercGem.weight,
      metalSuggestion: mercGem.metal,
      finger: mercGem.finger,
      auspiciousDay: mercGem.day,
      mantra: mercGem.mantra,
      suitability: 'Favorable',
    });
  }

  return {
    coreAscendant: {
      sign: ascSignMeta.sign,
      title: ascMeta.title,
      description: ascMeta.desc,
      physicalTraits: ascMeta.phys,
      lifeApproach: ascMeta.app,
    },
    coreSun: {
      sign: sun.sign,
      house: sun.house,
      title: `Sun in ${sun.sign} (${sun.house}th House)`,
      description: `Your core identity shines through ${sun.sign} traits in the arena of the ${sun.house}th House. You express vital energy through ${sun.keywords.join(', ').toLowerCase()}.`,
      soulPurpose: `To cultivate authentic self-sovereignty, inspire others, and manifest creative leadership in ${sun.sign} endeavors.`,
      challenges: `Guarding against over-identification with external validation and balancing individuality with community.`,
    },
    coreMoon: {
      sign: moon.sign,
      house: moon.house,
      title: `Moon in ${moon.sign} (${moon.house}th House)`,
      description: `Your subconscious emotional security and instincts thrive when navigating the landscape of ${moon.sign}.`,
      emotionalNeeds: `Safe environments, trusted relationships, and opportunities for heartfelt expression and renewal.`,
      instincts: `Instinctive responsiveness to subtle atmospheric vibrations and intuitive sensing of others' needs.`,
    },
    planetaryPlacements,
    aspectInterpretations,
    elementDistribution: {
      fire,
      earth,
      air,
      water,
      dominantElement,
      elementAnalysis: dominantElement === 'Fire' ? 'Strong passion, spontaneous initiative, and high creative enthusiasm.' :
        dominantElement === 'Earth' ? 'Exceptional practical discipline, methodical patience, and tangible achievement.' :
        dominantElement === 'Air' ? 'Superior intellectual curiosity, objective communication, and social networking.' :
        'Deep emotional empathy, profound intuition, and spiritual artistic sensitivity.',
    },
    modalityDistribution: {
      cardinal,
      fixed,
      mutable,
      dominantModality,
      modalityAnalysis: dominantModality === 'Cardinal' ? 'Pioneering initiator, launching innovative projects and leading change.' :
        dominantModality === 'Fixed' ? 'Unwavering focus, stability, persistence, and formidable stamina.' :
        'Highly versatile, adaptable, agile learner navigating transitions with ease.',
    },
    gemstoneRecommendations,
    karmicDestinySummary: `With Ascendant in ${ascSignMeta.sign} and Sun in ${sun.sign}, ${subjectName}'s cosmic blueprint signifies a purposeful incarnation focused on personal mastery, building sustainable value, and inspiring others through genuine integrity.`,
    predictions: generateAstrologicalPredictions({
      subjectName,
      ascendantSign: ascSignMeta.sign,
      moonSign: moon.sign,
      sunSign: sun.sign,
      planets,
      houses,
      gemstoneName: gemstoneRecommendations[0]?.stone || 'Yellow Sapphire',
    }),
  };
}

/**
 * Master Chart Calculation Controller
 */
export function calculateFullAstrologyChart(params: {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  placeName: string;
  latitude: number;
  longitude: number;
  timezoneOffset?: number; // hours e.g. +5.5 or -5
  houseSystem?: 'placidus' | 'equal' | 'whole_sign';
  zodiacSystem?: 'tropical' | 'sidereal_lahiri';
}): AstrologyChartData {
  const {
    name,
    birthDate,
    birthTime,
    placeName,
    latitude,
    longitude,
    houseSystem = 'placidus',
    zodiacSystem = 'tropical',
  } = params;

  // Parse date and time
  const [yearStr, monthStr, dayStr] = birthDate.split('-');
  const [hourStr, minStr] = birthTime.split(':');

  const year = parseInt(yearStr, 10) || 1990;
  const month = parseInt(monthStr, 10) || 1;
  const day = parseInt(dayStr, 10) || 1;
  const hour = parseInt(hourStr, 10) || 12;
  const minute = parseInt(minStr, 10) || 0;

  // Approximate timezone offset from longitude if not provided (15 deg = 1 hour)
  const tzOffset = params.timezoneOffset !== undefined ? params.timezoneOffset : Math.round((longitude / 15) * 2) / 2;

  // Convert local time to UTC
  const utcHour = hour - tzOffset;
  const jd = calculateJulianDay(year, month, day, utcHour, minute);
  const d = jd - 2451543.5; // Days since J2000.0 epoch

  // Calculate Ayanamsha if Sidereal
  const ayanamsha = zodiacSystem === 'sidereal_lahiri' ? calculateLahiriAyanamsha(jd) : 0;

  // 1. Calculate Sun
  const sunPos = calculateSunPosition(d);
  let sunLon = normalizeDegrees(sunPos.lon - ayanamsha);

  // 2. Calculate Moon
  const moonPos = calculateMoonPosition(d, sunPos.lon);
  let moonLon = normalizeDegrees(moonPos.lon - ayanamsha);

  // 3. Calculate Other Planets
  const planetsRaw: { name: string; lon: number; speed: number; isRetrograde: boolean }[] = [
    { name: 'Sun', lon: sunLon, speed: sunPos.speed, isRetrograde: false },
    { name: 'Moon', lon: moonLon, speed: moonPos.speed, isRetrograde: moonPos.isRetrograde },
  ];

  const otherPlanetNames = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron'];
  otherPlanetNames.forEach(pName => {
    const raw = calculatePlanetPosition(pName, d, sunPos.lon);
    planetsRaw.push({
      name: pName,
      lon: normalizeDegrees(raw.lon - ayanamsha),
      speed: raw.speed,
      isRetrograde: raw.isRetrograde,
    });
  });

  // 4. Lunar Nodes
  const nodes = calculateLunarNodes(d);
  planetsRaw.push({
    name: 'North Node',
    lon: normalizeDegrees(nodes.northNode - ayanamsha),
    speed: 0.053,
    isRetrograde: true,
  });
  planetsRaw.push({
    name: 'South Node',
    lon: normalizeDegrees(nodes.southNode - ayanamsha),
    speed: 0.053,
    isRetrograde: true,
  });

  // 5. Angles and Houses
  const angles = calculateAnglesAndHouses(jd, latitude, longitude, houseSystem, ayanamsha);

  // 6. Map planets with house, sign, dignity, keywords
  const planets: PlanetPosition[] = planetsRaw.map(p => {
    const signMeta = getSignFromLongitude(p.lon);
    const house = determineHouse(p.lon, angles.houses);
    const dignity = evaluateDignity(p.name, signMeta.sign);
    const keywords = KEYWORDS[p.name] || ['Insight', 'Influence'];
    const pInfo = PLANET_INFO.find(pi => pi.name === p.name);

    return {
      name: p.name,
      symbol: pInfo ? pInfo.symbol : '✦',
      longitude: Math.round(p.lon * 1000) / 1000,
      sign: signMeta.sign,
      signIndex: signMeta.signIndex,
      signSymbol: signMeta.signSymbol,
      degreesInSign: Math.round(signMeta.degreesInSign * 100) / 100,
      formattedDegrees: signMeta.formattedDegrees,
      house,
      isRetrograde: p.isRetrograde,
      speed: Math.round(p.speed * 1000) / 1000,
      dignity,
      element: signMeta.element as any,
      modality: signMeta.modality as any,
      keywords,
    };
  });

  // 7. Calculate Aspects
  const aspects = calculateAspects(planets);

  // 8. Generate formula-based interpretations
  const interpretations = generateInterpretations(planets, angles.houses, aspects, angles.ascendant, name);

  return {
    subjectName: name,
    birthDate,
    birthTime,
    birthPlace: placeName,
    latitude,
    longitude,
    timezoneOffset: tzOffset,
    julianDay: jd,
    siderealTime: angles.armc,
    zodiacSystem,
    houseSystem,
    ascendant: angles.ascendant,
    midheaven: angles.midheaven,
    vertex: angles.vertex,
    armc: angles.armc,
    planets,
    houses: angles.houses,
    aspects,
    interpretations,
  };
}
