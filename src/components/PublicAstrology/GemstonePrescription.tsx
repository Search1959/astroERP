/**
 * Astrological Gemstone Prescription Component (Ratna Jyotish)
 * Multilingual Indian Language support (Hindi, Sanskrit, Gujarati, Marathi, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi, Odia, English)
 * Formula-based Life Stone, Lucky Stone, Weight, Metal, Finger, Mantra,
 * and direct links to check Vault Inventory or Book Consultation.
 */

import React from 'react';
import { GemstoneRecommendation } from '../../types';
import { Gem, ShieldCheck, ArrowRight } from 'lucide-react';
import { LanguageCode, getGemstoneName, getPlanetName, getTranslation } from '../../utils/indianLanguages';

interface GemstonePrescriptionProps {
  recommendations: GemstoneRecommendation[];
  subjectName: string;
  selectedLanguage?: LanguageCode;
  onNavigateToVault?: () => void;
  onBookConsultation?: () => void;
}

export const GemstonePrescription: React.FC<GemstonePrescriptionProps> = ({
  recommendations,
  subjectName,
  selectedLanguage = 'en',
  onNavigateToVault,
  onBookConsultation,
}) => {
  const t = (key: string) => getTranslation(key, selectedLanguage);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 text-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Gem className="w-5 h-5 text-indigo-600" />
            {t('gemstonePrescription')}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Planetary remedial gemstones calculated based on {subjectName}'s Ascendant and trine lords.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToVault && (
            <button
              onClick={onNavigateToVault}
              className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Gem className="w-3.5 h-3.5" />
              View Certified Stock in Vault
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
              className={`rounded-xl p-5 border relative flex flex-col justify-between transition-all duration-200 ${
                isPrimary
                  ? 'bg-indigo-50/40 border-indigo-200 shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              {isPrimary && (
                <div className="absolute -top-2.5 right-4 bg-indigo-600 text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  {t('lifeStone')}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                      Ruling Graha: {translatedPlanet}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      {translatedGemName}
                    </h4>
                    <span className="text-xs text-slate-600 font-medium font-serif">
                      {gem.sanskritName} • {gem.stone}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    gem.suitability === 'Highly Recommended'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {gem.suitability}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                  {gem.reason}
                </p>

                {/* Practical Wearing Guidelines */}
                <div className="space-y-2 text-xs pt-1 border-t border-slate-200">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>{t('prescribedWeight')}:</span>
                    <span className="font-semibold text-slate-900">{gem.weightSuggestion}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>{t('recommendedMetal')}:</span>
                    <span className="font-semibold text-slate-900">{gem.metalSuggestion}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>{t('auspiciousFinger')}:</span>
                    <span className="font-semibold text-indigo-700">{gem.finger}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Auspicious Muhurta (वार):</span>
                    <span className="font-semibold text-amber-700">{gem.auspiciousDay}</span>
                  </div>
                </div>

                {/* Vedic Pran Pratishtha Mantra */}
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
                  <span className="text-[10px] text-amber-800 uppercase font-bold tracking-wider block mb-1">
                    {t('chantMantra')}:
                  </span>
                  <p className="text-xs font-mono text-amber-900 italic font-semibold">
                    "{gem.mantra}"
                  </p>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Certified Natural
                </div>
                {onBookConsultation && (
                  <button
                    onClick={onBookConsultation}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    Consult Astrologer <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
