/**
 * Planetary Positions Table & Element/Modality Balance Component
 * Multilingual Indian Language support (Hindi, Sanskrit, Gujarati, Marathi, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi, Odia, English)
 * Styled in the Executive Command Center Theme (#0e0307 background, red/orange accents, Outfit/Cinzel typography)
 */

import React from 'react';
import { AstrologyChartData } from '../../types';
import { Flame, Mountain, Wind, Droplet, Zap, Sparkles } from 'lucide-react';
import { LanguageCode, getPlanetName, getSignName, getTranslation } from '../../utils/indianLanguages';

interface PlanetaryTableProps {
  chartData: AstrologyChartData;
  selectedLanguage?: LanguageCode;
}

export const PlanetaryTable: React.FC<PlanetaryTableProps> = ({ chartData, selectedLanguage = 'en' }) => {
  const { planets, interpretations } = chartData;
  const { elementDistribution, modalityDistribution } = interpretations;

  const t = (key: string) => getTranslation(key, selectedLanguage);

  return (
    <div className="space-y-6 font-sans">
      {/* Planetary Table */}
      <div className="bg-[#120408] border border-red-900/60 rounded-2xl p-5 sm:p-6 shadow-xl overflow-hidden text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-['Outfit',sans-serif]">
            <span className="text-orange-500 font-bold text-base">☉</span>
            <span>{t('planetaryPositions')}</span>
          </h3>
          <span className="text-xs text-orange-400/80 font-mono">
            {chartData.zodiacSystem === 'tropical' ? 'Tropical Zodiac' : 'Sidereal (Lahiri / Vedic)'} • {chartData.houseSystem.toUpperCase()} Houses
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#1a060d] text-orange-300 uppercase font-semibold tracking-wider border-b border-red-950">
                <th className="py-3 px-3.5">Graha / Planet</th>
                <th className="py-3 px-3.5">Rashi / Sign</th>
                <th className="py-3 px-3.5">Degrees (अंश)</th>
                <th className="py-3 px-3.5">Bhava / House</th>
                <th className="py-3 px-3.5">Motion (गति)</th>
                <th className="py-3 px-3.5">Dignity / बल</th>
                <th className="py-3 px-3.5">Element / तत्त्व</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-950/60 font-medium">
              {planets.map((planet) => (
                <tr key={planet.name} className="hover:bg-red-950/20 transition">
                  <td className="py-3 px-3.5 flex items-center gap-2 text-white font-semibold">
                    <span className="text-sm text-orange-400 font-bold w-4 text-center">{planet.symbol}</span>
                    <span>{getPlanetName(planet.name, selectedLanguage)}</span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-200">
                    <span className="mr-1.5 text-orange-400 font-bold">{planet.signSymbol}</span>
                    <span className="font-semibold">{getSignName(planet.sign, selectedLanguage)}</span>
                  </td>
                  <td className="py-3 px-3.5 font-mono text-orange-300 font-semibold">
                    {planet.formattedDegrees}
                  </td>
                  <td className="py-3 px-3.5 text-slate-200 font-semibold">
                    {t('house')} {planet.house}
                  </td>
                  <td className="py-3 px-3.5">
                    {planet.isRetrograde ? (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <span className="text-[10px] bg-rose-950/80 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800/80">Rx</span>
                        {t('retrograde')}
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">
                        {t('direct')}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                      planet.dignity === 'Rulership' ? 'bg-orange-950/80 text-orange-300 border border-orange-700/60' :
                      planet.dignity === 'Exalted' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60' :
                      planet.dignity === 'Fall' ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80' :
                      planet.dignity === 'Detriment' ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60' :
                      'text-slate-400'
                    }`}>
                      {planet.dignity}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      {planet.element === 'Fire' && <Flame className="w-3.5 h-3.5 text-orange-400" />}
                      {planet.element === 'Earth' && <Mountain className="w-3.5 h-3.5 text-emerald-400" />}
                      {planet.element === 'Air' && <Wind className="w-3.5 h-3.5 text-amber-400" />}
                      {planet.element === 'Water' && <Droplet className="w-3.5 h-3.5 text-cyan-400" />}
                      <span>{planet.element}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Elemental & Modality Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Elements */}
        <div className="bg-[#120408] border border-red-900/60 rounded-2xl p-5 sm:p-6 shadow-xl text-slate-100">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center justify-between font-['Outfit',sans-serif]">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400" />
              <span>Elemental Balance / पञ्चमहाभूत</span>
            </span>
            <span className="text-xs text-orange-400 font-semibold px-2 py-0.5 bg-red-950/80 border border-orange-600/40 rounded-lg">
              Dominant: {elementDistribution.dominantElement}
            </span>
          </h4>
          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-200 mb-1.5">
                <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-orange-400" /> Fire / अग्नि (Aries, Leo, Sag)</span>
                <span className="font-semibold text-orange-400">{elementDistribution.fire} planets</span>
              </div>
              <div className="w-full bg-[#1e070e] rounded-full h-2">
                <div className="bg-gradient-to-r from-red-600 to-orange-500 h-2 rounded-full transition-all" style={{ width: `${(elementDistribution.fire / 10) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-200 mb-1.5">
                <span className="flex items-center gap-1.5"><Mountain className="w-3.5 h-3.5 text-emerald-400" /> Earth / पृथ्वी (Taurus, Virgo, Cap)</span>
                <span className="font-semibold text-emerald-400">{elementDistribution.earth} planets</span>
              </div>
              <div className="w-full bg-[#1e070e] rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${(elementDistribution.earth / 10) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-200 mb-1.5">
                <span className="flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-amber-400" /> Air / वायु (Gemini, Libra, Aqu)</span>
                <span className="font-semibold text-amber-400">{elementDistribution.air} planets</span>
              </div>
              <div className="w-full bg-[#1e070e] rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${(elementDistribution.air / 10) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-200 mb-1.5">
                <span className="flex items-center gap-1.5"><Droplet className="w-3.5 h-3.5 text-cyan-400" /> Water / जल (Cancer, Scorpio, Pis)</span>
                <span className="font-semibold text-cyan-400">{elementDistribution.water} planets</span>
              </div>
              <div className="w-full bg-[#1e070e] rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full transition-all" style={{ width: `${(elementDistribution.water / 10) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Modalities */}
        <div className="bg-[#120408] border border-red-900/60 rounded-2xl p-5 sm:p-6 shadow-xl text-slate-100">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center justify-between font-['Outfit',sans-serif]">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Quadruplicities / स्वभाव</span>
            </span>
            <span className="text-xs text-orange-400 font-semibold px-2 py-0.5 bg-red-950/80 border border-orange-600/40 rounded-lg">
              Dominant: {modalityDistribution.dominantModality}
            </span>
          </h4>
          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-200 mb-1.5">
                <span>Cardinal / चर राशि (Initiative, Dynamic)</span>
                <span className="font-semibold text-orange-400">{modalityDistribution.cardinal} planets</span>
              </div>
              <div className="w-full bg-[#1e070e] rounded-full h-2">
                <div className="bg-gradient-to-r from-red-600 to-orange-500 h-2 rounded-full transition-all" style={{ width: `${(modalityDistribution.cardinal / 10) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-200 mb-1.5">
                <span>Fixed / स्थिर राशि (Stability, Resolve)</span>
                <span className="font-semibold text-orange-400">{modalityDistribution.fixed} planets</span>
              </div>
              <div className="w-full bg-[#1e070e] rounded-full h-2">
                <div className="bg-gradient-to-r from-red-600 to-orange-500 h-2 rounded-full transition-all" style={{ width: `${(modalityDistribution.fixed / 10) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-200 mb-1.5">
                <span>Mutable / द्विस्वभाव राशि (Adaptability, Synthesis)</span>
                <span className="font-semibold text-orange-400">{modalityDistribution.mutable} planets</span>
              </div>
              <div className="w-full bg-[#1e070e] rounded-full h-2">
                <div className="bg-gradient-to-r from-red-600 to-orange-500 h-2 rounded-full transition-all" style={{ width: `${(modalityDistribution.mutable / 10) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
