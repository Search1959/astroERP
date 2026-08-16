/**
 * Client-Side Astrological Utilities & PDF Report Generator
 * Supports multilingual Kundali generation and Indian Language translations
 */

import { jsPDF } from 'jspdf';
import { AstrologyChartData } from '../types';
import { LanguageCode, getGemstoneName, getPlanetName, getSignName, getTranslation } from './indianLanguages';
import { generateAstrologicalPredictions } from './predictionEngine';

/**
 * Generate and download a formatted PDF Natal Chart Report
 */
export function generateAstrologyReportPDF(
  chart: AstrologyChartData,
  currencySymbol: string = '$',
  selectedLanguage: LanguageCode | string = 'en'
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 20;

  // Header Banner
  doc.setFillColor(30, 27, 75); // Deep Indigo
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ASTROLOGICAL NATAL CHART & KUNDALI REPORT', margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('AstroERP High-Precision Swiss Ephemeris & Vedic Calculation Engine', margin, 26);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | System: ${chart.zodiacSystem.toUpperCase()} (${chart.houseSystem.toUpperCase()})`, margin, 31);

  y = 45;

  // Subject Info Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 26, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Subject / Jataka: ${chart.subjectName}`, margin + 5, y + 7);
  doc.text(`Birth Date: ${chart.birthDate} at ${chart.birthTime}`, margin + 5, y + 14);
  doc.text(`Birth Place: ${chart.birthPlace} (Lat: ${chart.latitude.toFixed(2)}°, Lng: ${chart.longitude.toFixed(2)}°)`, margin + 5, y + 21);

  const sun = chart.planets.find(p => p.name === 'Sun');
  const moon = chart.planets.find(p => p.name === 'Moon');

  doc.setTextColor(79, 70, 229);
  doc.text(`Surya (Sun): ${sun?.sign || 'N/A'} (${sun?.formattedDegrees || ''})`, margin + 110, y + 7);
  doc.text(`Chandra (Moon): ${moon?.sign || 'N/A'} (${moon?.formattedDegrees || ''})`, margin + 110, y + 14);
  doc.text(`Lagna (Ascendant): ${chart.interpretations.coreAscendant.sign}`, margin + 110, y + 21);

  y += 34;

  // Planetary Positions Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 27, 75);
  doc.text('1. Planetary Positions & Dignities (Graha Sthiti & Bala)', margin, y);
  y += 6;

  // Table Headers
  doc.setFillColor(238, 242, 255);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setTextColor(67, 56, 202);
  doc.setFontSize(9);
  doc.text('Graha / Planet', margin + 3, y + 5);
  doc.text('Rashi / Sign', margin + 45, y + 5);
  doc.text('Longitude / Deg', margin + 85, y + 5);
  doc.text('House / Bhava', margin + 120, y + 5);
  doc.text('Motion', margin + 148, y + 5);
  doc.text('Dignity', margin + 168, y + 5);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  chart.planets.forEach((p, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 1, pageWidth - margin * 2, 6, 'F');
    }
    doc.text(`${p.name}`, margin + 3, y + 3.5);
    doc.text(`${p.sign}`, margin + 45, y + 3.5);
    doc.text(`${p.formattedDegrees}`, margin + 85, y + 3.5);
    doc.text(`House ${p.house}`, margin + 120, y + 3.5);
    doc.text(p.isRetrograde ? 'Vakri (Rx)' : 'Margi (Dir)', margin + 148, y + 3.5);
    doc.text(`${p.dignity}`, margin + 168, y + 3.5);
    y += 6;
  });

  y += 6;

  // Core Astrological Interpretations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 27, 75);
  doc.text('2. Core Archetype & Soul Blueprint (Lagna & Janma Rashi)', margin, y);
  y += 6;

  doc.setFillColor(254, 243, 199);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 26, 2, 2, 'FD');
  doc.setTextColor(146, 64, 14);
  doc.setFontSize(10);
  doc.text(`Ascendant / Lagna in ${chart.interpretations.coreAscendant.sign}: ${chart.interpretations.coreAscendant.title}`, margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const ascLines = doc.splitTextToSize(chart.interpretations.coreAscendant.description, pageWidth - margin * 2 - 8);
  doc.text(ascLines, margin + 4, y + 12);
  doc.text(`Life Approach: ${chart.interpretations.coreAscendant.lifeApproach}`, margin + 4, y + 21);

  y += 31;

  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 22, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text(`${chart.interpretations.coreSun.title} - Solar Life Purpose`, margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const sunLines = doc.splitTextToSize(chart.interpretations.coreSun.soulPurpose, pageWidth - margin * 2 - 8);
  doc.text(sunLines, margin + 4, y + 12);

  // ---------------- PAGE 2: PREDICTIONS & LIFE FORECASTS ---------------- //
  doc.addPage();
  y = 20;

  const preds = chart.interpretations.predictions || generateAstrologicalPredictions({
    subjectName: chart.subjectName,
    ascendantSign: chart.interpretations.coreAscendant.sign,
    moonSign: moon?.sign || 'Taurus',
    sunSign: sun?.sign || 'Leo',
    planets: chart.planets,
    houses: chart.houses,
    gemstoneName: chart.interpretations.gemstoneRecommendations[0]?.stone || 'Yellow Sapphire',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 27, 75);
  doc.text('3. Astrological Life Forecasts (Weekly, Monthly & Yearly Bhavishyafal)', margin, y);
  y += 8;

  // Weekly Section
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 44, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(67, 56, 202);
  doc.text(`A. ${preds.weekly.title} (Auspicious Score: ${preds.weekly.overallScore}/100 - ${preds.weekly.overallMood})`, margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const wLines = doc.splitTextToSize(preds.weekly.summary, pageWidth - margin * 2 - 8);
  doc.text(wLines, margin + 4, y + 12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Career Tip:`, margin + 4, y + 26);
  doc.setFont('helvetica', 'normal');
  doc.text(preds.weekly.careerAndMoney.actionableTip, margin + 24, y + 26);
  doc.setFont('helvetica', 'bold');
  doc.text(`Favored Activities:`, margin + 4, y + 32);
  doc.setFont('helvetica', 'normal');
  doc.text(preds.weekly.favorableActivities.slice(0, 2).join(' • '), margin + 35, y + 32);
  doc.setFont('helvetica', 'bold');
  doc.text(`Avoid / Caution:`, margin + 4, y + 38);
  doc.setFont('helvetica', 'normal');
  doc.text(preds.weekly.cautionActivities.slice(0, 2).join(' • '), margin + 30, y + 38);

  y += 48;

  // Monthly Section
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 44, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(22, 101, 52);
  doc.text(`B. ${preds.monthly.title} (Auspicious Score: ${preds.monthly.overallScore}/100 - ${preds.monthly.overallMood})`, margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const mLines = doc.splitTextToSize(preds.monthly.summary, pageWidth - margin * 2 - 8);
  doc.text(mLines, margin + 4, y + 12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Finance & Growth:`, margin + 4, y + 26);
  doc.setFont('helvetica', 'normal');
  doc.text(preds.monthly.careerAndMoney.prediction.substring(0, 110) + '...', margin + 34, y + 26);
  doc.setFont('helvetica', 'bold');
  doc.text(`Love & Family:`, margin + 4, y + 32);
  doc.setFont('helvetica', 'normal');
  doc.text(preds.monthly.loveAndFamily.prediction.substring(0, 110) + '...', margin + 28, y + 32);
  doc.setFont('helvetica', 'bold');
  doc.text(`Practical Advice:`, margin + 4, y + 38);
  doc.setFont('helvetica', 'normal');
  doc.text(preds.monthly.careerAndMoney.actionableTip, margin + 31, y + 38);

  y += 48;

  // Yearly Section
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 44, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(153, 27, 27);
  doc.text(`C. ${preds.yearly.title} (Auspicious Score: ${preds.yearly.overallScore}/100 - ${preds.yearly.overallMood})`, margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const yLines = doc.splitTextToSize(preds.yearly.summary, pageWidth - margin * 2 - 8);
  doc.text(yLines, margin + 4, y + 12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Annual Milestones:`, margin + 4, y + 26);
  doc.setFont('helvetica', 'normal');
  doc.text(preds.yearly.careerAndMoney.prediction.substring(0, 110) + '...', margin + 35, y + 26);
  doc.setFont('helvetica', 'bold');
  doc.text(`Key Relationships:`, margin + 4, y + 32);
  doc.setFont('helvetica', 'normal');
  doc.text(preds.yearly.loveAndFamily.prediction.substring(0, 110) + '...', margin + 35, y + 32);
  doc.setFont('helvetica', 'bold');
  doc.text(`Yearly Strategy:`, margin + 4, y + 38);
  doc.setFont('helvetica', 'normal');
  doc.text(preds.yearly.careerAndMoney.actionableTip, margin + 30, y + 38);

  y += 48;

  // Lucky Elements Box
  doc.setFillColor(255, 251, 235);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 26, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(146, 64, 14);
  doc.text('Lucky Elements, Numbers, Directions & Daily Affirmation', margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Lucky Colors: ${preds.weekly.luckyElements.luckyColors.join(', ')}  |  Lucky Numbers: ${preds.weekly.luckyElements.luckyNumbers.join(', ')}  |  Lucky Days: ${preds.weekly.luckyElements.luckyDays.join(', ')}`, margin + 4, y + 13);
  doc.text(`Direction: ${preds.weekly.luckyElements.auspiciousDirection}  |  Recommended Ratna: ${preds.weekly.luckyElements.favorableGemstone}`, margin + 4, y + 19);

  // ---------------- PAGE 3: GEMSTONES & REMEDIES ---------------- //
  doc.addPage();
  y = 20;

  // Gemstone Recommendations Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 27, 75);
  doc.text('4. Astrological Gemstone Prescription (Ratna Chikitsa)', margin, y);
  y += 8;

  chart.interpretations.gemstoneRecommendations.forEach((gem) => {
    doc.setFillColor(245, 243, 255);
    doc.setDrawColor(221, 214, 254);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 34, 2, 2, 'FD');

    doc.setTextColor(109, 40, 217);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`${gem.stone} (${gem.sanskritName}) - ${gem.suitability.toUpperCase()}`, margin + 4, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`Graha / Planet: ${gem.planet}  |  Weight: ${gem.weightSuggestion}  |  Metal: ${gem.metalSuggestion}`, margin + 4, y + 12);
    doc.text(`Finger: ${gem.finger}  |  Auspicious Time: ${gem.auspiciousDay}`, margin + 4, y + 17);
    doc.text(`Pran Pratishtha Mantra: ${gem.mantra}`, margin + 4, y + 22);

    const reasonLines = doc.splitTextToSize(`Prescription Logic: ${gem.reason}`, pageWidth - margin * 2 - 8);
    doc.text(reasonLines, margin + 4, y + 27);

    y += 38;
  });

  // Major Aspects Section
  y += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 27, 75);
  doc.text('5. Major Planetary Aspects & Planetary Angles (Drishti)', margin, y);
  y += 6;

  chart.aspects.slice(0, 7).forEach((asp) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(asp.nature === 'Harmonious' ? 22 : asp.nature === 'Dynamic' ? 194 : 71, asp.nature === 'Harmonious' ? 101 : asp.nature === 'Dynamic' ? 65 : 85, asp.nature === 'Harmonious' ? 52 : asp.nature === 'Dynamic' ? 12 : 105);
    doc.text(`${asp.planet1} ${asp.symbol} ${asp.planet2} (${asp.aspectType} - ${asp.orb.toFixed(1)}° Orb, ${asp.nature})`, margin, y);
    y += 4.5;
  });

  // Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('AstroERP © 2026 - Authentic Astrological Consultations & Certified Jyotish Gemstones. Confidential Report.', margin, 285);

  doc.save(`${chart.subjectName.replace(/\s+/g, '_')}_Astrology_Natal_Chart.pdf`);
}

