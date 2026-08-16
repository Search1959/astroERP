/**
 * Store & Astrological Settings Configuration View
 */

import React, { useState, useEffect } from 'react';
import { StoreSettings } from '../../types';
import { Settings, Save, CheckCircle2, Globe, Shield, Sparkles } from 'lucide-react';

interface StoreSettingsViewProps {
  settings: StoreSettings | null;
  onSaveSettings: (settings: StoreSettings) => void;
}

export const StoreSettingsView: React.FC<StoreSettingsViewProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<StoreSettings>({
    storeName: 'AstroERP Sanctuary & Vault',
    astrologerTitle: 'Chief Astrologer & Vedic Master',
    currency: 'USD',
    currencySymbol: '$',
    taxRatePercent: 5,
    defaultHouseSystem: 'placidus',
    defaultAyanamsha: 'tropical',
    officeAddress: 'Mayfair, London W1K, United Kingdom',
    contactEmail: 'contact@astroerp.com',
    contactPhone: '+44 20 7946 0912',
    enablePublicCalculator: true,
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Office & Astrological Ephemeris Settings</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure business identity, currency formatting, default house computation methods, and public portal settings.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 text-xs text-slate-700">
        {/* Business Identity */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Globe className="w-4 h-4 text-indigo-600" /> Business Identity & Office Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Sanctuary / Practice Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Primary Astrologer Professional Title</label>
              <input
                type="text"
                value={formData.astrologerTitle}
                onChange={e => setFormData({ ...formData, astrologerTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Contact Phone / WhatsApp</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Physical Office Address (Printed on Invoices)</label>
              <input
                type="text"
                value={formData.officeAddress}
                onChange={e => setFormData({ ...formData, officeAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Currency & Tax */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Shield className="w-4 h-4 text-emerald-600" /> Currency & Billing Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Base Currency Code</label>
              <select
                value={formData.currency}
                onChange={e => {
                  const val = e.target.value;
                  const sym = val === 'USD' ? '$' : val === 'EUR' ? '€' : val === 'GBP' ? '£' : '₹';
                  setFormData({ ...formData, currency: val, currencySymbol: sym });
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Currency Symbol</label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={e => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Default Sales Tax Rate (%)</label>
              <input
                type="number"
                value={formData.taxRatePercent}
                onChange={e => setFormData({ ...formData, taxRatePercent: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Astrological Defaults */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" /> Default Astrological Ephemeris Engine Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Default House Calculation System</label>
              <select
                value={formData.defaultHouseSystem}
                onChange={e => setFormData({ ...formData, defaultHouseSystem: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="placidus">Placidus (Standard Topocentric)</option>
                <option value="whole_sign">Whole Sign (Vedic & Hellenistic standard)</option>
                <option value="equal">Equal House (from Ascendant)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Default Zodiac Reference System</label>
              <select
                value={formData.defaultAyanamsha}
                onChange={e => setFormData({ ...formData, defaultAyanamsha: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="tropical">Tropical Zodiac (Western Astrodienst style)</option>
                <option value="sidereal_lahiri">Sidereal Lahiri Ayanamsha (Vedic Jyotish)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Default Indian Language for Kundali & Reports</label>
              <select
                value={formData.defaultLanguage || 'hi'}
                onChange={e => setFormData({ ...formData, defaultLanguage: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="hi">हिन्दी (Hindi - Devanagari)</option>
                <option value="sa">संस्कृतम् (Sanskrit - Classical Vedic)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="bn">বাংলা (Bengali / Bangla)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="ml">മലയാളം (Malayalam)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi / Gurmukhi)</option>
                <option value="or">ଓଡ଼ିଆ (Odia)</option>
                <option value="en">English (International Standard)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
            {isSaved && (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Settings saved successfully!
              </>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-2 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Store Settings
          </button>
        </div>
      </form>
    </div>
  );
};
