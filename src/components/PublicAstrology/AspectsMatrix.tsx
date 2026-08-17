/**
 * Astrological Aspects Matrix & Table Component
 * Styled in the Executive Command Center Theme (#0e0307 background, red/orange accents, Outfit/Cinzel typography)
 */

import React from 'react';
import { Aspect } from '../../types';

interface AspectsMatrixProps {
  aspects: Aspect[];
}

export const AspectsMatrix: React.FC<AspectsMatrixProps> = ({ aspects }) => {
  return (
    <div className="bg-[#120408] border border-red-900/60 rounded-2xl p-5 sm:p-6 shadow-xl text-slate-100 font-sans">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-['Outfit',sans-serif]">
          <span className="text-orange-500 font-bold text-base">☌</span>
          <span>Major Planetary Aspects & Orbs</span>
        </h3>
        <span className="text-xs text-orange-400 font-medium px-2 py-0.5 bg-red-950/80 border border-orange-600/40 rounded-lg">
          Total Aspects: {aspects.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {aspects.map((asp, idx) => (
          <div
            key={`aspect-card-${idx}`}
            className="p-3.5 bg-[#16050b] border border-red-950/80 rounded-xl hover:border-orange-500/50 transition flex items-center justify-between text-xs shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                asp.nature === 'Harmonious' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60' :
                asp.nature === 'Dynamic' ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80' :
                'bg-orange-950/80 text-orange-300 border border-orange-700/60'
              }`}>
                {asp.symbol}
              </span>
              <div>
                <div className="font-semibold text-white">
                  {asp.planet1} <span className="text-orange-400/80 text-[10px] font-normal">{asp.aspectType}</span> {asp.planet2}
                </div>
                <div className="text-[11px] text-slate-400">
                  {asp.angle.toFixed(1)}° (Orb: {asp.orb.toFixed(1)}°)
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                asp.nature === 'Harmonious' ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-700/60' :
                asp.nature === 'Dynamic' ? 'text-rose-300 bg-rose-950/80 border border-rose-800/80' :
                'text-orange-300 bg-orange-950/80 border border-orange-700/60'
              }`}>
                {asp.nature}
              </span>
              <div className="text-[10px] text-slate-400 mt-1 font-medium">
                {asp.isApplying ? 'Applying' : 'Separating'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
