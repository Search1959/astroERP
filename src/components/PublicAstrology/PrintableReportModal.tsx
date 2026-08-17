/**
 * Astrological Natal Chart PDF / Print Preview Modal
 * Supports Multilingual Indian Languages and formatted PDF Export
 * Styled in the Executive Command Center Theme (#0e0307 background, red/orange accents, Outfit/Cinzel typography)
 */

import React from 'react';
import { AstrologyChartData } from '../../types';
import { generateAstrologyReportPDF } from '../../utils/astrologyEngine';
import { Download, Printer, X, Sparkles, CheckCircle2, Flame } from 'lucide-react';
import { LanguageCode, getGemstoneName, getPlanetName, getSignName, getTranslation } from '../../utils/indianLanguages';
import { LanguageSelector } from '../Common/LanguageSelector';

interface PrintableReportModalProps {
  chartData: AstrologyChartData;
  isOpen: boolean;
  onClose: () => void;
  currencySymbol?: string;
  selectedLanguage?: LanguageCode;
  onSelectLanguage?: (lang: LanguageCode) => void;
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({
  chartData,
  isOpen,
  onClose,
  currencySymbol = '$',
  selectedLanguage = 'en',
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  const t = (key: string) => getTranslation(key, selectedLanguage);

  const handleDownloadPDF = () => {
    generateAstrologyReportPDF(chartData, currencySymbol, selectedLanguage);
  };

  const handlePrint = () => {
    window.print();
  };

  const sun = chartData.planets.find(p => p.name === 'Sun');
  const moon = chartData.planets.find(p => p.name === 'Moon');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto font-sans">
      <div className="bg-[#0e0307] border border-red-900/60 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-red-950/80 bg-[#120408] gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">
              {t('printReport')} & PDF Export
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {onSelectLanguage && (
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onSelectLanguage={onSelectLanguage}
                variant="header"
              />
            )}

            <button
              id="btn-print-report"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#1c060e] hover:bg-[#280814] text-slate-200 border border-red-950 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('printReport')}</span>
            </button>
            <button
              id="btn-download-pdf"
              onClick={handleDownloadPDF}
              className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('downloadPDF')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-rose-950/80 hover:text-rose-300 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Printable Document Look */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0e0307] font-sans">
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-[#1c060e] via-[#120408] to-[#1a050d] border border-red-900/60 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest block mb-1 font-['Outfit',sans-serif]">
                Official Natal Kundali Document
              </span>
              <h2 className="text-2xl font-black text-white font-['Outfit',sans-serif]">{chartData.subjectName}</h2>
              <p className="text-xs text-slate-300 mt-1">
                {t('dateOfBirth')}: {chartData.birthDate} at {chartData.birthTime} • {chartData.birthPlace} (Lat: {chartData.latitude.toFixed(2)}°, Lng: {chartData.longitude.toFixed(2)}°)
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="bg-[#16050b] p-3 rounded-xl border border-red-950/80 text-center">
                <span className="text-slate-400 block text-[10px]">Surya / Sun Rashi</span>
                <span className="text-amber-400 font-bold text-sm font-['Outfit',sans-serif]">
                  {sun ? getSignName(sun.sign, selectedLanguage) : 'N/A'}
                </span>
              </div>
              <div className="bg-[#16050b] p-3 rounded-xl border border-red-950/80 text-center">
                <span className="text-slate-400 block text-[10px]">Chandra / Moon Rashi</span>
                <span className="text-cyan-400 font-bold text-sm font-['Outfit',sans-serif]">
                  {moon ? getSignName(moon.sign, selectedLanguage) : 'N/A'}
                </span>
              </div>
              <div className="bg-[#16050b] p-3 rounded-xl border border-red-950/80 text-center">
                <span className="text-slate-400 block text-[10px]">Lagna / Ascendant</span>
                <span className="text-orange-400 font-bold text-sm font-['Outfit',sans-serif]">
                  {getSignName(chartData.interpretations.coreAscendant.sign, selectedLanguage)}
                </span>
              </div>
            </div>
          </div>

          {/* Planetary Matrix */}
          <div className="bg-[#120408] border border-red-900/60 rounded-xl p-4 shadow-xl">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center justify-between font-['Outfit',sans-serif]">
              <span>{t('planetaryPositions')}</span>
              <span className="text-xs text-orange-400 font-normal">
                {chartData.zodiacSystem === 'tropical' ? 'Tropical' : 'Sidereal Lahiri (Vedic)'}
              </span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
              {chartData.planets.map(p => (
                <div key={p.name} className="p-2.5 bg-[#16050b] rounded-xl border border-red-950/80">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="font-bold text-white flex items-center gap-1 font-['Outfit',sans-serif]">
                      <span className="text-orange-400">{p.symbol}</span> {getPlanetName(p.name, selectedLanguage)}
                    </span>
                    <span className="text-orange-400 font-semibold">{t('house')} {p.house}</span>
                  </div>
                  <div className="font-semibold text-amber-300 mt-1">
                    {getSignName(p.sign, selectedLanguage)} <span className="font-mono text-slate-400 text-[10px]">({p.formattedDegrees})</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {p.isRetrograde ? t('retrograde') : t('direct')} • {p.dignity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Predictions Summary Section */}
          <div className="bg-[#120408] border border-red-900/60 rounded-xl p-4 space-y-3 shadow-xl">
            <h4 className="text-sm font-bold text-orange-300 flex items-center gap-2 font-['Outfit',sans-serif]">
              <Sparkles className="w-4 h-4 text-orange-400" /> {t('predictionsTitle')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Weekly */}
              <div className="p-3 bg-[#16050b] rounded-xl border border-red-950/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 font-['Outfit',sans-serif]">{t('weeklyForecast')}</span>
                  <span className="px-2 py-0.5 bg-orange-950 text-orange-300 border border-orange-700/60 rounded text-[10px] font-bold">
                    Score: {chartData.interpretations?.predictions?.weekly?.overallScore || 86}%
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {chartData.interpretations?.predictions?.weekly?.headline || 'Dynamic and rewarding week for key communications and projects.'}
                </p>
                <div className="text-[10px] text-slate-400 border-t border-red-950/80 pt-1.5">
                  <span className="text-orange-300 font-semibold">Career Tip:</span> {chartData.interpretations?.predictions?.weekly?.careerAndMoney?.actionableTip || 'Schedule major presentations mid-week.'}
                </div>
              </div>

              {/* Monthly */}
              <div className="p-3 bg-[#16050b] rounded-xl border border-red-950/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300 font-['Outfit',sans-serif]">{t('monthlyForecast')}</span>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded text-[10px] font-bold">
                    Score: {chartData.interpretations?.predictions?.monthly?.overallScore || 89}%
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {chartData.interpretations?.predictions?.monthly?.headline || 'Powerhouse month for financial growth and relationship harmony.'}
                </p>
                <div className="text-[10px] text-slate-400 border-t border-red-950/80 pt-1.5">
                  <span className="text-emerald-300 font-semibold">Advice:</span> {chartData.interpretations?.predictions?.monthly?.careerAndMoney?.actionableTip || 'Consolidate investments with elder guidance.'}
                </div>
              </div>

              {/* Yearly */}
              <div className="p-3 bg-[#16050b] rounded-xl border border-red-950/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-300 font-['Outfit',sans-serif]">{t('yearlyForecast')}</span>
                  <span className="px-2 py-0.5 bg-orange-950 text-orange-300 border border-orange-700/60 rounded text-[10px] font-bold">
                    Score: {chartData.interpretations?.predictions?.yearly?.overallScore || 92}%
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {chartData.interpretations?.predictions?.yearly?.headline || 'A defining annual period of personal elevation and lasting wealth.'}
                </p>
                <div className="text-[10px] text-slate-400 border-t border-red-950/80 pt-1.5">
                  <span className="text-orange-300 font-semibold">Strategy:</span> {chartData.interpretations?.predictions?.yearly?.careerAndMoney?.actionableTip || 'Focus on high-leverage assets and spiritual peace.'}
                </div>
              </div>
            </div>
          </div>

          {/* Gemstone Prescription Section */}
          <div className="bg-[#120408] border border-red-900/60 rounded-xl p-4 shadow-xl">
            <h4 className="text-sm font-bold text-amber-300 mb-3 flex items-center gap-2 font-['Outfit',sans-serif]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t('gemstonePrescription')}
            </h4>
            <div className="space-y-3">
              {chartData.interpretations.gemstoneRecommendations.map((gem, i) => (
                <div key={i} className="p-3 bg-[#16050b] rounded-xl border border-red-950/80 text-xs flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white text-sm font-['Outfit',sans-serif]">
                      {getGemstoneName(gem.stone, selectedLanguage)} ({gem.sanskritName})
                    </span>
                    <span className="text-slate-400 text-xs ml-2">
                      Graha: {getPlanetName(gem.planet, selectedLanguage)} • Weight: {gem.weightSuggestion}
                    </span>
                    <p className="text-slate-300 text-[11px] mt-1">{gem.reason}</p>
                    <p className="text-amber-300 text-[11px] font-mono mt-1 italic">
                      Mantra: "{gem.mantra}"
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded font-semibold text-[11px]">
                      {gem.suitability}
                    </span>
                    <div className="text-slate-400 text-[11px] mt-1">
                      Finger: <span className="text-orange-300 font-medium">{gem.finger}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
