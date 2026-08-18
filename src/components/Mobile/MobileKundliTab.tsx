import React, { useState } from 'react';
import { AstrologyChartData, Client, GemstoneRecommendation } from '../../types';
import { TOP_INDIAN_CITIES, IndianCity } from '../../data/indianCities';
import { calculateFullAstrologyChart } from '../../utils/ephemerisEngine';
import { generateAstrologicalPredictions } from '../../utils/predictionEngine';
import { generateAstrologyReportPDF } from '../../utils/astrologyEngine';
import {
  LanguageCode,
  INDIAN_LANGUAGES,
  getTranslation,
  getSignName,
  getGemstoneName,
  getStatusName,
} from '../../utils/indianLanguages';
import { ComprehensivePredictionsWindow } from '../PublicAstrology/ComprehensivePredictionsWindow';
import { PrintableReportModal } from '../PublicAstrology/PrintableReportModal';
import {
  Sparkles,
  Search,
  Share2,
  Gem,
  MessageSquare,
  UserPlus,
  Compass,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Copy,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Heart,
  Activity,
  Download,
  Printer,
  Globe,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Zap,
  Flame,
  FileText,
  Layers,
  Award,
} from 'lucide-react';

interface MobileKundliTabProps {
  onSaveAsClient?: (clientData: Partial<Client>) => void;
  onOpenNewSale?: (stoneName: string, clientName: string) => void;
  currencySymbol?: string;
}

