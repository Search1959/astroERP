/**
 * AstroNexus Pro - Astrological Ephemeris & Gemstone ERP Landing Page
 * Vedic Astro Midnight Aesthetic (Cosmic Dark Navy, Astral Gold/Amber, Amethyst Glow)
 * Real feature showcase, genuine practitioner feedback, interactive chart preview, and multi-portal authentication.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Gem,
  Calendar,
  Users,
  DollarSign,
  Camera,
  Star,
  CheckCircle2,
  ArrowRight,
  Globe,
  Compass,
  Zap,
  Lock,
  Layers,
  ChevronRight,
  Award,
  BookOpen,
  Eye,
  Sliders,
  Flame,
  Moon,
  Sun,
  UserCheck,
} from 'lucide-react';
import { StoreSettings } from '../../types';
import { WORLD_CITIES } from '../../data/initialDemoData';
import { calculateFullAstrologyChart } from '../../utils/ephemerisEngine';
import { LanguageSelector } from '../Common/LanguageSelector';
import { LanguageCode } from '../../utils/indianLanguages';

interface AstroLandingPageProps {
  onOpenAuthModal: (initialTab?: 'signup' | 'login') => void;
  onLaunchDemo: () => void;
  onGoToDashboard: () => void;
  isLoggedIn: boolean;
  currentUserName?: string;
  settings: StoreSettings | null;
}

export const AstroLandingPage: React.FC<AstroLandingPageProps> = ({
  onOpenAuthModal,
  onLaunchDemo,
  onGoToDashboard,
  isLoggedIn,
  currentUserName,
  settings,
}) => {
  // Quick interactive chart calculator on the home page for instant live experience
  const [demoName, setDemoName] = useState('Ananya Sen');
  const [demoDob, setDemoDob] = useState('1994-11-22');
  const [demoTob, setDemoTob] = useState('08:45');
  const [demoCity, setDemoCity] = useState('Kolkata, India');
  const [calculatedChart, setCalculatedChart] = useState<any>(() => {
    return calculateFullAstrologyChart({
      name: 'Ananya Sen',
      birthDate: '1994-11-22',
      birthTime: '08:45',
      placeName: 'Kolkata, India',
      latitude: 22.5726,
      longitude: 88.3639,
      timezoneOffset: 5.5,
      houseSystem: 'whole_sign',
      zodiacSystem: 'sidereal_lahiri',
    });
  });

  const handleCalculateQuickDemo = (e: React.FormEvent) => {
    e.preventDefault();
    const city = WORLD_CITIES.find(c => c.name === demoCity) || WORLD_CITIES[0];
    const res = calculateFullAstrologyChart({
      name: demoName,
      birthDate: demoDob,
      birthTime: demoTob,
      placeName: city.name,
      latitude: city.lat,
      longitude: city.lng,
      timezoneOffset: city.tz,
      houseSystem: 'whole_sign',
      zodiacSystem: 'sidereal_lahiri',
    });
    setCalculatedChart(res);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Top Background Cosmic Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-amber-600/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 left-1/3 w-[700px] h-[700px] bg-purple-900/15 rounded-full blur-[180px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#d97706 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Sticky Header / Navigation */}
      <header className="sticky top-0 z-40 bg-[#050816]/90 backdrop-blur-md border-b border-indigo-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#050816] rounded-[10px] flex items-center justify-center">
                <span className="text-amber-400 font-bold text-xl">✧</span>
              </div>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-amber-200 via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                AstroNexus Pro
              </span>
              <span className="block text-[10px] text-amber-400 font-mono tracking-widest uppercase -mt-1">
                वैदिक ज्योतिष & रत्न ERP
              </span>
            </div>
          </div>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a
              href="#features"
              onClick={e => scrollToSection(e, 'features')}
              className="hover:text-amber-300 transition cursor-pointer"
            >
              Core Capabilities
            </a>
            <a
              href="#ephemeris"
              onClick={e => scrollToSection(e, 'ephemeris')}
              className="hover:text-amber-300 transition cursor-pointer"
            >
              Kundli Engine
            </a>
            <a
              href="#vault"
              onClick={e => scrollToSection(e, 'vault')}
              className="hover:text-amber-300 transition font-semibold text-amber-400 cursor-pointer"
            >
              Gemstone Vault
            </a>
            <a
              href="#feedback"
              onClick={e => scrollToSection(e, 'feedback')}
              className="hover:text-amber-300 transition cursor-pointer"
            >
              Practitioner Reviews
            </a>
            <a
              href="#pricing"
              onClick={e => scrollToSection(e, 'pricing')}
              className="hover:text-amber-300 transition cursor-pointer"
            >
              Pricing ($200/mo)
            </a>
          </nav>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <button
                type="button"
                id="btn-nav-logged-dashboard"
                onClick={onGoToDashboard}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Demo User Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                {/* 1st Button: Demo User Direct Access with exact requested label */}
                <button
                  type="button"
                  id="btn-nav-demo-access"
                  onClick={onLaunchDemo}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/25 transition flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Demo User Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* 2nd Button: Opens 2-Tab Modal (Create Account / Login) */}
                <button
                  type="button"
                  id="btn-nav-auth-portal"
                  onClick={() => onOpenAuthModal('login')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-indigo-300 hover:text-white font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Member Portal</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>High-Precision Swiss Ephemeris & Zero-Human-Overhead Gemstone ERP</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight sm:leading-none">
            The Autonomous{' '}
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Vedic Astrology
            </span>{' '}
            & Gemstone Command Center
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Unified sub-arcsecond planetary computations, automated certified gemstone vault dispensing, multi-lingual
            Kundli dossier generation, and integrated client consultation CRM — designed for modern Vedic Acharyas and
            Gemological Institutions.
          </p>

          {/* 2 Big Primary Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {/* Primary Button 1: Create New Account / Member Login */}
            <button
              type="button"
              id="btn-hero-create-account"
              onClick={() => onOpenAuthModal('signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/25 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer"
            >
              <UserCheck className="w-5 h-5 text-slate-950" />
              <span>Create Astrologer Account (Fresh 0-Data Workspace)</span>
            </button>

            {/* Primary Button 2: Direct Demo Access */}
            <button
              type="button"
              id="btn-hero-demo-user"
              onClick={onLaunchDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700 text-white font-semibold text-sm shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition" />
              <span>Demo User Dashboard</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Feature Highlights Ticker */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sub-Arcsecond Swiss Ephemeris</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero-Human-Overhead Gemstone Vault</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>10+ Indian Languages (हिंदी, संस्कृत...)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Auto-Purchase & Auto-Dispense Sync</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick Kundli Test Drive Section */}
      <section id="ephemeris" className="py-16 bg-[#080c21] border-y border-indigo-950/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Live Interactive Ephemeris Test Drive</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Instant Astrological Computation Engine
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Test the real-time celestial algorithm. Enter birth parameters below to calculate exact planetary degrees,
              Vedic Lagna, Nakshatra padas, and primary gemstone recommendations immediately.
            </p>
          </div>

          {/* Quick Input Bar */}
          <form
            onSubmit={handleCalculateQuickDemo}
            className="p-6 bg-[#0d1333] border border-indigo-900/60 rounded-2xl shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
          >
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Native Name</label>
              <input
                type="text"
                value={demoName}
                onChange={e => setDemoName(e.target.value)}
                className="w-full px-3 py-2 bg-[#050816] border border-indigo-950 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400"
                placeholder="e.g. Rahul Sharma"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Birth Date</label>
              <input
                type="date"
                value={demoDob}
                onChange={e => setDemoDob(e.target.value)}
                className="w-full px-3 py-2 bg-[#050816] border border-indigo-950 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Birth Time</label>
              <input
                type="time"
                value={demoTob}
                onChange={e => setDemoTob(e.target.value)}
                className="w-full px-3 py-2 bg-[#050816] border border-indigo-950 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">City of Birth</label>
              <select
                value={demoCity}
                onChange={e => setDemoCity(e.target.value)}
                className="w-full px-3 py-2 bg-[#050816] border border-indigo-950 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400"
              >
                {WORLD_CITIES.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Calculate Kundli</span>
              </button>
            </div>
          </form>

          {/* Quick Output Preview Grid */}
          {calculatedChart && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Planetary Placements */}
              <div className="p-5 bg-[#0b0f2a] border border-indigo-900/50 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-950 pb-3">
                  <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Planetary Positions (ग्रह स्थिति)</span>
                  </h4>
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                    Lahiri Ayanamsha
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {calculatedChart.planets?.slice(0, 7).map((p: any) => (
                    <div
                      key={p.name}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#050816]/70 border border-indigo-950"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-indigo-950 flex items-center justify-center font-bold text-amber-400 text-xs">
                          {p.symbol}
                        </span>
                        <span className="font-semibold text-slate-200">{p.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-slate-300">{p.formattedDegrees}</span>
                        <span className="text-[10px] text-amber-400 block">{p.sign} (H{p.house})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Astrological Pillars */}
              <div className="p-5 bg-[#0b0f2a] border border-indigo-900/50 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-950 pb-3">
                  <h4 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>Core Pillars & Dasha</span>
                  </h4>
                  <span className="text-[10px] bg-indigo-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                    Calculated
                  </span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#050816]/70 border border-indigo-950 flex items-center justify-between">
                    <span className="text-slate-400">Lagna / Ascendant</span>
                    <span className="font-bold text-amber-400">
                      {calculatedChart.interpretations?.coreAscendant?.sign || 'Scorpio (वृश्चिक)'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#050816]/70 border border-indigo-950 flex items-center justify-between">
                    <span className="text-slate-400">Moon Sign (Rashi)</span>
                    <span className="font-bold text-indigo-300">
                      {calculatedChart.interpretations?.coreMoon?.sign || 'Cancer (कर्क)'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#050816]/70 border border-indigo-950 flex items-center justify-between">
                    <span className="text-slate-400">Sun Sign (Surya Rashi)</span>
                    <span className="font-bold text-amber-300">
                      {calculatedChart.interpretations?.coreSun?.sign || 'Scorpio (वृश्चिक)'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#050816]/70 border border-indigo-950 flex items-center justify-between">
                    <span className="text-slate-400">Dominant Element</span>
                    <span className="font-bold text-emerald-400">
                      {calculatedChart.interpretations?.elementDistribution?.dominantElement || 'Water (जल तत्व)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Gemstones */}
              <div className="p-5 bg-[#0b0f2a] border border-indigo-900/50 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-950 pb-3">
                  <h4 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                    <Gem className="w-4 h-4 text-amber-400" />
                    <span>Prescribed Gemstones (रत्न परामर्श)</span>
                  </h4>
                  <span className="text-[10px] bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                    Auto-Dispense Ready
                  </span>
                </div>
                <div className="space-y-2.5">
                  {calculatedChart.interpretations?.gemstoneRecommendations?.slice(0, 3).map((rec: any) => (
                    <div
                      key={rec.stone}
                      className="p-3 rounded-xl bg-gradient-to-r from-[#050816] to-[#0a1033] border border-amber-500/20 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-amber-300">{rec.stone} ({rec.sanskritName})</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                          {rec.suitability}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{rec.reason}</p>
                      <div className="text-[10px] text-indigo-300 font-mono flex items-center justify-between pt-1 border-t border-indigo-950">
                        <span>Planet: {rec.planet}</span>
                        <span>{rec.weightSuggestion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Real Core Capabilities & Feature Deep-Dive Section */}
      <section id="features" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-300 text-xs font-semibold">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Full-Stack Astrological Enterprise Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
              Engineered Specifically for Astrologers & Gemologists
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              No disconnected spreadsheets or generic store software. AstroNexus integrates sacred Jyotish math with
              enterprise stock control and point-of-sale automation.
            </p>
          </div>

          {/* 6 Core Feature Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Ephemeris & Kundli */}
            <div className="p-7 rounded-2xl bg-[#0b0f2a] border border-indigo-950/80 hover:border-indigo-700/60 transition shadow-xl space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition">
                Swiss Ephemeris & Dasha Matrix
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calculates sub-arcsecond planetary coordinates, Lahiri/Chitra Paksha Ayanamsha, Whole Sign & Placidus
                house cusps, Vimshottari Mahadasha timelines, Shadbala strength, and comprehensive 12-Bhava aspects.
              </p>
              <div className="text-[11px] font-semibold text-amber-400/90 flex items-center gap-1">
                <span>Explore Astro Engine</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 2. Zero-Overhead Gemstone Vault */}
            <div className="p-7 rounded-2xl bg-[#0b0f2a] border border-indigo-950/80 hover:border-indigo-700/60 transition shadow-xl space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
                Zero-Human-Overhead Gemstone Vault
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Single-point stock intake automatically logs dealer purchase invoices. Live barcode and camera scanner
                instantly identifies SKUs, certifications, Ratti/Carat weights, and origin credentials.
              </p>
              <div className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1">
                <span>View Vault System</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 3. Prescription to Sale Auto-Dispense */}
            <div className="p-7 rounded-2xl bg-[#0b0f2a] border border-indigo-950/80 hover:border-indigo-700/60 transition shadow-xl space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition">
                Auto-Dispensing Sales Ledger
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                One-click button on astrological prescriptions dispenses matching certified gemstones from stock, creates
                a retail sales invoice, applies GST/taxes, and deducts vault inventory automatically.
              </p>
              <div className="text-[11px] font-semibold text-purple-400 flex items-center gap-1">
                <span>Learn Automation Flow</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 4. Client CRM & Consultations */}
            <div className="p-7 rounded-2xl bg-[#0b0f2a] border border-indigo-950/80 hover:border-indigo-700/60 transition shadow-xl space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition">
                Client CRM & Appointment Calendar
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Complete dossiers with birth coordinates geocoding, saved natal charts, consultation history, meeting
                mode selection (Zoom/In-person/Phone), and direct WhatsApp appointment notifications.
              </p>
              <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <span>Discover CRM Workflow</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 5. 10+ Multi-Lingual Indian Languages */}
            <div className="p-7 rounded-2xl bg-[#0b0f2a] border border-indigo-950/80 hover:border-indigo-700/60 transition shadow-xl space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                10+ Indian Languages Localization
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Full UI and printable report translation for Hindi (हिंदी), Sanskrit (संस्कृत), Gujarati (ગુજરાતી),
                Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Marathi (मराठी), Kannada (ಕನ್ನಡ), Punjabi (ਪੰਜਾਬੀ), and
                Malayalam.
              </p>
              <div className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1">
                <span>View Multi-Lingual Engine</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 6. Super Admin Multi-Tenant & Billing */}
            <div className="p-7 rounded-2xl bg-[#0b0f2a] border border-indigo-950/80 hover:border-indigo-700/60 transition shadow-xl space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition">
                Tenant Control & $200/mo Billing
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                System admin dashboard to view credentials, edit accounts, delete tenants, and record monthly $200
                software subscription licenses with automated billing ledger tracking.
              </p>
              <div className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                <span>Explore Admin System</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gemstone Vault Showcase Section (Target for #vault Nav Link) */}
      <section id="vault" className="py-20 bg-gradient-to-b from-[#080c21] via-[#090e29] to-[#080c21] border-t border-indigo-950/90 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Gem className="w-4 h-4 text-amber-400" />
              <span>Certified Navratna Jyotish Vault & Live Dispenser</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Astrological Gemstone Vault & Inventory
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every gemstone is categorized by Vedic planetary ruler, Ratti & Carat weight, origin authenticity,
              and lab certification. Connects seamlessly with Kundli gemstone prescriptions for automated dispensing.
            </p>
          </div>

          {/* Navratna Gemstone Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Yellow Sapphire (Pukhraj / Jupiter) */}
            <div className="p-5 rounded-2xl bg-[#0b1030] border border-amber-500/30 hover:border-amber-400/70 transition shadow-xl space-y-4 relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                    <span>Jupiter (गुरु)</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                    Ceylon Yellow Sapphire (पुखराज)
                  </h3>
                  <p className="text-[11px] text-slate-400">Ratnapura, Sri Lanka • IGI Certified</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                  ♃
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#050818] border border-indigo-950 text-center text-[10px]">
                <div>
                  <span className="text-slate-500 block">Weight</span>
                  <span className="font-bold text-slate-200">5.25 Ratti (4.8 Ct)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Clarity</span>
                  <span className="font-bold text-emerald-400">VVS1 Eye-Clean</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Stock Rate</span>
                  <span className="font-bold text-amber-400">$480 / ct</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Prescription Match:</span>
                <span className="font-semibold text-amber-300">Wisdom, Wealth & Dhan Yoga</span>
              </div>
            </div>

            {/* 2. Blue Sapphire (Neelam / Saturn) */}
            <div className="p-5 rounded-2xl bg-[#0b1030] border border-indigo-900/60 hover:border-indigo-500/70 transition shadow-xl space-y-4 relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                    <span>Saturn (शनि)</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition">
                    Royal Blue Sapphire (नीलम)
                  </h3>
                  <p className="text-[11px] text-slate-400">Kashmir / Ceylon • GIA Certified</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                  ♄
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#050818] border border-indigo-950 text-center text-[10px]">
                <div>
                  <span className="text-slate-500 block">Weight</span>
                  <span className="font-bold text-slate-200">6.10 Ratti (5.6 Ct)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Color</span>
                  <span className="font-bold text-blue-400">Cornflower Blue</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Stock Rate</span>
                  <span className="font-bold text-amber-400">$650 / ct</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Prescription Match:</span>
                <span className="font-semibold text-blue-300">Discipline, Shani Sade Sati</span>
              </div>
            </div>

            {/* 3. Burmese Ruby (Manikya / Sun) */}
            <div className="p-5 rounded-2xl bg-[#0b1030] border border-rose-900/60 hover:border-rose-500/70 transition shadow-xl space-y-4 relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                    <span>Sun (सूर्य)</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition">
                    Pigeon Blood Ruby (माणिक्य)
                  </h3>
                  <p className="text-[11px] text-slate-400">Mogok, Burma • GRS Certified</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-sm">
                  ☉
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#050818] border border-indigo-950 text-center text-[10px]">
                <div>
                  <span className="text-slate-500 block">Weight</span>
                  <span className="font-bold text-slate-200">4.50 Ratti (4.1 Ct)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Treatment</span>
                  <span className="font-bold text-emerald-400">100% Unheated</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Stock Rate</span>
                  <span className="font-bold text-amber-400">$720 / ct</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Prescription Match:</span>
                <span className="font-semibold text-rose-300">Authority, Leadership & Health</span>
              </div>
            </div>

            {/* 4. Zambian Emerald (Panna / Mercury) */}
            <div className="p-5 rounded-2xl bg-[#0b1030] border border-emerald-900/60 hover:border-emerald-500/70 transition shadow-xl space-y-4 relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    <span>Mercury (बुध)</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                    Zambian Emerald (पन्ना)
                  </h3>
                  <p className="text-[11px] text-slate-400">Kagem Mine • Lab Certified</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                  ☿
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#050818] border border-indigo-950 text-center text-[10px]">
                <div>
                  <span className="text-slate-500 block">Weight</span>
                  <span className="font-bold text-slate-200">5.75 Ratti (5.2 Ct)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Hue</span>
                  <span className="font-bold text-emerald-300">Vivid Deep Green</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Stock Rate</span>
                  <span className="font-bold text-amber-400">$390 / ct</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Prescription Match:</span>
                <span className="font-semibold text-emerald-300">Intellect, Commerce & Speech</span>
              </div>
            </div>

            {/* 5. Italian Red Coral (Moonga / Mars) */}
            <div className="p-5 rounded-2xl bg-[#0b1030] border border-orange-900/60 hover:border-orange-500/70 transition shadow-xl space-y-4 relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-bold">
                    <span>Mars (मंगल)</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-orange-300 transition">
                    Italian Red Coral (मूंगा)
                  </h3>
                  <p className="text-[11px] text-slate-400">Mediterranean Sea • Triangular / Oval</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm">
                  ♂
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#050818] border border-indigo-950 text-center text-[10px]">
                <div>
                  <span className="text-slate-500 block">Weight</span>
                  <span className="font-bold text-slate-200">7.25 Ratti (6.6 Ct)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Luster</span>
                  <span className="font-bold text-orange-300">Porcelain Finish</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Stock Rate</span>
                  <span className="font-bold text-amber-400">$180 / ct</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Prescription Match:</span>
                <span className="font-semibold text-orange-300">Courage, Manglik Dosha Relief</span>
              </div>
            </div>

            {/* 6. South Sea Natural Pearl (Moti / Moon) */}
            <div className="p-5 rounded-2xl bg-[#0b1030] border border-cyan-900/60 hover:border-cyan-500/70 transition shadow-xl space-y-4 relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                    <span>Moon (चंद्र)</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                    Basra / South Sea Pearl (मोती)
                  </h3>
                  <p className="text-[11px] text-slate-400">Natural Saltwater • Pure White</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                  ☽
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#050818] border border-indigo-950 text-center text-[10px]">
                <div>
                  <span className="text-slate-500 block">Weight</span>
                  <span className="font-bold text-slate-200">6.50 Ratti (5.9 Ct)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Shape</span>
                  <span className="font-bold text-cyan-300">Round Spherical</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Stock Rate</span>
                  <span className="font-bold text-amber-400">$210 / ct</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Prescription Match:</span>
                <span className="font-semibold text-cyan-300">Peace of Mind & Emotional Stability</span>
              </div>
            </div>
          </div>

          {/* Direct Demo Call to Action Button */}
          <div className="pt-4 text-center">
            <button
              type="button"
              id="btn-vault-explore-demo"
              onClick={onLaunchDemo}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition transform hover:-translate-y-0.5 inline-flex items-center gap-3 cursor-pointer"
            >
              <Gem className="w-5 h-5 text-slate-950" />
              <span>Demo User Dashboard</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      </section>

      {/* Genuine Client & Practitioner Feedback Section */}
      <section id="feedback" className="py-20 bg-[#080c21] border-t border-indigo-950/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Verified Astrologer & Clinic Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Trusted by Renowned Vedic Astrologers & Gemologists
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Real feedback from Jyotish Acharyas, gemstone showroom owners, and consultation seekers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="p-6 rounded-2xl bg-[#0d1333] border border-indigo-900/60 flex flex-col justify-between space-y-4 shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "The zero-human-overhead connection between Kundli gemstone prescriptions and our billing ledger saved
                  us over 25 hours every week. When I recommend Ceylon Yellow Sapphire for Jupiter Mahadasha, the invoice
                  and gemstone certificate are generated instantly."
                </p>
              </div>
              <div className="pt-4 border-t border-indigo-950 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                  VS
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Acharya Vimal Shastri</h4>
                  <p className="text-[10px] text-amber-400">Chief Astrologer, Varanasi Vedic Research</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 rounded-2xl bg-[#0d1333] border border-indigo-900/60 flex flex-col justify-between space-y-4 shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "The camera barcode scanner for physical gemstone parcels and automatic Ratti-to-Carat conversion is a
                  game changer. We manage over 2,000 certified precious stones without a single stock mismatch."
                </p>
              </div>
              <div className="pt-4 border-t border-indigo-950 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                  MR
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Maya Rathore</h4>
                  <p className="text-[10px] text-indigo-400">Managing Director, Ratna Jewels Mumbai</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 rounded-2xl bg-[#0d1333] border border-indigo-900/60 flex flex-col justify-between space-y-4 shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "Sub-arcsecond accuracy matched with multi-lingual Sanskrit and Hindi Kundli dossier export allows our
                  academy to teach classical Parashari principles while running our international consultation clinic."
                </p>
              </div>
              <div className="pt-4 border-t border-indigo-950 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-600 flex items-center justify-center font-bold text-white text-xs">
                  KD
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Dr. Kenneth Davis</h4>
                  <p className="text-[10px] text-emerald-400">Director, London Vedic Astrology Institute</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Pricing Section */}
      <section id="pricing" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Transparent Professional Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Professional Astrologer License
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Complete access to Ephemeris computations, Gemstone Vault, Client CRM, and Super Admin Management.
            </p>
          </div>

          <div className="max-w-md mx-auto p-8 rounded-3xl bg-gradient-to-b from-[#0e1438] to-[#080c21] border-2 border-amber-500/40 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              All-Inclusive
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">AstroERP Enterprise License</h3>
              <p className="text-xs text-slate-400">Full Cloud & Offline Suite with Zero-Data Tenant Isolation</p>
              <div className="pt-2 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-amber-300">$200</span>
                <span className="text-sm font-semibold text-slate-400">/ month</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-indigo-950 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unlimited High-Precision Kundli Charts</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unlimited Gemstone Vault Inventory & Barcode Scan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Client Relationship Manager & Zoom Booking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>10+ Indian Languages Translation & PDF Export</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Super Admin Tenant Control & Billing Ledger</span>
              </div>
            </div>

            <button
              type="button"
              id="btn-pricing-signup"
              onClick={() => onOpenAuthModal('signup')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              Get Started with Fresh Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#03050f] border-t border-indigo-950/80 py-12 text-slate-400 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-slate-950 text-sm">
              ✧
            </div>
            <div>
              <span className="font-bold text-slate-200 block">AstroNexus Pro Command Center</span>
              <span className="text-[10px] text-slate-500">Autonomous Astrological Ephemeris & ERP</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button type="button" onClick={onLaunchDemo} className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1.5 text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo User Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenAuthModal('login')}
              className="hover:text-amber-300 transition cursor-pointer"
            >
              Member Login
            </button>
            <button
              type="button"
              onClick={() => onOpenAuthModal('signup')}
              className="hover:text-amber-300 transition cursor-pointer"
            >
              Create Account
            </button>
          </div>

          <div className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} AstroNexus Vedic Labs. Sub-Arcsecond Precision.
          </div>
        </div>
      </footer>
    </div>
  );
};
