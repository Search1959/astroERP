/**
 * Astrological Aspects Matrix & Table Component
 */

import React from 'react';
import { Aspect } from '../../types';

interface AspectsMatrixProps {
  aspects: Aspect[];
}

export const AspectsMatrix: React.FC<AspectsMatrixProps> = ({ aspects }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="text-indigo-600 font-bold text-base">☌</span> Major Planetary Aspects & Orbs
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          Total Aspects Detected: {aspects.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {aspects.map((asp, idx) => (
          <div
            key={`aspect-card-${idx}`}
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-300 transition flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm ${
                asp.nature === 'Harmonious' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                asp.nature === 'Dynamic' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                'bg-violet-50 text-violet-700 border border-violet-200'
              }`}>
                {asp.symbol}
              </span>
              <div>
                <div className="font-semibold text-slate-900">
                  {asp.planet1} <span className="text-slate-500 text-[10px] font-normal">{asp.aspectType}</span> {asp.planet2}
                </div>
                <div className="text-[11px] text-slate-500">
                  {asp.angle.toFixed(1)}° (Orb: {asp.orb.toFixed(1)}°)
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                asp.nature === 'Harmonious' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' :
                asp.nature === 'Dynamic' ? 'text-rose-700 bg-rose-50 border border-rose-200' :
                'text-indigo-700 bg-indigo-50 border border-indigo-200'
              }`}>
                {asp.nature}
              </span>
              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                {asp.isApplying ? 'Applying' : 'Separating'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
