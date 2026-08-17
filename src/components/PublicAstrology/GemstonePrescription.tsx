/**
 * Astrological Gemstone Prescription Component (Ratna Jyotish)
 * Multilingual Indian Language support (Hindi, Sanskrit, Gujarati, Marathi, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi, Odia, English)
 * Formula-based Life Stone, Lucky Stone, Weight, Metal, Finger, Mantra,
 * and 1-Click Auto-Dispense & Issue Sale Invoice capability.
 * Styled in the Executive Command Center Theme (#0e0307 background, red/orange accents, Outfit/Cinzel typography)
 */

import React from 'react';
import { GemstoneRecommendation } from '../../types';
import { Gem, ShieldCheck, ArrowRight, Zap, Flame } from 'lucide-react';
import { LanguageCode, getGemstoneName, getPlanetName, getTranslation } from '../../utils/indianLanguages';

interface GemstonePrescriptionProps {
  recommendations: GemstoneRecommendation[];
  subjectName: string;
  selectedLanguage?: LanguageCode;
  onNavigateToVault?: () => void;
  onBookConsultation?: () => void;
  onAutoDispense?: (recommendation: GemstoneRecommendation) => void;
}

export const GemstonePrescription: React.FC<GemstonePrescriptionProps> = ({
  recommendations,
  subjectName,
  selectedLanguage = 'en',
  onNavigateToVault,
  onBookConsultation,
  onAutoDispense,
}) => {
  const t = (key: string) => getTranslation(key, selectedLanguage);

  return (
    <div className="bg-[#120408] border border-red-900/60 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6 text-slate-100 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-red-950/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Outfit',sans-serif]">
            <Gem className="w-5 h-5 text-orange-500" />
            <span>{t('gemstonePrescription')}</span>
            <span className="text-[10px] bg-emerald-950/80 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-700/60">
              1-Click Auto Dispensing
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Planetary remedial gemstones calculated based on <span className="text-orange-300 font-semibold">{subjectName}</span>'s Ascendant and trine lords.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToVault && (
            <button
              onClick={onNavigateToVault}
              className="px-3.5 py-1.5 bg-[#1a060e] hover:bg-[#250814] text-orange-300 rounded-xl border border-orange-600/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Gem className="w-3.5 h-3.5 text-orange-400" />
              <span>View Certified Stock in Vault</span>
            </button>
          )}
        </div>
      </div>

      {/* Gemstone Recommendation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {recommendations.map((gem, index) => {
          const isPrimary = index === 0;
          const translatedGemName = getGemstoneName(gem.stone, selectedLanguage);
          const translatedPlanet = getPlanetName(gem.planet, selectedLanguage);

          return (
            <div
              key={`gem-rec-${index}`}
              className={`rounded-2xl p-5 border relative flex flex-col justify-between transition-all duration-200 ${
                isPrimary
                  ? 'bg-[#18050e] border-orange-500/50 shadow-md shadow-orange-950/30'
                  : 'bg-[#14050a] border-red-950/80 hover:border-orange-500/30'
              }`}
            >
              {isPrimary && (
                <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full shadow-md">
                  {t('lifeStone')}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider">
                      Ruling Graha: {translatedPlanet}
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5 flex items-center gap-1.5 font-['Outfit',sans-serif]">
                      {translatedGemName}
                    </h4>
                    <span className="text-xs text-slate-400 font-medium font-serif">
                      {gem.sanskritName} • {gem.stone}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    gem.suitability === 'Highly Recommended'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                      : 'bg-orange-950/80 text-orange-300 border border-orange-700/60'
                  }`}>
                    {gem.suitability}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-[#100307] p-3 rounded-xl border border-red-950">
                  {gem.reason}
                </p>

                {/* Practical Wearing Guidelines */}
                <div className="space-y-2 text-xs pt-1 border-t border-red-950/80">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>{t('prescribedWeight')}:</span>
                    <span className="font-semibold text-white">{gem.weightSuggestion}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>{t('recommendedMetal')}:</span>
                    <span className="font-semibold text-white">{gem.metalSuggestion}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>{t('auspiciousFinger')}:</span>
                    <span className="font-semibold text-orange-300">{gem.finger}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Auspicious Muhurta (वार):</span>
                    <span className="font-semibold text-amber-300">{gem.auspiciousDay}</span>
                  </div>
                </div>

                {/* Vedic Pran Pratishtha Mantra */}
                <div className="p-3 bg-[#1e0810] border border-amber-500/30 rounded-xl">
                  <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block mb-1">
                    {t('chantMantra')}:
                  </span>
                  <p className="text-xs font-mono text-amber-200 italic font-semibold">
                    "{gem.mantra}"
                  </p>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-5 pt-3.5 border-t border-red-950/80 space-y-2">
                {onAutoDispense && (
                  <button
                    type="button"
                    onClick={() => onAutoDispense(gem)}
                    className="w-full py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>⚡ Auto-Dispense & Issue Sale Invoice</span>
                  </button>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>100% Certified Natural</span>
                  </div>
                  {onBookConsultation && (
                    <button
                      onClick={onBookConsultation}
                      className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>Consult Astrologer</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