export const MobileKundliTab: React.FC<MobileKundliTabProps> = ({
  onSaveAsClient,
  onOpenNewSale,
  currencySymbol = '₹',
}) => {
  const [name, setName] = useState('Rahul Sharma');
  const [date, setDate] = useState('1994-08-15');
  const [time, setTime] = useState('07:30');
  const [selectedCity, setSelectedCity] = useState<IndianCity>(TOP_INDIAN_CITIES[0]); // New Delhi
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [activeSection, setActiveSection] = useState<'overview' | 'predictions' | 'report'>('overview');
  const [predictionTimeframe, setPredictionTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [showTransits, setShowTransits] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [showComprehensiveModal, setShowComprehensiveModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const [chart, setChart] = useState<AstrologyChartData | null>(() => {
    return calculateFullAstrologyChart({
      name: 'Rahul Sharma',
      birthDate: '1994-08-15',
      birthTime: '07:30',
      placeName: 'New Delhi',
      latitude: 28.6139,
      longitude: 77.2090,
      zodiacSystem: 'sidereal_lahiri',
      houseSystem: 'whole_sign',
      timezoneOffset: 5.5,
    });
  });

  const t = (key: string) => getTranslation(key, selectedLanguage);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateFullAstrologyChart({
      name,
      birthDate: date,
      birthTime: time,
      placeName: selectedCity.name,
      latitude: selectedCity.latitude,
      longitude: selectedCity.longitude,
      zodiacSystem: 'sidereal_lahiri',
      houseSystem: 'whole_sign',
      timezoneOffset: selectedCity.timezone,
    });
    setChart(result);
  };

  const sun = chart?.planets.find(p => p.name === 'Sun');
  const moon = chart?.planets.find(p => p.name === 'Moon');
  const ascendant = chart?.interpretations?.coreAscendant?.sign || 'Simha (Leo)';
  const moonSign = moon?.sign || 'Vrishchika (Scorpio)';
  const sunSign = sun?.sign || 'Karka (Cancer)';
  const primaryGemstone = chart?.interpretations?.gemstoneRecommendations?.[0]?.stone || 'Yellow Sapphire (Pukhraj)';

  // Calculate dynamic Weekly, Monthly, and Yearly predictions
  const predictions = chart
    ? generateAstrologicalPredictions({
        subjectName: chart.subjectName || name,
        ascendantSign: ascendant,
        moonSign,
        sunSign,
        planets: chart.planets,
        houses: chart.houses,
        gemstoneName: primaryGemstone,
        language: selectedLanguage,
      })
    : null;

  const currentPrediction = predictions ? predictions[predictionTimeframe] : null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60';
      case 'Favorable':
        return 'bg-orange-950/80 text-orange-300 border border-orange-700/60';
      case 'Steady':
        return 'bg-amber-950/80 text-amber-300 border border-amber-700/60';
      case 'Caution':
        return 'bg-rose-950/80 text-rose-300 border border-rose-800/80';
      default:
        return 'bg-[#120408] text-slate-300 border border-red-950';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 65) return 'text-orange-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  // WhatsApp share generators
  const getWhatsAppShareText = (type: 'overview' | 'forecast' = 'overview') => {
    if (!chart) return '';

    if (type === 'forecast' && currentPrediction) {
      return (
        `✨ *${currentPrediction.timeframeLabel} Life Predictions (${predictionTimeframe.toUpperCase()})*\n` +
        `👤 *Client:* ${name}\n` +
        `🪐 *Lagna:* ${getSignName(ascendant, selectedLanguage)} | *Moon Sign:* ${getSignName(moonSign, selectedLanguage)}\n\n` +
        `🔮 *Key Forecast:*\n"${currentPrediction.headline}"\n\n` +
        `📊 *Overall Auspiciousness:* ${currentPrediction.overallScore}/100\n` +
        `💼 *Career & Finances:* ${currentPrediction.careerAndMoney.score}% - ${currentPrediction.careerAndMoney.status}\n` +
        `❤️ *Love & Family:* ${currentPrediction.loveAndFamily.score}% - ${currentPrediction.loveAndFamily.status}\n` +
        `🧘 *Health & Vitality:* ${currentPrediction.healthAndVitality.score}% - ${currentPrediction.healthAndVitality.status}\n\n` +
        `🌟 *Lucky Elements:*\n` +
        `• Days: ${currentPrediction.luckyElements.luckyDays.join(', ')}\n` +
        `• Colors: ${currentPrediction.luckyElements.luckyColors.join(', ')}\n` +
        `• Numbers: ${currentPrediction.luckyElements.luckyNumbers.join(', ')}\n` +
        `• Mantra: "${currentPrediction.luckyElements.mantraOrAffirmation}"\n\n` +
        `_Generated via AstroERP Vedic Swiss Ephemeris Engine._`
      );
    }

    return (
      `🙏 *Vedic Kundli Summary - VedicAstro*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📅 *DOB:* ${date} at ${time} (${selectedCity.name})\n\n` +
      `✨ *Ascendant (Lagna):* ${ascendant}\n` +
      `🌙 *Moon Sign (Rashi):* ${moonSign}\n` +
      `☀️ *Sun Sign (Surya Rashi):* ${sunSign}\n` +
      `🪐 *Current Mahadasha:* ${chart.interpretations?.planetaryPlacements?.[0]?.planet || 'Jupiter'}\n\n` +
      `💎 *Prescribed Gemstone:* ${primaryGemstone}\n` +
      `📿 *Rudraksha:* 5 Mukhi Rudraksha\n` +
      `🎨 *Lucky Color:* Saffron / Yellow\n` +
      `🔢 *Lucky Number:* 3, 7\n\n` +
      `_For complete life predictions & gemstone energization, visit our center or reply here._`
    );
  };

  const handleCopySummary = (type: 'overview' | 'forecast' = 'overview') => {
    const text = getWhatsAppShareText(type);
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  const handleShareWhatsApp = (type: 'overview' | 'forecast' = 'overview') => {
    const text = getWhatsAppShareText(type);
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleDownloadPDF = () => {
    if (!chart) return;
    generateAstrologyReportPDF(chart, currencySymbol, selectedLanguage);
  };

  return (
    <div className="space-y-4 pb-24 select-none font-sans">
      {/* Top Header Card */}
      <div className="bg-[#0e0307] border border-red-950/80 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-600/20">
              <Sparkles className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-['Outfit',sans-serif]">
                Instant Kundli & Predictions
              </h2>
              <p className="text-[11px] text-slate-400">Swiss Ephemeris • Weekly/Monthly/Yearly</p>
            </div>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-1 bg-[#16050b] px-2 py-1 rounded-xl border border-red-950/80">
            <Globe className="w-3 h-3 text-orange-400" />
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-[11px] text-orange-300 font-semibold focus:outline-none cursor-pointer"
            >
              {INDIAN_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-[#0e0307] text-white">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rapid Birth Input Form */}
        <form onSubmit={handleCalculate} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Client Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3 py-2 bg-[#120408] border border-red-950/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Date of Birth</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#120408] border border-red-950/80 rounded-2xl text-xs text-white focus:outline-none focus:border-orange-500 transition font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Time of Birth</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#120408] border border-red-950/80 rounded-2xl text-xs text-white focus:outline-none focus:border-orange-500 transition font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Birth City (India)</label>
            <select
              value={selectedCity.name}
              onChange={e => {
                const found = TOP_INDIAN_CITIES.find(c => c.name === e.target.value);
                if (found) setSelectedCity(found);
              }}
              className="w-full px-3 py-2 bg-[#120408] border border-red-950/80 rounded-2xl text-xs text-white focus:outline-none focus:border-orange-500 transition"
            >
              {TOP_INDIAN_CITIES.map(city => (
                <option key={city.name} value={city.name} className="bg-[#0e0307] text-white">
                  {city.name} ({city.state})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-600/20 active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Calculate Vedic Kundli & Forecasts</span>
          </button>
        </form>
      </div>

      {/* Segmented Sub-Navigation Switcher */}
      {chart && (
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#120408] rounded-2xl border border-red-950/80 shadow-md">
          <button
            type="button"
            onClick={() => setActiveSection('overview')}
            className={`py-2 text-[11px] font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 font-['Outfit',sans-serif] ${
              activeSection === 'overview'
                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Kundli</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('predictions')}
            className={`py-2 text-[11px] font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 font-['Outfit',sans-serif] ${
              activeSection === 'predictions'
                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Predictions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('report')}
            className={`py-2 text-[11px] font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 font-['Outfit',sans-serif] ${
              activeSection === 'report'
                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Full Report</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: KUNDLI OVERVIEW & PLANETARY PLACEMENTS                          */}
      {/* ========================================================================= */}
      {chart && activeSection === 'overview' && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Quick Pillars Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#0e0307] border border-red-950/80 p-3 rounded-3xl shadow-lg">
              <span className="text-[10px] text-amber-400 font-semibold block uppercase">Ascendant (Lagna)</span>
              <span className="text-sm font-bold text-white block mt-0.5 font-['Outfit',sans-serif]">{ascendant}</span>
              <span className="text-[10px] text-slate-400">1st House (Life Path)</span>
            </div>

            <div className="bg-[#0e0307] border border-red-950/80 p-3 rounded-3xl shadow-lg">
              <span className="text-[10px] text-orange-400 font-semibold block uppercase">Moon Sign (Rashi)</span>
              <span className="text-sm font-bold text-white block mt-0.5 font-['Outfit',sans-serif]">
                {moonSign}
              </span>
              <span className="text-[10px] text-slate-400">Mind & Janma Rashi</span>
            </div>

            <div className="bg-[#0e0307] border border-red-950/80 p-3 rounded-3xl shadow-lg">
              <span className="text-[10px] text-purple-400 font-semibold block uppercase">Current Mahadasha</span>
              <span className="text-sm font-bold text-white block mt-0.5 font-['Outfit',sans-serif]">
                {chart.interpretations?.planetaryPlacements?.[0]?.planet || 'Jupiter'} Mahadasha
              </span>
              <span className="text-[10px] text-slate-400">Active Planetary Period</span>
            </div>

            <div className="bg-[#0e0307] border border-red-950/80 p-3 rounded-3xl shadow-lg">
              <span className="text-[10px] text-emerald-400 font-semibold block uppercase">Prescribed Gemstone</span>
              <span className="text-sm font-bold text-emerald-300 block mt-0.5 truncate font-['Outfit',sans-serif]">
                {primaryGemstone}
              </span>
              <span className="text-[10px] text-slate-400">Lucky Energized Gem</span>
            </div>
          </div>

          {/* Planetary Placements Table */}
          <div className="bg-[#0e0307] border border-red-950/80 rounded-3xl p-4 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center justify-between font-['Outfit',sans-serif]">
              <span>Planetary Coordinates</span>
              <span className="text-[10px] text-orange-400 font-mono">Lahiri Sidereal</span>
            </h3>

            <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
              {(chart.planets || []).map(p => (
                <div key={p.name} className="flex items-center justify-between p-2 bg-[#120408] rounded-xl border border-red-950/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    <span className="font-semibold text-white">{p.name}</span>
                    {p.isRetrograde && <span className="text-[9px] text-rose-400 font-bold">(R)</span>}
                  </div>
                  <div className="text-right">
                    <span className="text-amber-300 font-mono text-[11px]">{p.sign}</span>
                    <span className="text-slate-400 text-[10px] ml-2">H{p.house}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 1-Tap Client Actions */}
          <div className="bg-[#0e0307] border border-red-950/80 rounded-3xl p-4 shadow-xl space-y-2.5">
            <h4 className="text-xs font-bold text-white font-['Outfit',sans-serif]">Share Kundli Summary with Client</h4>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleShareWhatsApp('overview')}
                className="py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Share WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopySummary('overview')}
                className="py-2.5 px-3 bg-[#16050b] hover:bg-[#220712] text-slate-200 hover:text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 border border-red-900/70 cursor-pointer shadow-xs"
              >
                <Copy className="w-4 h-4 text-orange-400" />
                <span>{copiedNotice ? 'Copied!' : 'Copy Summary'}</span>
              </button>
            </div>

            {onSaveAsClient && (
              <button
                type="button"
                onClick={() => {
                  onSaveAsClient({
                    name,
                    dateOfBirth: date,
                    timeOfBirth: time,
                    placeOfBirth: selectedCity.name,
                    latitude: selectedCity.latitude,
                    longitude: selectedCity.longitude,
                    timezone: selectedCity.timezone,
                  });
                }}
                className="w-full py-2 bg-[#1c060e] hover:bg-[#280814] text-orange-300 hover:text-orange-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 border border-red-900/60 cursor-pointer shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Save Client Profile to CRM</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: WEEKLY, MONTHLY & YEARLY ASTROLOGICAL PREDICTIONS             */}
      {/* ========================================================================= */}
      {chart && activeSection === 'predictions' && currentPrediction && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Timeframe Selector (Weekly, Monthly, Yearly) */}
          <div className="grid grid-cols-3 gap-1.5 bg-[#0e0307] p-1.5 rounded-2xl border border-red-950/80 shadow-md">
            {(['weekly', 'monthly', 'yearly'] as const).map(tf => (
              <button
                key={tf}
                type="button"
                onClick={() => setPredictionTimeframe(tf)}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer font-['Outfit',sans-serif] ${
                  predictionTimeframe === tf
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                    : 'bg-[#120408] text-slate-400 hover:text-white border border-red-950'
                }`}
              >
                {tf === 'weekly' && <Calendar className="w-3.5 h-3.5 text-amber-300" />}
                {tf === 'monthly' && <Sparkles className="w-3.5 h-3.5 text-orange-300" />}
                {tf === 'yearly' && <Flame className="w-3.5 h-3.5 text-rose-300" />}
                <span>{tf.charAt(0).toUpperCase() + tf.slice(1)}</span>
              </button>
            ))}
          </div>

          {/* Overall Auspiciousness & Headline Banner */}
          <div className="bg-[#0e0307] border border-red-950/80 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-red-950/80 pb-2.5">
              <div>
                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block font-['Outfit',sans-serif]">
                  {currentPrediction.timeframeLabel}
                </span>
                <h3 className="text-sm font-bold text-white font-['Outfit',sans-serif]">
                  {predictionTimeframe.toUpperCase()} Life Forecast
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">Auspiciousness</span>
                <span className={`text-lg font-black font-mono ${getScoreColor(currentPrediction.overallScore)}`}>
                  {currentPrediction.overallScore}/100
                </span>
              </div>
            </div>

            {/* Headline Callout */}
            <div className="p-3 bg-[#120408] rounded-2xl border border-red-950/80">
              <p className="text-xs text-orange-100 font-medium leading-relaxed italic">
                "{currentPrediction.headline}"
              </p>
            </div>
          </div>

          {/* 3 Core Life Domain Predictions */}
          <div className="space-y-2.5">
            {/* 1. Career & Wealth */}
            <div className="bg-[#0e0307] border border-red-950/80 rounded-3xl p-4 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-orange-950/80 border border-orange-700/60 flex items-center justify-center text-orange-400">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-['Outfit',sans-serif]">
                      {t('careerAndMoney')}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {currentPrediction.careerAndMoney.score}% Rating
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(currentPrediction.careerAndMoney.status)}`}>
                  {getStatusName(currentPrediction.careerAndMoney.status, selectedLanguage)}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentPrediction.careerAndMoney.prediction}
              </p>

              <div className="p-2 bg-[#120408] rounded-xl border border-red-950/60 text-[11px] text-amber-200/90 font-medium">
                <strong className="text-orange-400 font-semibold">{t('keyAdvice')}:</strong> {currentPrediction.careerAndMoney.actionableTip}
              </div>
            </div>

            {/* 2. Love & Family */}
            <div className="bg-[#0e0307] border border-red-950/80 rounded-3xl p-4 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-rose-950/80 border border-rose-700/60 flex items-center justify-center text-rose-400">
                    <Heart className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-['Outfit',sans-serif]">
                      {t('loveAndFamily')}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {currentPrediction.loveAndFamily.score}% Rating
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(currentPrediction.loveAndFamily.status)}`}>
                  {getStatusName(currentPrediction.loveAndFamily.status, selectedLanguage)}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentPrediction.loveAndFamily.prediction}
              </p>

              <div className="p-2 bg-[#120408] rounded-xl border border-red-950/60 text-[11px] text-rose-200/90 font-medium">
                <strong className="text-rose-400 font-semibold">{t('keyAdvice')}:</strong> {currentPrediction.loveAndFamily.actionableTip}
              </div>
            </div>

            {/* 3. Health & Vitality */}
            <div className="bg-[#0e0307] border border-red-950/80 rounded-3xl p-4 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-['Outfit',sans-serif]">
                      {t('healthAndVitality')}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {currentPrediction.healthAndVitality.score}% Rating
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(currentPrediction.healthAndVitality.status)}`}>
                  {getStatusName(currentPrediction.healthAndVitality.status, selectedLanguage)}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentPrediction.healthAndVitality.prediction}
              </p>

              <div className="p-2 bg-[#120408] rounded-xl border border-red-950/60 text-[11px] text-emerald-200/90 font-medium">
                <strong className="text-emerald-400 font-semibold">{t('keyAdvice')}:</strong> {currentPrediction.healthAndVitality.actionableTip}
              </div>
            </div>
          </div>

          {/* Lucky Elements & Remedial Affirmation */}
          <div className="bg-[#0e0307] border border-red-950/80 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit',sans-serif]">
                {t('vedicRemediesAndMantra')}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#120408] rounded-xl border border-red-950/60">
                <span className="text-[10px] text-amber-400 font-semibold block">{t('auspiciousDaysLabel')}</span>
                <span className="font-bold text-white mt-0.5 block">{currentPrediction.luckyElements.luckyDays.join(', ')}</span>
              </div>

              <div className="p-2.5 bg-[#120408] rounded-xl border border-red-950/60">
                <span className="text-[10px] text-orange-400 font-semibold block">{t('auspiciousColorsLabel')}</span>
                <span className="font-bold text-white mt-0.5 block">{currentPrediction.luckyElements.luckyColors.join(', ')}</span>
              </div>

              <div className="p-2.5 bg-[#120408] rounded-xl border border-red-950/60">
                <span className="text-[10px] text-emerald-400 font-semibold block">{t('luckyNumbersLabel')}</span>
                <span className="font-bold text-white mt-0.5 block font-mono">{currentPrediction.luckyElements.luckyNumbers.join(', ')}</span>
              </div>

              <div className="p-2.5 bg-[#120408] rounded-xl border border-red-950/60">
                <span className="text-[10px] text-rose-400 font-semibold block">{t('favorableDirectionLabel')}</span>
                <span className="font-bold text-white mt-0.5 block">{currentPrediction.luckyElements.auspiciousDirection}</span>
              </div>
            </div>

            {/* Daily Mantra */}
            <div className="p-3 bg-[#1a060e] rounded-2xl border border-orange-600/30 space-y-1">
              <span className="text-[10px] text-orange-300 font-bold uppercase">{t('dailyVedicMantra')}</span>
              <p className="text-xs font-medium text-orange-100 italic">
                "{currentPrediction.luckyElements.mantraOrAffirmation}"
              </p>
            </div>
          </div>

          {/* Collapsible Planetary Transits (Gochara) */}
          <div className="bg-[#0e0307] border border-red-950/80 rounded-3xl p-4 shadow-xl space-y-2">
            <button
              type="button"
              onClick={() => setShowTransits(!showTransits)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <h4 className="text-xs font-bold text-white font-['Outfit',sans-serif]">
                  Planetary Transits (Gochara Breakdown)
                </h4>
              </div>
              {showTransits ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showTransits && (
              <div className="space-y-2 pt-2 border-t border-red-950/60 text-xs">
                {(currentPrediction.transitInfluences || []).map((tr, idx) => (
                  <div key={idx} className="p-2.5 bg-[#120408] rounded-xl border border-red-950/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-300 font-['Outfit',sans-serif]">{tr.planet}</span>
                      <span className="text-[10px] font-bold text-emerald-400">{tr.impactOnHouses}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{tr.transitNote}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Forecast Share Actions */}
          <div className="bg-[#0e0307] border border-red-950/80 rounded-3xl p-4 shadow-xl space-y-2.5">
            <h4 className="text-xs font-bold text-white font-['Outfit',sans-serif]">
              Share {predictionTimeframe.toUpperCase()} Predictions
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleShareWhatsApp('forecast')}
                className="py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Share WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopySummary('forecast')}
                className="py-2.5 px-3 bg-[#16050b] hover:bg-[#220712] text-slate-200 hover:text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 border border-red-900/70 cursor-pointer shadow-xs"
              >
                <Copy className="w-4 h-4 text-orange-400" />
                <span>{copiedNotice ? 'Copied!' : 'Copy Forecast'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: FULL REPORT, PDF DOWNLOAD & COMPREHENSIVE WINDOW               */}
      {/* ========================================================================= */}
      {chart && activeSection === 'report' && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Full Report Dashboard Card */}
          <div className="bg-[#0e0307] border border-red-950/80 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-3 border-b border-red-950/80 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-600/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-['Outfit',sans-serif]">
                  Full Astrological Natal Report
                </h3>
                <p className="text-[11px] text-slate-400">
                  Comprehensive Multilingual Document & PDF Export
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Generate the verified full-length Vedic Kundli document for <strong>{name}</strong> containing complete planetary dignities, vimshottari dasha cycle, gemstone prescriptions, and weekly/monthly/yearly forecasts.
            </p>

            {/* Action Grid */}
            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => setShowComprehensiveModal(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Open Full Comprehensive Window</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="py-2.5 px-3 bg-[#1c060e] hover:bg-[#280814] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 border border-red-900/80 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPdfModal(true)}
                  className="py-2.5 px-3 bg-[#1c060e] hover:bg-[#280814] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 border border-red-900/80 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print Preview</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Dispense Prescribed Gemstone */}
          {onOpenNewSale && (
            <div className="bg-[#0e0307] border border-red-950/80 rounded-3xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gem className="w-4 h-4 text-amber-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white font-['Outfit',sans-serif]">
                      Prescribed Gemstone
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-semibold">{primaryGemstone}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenNewSale(primaryGemstone, name)}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer shadow-md"
                >
                  Dispense Gem
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS: COMPREHENSIVE WINDOW & PRINTABLE REPORT                           */}
      {/* ========================================================================= */}
      {chart && (
        <>
          <ComprehensivePredictionsWindow
            chartData={chart}
            isOpen={showComprehensiveModal}
            onClose={() => setShowComprehensiveModal(false)}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
            currencySymbol={currencySymbol}
            onAutoDispenseGemstone={rec => {
              if (onOpenNewSale) {
                onOpenNewSale(rec.stone, name);
              }
            }}
          />

          <PrintableReportModal
            chartData={chart}
            isOpen={showPdfModal}
            onClose={() => setShowPdfModal(false)}
            currencySymbol={currencySymbol}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
          />
        </>
      )}
    </div>
  );
};

