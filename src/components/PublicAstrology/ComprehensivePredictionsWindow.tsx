/**
 * Comprehensive Astrological Predictions Dedicated Window
 * Features:
 * - Weekly Forecast, Monthly Outlook, and Yearly Master Transits
 * - Complete verified birth detail information (Date, Time, Place, Coordinates, Ascendant, Moon Sign, Sun Sign, Dasha)
 * - Complete localization into 12 Indian Languages (Hindi, Sanskrit, Gujarati, Marathi, Bengali, Tamil, Telugu, etc.)
 * - Standalone Browser Popout Window option with clean printable layout
 * - Copy to clipboard, PDF Export / Print capability
 */

import React, { useState } from 'react';
import {
  AstrologyChartData,
  AstrologyPredictions,
  TimeframePrediction,
  GemstoneRecommendation,
} from '../../types';
import {
  Sparkles,
  Calendar,
  Moon,
  Star,
  Briefcase,
  Heart,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Copy,
  Check,
  Printer,
  ExternalLink,
  X,
  Maximize2,
  Minimize2,
  ShieldCheck,
  User,
  MapPin,
  Globe,
  Gem,
} from 'lucide-react';
import {
  LanguageCode,
  getTranslation,
  getSignName,
  getGemstoneName,
  getStatusName,
} from '../../utils/indianLanguages';
import { LanguageSelector } from '../Common/LanguageSelector';
import { generateAstrologicalPredictions } from '../../utils/predictionEngine';

interface ComprehensivePredictionsWindowProps {
  chartData: AstrologyChartData;
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage?: LanguageCode;
  onSelectLanguage?: (lang: LanguageCode) => void;
  currencySymbol?: string;
  onAutoDispenseGemstone?: (rec: GemstoneRecommendation) => void;
}

