/**
 * Public Astrology Chart Calculator Form (Astro.com & Vedic Kundali Style)
 * Input: Name, Date of Birth, Time of Birth, Place of Birth (Lat/Lng)
 * Indian Language selector, Zodiac System, House System, Quick Indian & Global presets
 */

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles, User, Compass, Languages } from 'lucide-react';
import { WORLD_CITIES } from '../../data/initialDemoData';
import { LanguageCode, getTranslation, INDIAN_LANGUAGES } from '../../utils/indianLanguages';
import { LanguageSelector } from '../Common/LanguageSelector';

interface ChartCalculatorFormProps {
  onCalculate: (formData: {
    name: string;
    birthDate: string;
    birthTime: string;
    placeName: string;
    latitude: number;
    longitude: number;
    timezoneOffset?: number;
    houseSystem: 'placidus' | 'equal' | 'whole_sign';
    zodiacSystem: 'tropical' | 'sidereal_lahiri';
  }) => void;
  isLoading?: boolean;
  selectedLanguage?: LanguageCode;
  onSelectLanguage?: (lang: LanguageCode) => void;
}

export const ChartCalculatorForm: React.FC<ChartCalculatorFormProps> = ({
  onCalculate,
  isLoading = false,
  selectedLanguage = 'en',
  onSelectLanguage,
}) => {
  const [name, setName] = useState('Arun Kumar Jaiswal');
  const [birthDate, setBirthDate] = useState('1959-04-16');
  const [birthTime, setBirthTime] = useState('06:30');
  const [placeName, setPlaceName] = useState('Kolkata, India');
  const [latitude, setLatitude] = useState<number>(22.5726);
  const [longitude, setLongitude] = useState<number>(88.3639);
  const [timezoneOffset, setTimezoneOffset] = useState<number>(5.5);
  const [houseSystem, setHouseSystem] = useState<'placidus' | 'equal' | 'whole_sign'>('whole_sign');
  const [zodiacSystem, setZodiacSystem] = useState<'tropical' | 'sidereal_lahiri'>('sidereal_lahiri');

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [cityResults, setCityResults] = useState(WORLD_CITIES.slice(0, 10));
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const t = (key: string) => getTranslation(key, selectedLanguage);

  const handleCitySearch = (query: string) => {
    setCitySearchQuery(query);
    setPlaceName(query);
    if (!query.trim()) {
      setCityResults(WORLD_CITIES.slice(0, 10));
    } else {
      const q = query.toLowerCase();
      const filtered = WORLD_CITIES.filter(
        c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
      );
      setCityResults(filtered.slice(0, 12));
    }
    setIsCityDropdownOpen(true);
  };

  const handleSelectCity = (city: typeof WORLD_CITIES[0]) => {
    setPlaceName(city.name);
    setLatitude(city.lat);
    setLongitude(city.lng);
    setTimezoneOffset(city.tz);
    setIsCityDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthDate || !birthTime) return;

    onCalculate({
      name,
      birthDate,
      birthTime,
      placeName,
      latitude,
      longitude,
      timezoneOffset,
      houseSystem,
      zodiacSystem,
    });
  };

  // Quick preset sample profiles
  const loadPreset = (presetName: string) => {
    if (presetName === 'Kolkata') {
      setName('Arun Kumar Jaiswal');
      setBirthDate('1959-04-16');
      setBirthTime('06:30');
      setPlaceName('Kolkata, India');
      setLatitude(22.5726);
      setLongitude(88.3639);
      setTimezoneOffset(5.5);
    } else if (presetName === 'Mumbai') {
      setName('Ananya Deshmukh');
      setBirthDate('1995-11-18');
      setBirthTime('09:15');
      setPlaceName('Mumbai, India');
      setLatitude(19.0760);
      setLongitude(72.8777);
      setTimezoneOffset(5.5);
    } else if (presetName === 'Delhi') {
      setName('Rajesh Sharma');
      setBirthDate('1984-08-15');
      setBirthTime('07:45');
      setPlaceName('New Delhi, India');
      setLatitude(28.6139);
      setLongitude(77.2090);
      setTimezoneOffset(5.5);
    } else if (presetName === 'London') {
      setName('Alexander Sterling');
      setBirthDate('1992-07-24');
      setBirthTime('14:30');
      setPlaceName('London, UK');
      setLatitude(51.5074);
      setLongitude(-0.1278);
      setTimezoneOffset(0);
    } else if (presetName === 'NewYork') {
      setName('Elena Vance');
      setBirthDate('1988-04-12');
      setBirthTime('19:45');
      setPlaceName('New York, USA');
      setLatitude(40.7128);
      setLongitude(-74.0060);
      setTimezoneOffset(-5);
    }
  };

  return (
    <div id="chart-calculator-card" className="w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            {t('calculatorTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('calculatorSubtitle')}
          </p>
        </div>

        {/* Quick Presets & Indian Language Dropdown */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {onSelectLanguage && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium hidden sm:inline">Language:</span>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onSelectLanguage={onSelectLanguage}
                variant="header"
              />
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">{t('quickSamples')}:</span>
            <button
              type="button"
              id="preset-kolkata"
              onClick={() => loadPreset('Kolkata')}
              className="px-2 py-0.5 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded border border-slate-200 font-medium transition cursor-pointer text-[11px]"
            >
              Kolkata
            </button>
            <button
              type="button"
              id="preset-mumbai"
              onClick={() => loadPreset('Mumbai')}
              className="px-2 py-0.5 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded border border-slate-200 font-medium transition cursor-pointer text-[11px]"
            >
              Mumbai
            </button>
            <button
              type="button"
              id="preset-delhi"
              onClick={() => loadPreset('Delhi')}
              className="px-2 py-0.5 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded border border-slate-200 font-medium transition cursor-pointer text-[11px]"
            >
              Delhi
            </button>
            <button
              type="button"
              id="preset-london"
              onClick={() => loadPreset('London')}
              className="px-2 py-0.5 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded border border-slate-200 font-medium transition cursor-pointer text-[11px]"
            >
              London
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              {t('subjectName')}
            </label>
            <input
              type="text"
              id="input-subject-name"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Arun Kumar Jaiswal"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition font-medium"
            />
          </div>

          {/* Date of Birth */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              {t('dateOfBirth')}
            </label>
            <input
              type="date"
              id="input-birth-date"
              required
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition font-medium"
            />
          </div>

          {/* Time of Birth */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              {t('timeOfBirth')}
            </label>
            <input
              type="time"
              id="input-birth-time"
              required
              value={birthTime}
              onChange={e => setBirthTime(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition font-medium"
            />
          </div>

          {/* Place of Birth (Autocomplete dropdown) */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              {t('placeOfBirth')}
            </label>
            <input
              type="text"
              id="input-place-name"
              required
              value={placeName}
              onChange={e => handleCitySearch(e.target.value)}
              onFocus={() => setIsCityDropdownOpen(true)}
              placeholder="Search city e.g. Kolkata, Mumbai, London..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition font-medium"
            />

            {/* City Autocomplete Dropdown */}
            {isCityDropdownOpen && cityResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg divide-y divide-slate-100">
                {cityResults.map((c, i) => (
                  <button
                    key={`${c.name}-${i}`}
                    type="button"
                    onClick={() => handleSelectCity(c)}
                    className="w-full px-3.5 py-2 text-left text-xs text-slate-800 hover:bg-indigo-50 hover:text-indigo-900 flex items-center justify-between transition cursor-pointer"
                  >
                    <span className="font-medium">{c.name}</span>
                    <span className="text-slate-500 text-[11px]">{c.lat.toFixed(2)}°, {c.lng.toFixed(2)}° (UTC{c.tz >= 0 ? `+${c.tz}` : c.tz})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Advanced Coordinates & Astrological System Settings */}
        <div className="pt-2">
          <button
            type="button"
            id="btn-toggle-advanced"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-semibold transition cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            {showAdvanced ? 'Hide Advanced Astrological Settings ▲' : 'Show Advanced Calculation Settings (House & Zodiac Systems, Custom Lat/Lng) ▼'}
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">House System / भाव पद्धति</label>
                <select
                  value={houseSystem}
                  onChange={e => setHouseSystem(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="whole_sign">Whole Sign / सम्पूर्ण राशि भाव (Vedic Standard)</option>
                  <option value="placidus">Placidus (Standard Topocentric)</option>
                  <option value="equal">Equal House (from Ascendant degree)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Zodiac Coordinate System / अयनांश</label>
                <select
                  value={zodiacSystem}
                  onChange={e => setZodiacSystem(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="sidereal_lahiri">Sidereal (Lahiri / Chitra Paksha Ayanamsha - Vedic)</option>
                  <option value="tropical">Tropical Zodiac (Western Ephemeris Standard)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Latitude (° अक्षांश)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={e => setLatitude(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Longitude (° रेखांश)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={e => setLongitude(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>High-precision Swiss Ephemeris Engine active</span>
          </div>

          <button
            type="submit"
            id="btn-calculate-chart"
            disabled={isLoading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-2 transition cursor-pointer text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t('calculating')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>{t('calculateButton')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
