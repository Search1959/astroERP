/**
 * Astrological Formula-Based Interpretation View
 * Ascendant personality, Sun Life Purpose, Moon Subconscious,
 * Planetary house placements, and karmic destiny.
 * Supports Multilingual Indian Languages.
 * Styled in the Executive Command Center Theme (#0e0307 background, red/orange accents, Outfit/Cinzel typography)
 */

import React, { useState } from 'react';
import { AstrologyInterpretation } from '../../types';
import { Sparkles, Sun, Moon, Compass, BookOpen, Star, Flame } from 'lucide-react';
import { LanguageCode, getPlanetName, getSignName, getTranslation } from '../../utils/indianLanguages';

interface InterpretationViewProps {
  interpretations: AstrologyInterpretation;
  subjectName: string;
  selectedLanguage?: LanguageCode;
}

export const InterpretationView: React.FC<InterpretationViewProps> = ({
  interpretations,
  subjectName,
  selectedLanguage = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<'core' | 'planets' | 'aspects'>('core');
  const { coreAscendant, coreSun, coreMoon, planetaryPlacements, aspectInterpretations, karmicDestinySummary } = interpretations;

  const t = (key: string) => getTranslation(key, selectedLanguage);

  return (
    <div className="bg-[#120408] border border-red-900/60 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6 text-slate-100 font-sans">
      {/* Header and Tab switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-red-950/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Outfit',sans-serif]">
            <BookOpen className="w-5 h-5 text-orange-500" />
            <span>Formula-Based Astrological Synthesis (जन्म कुण्डली फल)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Dignity-based analysis calculated for <span className="text-orange-300 font-semibold">{subjectName}</span>
          </p>
        </div>

        <div className="flex items-center bg-[#18050d] p-1 rounded-xl border border-red-950 text-xs">
          <button
            onClick={() => setActiveTab('core')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'core'
                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Core Archetype (लग्न / सूर्य / चन्द्र)
          </button>
          <button
            onClick={() => setActiveTab('planets')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'planets'
                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Planetary Houses ({planetaryPlacements.length} भाव)
          </button>
          <button
            onClick={() => setActiveTab('aspects')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'aspects'
                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aspect Synthesis (दृष्टि)
          </button>
        </div>
      </div>

      {/* Tab 1: Core Archetype */}
      {activeTab === 'core' && (
        <div className="space-y-5">
          {/* Karmic Overview Banner */}
          <div className="p-4 bg-[#1a060e] border border-orange-600/30 rounded-xl text-xs text-slate-200 flex items-start gap-3 shadow-inner">
            <Sparkles className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-orange-300 block mb-1 font-['Outfit',sans-serif]">
                Cosmic Soul Blueprint Summary (कर्म व भाग्य योग)
              </span>
              <span className="leading-relaxed text-slate-300">{karmicDestinySummary}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ascendant Card */}
            <div className="bg-[#16050b] border border-red-950/80 rounded-xl p-4.5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-sm font-['Outfit',sans-serif]">
                <Compass className="w-4 h-4" />
                <span>Ascendant / {getPlanetName('Ascendant', selectedLanguage)}</span>
              </div>
              <div className="text-base font-bold text-white">
                {getSignName(coreAscendant.sign, selectedLanguage)} Rising
              </div>
              <div className="text-xs text-orange-400/90 font-semibold">
                {coreAscendant.title}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {coreAscendant.description}
              </p>
              <div className="pt-2.5 border-t border-red-950/80 text-[11px] text-slate-400 space-y-1">
                <div><span className="text-orange-300 font-semibold">Physical Aura:</span> {coreAscendant.physicalTraits}</div>
                <div><span className="text-orange-300 font-semibold">Life Strategy:</span> {coreAscendant.lifeApproach}</div>
              </div>
            </div>

            {/* Sun Sign Card */}
            <div className="bg-[#16050b] border border-red-950/80 rounded-xl p-4.5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm font-['Outfit',sans-serif]">
                <Sun className="w-4 h-4" />
                <span>{getPlanetName('Sun', selectedLanguage)} in {getSignName(coreSun.sign, selectedLanguage)}</span>
              </div>
              <div className="text-base font-bold text-white">
                House {coreSun.house} • {coreSun.title}
              </div>
              <div className="text-xs text-amber-400/90 font-semibold">
                Vitality & Soul Purpose
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {coreSun.soulPurpose}
              </p>
              <div className="pt-2.5 border-t border-red-950/80 text-[11px] text-slate-400 space-y-1">
                <div><span className="text-amber-300 font-semibold">Challenges:</span> {coreSun.challenges || 'Balancing personal will with collective harmony.'}</div>
                <div><span className="text-amber-300 font-semibold">Soul Purpose:</span> {coreSun.description}</div>
              </div>
            </div>

            {/* Moon Sign Card */}
            <div className="bg-[#16050b] border border-red-950/80 rounded-xl p-4.5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm font-['Outfit',sans-serif]">
                <Moon className="w-4 h-4" />
                <span>{getPlanetName(coreMoon.sign, selectedLanguage)} in {getSignName(coreMoon.sign, selectedLanguage)}</span>
              </div>
              <div className="text-base font-bold text-white">
                House {coreMoon.house} • {coreMoon.title}
              </div>
              <div className="text-xs text-cyan-400/90 font-semibold">
                Subconscious Mind & Intuition
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {coreMoon.emotionalNeeds}
              </p>
              <div className="pt-2.5 border-t border-red-950/80 text-[11px] text-slate-400 space-y-1">
                <div><span className="text-cyan-300 font-semibold">Instincts:</span> {coreMoon.instincts || 'Deep intuitive reflexes and protective emotional sanctuary.'}</div>
                <div><span className="text-cyan-300 font-semibold">Subconscious:</span> {coreMoon.description}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Planetary Houses */}
      {activeTab === 'planets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {planetaryPlacements.map((placement, i) => (
            <div key={i} className="p-4 bg-[#16050b] border border-red-950/80 rounded-xl space-y-2 text-xs shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm flex items-center gap-1.5 font-['Outfit',sans-serif]">
                  <span className="text-orange-500 font-bold">●</span>
                  <span>{getPlanetName(placement.planet, selectedLanguage)} in {getSignName(placement.sign, selectedLanguage)}</span>
                </span>
                <span className="px-2 py-0.5 bg-orange-950/80 text-orange-300 border border-orange-700/60 rounded-lg font-semibold text-[11px]">
                  {t('house')} {placement.house}
                </span>
              </div>
              <p className="text-orange-400/90 font-medium">Dignity: {placement.dignity}</p>
              <p className="text-slate-300 leading-relaxed">{placement.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Aspect Synthesis */}
      {activeTab === 'aspects' && (
        <div className="space-y-3">
          {aspectInterpretations.map((asp, i) => (
            <div key={i} className="p-4 bg-[#16050b] border border-red-950/80 rounded-xl flex items-start gap-3 text-xs shadow-sm">
              <div className={`p-2 rounded-lg shrink-0 ${
                asp.nature === 'Harmonious' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60' :
                asp.nature === 'Dynamic' ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80' :
                'bg-orange-950/80 text-orange-300 border border-orange-700/60'
              }`}>
                <Star className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm font-['Outfit',sans-serif]">
                    {getPlanetName(asp.planet1, selectedLanguage)} {asp.aspect} {getPlanetName(asp.planet2, selectedLanguage)}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    asp.nature === 'Harmonious' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' :
                    asp.nature === 'Dynamic' ? 'bg-rose-950 text-rose-300 border border-rose-800/80' :
                    'bg-orange-950 text-orange-300 border border-orange-700/60'
                  }`}>
                    {asp.nature}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{asp.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