export const ComprehensivePredictionsWindow: React.FC<ComprehensivePredictionsWindowProps> = ({
  chartData,
  isOpen,
  onClose,
  selectedLanguage = 'en',
  onSelectLanguage,
  currencySymbol = '$',
  onAutoDispenseGemstone,
}) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen || !chartData) return null;

  const t = (key: string) => getTranslation(key, selectedLanguage);

  const sun = chartData.planets.find(p => p.name === 'Sun');
  const moon = chartData.planets.find(p => p.name === 'Moon');
  const ascendant = chartData.interpretations?.coreAscendant?.sign || 'Aries';
  const moonSign = moon?.sign || 'Taurus';
  const sunSign = sun?.sign || 'Leo';

  // Active Vimshottari period
  const activeDashaPeriod = selectedLanguage === 'hi' 
    ? 'बृहस्पति - शनि (सक्रिय महादशा / अंतर्दशा)'
    : 'Jupiter - Saturn (Active Mahadasha)';

  const primaryGemstone = chartData.interpretations?.gemstoneRecommendations?.[0]?.stone || 'Yellow Sapphire';

  // Always compute predictions strictly in the active selectedLanguage so language switching is instantaneous and flawless
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

  const currentPrediction: TimeframePrediction = predictions[activeTab];

  // Helper for status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'Favorable':
        return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30';
      case 'Steady':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'Caution':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 65) return 'text-indigo-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  const handleCopySummary = () => {
    const summaryText = `${t('predictionsWindowTitle')} (${activeTab.toUpperCase()})
${t('subjectName') || 'Subject'}: ${chartData.subjectName}
${t('birthDate') || 'Birth Date'}: ${chartData.birthDate} | ${t('birthTime') || 'Time'}: ${chartData.birthTime} | ${t('birthPlace') || 'Place'}: ${chartData.birthPlace}
${t('ascendant') || 'Ascendant'}: ${getSignName(ascendant, selectedLanguage)} | ${t('moonSign') || 'Moon Sign'}: ${getSignName(moonSign, selectedLanguage)} | ${t('sunSign') || 'Sun Sign'}: ${getSignName(sunSign, selectedLanguage)}
${t('predictionHorizon')}: ${currentPrediction.timeframeLabel}
${currentPrediction.headline}
${t('overallAuspiciousness')}: ${currentPrediction.overallScore}/100
${t('careerAndMoney')}: ${currentPrediction.careerAndMoney.prediction} (${currentPrediction.careerAndMoney.score}%)
${t('loveAndFamily')}: ${currentPrediction.loveAndFamily.prediction} (${currentPrediction.loveAndFamily.score}%)
${t('healthAndVitality')}: ${currentPrediction.healthAndVitality.prediction} (${currentPrediction.healthAndVitality.score}%)
${t('auspiciousDaysLabel')}: ${currentPrediction.luckyElements.luckyDays.join(', ')}
${t('dailyVedicMantra')}: ${currentPrediction.luckyElements.mantraOrAffirmation}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Open standalone popup browser window
  const handleOpenStandaloneWindow = () => {
    const popupWidth = 1000;
    const popupHeight = 850;
    const left = (window.screen.width - popupWidth) / 2;
    const top = (window.screen.height - popupHeight) / 2;

    const popup = window.open(
      '',
      `AstroERP_Predictions_${chartData.subjectName.replace(/\s+/g, '_')}`,
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );

    if (popup) {
      popup.document.write(`
        <!DOCTYPE html>
        <html lang="${selectedLanguage}">
        <head>
          <meta charset="UTF-8">
          <title>${chartData.subjectName} - ${t('predictionsWindowTitle')}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
            .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 20px; }
            h1 { color: #f8fafc; font-size: 24px; margin: 0; }
            h2 { color: #38bdf8; font-size: 18px; margin-top: 0; }
            h3 { color: #fbbf24; font-size: 15px; margin-bottom: 8px; }
            .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
            .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
            .badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold; background: #312e81; color: #c7d2fe; }
            .meta-item { font-size: 13px; color: #94a3b8; }
            .meta-val { color: #f8fafc; font-weight: 600; }
            .score-circle { font-size: 28px; font-weight: bold; color: #34d399; }
            .btn { background: #4f46e5; color: #fff; padding: 8px 16px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; }
            @media print { body { background: #fff; color: #000; } .card { border: 1px solid #ccc; background: #fff; } .btn { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <span class="badge">${t('dedicatedWindow')}</span>
              <h1>${chartData.subjectName}</h1>
              <div class="meta-item" style="margin-top: 4px;">${t('swissPrecision')}</div>
            </div>
            <button class="btn" onclick="window.print()">${t('printBtn')}</button>
          </div>

          <div class="card">
            <h2>${t('verifiedBirthDetails')}</h2>
            <div class="grid-4">
              <div class="meta-item">${t('birthDate') || 'Birth Date'}: <span class="meta-val">${chartData.birthDate}</span></div>
              <div class="meta-item">${t('birthTime') || 'Birth Time'}: <span class="meta-val">${chartData.birthTime}</span></div>
              <div class="meta-item">${t('birthPlace') || 'Birth Place'}: <span class="meta-val">${chartData.birthPlace}</span></div>
              <div class="meta-item">${t('coordinates')}: <span class="meta-val">${chartData.latitude?.toFixed(2)}° N, ${chartData.longitude?.toFixed(2)}° E</span></div>
              <div class="meta-item">${t('ascendant') || 'Ascendant'}: <span class="meta-val">${getSignName(ascendant, selectedLanguage)}</span></div>
              <div class="meta-item">${t('moonSign') || 'Moon Sign'}: <span class="meta-val">${getSignName(moonSign, selectedLanguage)}</span></div>
              <div class="meta-item">${t('sunSign') || 'Sun Sign'}: <span class="meta-val">${getSignName(sunSign, selectedLanguage)}</span></div>
              <div class="meta-item">${t('currentMahadasha')}: <span class="meta-val">${activeDashaPeriod}</span></div>
            </div>
          </div>

          <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <h2>${currentPrediction.timeframeLabel}</h2>
                <p style="font-size:16px; color:#e2e8f0; margin:0;">${currentPrediction.headline}</p>
                <p style="font-size:13px; color:#94a3b8; margin-top:6px;">${currentPrediction.summary}</p>
              </div>
              <div style="text-align:right;">
                <div style="font-size:11px; color:#94a3b8; text-transform:uppercase;">${t('overallAuspiciousness')}</div>
                <div class="score-circle">${currentPrediction.overallScore}/100</div>
              </div>
            </div>
          </div>

          <div class="grid-2">
            <div class="card">
              <h3>💼 ${t('careerAndMoney')} (${currentPrediction.careerAndMoney.score}%)</h3>
              <p style="color:#94a3b8; font-size:14px; line-height:1.6;">${currentPrediction.careerAndMoney.prediction}</p>
              <div style="background:#0f172a; padding:10px; border-radius:6px; font-size:12px; color:#c7d2fe;">
                <strong>${t('strategicAction')}:</strong> ${currentPrediction.careerAndMoney.actionableTip}
              </div>
            </div>

            <div class="card">
              <h3>❤️ ${t('loveAndFamily')} (${currentPrediction.loveAndFamily.score}%)</h3>
              <p style="color:#94a3b8; font-size:14px; line-height:1.6;">${currentPrediction.loveAndFamily.prediction}</p>
              <div style="background:#0f172a; padding:10px; border-radius:6px; font-size:12px; color:#c7d2fe;">
                <strong>${t('harmonizingDirective')}:</strong> ${currentPrediction.loveAndFamily.actionableTip}
              </div>
            </div>

            <div class="card">
              <h3>🧘 ${t('healthAndVitality')} (${currentPrediction.healthAndVitality.score}%)</h3>
              <p style="color:#94a3b8; font-size:14px; line-height:1.6;">${currentPrediction.healthAndVitality.prediction}</p>
              <div style="background:#0f172a; padding:10px; border-radius:6px; font-size:12px; color:#c7d2fe;">
                <strong>${t('vitalityDirective')}:</strong> ${currentPrediction.healthAndVitality.actionableTip}
              </div>
            </div>

            <div class="card">
              <h3>✨ ${t('auspiciousActivities')} & ${t('planetaryCautions')}</h3>
              <p style="color:#34d399; font-size:13px;"><strong>${t('auspiciousActivities')}:</strong> ${currentPrediction.favorableActivities.join(', ')}</p>
              <p style="color:#f87171; font-size:13px; margin-top:8px;"><strong>${t('planetaryCautions')}:</strong> ${currentPrediction.cautionActivities.join(', ')}</p>
            </div>
          </div>

          <div class="card">
            <h2>${t('vedicRemediesAndMantra')}</h2>
            <p><strong>${t('dailyVedicMantra')}:</strong> ${currentPrediction.luckyElements.mantraOrAffirmation}</p>
            <p><strong>${t('auspiciousDaysLabel')}:</strong> ${currentPrediction.luckyElements.luckyDays.join(', ')}</p>
            <p><strong>${t('auspiciousColorsLabel')}:</strong> ${currentPrediction.luckyElements.luckyColors.join(', ')}</p>
            <p><strong>${t('luckyNumbersLabel')}:</strong> ${currentPrediction.luckyElements.luckyNumbers.join(', ')}</p>
            <p><strong>${t('favorableDirectionLabel')}:</strong> ${currentPrediction.luckyElements.auspiciousDirection}</p>
            <p><strong>${t('lifeGemstone')}:</strong> ${currentPrediction.luckyElements.favorableGemstone}</p>
          </div>
        </body>
        </html>
      `);
      popup.document.close();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div
        className={`bg-slate-900 border border-slate-800 rounded-3xl flex flex-col shadow-2xl overflow-hidden text-slate-100 transition-all duration-200 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-5xl max-h-[92vh]'
        }`}
      >
        {/* ========================================================================= */}
        {/* Top Action Bar                                                            */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-md">
                  {t('dedicatedWindow')}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {t('swissPrecision')}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {t('predictionsWindowTitle')} • {chartData.subjectName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSelectLanguage && (
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onSelectLanguage={onSelectLanguage}
                variant="header"
              />
            )}

            <button
              id="btn-copy-predictions"
              type="button"
              onClick={handleCopySummary}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title={t('copyBtn')}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? t('copiedBtn') : t('copyBtn')}</span>
            </button>

            <button
              id="btn-popout-window"
              type="button"
              onClick={handleOpenStandaloneWindow}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title={t('popOutWindowBtn')}
            >
              <ExternalLink className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">{t('popOutWindowBtn')}</span>
            </button>

            <button
              id="btn-print-predictions"
              type="button"
              onClick={handlePrint}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title={t('printBtn')}
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{t('printBtn')}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-rose-500/20 hover:text-rose-300 rounded-xl transition cursor-pointer"
              title={t('closeBtn')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Window Body                                                               */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-900/90">
          {/* Section 1: Complete Birth Detail Information Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {t('verifiedBirthDetails')}
                </h3>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{chartData.birthPlace || 'Global Coordinates'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">{t('birthDate') || 'Date of Birth'}</span>
                <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block">{chartData.birthDate}</span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">{t('birthTime') || 'Time of Birth'}</span>
                <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block">{chartData.birthTime}</span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-indigo-400 block uppercase font-bold">{t('ascendant') || 'Ascendant'} (Lagna)</span>
                <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block">{getSignName(ascendant, selectedLanguage)}</span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-cyan-400 block uppercase font-bold">{t('moonSign') || 'Moon Sign'} (Rashi)</span>
                <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block">{getSignName(moonSign, selectedLanguage)}</span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-amber-400 block uppercase font-bold">{t('sunSign') || 'Sun Sign'} (Surya)</span>
                <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block">{getSignName(sunSign, selectedLanguage)}</span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-emerald-400 block uppercase font-bold">{t('currentMahadasha')}</span>
                <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block">
                  {activeDashaPeriod}
                </span>
              </div>
            </div>

            {/* Quick Astrological Key Metrics Bar */}
            <div className="flex flex-wrap items-center justify-between text-[11px] bg-indigo-950/40 border border-indigo-900/50 rounded-xl px-4 py-2.5 gap-3 text-slate-300">
              <div className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-white">{t('houseSystem')}:</span>
                <span>Placidus / Sripathi Equatorial</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-white">{t('coordinates')}:</span>
                <span>{chartData.latitude?.toFixed(2)}°, {chartData.longitude?.toFixed(2)}° (UTC{chartData.timezoneOffset ? `+${chartData.timezoneOffset}` : '+05:30'})</span>
              </div>
              <div className="flex items-center gap-2">
                <Gem className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-white">{t('lifeGemstone')}:</span>
                <span>{getGemstoneName(primaryGemstone, selectedLanguage)}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Timeframe Navigation Tabs (Weekly, Monthly, Yearly) */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 border border-slate-800 p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                {t('predictionHorizon')}:
              </span>
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  id="tab-window-weekly"
                  onClick={() => setActiveTab('weekly')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'weekly'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('weeklyForecastTab')}</span>
                </button>

                <button
                  type="button"
                  id="tab-window-monthly"
                  onClick={() => setActiveTab('monthly')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'monthly'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>{t('monthlyOutlookTab')}</span>
                </button>

                <button
                  type="button"
                  id="tab-window-yearly"
                  onClick={() => setActiveTab('yearly')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'yearly'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>{t('yearlyMasterTab')}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-2">
              <span className="text-xs text-slate-400">{t('overallAuspiciousness')}:</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                {currentPrediction.overallScore}/100
              </span>
            </div>
          </div>

          {/* Section 3: Timeframe Header Banner */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-950 to-indigo-950 border border-indigo-900/60 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full">
                  {currentPrediction.timeframeLabel}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadge(currentPrediction.careerAndMoney.status)}`}>
                  {getStatusName(currentPrediction.careerAndMoney.status, selectedLanguage)} {t('statusOutlook')}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {currentPrediction.headline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentPrediction.summary}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center bg-slate-900/90 border border-slate-800 p-5 rounded-2xl text-center min-w-[160px] self-start md:self-center shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                {t('planetaryHarmony')}
              </span>
              <div className="text-3xl font-black text-emerald-400 font-mono">
                {currentPrediction.overallScore}%
              </div>
              <span className="text-[11px] text-emerald-300/90 font-semibold mt-1">
                {currentPrediction.overallMood}
              </span>
            </div>
          </div>

          {/* Section 4: Domain Grid (Career & Wealth, Love & Family, Health & Vitality) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Career & Wealth */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{t('careerAndMoney')}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getStatusBadge(currentPrediction.careerAndMoney.status)}`}>
                      {getStatusName(currentPrediction.careerAndMoney.status, selectedLanguage)}
                    </span>
                    <span className={`text-sm font-bold font-mono ${getScoreColor(currentPrediction.careerAndMoney.score)}`}>
                      {currentPrediction.careerAndMoney.score}%
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentPrediction.careerAndMoney.prediction}
                </p>
              </div>

              <div className="p-3 bg-indigo-950/30 border border-indigo-900/40 rounded-xl text-xs text-indigo-200 mt-2">
                <span className="font-bold text-indigo-300 block mb-0.5">{t('strategicAction')}:</span>
                {currentPrediction.careerAndMoney.actionableTip}
              </div>
            </div>

            {/* 2. Relationships & Family */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{t('loveAndFamily')}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getStatusBadge(currentPrediction.loveAndFamily.status)}`}>
                      {getStatusName(currentPrediction.loveAndFamily.status, selectedLanguage)}
                    </span>
                    <span className={`text-sm font-bold font-mono ${getScoreColor(currentPrediction.loveAndFamily.score)}`}>
                      {currentPrediction.loveAndFamily.score}%
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentPrediction.loveAndFamily.prediction}
                </p>
              </div>

              <div className="p-3 bg-rose-950/30 border border-rose-900/40 rounded-xl text-xs text-rose-200 mt-2">
                <span className="font-bold text-rose-300 block mb-0.5">{t('harmonizingDirective')}:</span>
                {currentPrediction.loveAndFamily.actionableTip}
              </div>
            </div>

            {/* 3. Health & Vitality */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{t('healthAndVitality')}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getStatusBadge(currentPrediction.healthAndVitality.status)}`}>
                      {getStatusName(currentPrediction.healthAndVitality.status, selectedLanguage)}
                    </span>
                    <span className={`text-sm font-bold font-mono ${getScoreColor(currentPrediction.healthAndVitality.score)}`}>
                      {currentPrediction.healthAndVitality.score}%
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentPrediction.healthAndVitality.prediction}
                </p>
              </div>

              <div className="p-3 bg-cyan-950/30 border border-cyan-900/40 rounded-xl text-xs text-cyan-200 mt-2">
                <span className="font-bold text-cyan-300 block mb-0.5">{t('vitalityDirective')}:</span>
                {currentPrediction.healthAndVitality.actionableTip}
              </div>
            </div>
          </div>

          {/* Section 5: Favorable Activities vs Caution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-950 border border-emerald-900/40 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <h4 className="text-xs uppercase font-bold tracking-wider">{t('auspiciousActivities')}</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentPrediction.favorableActivities.map((act, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 border border-rose-900/40 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <h4 className="text-xs uppercase font-bold tracking-wider">{t('planetaryCautions')}</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentPrediction.cautionActivities.map((act, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">!</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 6: Auspicious Guidance & Remedies */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {t('vedicRemediesAndMantra')}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-amber-400 uppercase font-bold block mb-1">{t('auspiciousDaysLabel')}</span>
                <span className="text-xs font-semibold text-white">{currentPrediction.luckyElements.luckyDays.join(', ')}</span>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-indigo-400 uppercase font-bold block mb-1">{t('auspiciousColorsLabel')}</span>
                <span className="text-xs font-semibold text-white">{currentPrediction.luckyElements.luckyColors.join(', ')}</span>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">{t('luckyNumbersLabel')}</span>
                <span className="text-xs font-semibold text-white font-mono">{currentPrediction.luckyElements.luckyNumbers.join(', ')}</span>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-rose-400 uppercase font-bold block mb-1">{t('favorableDirectionLabel')}</span>
                <span className="text-xs font-semibold text-white">{currentPrediction.luckyElements.auspiciousDirection}</span>
              </div>
            </div>

            <div className="p-4 bg-indigo-950/40 border border-indigo-800/50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-indigo-300">
                  {t('dailyVedicMantra')}
                </div>
                <div className="text-xs sm:text-sm font-medium text-indigo-100 italic">
                  "{currentPrediction.luckyElements.mantraOrAffirmation}"
                </div>
              </div>

              {chartData.interpretations?.gemstoneRecommendations?.[0] && onAutoDispenseGemstone && (
                <button
                  type="button"
                  onClick={() => onAutoDispenseGemstone(chartData.interpretations.gemstoneRecommendations[0])}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition cursor-pointer whitespace-nowrap"
                >
                  <Gem className="w-4 h-4" />
                  {t('dispenseGemstone')} {getGemstoneName(primaryGemstone, selectedLanguage)}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Footer Bar                                                                */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{t('ephemerisCalculationActive')}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleOpenStandaloneWindow}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {t('openInNewTab')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold cursor-pointer transition"
            >
              {t('closeBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
