import React, { useState } from 'react';
import { AstrologyChartData, Client } from '../../types';
import { TOP_INDIAN_CITIES, IndianCity } from '../../data/indianCities';
import { calculateFullAstrologyChart } from '../../utils/ephemerisEngine';
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
} from 'lucide-react';

interface MobileKundliTabProps {
  onSaveAsClient?: (clientData: Partial<Client>) => void;
  onOpenNewSale?: (stoneName: string, clientName: string) => void;
  currencySymbol: string;
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

  const [copiedNotice, setCopiedNotice] = useState(false);

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

  const getWhatsAppShareText = () => {
    if (!chart) return '';
    const asc = chart.interpretations?.coreAscendant?.sign || 'Simha (Leo)';
    const moon = chart.interpretations?.coreMoon?.sign || chart.planets?.find(p => p.name === 'Moon')?.sign || 'Vrishchika (Scorpio)';
    const sun = chart.interpretations?.coreSun?.sign || chart.planets?.find(p => p.name === 'Sun')?.sign || 'Karka (Cancer)';
    const dasha = chart.interpretations?.planetaryPlacements?.[0]?.planet || 'Jupiter';
    const gemstone = chart.interpretations?.gemstoneRecommendations?.[0]?.stone || 'Yellow Sapphire (Pukhraj)';

    return `🙏 *Vedic Kundli Summary - VedicAstro*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📅 *DOB:* ${date} at ${time} (${selectedCity.name})\n\n` +
      `✨ *Ascendant (Lagna):* ${asc}\n` +
      `🌙 *Moon Sign (Rashi):* ${moon}\n` +
      `☀️ *Sun Sign (Surya Rashi):* ${sun}\n` +
      `🪐 *Current Mahadasha:* ${dasha}\n\n` +
      `💎 *Prescribed Gemstone:* ${gemstone}\n` +
      `📿 *Rudraksha:* 5 Mukhi Rudraksha\n` +
      `🎨 *Lucky Color:* Saffron / Yellow\n` +
      `🔢 *Lucky Number:* 3, 7\n\n` +
      `_For complete life predictions & gemstone energization, visit our center or reply here._`;
  };

  const handleCopySummary = () => {
    const text = getWhatsAppShareText();
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = getWhatsAppShareText();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Instant Kundli & Astro-Check</h2>
            <p className="text-[11px] text-slate-400">Swiss Ephemeris & Vedic Lahiri Engine (Mobile)</p>
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
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Time of Birth</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
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
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {TOP_INDIAN_CITIES.map(city => (
                <option key={city.name} value={city.name}>
                  {city.name} ({city.state})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Calculate Vedic Kundli</span>
          </button>
        </form>
      </div>

      {/* Chart Results Card */}
      {chart && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Quick Pillars Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-amber-400 font-semibold block uppercase">Ascendant (Lagna)</span>
              <span className="text-sm font-bold text-white block mt-0.5">{chart.interpretations?.coreAscendant?.sign || 'Simha (Leo)'}</span>
              <span className="text-[10px] text-slate-400">1st House (Physical & Life Path)</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-sky-400 font-semibold block uppercase">Moon Sign (Rashi)</span>
              <span className="text-sm font-bold text-white block mt-0.5">
                {chart.interpretations?.coreMoon?.sign || chart.planets?.find(p => p.name === 'Moon')?.sign || 'Vrishchika (Scorpio)'}
              </span>
              <span className="text-[10px] text-slate-400">Mind, Emotions & Janma Rashi</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-purple-400 font-semibold block uppercase">Current Mahadasha</span>
              <span className="text-sm font-bold text-white block mt-0.5">
                {chart.interpretations?.planetaryPlacements?.[0]?.planet || 'Jupiter'} Mahadasha
              </span>
              <span className="text-[10px] text-slate-400">Active Planetary Period</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-emerald-400 font-semibold block uppercase">Prescribed Gemstone</span>
              <span className="text-sm font-bold text-emerald-300 block mt-0.5 truncate">
                {chart.interpretations?.gemstoneRecommendations?.[0]?.stone || 'Yellow Sapphire (Pukhraj)'}
              </span>
              <span className="text-[10px] text-slate-400">Lucky Energized Gem</span>
            </div>
          </div>

          {/* Planetary Placements Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Planetary Coordinates</span>
              <span className="text-[10px] text-slate-400 lowercase">Lahiri Sidereal</span>
            </h3>

            <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
              {(chart.planets || []).map(p => (
                <div key={p.name} className="flex items-center justify-between p-1.5 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
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

          {/* 1-Tap Client Share Actions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200">Share Kundli Summary with Client</h4>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Share WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <Copy className="w-4 h-4 text-indigo-400" />
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
                className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-indigo-500/30 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Save Client Profile to CRM</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
