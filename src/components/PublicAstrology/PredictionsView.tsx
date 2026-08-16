/**
 * Astrological Life Predictions & Transit Forecast View
 * Supports Weekly, Monthly, and Yearly timeframes formatted for effortless
 * understanding by everyday individuals and clients across 12 Indian Languages.
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
  Award
} from 'lucide-react';
import { LanguageCode, getTranslation, getGemstoneName } from '../../utils/indianLanguages';
import { generateAstrologicalPredictions } from '../../utils/predictionEngine';

interface PredictionsViewProps {
  chartData: AstrologyChartData;
  selectedLanguage?: LanguageCode;
}

export const PredictionsView: React.FC<PredictionsViewProps> = ({
  chartData,
  selectedLanguage = 'en',
}) => {
  const [activePeriod, setActivePeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [showTransits, setShowTransits] = useState<boolean>(false);

  const t = (key: string) => getTranslation(key, selectedLanguage);

  // Retrieve predictions or compute dynamically if missing
  const sun = chartData.planets.find(p => p.name === 'Sun');
  const moon = chartData.planets.find(p => p.name === 'Moon');
  
  const predictions: AstrologyPredictions = chartData.interpretations?.predictions || generateAstrologicalPredictions({
    subjectName: chartData.subjectName,
    ascendantSign: chartData.interpretations.coreAscendant.sign,
    moonSign: moon?.sign || 'Taurus',
    sunSign: sun?.sign || 'Leo',
    planets: chartData.planets,
    houses: chartData.houses,
    gemstoneName: chartData.interpretations.gemstoneRecommendations[0]?.stone || 'Yellow Sapphire',
  });

  const currentPrediction: TimeframePrediction = predictions[activePeriod];

  // Helper for status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Favorable':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Steady':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Caution':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-slate-800">
      {/* Header & Timeframe Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {t('predictionsTitle')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('predictionsSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Timeframe Selector Tabs */}
        <div className="flex items-center bg-slate-100/90 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold self-start md:self-auto shadow-inner">
          <button
            type="button"
            id="tab-prediction-weekly"
            onClick={() => setActivePeriod('weekly')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activePeriod === 'weekly'
                ? 'bg-white text-indigo-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
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
                ? 'bg-white text-indigo-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
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
                ? 'bg-white text-indigo-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{t('yearlyForecast')}</span>
          </button>
        </div>
      </div>

      {/* Main Period Overview Banner */}
      <div className="p-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              {currentPrediction.timeframeLabel}
            </span>
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 rounded-full text-xs font-medium">
              {currentPrediction.overallMood}
            </span>
          </div>

          {/* Period Score Meter */}
          <div className="flex items-center gap-2.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15">
            <div className="text-right">
              <div className="text-[10px] text-indigo-200 font-medium uppercase tracking-wider">Auspicious Index</div>
              <div className="text-sm font-black text-amber-300">{currentPrediction.overallScore} / 100</div>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-amber-400 flex items-center justify-center text-xs font-bold text-white bg-amber-500/20">
              <TrendingUp className="w-4 h-4 text-amber-300" />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-bold text-white leading-snug">
            {currentPrediction.headline}
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed mt-2 bg-white/5 p-3 rounded-xl border border-white/10">
            {currentPrediction.summary}
          </p>
        </div>
      </div>

      {/* 3 Core Life Pillars: Career & Money, Love & Family, Health & Vitality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Career, Business & Finances */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3 flex flex-col justify-between hover:border-indigo-300 transition shadow-2xs">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-700">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span>{t('careerAndMoney')}</span>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(currentPrediction.careerAndMoney.status)}`}>
                {currentPrediction.careerAndMoney.status} ({currentPrediction.careerAndMoney.score}%)
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {currentPrediction.careerAndMoney.prediction}
            </p>
          </div>

          <div className="pt-2.5 border-t border-slate-200/80 bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100/80 text-[11px] text-indigo-950 flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-indigo-900 block">{t('actionableTip')}:</span>
              <span className="text-indigo-800/90">{currentPrediction.careerAndMoney.actionableTip}</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Love, Marriage & Family */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3 flex flex-col justify-between hover:border-rose-300 transition shadow-2xs">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <div className="p-1.5 bg-rose-100 rounded-lg text-rose-700">
                  <Heart className="w-4 h-4" />
                </div>
                <span>{t('loveAndFamily')}</span>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(currentPrediction.loveAndFamily.status)}`}>
                {currentPrediction.loveAndFamily.status} ({currentPrediction.loveAndFamily.score}%)
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {currentPrediction.loveAndFamily.prediction}
            </p>
          </div>

          <div className="pt-2.5 border-t border-slate-200/80 bg-rose-50/60 p-2.5 rounded-lg border border-rose-100/80 text-[11px] text-rose-950 flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-900 block">{t('actionableTip')}:</span>
              <span className="text-rose-800/90">{currentPrediction.loveAndFamily.actionableTip}</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Health, Energy & Vitality */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3 flex flex-col justify-between hover:border-emerald-300 transition shadow-2xs">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
                  <Activity className="w-4 h-4" />
                </div>
                <span>{t('healthAndVitality')}</span>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(currentPrediction.healthAndVitality.status)}`}>
                {currentPrediction.healthAndVitality.status} ({currentPrediction.healthAndVitality.score}%)
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {currentPrediction.healthAndVitality.prediction}
            </p>
          </div>

          <div className="pt-2.5 border-t border-slate-200/80 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100/80 text-[11px] text-emerald-950 flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-900 block">{t('actionableTip')}:</span>
              <span className="text-emerald-800/90">{currentPrediction.healthAndVitality.actionableTip}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Section: What is Favored vs. What to Avoid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What is Favored */}
        <div className="p-4.5 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{t('favorableActivities')}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {currentPrediction.favorableActivities.map((act, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✔</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What to Avoid */}
        <div className="p-4.5 bg-rose-50/50 border border-rose-200/80 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{t('cautionActivities')}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {currentPrediction.cautionActivities.map((act, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-600 font-bold mt-0.5">✖</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lucky Elements, Remedies & Daily Affirmation */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>{t('luckyElements')}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Lucky Colors */}
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Lucky Colors</span>
            <div className="font-bold text-slate-900 flex flex-wrap gap-1">
              {currentPrediction.luckyElements.luckyColors.map((c, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[11px]">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Lucky Numbers */}
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Lucky Numbers</span>
            <div className="font-bold text-indigo-700 flex flex-wrap gap-1">
              {currentPrediction.luckyElements.luckyNumbers.map((n, i) => (
                <span key={i} className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded font-black text-xs">
                  {n}
                </span>
              ))}
            </div>
          </div>

          {/* Lucky Days */}
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Auspicious Days</span>
            <div className="font-bold text-slate-900 flex flex-wrap gap-1">
              {currentPrediction.luckyElements.luckyDays.map((d, i) => (
                <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[11px]">
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Direction */}
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
            <span className="text-[10px] font-semibold text-slate-500 uppercase flex items-center gap-1">
              <Compass className="w-3 h-3 text-slate-400" />
              <span>Auspicious Direction</span>
            </span>
            <div className="font-bold text-slate-900 text-xs">
              {currentPrediction.luckyElements.auspiciousDirection}
            </div>
          </div>
        </div>

        {/* Remedial Gemstone & Mantra */}
        <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Gem className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <span className="font-semibold text-slate-900">Recommended Ratna:</span>{' '}
              {getGemstoneName(currentPrediction.luckyElements.favorableGemstone, selectedLanguage)}
            </span>
          </div>

          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900 text-[11px] flex-1 sm:max-w-xl">
            <span className="font-bold block mb-0.5">Sacred Mantra & Affirmation:</span>
            <span className="italic text-indigo-800">{currentPrediction.luckyElements.mantraOrAffirmation}</span>
          </div>
        </div>
      </div>

      {/* Expandable Astrological Transits Underpinnings (Gochara) */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTransits(!showTransits)}
          className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>{t('astrologicalTransits')}</span>
          </span>
          <span className="flex items-center gap-1 text-slate-500 text-[11px]">
            {showTransits ? 'Hide Technical Details' : 'View Astrological Basis'}
            {showTransits ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </button>

        {showTransits && (
          <div className="p-4 bg-white space-y-3 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Astrological background explaining how current planetary transits (Gochara) interact with your birth chart houses:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentPrediction.transitInfluences.map((inf, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                  <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                    <span className="text-indigo-600">●</span>
                    <span>{inf.planet}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{inf.transitNote}</p>
                  <div className="text-[10px] text-indigo-600 font-semibold bg-indigo-50/80 p-1.5 rounded border border-indigo-100">
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
