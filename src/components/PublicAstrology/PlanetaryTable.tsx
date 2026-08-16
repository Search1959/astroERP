/**
 * Planetary Positions Table & Element/Modality Balance Component
 * Multilingual Indian Language support (Hindi, Sanskrit, Gujarati, Marathi, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi, Odia, English)
 */

import React from 'react';
import { AstrologyChartData } from '../../types';
import { Flame, Mountain, Wind, Droplet, Zap } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Planetary Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm overflow-hidden text-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="text-indigo-600 font-bold text-base">☉</span>
            {t('planetaryPositions')}
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {chartData.zodiacSystem === 'tropical' ? 'Tropical Zodiac' : 'Sidereal (Lahiri / Vedic)'} • {chartData.houseSystem.toUpperCase()} Houses
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-semibold tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-3">Graha / Planet</th>
                <th className="py-2.5 px-3">Rashi / Sign</th>
                <th className="py-2.5 px-3">Degrees (अंश)</th>
                <th className="py-2.5 px-3">Bhava / House</th>
                <th className="py-2.5 px-3">Motion (गति)</th>
                <th className="py-2.5 px-3">Dignity / बल</th>
                <th className="py-2.5 px-3">Element / तत्त्व</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {planets.map((planet) => (
                <tr key={planet.name} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-3 flex items-center gap-2 text-slate-900 font-semibold">
                    <span className="text-sm text-indigo-600 font-bold w-4 text-center">{planet.symbol}</span>
                    <span>{getPlanetName(planet.name, selectedLanguage)}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">
                    <span className="mr-1.5 text-indigo-600 font-bold">{planet.signSymbol}</span>
                    <span className="font-semibold">{getSignName(planet.sign, selectedLanguage)}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-indigo-700 font-semibold">
                    {planet.formattedDegrees}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 font-semibold">
                    {t('house')} {planet.house}
                  </td>
                  <td className="py-2.5 px-3">
                    {planet.isRetrograde ? (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">Rx</span>
                        {t('retrograde')}
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">
                        {t('direct')}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                      planet.dignity === 'Rulership' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      planet.dignity === 'Exalted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      planet.dignity === 'Fall' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      planet.dignity === 'Detriment' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'text-slate-500'
                    }`}>
                      {planet.dignity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      {planet.element === 'Fire' && <Flame className="w-3 h-3 text-rose-500" />}
                      {planet.element === 'Earth' && <Mountain className="w-3 h-3 text-emerald-600" />}
                      {planet.element === 'Air' && <Wind className="w-3 h-3 text-amber-500" />}
                      {planet.element === 'Water' && <Droplet className="w-3 h-3 text-cyan-600" />}
                      {planet.element}
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
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-slate-800">
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Elemental Balance / पञ्चमहाभूत
            </span>
            <span className="text-xs text-indigo-600 font-semibold">
              Dominant: {elementDistribution.dominantElement}
            </span>
          </h4>
          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-rose-500" /> Fire / अग्नि (Aries, Leo, Sag)</span>
                <span className="font-semibold text-rose-600">{elementDistribution.fire} planets</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-rose-500 h-2 rounded-full transition-all" style={{ width: `${(elementDistribution.fire / 10) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span className="flex items-center gap-1"><Mountain className="w-3 h-3 text-emerald-600" /> Earth / पृथ्वी (Taurus, Virgo, Cap)</span>
                <span className="font-semibold text-emerald-700">{elementDistribution.earth} planets</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${(elementDistribution.earth / 10) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-amber-500" /> Air / वायु (Gemini, Libra, Aqu)</span>
                <span className="font-semibold text-amber-600">{elementDistribution.air} planets</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${(elementDistribution.air / 10) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span className="flex items-center gap-1"><Droplet className="w-3 h-3 text-cyan-600" /> Water / जल (Cancer, Scorpio, Pis)</span>
                <span className="font-semibold text-cyan-700">{elementDistribution.water} planets</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full transition-all" style={{ width: `${(elementDistribution.water / 10) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Modalities */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-slate-800">
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-500" /> Quadruplicities / स्वभाव
            </span>
            <span className="text-xs text-indigo-600 font-semibold">
              Dominant: {modalityDistribution.dominantModality}
            </span>
          </h4>
          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Cardinal / चर राशि (Initiative, Dynamic)</span>
                <span className="font-semibold text-indigo-700">{modalityDistribution.cardinal} planets</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${(modalityDistribution.cardinal / 10) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Fixed / स्थिर राशि (Stability, Resolve)</span>
                <span className="font-semibold text-indigo-700">{modalityDistribution.fixed} planets</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${(modalityDistribution.fixed / 10) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Mutable / द्विस्वभाव राशि (Adaptability, Synthesis)</span>
                <span className="font-semibold text-indigo-700">{modalityDistribution.mutable} planets</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${(modalityDistribution.mutable / 10) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
