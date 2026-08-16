/**
 * Astrological Formula-Based Interpretation View
 * Ascendant personality, Sun Life Purpose, Moon Subconscious,
 * Planetary house placements, and karmic destiny.
 * Supports Multilingual Indian Languages.
 */

import React, { useState } from 'react';
import { AstrologyInterpretation } from '../../types';
import { Sparkles, Sun, Moon, Compass, BookOpen, Star } from 'lucide-react';
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
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 text-slate-800">
      {/* Header and Tab switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Formula-Based Astrological Synthesis (जन्म कुण्डली फल)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Dignity-based analysis calculated for {subjectName}
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('core')}
            className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
              activeTab === 'core' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Core Archetype (लग्न / सूर्य / चन्द्र)
          </button>
          <button
            onClick={() => setActiveTab('planets')}
            className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
              activeTab === 'planets' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Planetary Houses ({planetaryPlacements.length} भाव)
          </button>
          <button
            onClick={() => setActiveTab('aspects')}
            className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
              activeTab === 'aspects' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-slate-700 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-indigo-900 block mb-1">Cosmic Soul Blueprint Summary (कर्म व भाग्य योग)</span>
              {karmicDestinySummary}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ascendant Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                <Compass className="w-4 h-4" />
                <span>Ascendant / {getPlanetName('Ascendant', selectedLanguage)}</span>
              </div>
              <div className="text-base font-bold text-slate-900">
                {getSignName(coreAscendant.sign, selectedLanguage)} Rising
              </div>
              <div className="text-xs text-indigo-600 font-semibold">
                {coreAscendant.title}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {coreAscendant.description}
              </p>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                <div><span className="text-slate-800 font-semibold">Physical Aura:</span> {coreAscendant.physicalTraits}</div>
                <div><span className="text-slate-800 font-semibold">Life Strategy:</span> {coreAscendant.lifeApproach}</div>
              </div>
            </div>

            {/* Sun Sign Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <Sun className="w-4 h-4" />
                <span>{getPlanetName('Sun', selectedLanguage)} in {getSignName(coreSun.sign, selectedLanguage)}</span>
              </div>
              <div className="text-base font-bold text-slate-900">
                House {coreSun.house} • {coreSun.title}
              </div>
              <div className="text-xs text-amber-700 font-semibold">
                Vitality & Soul Purpose
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {coreSun.soulPurpose}
              </p>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                <div><span className="text-slate-800 font-semibold">Challenges:</span> {coreSun.challenges || 'Balancing personal will with collective harmony.'}</div>
                <div><span className="text-slate-800 font-semibold">Soul Purpose:</span> {coreSun.description}</div>
              </div>
            </div>

            {/* Moon Sign Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3">
              <div className="flex items-center gap-2 text-cyan-600 font-bold text-sm">
                <Moon className="w-4 h-4" />
                <span>{getPlanetName(coreMoon.sign, selectedLanguage)} in {getSignName(coreMoon.sign, selectedLanguage)}</span>
              </div>
              <div className="text-base font-bold text-slate-900">
                House {coreMoon.house} • {coreMoon.title}
              </div>
              <div className="text-xs text-cyan-700 font-semibold">
                Subconscious Mind & Intuition
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {coreMoon.emotionalNeeds}
              </p>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                <div><span className="text-slate-800 font-semibold">Instincts:</span> {coreMoon.instincts || 'Deep intuitive reflexes and protective emotional sanctuary.'}</div>
                <div><span className="text-slate-800 font-semibold">Subconscious:</span> {coreMoon.description}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Planetary Houses */}
      {activeTab === 'planets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {planetaryPlacements.map((placement, i) => (
            <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span className="text-indigo-600 font-bold">●</span>
                  {getPlanetName(placement.planet, selectedLanguage)} in {getSignName(placement.sign, selectedLanguage)}
                </span>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded font-semibold text-[11px]">
                  {t('house')} {placement.house}
                </span>
              </div>
              <p className="text-slate-700 font-medium">Dignity: {placement.dignity}</p>
              <p className="text-slate-600 leading-relaxed">{placement.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Aspect Synthesis */}
      {activeTab === 'aspects' && (
        <div className="space-y-3">
          {aspectInterpretations.map((asp, i) => (
            <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs">
              <div className={`p-2 rounded-lg shrink-0 ${
                asp.nature === 'Harmonious' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                asp.nature === 'Dynamic' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                'bg-indigo-50 text-indigo-600 border border-indigo-200'
              }`}>
                <Star className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {getPlanetName(asp.planet1, selectedLanguage)} {asp.aspect} {getPlanetName(asp.planet2, selectedLanguage)}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    asp.nature === 'Harmonious' ? 'bg-emerald-100 text-emerald-800' :
                    asp.nature === 'Dynamic' ? 'bg-rose-100 text-rose-800' :
                    'bg-indigo-100 text-indigo-800'
                  }`}>
                    {asp.nature}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{asp.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
