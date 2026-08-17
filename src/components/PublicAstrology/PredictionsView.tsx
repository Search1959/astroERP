/**
 * Astrological Life Predictions & Transit Forecast View
 * Supports Weekly, Monthly, and Yearly timeframes formatted for effortless
 * understanding by everyday individuals and clients across 12 Indian Languages.
 * Styled in the Executive Command Center Theme (#0e0307 background, red/orange accents, Outfit/Cinzel typography)
 */

import React, { useState } from 'react';
import { AstrologyChartData, AstrologyPredictions, TimeframePrediction } from '../../types';
import {
  Sparkles,
  Calendar,
  Briefcase,
  Heart,
  Activity,
  CheckCircle,
  AlertTriangle,
  Compass,
  Zap,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Gem,
  Award,
  ExternalLink,
  Flame,
} from 'lucide-react';
import {
  LanguageCode,
  getTranslation,
  getGemstoneName,
  getStatusName,
} from '../../utils/indianLanguages';
import { generateAstrologicalPredictions } from '../../utils/predictionEngine';

interface PredictionsViewProps {
  chartData: AstrologyChartData;
  selectedLanguage?: LanguageCode;
  onOpenDedicatedWindow?: () => void;
}

export const PredictionsView: React.FC<PredictionsViewProps> = ({
  chartData,
  selectedLanguage = 'en',
  onOpenDedicatedWindow,
}) => {
  const [activePeriod, setActivePeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [showTransits, setShowTransits] = useState<boolean>(false);

  const t = (key: string) => getTranslation(key, selectedLanguage);

  const sun = chartData.planets.find(p => p.name === 'Sun');
  const moon = chartData.planets.find(p => p.name === 'Moon');
  const ascendant = chartData.interpretations?.coreAscendant?.sign || 'Aries';
  const moonSign = moon?.sign || 'Taurus';
  const sunSign = sun?.sign || 'Leo';
  const primaryGemstone = chartData.interpretations?.gemstoneRecommendations?.[0]?.stone || 'Yellow Sapphire';

  // Compute predictions dynamically based on the current selected language
  const predictions: AstrologyPredictions = generateAstrologicalPredictions({
    subjectName: chartData.subjectName,
    ascendantSign: ascendant,
    moonSign,
    sunSign,
    planets: chartData.planets,
    houses: chartData.houses,
    gemstoneName: primaryGemstone,
    language: selectedLanguage,
  });

  const currentPrediction: TimeframePrediction = predictions[activePeriod];

  // Helper for status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
      case 'Favorable':
        return 'bg-orange-950/80 text-orange-300 border-orange-700/60';
      case 'Steady':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/60';
      case 'Caution':
        return 'bg-rose-950/80 text-rose-300 border-rose-800/80';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-[#120408] border border-red-900/60 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6 text-slate-100 font-sans">
      {/* Header & Timeframe Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-950/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1c060e] border border-orange-600/40 rounded-xl text-orange-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                {t('predictionsTitle')}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('predictionsSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Timeframe Selector Tabs & Dedicated Window Launcher */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="flex items-center bg-[#18050d] p-1.5 rounded-xl border border-red-950 text-xs font-semibold shadow-inner">
            <button
              type="button"
              id="tab-prediction-weekly"
              onClick={() => setActivePeriod('weekly')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activePeriod === 'weekly'
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('weeklyForecast')}</span>
            </button>

            <button
              type="button"
              id="tab-prediction-monthly"
              onClick={() => setActivePeriod('monthly')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activePeriod === 'monthly'
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('monthlyForecast')}</span>
            </button>

            <button
              type="button"
              id="tab-prediction-yearly"
              onClick={() => setActivePeriod('yearly')}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activePeriod === 'yearly'
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{t('yearlyForecast')}</span>
            </button>
          </div>

          {onOpenDedicatedWindow && (
            <button
              type="button"
              id="btn-open-dedicated-window"
              onClick={onOpenDedicatedWindow}
              className="px-3.5 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
              title="Open Weekly, Monthly & Yearly Predictions with Full Birth Details in Dedicated Window"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('dedicatedWindow')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Period Overview Banner */}
      <div className="p-5 bg-gradient-to-br from-[#1c060e] via-[#120408] to-[#1a050d] text-white rounded-2xl shadow-xl border border-red-950/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-400/10 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{currentPrediction.timeframeLabel}</span>
            </span>
            <span className="px-3 py-1 bg-orange-500/10 text-orange-200 border border-orange-400/30 rounded-full text-xs font-medium">
              {currentPrediction.overallMood}
            </span>
          </div>

          {/* Period Score Meter */}
          <div className="flex items-center gap-2.5 bg-black/40 px-3.5 py-1.5 rounded-xl border border-red-900/60">
            <div className="text-right">
              <div className="text-[10px] text-orange-300/80 font-medium uppercase tracking-wider">{t('overallAuspiciousness')}</div>
              <div className="text-sm font-black text-amber-300">{currentPrediction.overallScore} / 100</div>
            </div>
            <div className="w-8 h-8 rounded-full border border-amber-400 flex items-center justify-center text-xs font-bold text-white bg-amber-500/20">
              <TrendingUp className="w-4 h-4 text-amber-300" />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-bold text-white leading-snug font-['Outfit',sans-serif]">
            {currentPrediction.headline}
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed mt-2 bg-[#0e0307]/80 p-3 rounded-xl border border-red-950/80">
            {currentPrediction.summary}
          </p>
        </div>
      </div>

      {/* 3 Core Life Pillars: Career & Money, Love & Family, Health & Vitality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Career, Business & Finances */}
        <div className="bg-[#16050b] border border-red-950/80 rounded-xl p-4.5 space-y-3 flex flex-col justify-between hover:border-orange-500/40 transition shadow-sm">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-sm font-['Outfit',sans-serif]">
                <div className="p-1.5 bg-[#250814] rounded-lg text-orange-400 border border-orange-600/30">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span>{t('careerAndMoney')}</span>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(currentPrediction.careerAndMoney.status)}`}>
                {getStatusName(currentPrediction.careerAndMoney.status, selectedLanguage)} ({currentPrediction.careerAndMoney.score}%)
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentPrediction.careerAndMoney.prediction}
            </p>
          </div>

          <div className="pt-2.5 border-t border-red-950/80 bg-[#1c060e] p-2.5 rounded-lg border border-orange-600/20 text-[11px] text-slate-200 flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-orange-300 block">{t('strategicAction')}:</span>
              <span className="text-slate-300">{currentPrediction.careerAndMoney.actionableTip}</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Love, Marriage & Family */}
        <div className="bg-[#16050b] border border-red-950/80 rounded-xl p-4.5 space-y-3 flex flex-col justify-between hover:border-rose-500/40 transition shadow-sm">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm font-['Outfit',sans-serif]">
                <div className="p-1.5 bg-[#250814] rounded-lg text-rose-400 border border-rose-600/30">
                  <Heart className="w-4 h-4" />
                </div>
                <span>{t('loveAndFamily')}</span>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(currentPrediction.loveAndFamily.status)}`}>
                {getStatusName(currentPrediction.loveAndFamily.status, selectedLanguage)} ({currentPrediction.loveAndFamily.score}%)
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentPrediction.loveAndFamily.prediction}
            </p>
          </div>

          <div className="pt-2.5 border-t border-red-950/80 bg-[#1c060e] p-2.5 rounded-lg border border-rose-600/20 text-[11px] text-slate-200 flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-300 block">{t('harmonizingDirective')}:</span>
              <span className="text-slate-300">{currentPrediction.loveAndFamily.actionableTip}</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Health, Energy & Vitality */}
        <div className="bg-[#16050b] border border-red-950/80 rounded-xl p-4.5 space-y-3 flex flex-col justify-between hover:border-emerald-500/40 transition shadow-sm">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-['Outfit',sans-serif]">
                <div className="p-1.5 bg-[#250814] rounded-lg text-emerald-400 border border-emerald-600/30">
                  <Activity className="w-4 h-4" />
                </div>
                <span>{t('healthAndVitality')}</span>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(currentPrediction.healthAndVitality.status)}`}>
                {getStatusName(currentPrediction.healthAndVitality.status, selectedLanguage)} ({currentPrediction.healthAndVitality.score}%)
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentPrediction.healthAndVitality.prediction}
            </p>
          </div>

          <div className="pt-2.5 border-t border-red-950/80 bg-[#1c060e] p-2.5 rounded-lg border border-emerald-600/20 text-[11px] text-slate-200 flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-300 block">{t('vitalityDirective')}:</span>
              <span className="text-slate-300">{currentPrediction.healthAndVitality.actionableTip}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Section: What is Favored vs. What to Avoid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What is Favored */}
        <div className="p-4.5 bg-[#14080e] border border-emerald-700/50 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider font-['Outfit',sans-serif]">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{t('auspiciousActivities')}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {currentPrediction.favorableActivities.map((act, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">✔</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What to Avoid */}
        <div className="p-4.5 bg-[#14080e] border border-rose-800/50 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider font-['Outfit',sans-serif]">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{t('planetaryCautions')}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {currentPrediction.cautionActivities.map((act, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold mt-0.5">✖</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lucky Elements, Remedies & Daily Affirmation */}
      <div className="p-5 bg-[#16050b] border border-red-950/80 rounded-xl space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-white font-bold text-sm font-['Outfit',sans-serif]">
          <ShieldCheck className="w-4 h-4 text-orange-400" />
          <span>{t('vedicRemediesAndMantra')}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Lucky Colors */}
          <div className="p-3 bg-[#100307] border border-red-950 rounded-xl space-y-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">{t('auspiciousColorsLabel')}</span>
            <div className="font-bold text-white flex flex-wrap gap-1">
              {currentPrediction.luckyElements.luckyColors.map((c, i) => (
                <span key={i} className="px-2 py-0.5 bg-[#1c060e] text-orange-300 border border-orange-700/40 rounded text-[11px]">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Lucky Numbers */}
          <div className="p-3 bg-[#100307] border border-red-950 rounded-xl space-y-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">{t('luckyNumbersLabel')}</span>
            <div className="font-bold text-orange-400 flex flex-wrap gap-1">
              {currentPrediction.luckyElements.luckyNumbers.map((n, i) => (
                <span key={i} className="px-2 py-0.5 bg-[#1c060e] border border-orange-600/40 text-orange-300 rounded font-black text-xs">
                  {n}
                </span>
              ))}
            </div>
          </div>

          {/* Lucky Days */}
          <div className="p-3 bg-[#100307] border border-red-950 rounded-xl space-y-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">{t('auspiciousDaysLabel')}</span>
            <div className="font-bold text-white flex flex-wrap gap-1">
              {currentPrediction.luckyElements.luckyDays.map((d, i) => (
                <span key={i} className="px-2 py-0.5 bg-[#1c060e] text-amber-300 border border-amber-600/40 rounded text-[11px]">
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Direction */}
          <div className="p-3 bg-[#100307] border border-red-950 rounded-xl space-y-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1">
              <Compass className="w-3 h-3 text-orange-400" />
              <span>{t('favorableDirectionLabel')}</span>
            </span>
            <div className="font-bold text-white text-xs">
              {currentPrediction.luckyElements.auspiciousDirection}
            </div>
          </div>
        </div>

        {/* Remedial Gemstone & Mantra */}
        <div className="pt-2 border-t border-red-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-200">
            <Gem className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <span className="font-semibold text-white">{t('lifeGemstone')}:</span>{' '}
              <span className="text-orange-300 font-bold">{getGemstoneName(currentPrediction.luckyElements.favorableGemstone, selectedLanguage)}</span>
            </span>
          </div>

          <div className="p-2.5 bg-[#1a060e] border border-orange-600/30 rounded-xl text-orange-200 text-[11px] flex-1 sm:max-w-xl">
            <span className="font-bold text-orange-300 block mb-0.5">{t('dailyVedicMantra')}:</span>
            <span className="italic text-orange-200 font-mono">{currentPrediction.luckyElements.mantraOrAffirmation}</span>
          </div>
        </div>
      </div>

      {/* Expandable Astrological Transits Underpinnings (Gochara) */}
      <div className="border border-red-950/80 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTransits(!showTransits)}
          className="w-full px-4 py-3 bg-[#16050b] hover:bg-[#1f0710] flex items-center justify-between text-xs font-bold text-white transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>{t('astrologicalTransits')}</span>
          </span>
          <span className="flex items-center gap-1 text-slate-400 text-[11px]">
            {showTransits ? 'Hide Technical Details' : 'View Astrological Basis'}
            {showTransits ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </button>

        {showTransits && (
          <div className="p-4 bg-[#100307] space-y-3 border-t border-red-950/80">
            <p className="text-xs text-slate-400">
              Astrological background explaining how current planetary transits (Gochara) interact with your birth chart houses:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentPrediction.transitInfluences.map((inf, idx) => (
                <div key={idx} className="p-3 bg-[#16050b] border border-red-950/80 rounded-xl text-xs space-y-1.5">
                  <div className="font-bold text-orange-300 flex items-center gap-1.5">
                    <span className="text-orange-500">●</span>
                    <span>{inf.planet}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{inf.transitNote}</p>
                  <div className="text-[10px] text-orange-300 font-semibold bg-red-950/80 p-1.5 rounded-lg border border-orange-700/40">
                    {inf.impactOnHouses}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
