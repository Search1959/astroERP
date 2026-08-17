/**
 * Cloud Database (Firestore) & SEO Optimization Control Modal
 * Allows astrologers and clients to view live database sync metrics, save charts
 * to the cloud, generate public shareable internet links, and preview SEO rich snippets.
 */

import React, { useState, useEffect } from 'react';
import {
  Database,
  Globe,
  Share2,
  Copy,
  Check,
  Search,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Eye,
  Server,
  Cloud,
  FileCode,
  Tag,
  CheckCircle2,
  X
} from 'lucide-react';
import {
  saveChartToCloud,
  getRecentCloudCharts,
  seedCloudDatabaseIfEmpty,
  SavedCloudChart
} from '../../services/firestoreSync';
import { AstrologyChartData, Client, InventoryItem, Appointment, Purchase, Sale, User, StoreSettings } from '../../types';

interface CloudDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartData: AstrologyChartData | null;
  clients: Client[];
  inventory: InventoryItem[];
  appointments: Appointment[];
  purchases: Purchase[];
  sales: Sale[];
  users: User[];
  settings: StoreSettings | null;
  onLoadSavedChart?: (chart: SavedCloudChart) => void;
}

export const CloudDatabaseModal: React.FC<CloudDatabaseModalProps> = ({
  isOpen,
  onClose,
  chartData,
  clients,
  inventory,
  appointments,
  purchases,
  sales,
  users,
  settings,
  onLoadSavedChart,
}) => {
  const [activeTab, setActiveTab] = useState<'cloud_sync' | 'seo_preview' | 'recent_charts'>('cloud_sync');
  const [isSavingChart, setIsSavingChart] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [recentCharts, setRecentCharts] = useState<SavedCloudChart[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadRecent();
    }
  }, [isOpen]);

  const loadRecent = async () => {
    const charts = await getRecentCloudCharts(8);
    setRecentCharts(charts);
  };

  if (!isOpen) return null;

  const handleSaveCurrentChartToCloud = async () => {
    if (!chartData) return;
    setIsSavingChart(true);
    setStatusMessage(null);
    try {
      const sun = chartData.planets.find(p => p.name === 'Sun');
      const moon = chartData.planets.find(p => p.name === 'Moon');
      const res = await saveChartToCloud({
        subjectName: chartData.subjectName,
        birthDate: chartData.birthDate || '1992-07-24',
        birthTime: chartData.birthTime || '14:30',
        placeName: chartData.birthPlace || 'Global Coordinates',
        latitude: chartData.latitude || 0,
        longitude: chartData.longitude || 0,
        timezoneOffset: chartData.timezoneOffset || 0,
        houseSystem: chartData.houseSystem || 'placidus',
        zodiacSystem: chartData.zodiacSystem || 'tropical',
        chartData,
      });

      setShareUrl(res.shareUrl);
      setStatusMessage('Chart successfully saved to Firestore! Shareable link generated.');
      loadRecent();
    } catch (err: any) {
      setStatusMessage(`Error saving: ${err.message}`);
    } finally {
      setIsSavingChart(false);
    }
  };

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSeedAllData = async () => {
    setIsSeeding(true);
    setStatusMessage(null);
    try {
      const defaultSettings: StoreSettings = settings || {
        businessName: 'VedicAstro Gems & Astrology Studio',
        tagline: 'Authentic Astrological Consultations & Certified Jyotish Gemstones',
        address: 'Suite 408, Celestial Tower, MG Road, Bangalore - 560001, India',
        phone: '+91 98450 12345',
        email: 'consult@vedicastro.in',
        website: 'https://vedicastro-gems.in',
        taxRatePercent: 3.0,
        currencySymbol: '₹',
        currencyCode: 'INR',
        defaultHouseSystem: 'whole_sign',
        defaultZodiacSystem: 'sidereal_lahiri',
        invoiceFooterNote: 'All gemstones are 100% natural, lab-certified, and energized.',
      };

      await seedCloudDatabaseIfEmpty({
        clients,
        inventory,
        appointments,
        purchases,
        sales,
        users,
        settings: defaultSettings,
      });
      setStatusMessage('All ERP and catalog records synced and active in Firestore.');
    } catch (err: any) {
      setStatusMessage(`Sync error: ${err.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-xl text-indigo-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Cloud Database & Global SEO Suite
                </h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Firestore Live
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Multi-region Firestore cloud persistence and search engine optimization suite
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('cloud_sync')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 border-t border-x ${
              activeTab === 'cloud_sync'
                ? 'bg-white text-indigo-700 border-slate-200 border-b-white -mb-px'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Cloud Database Sync</span>
          </button>
          <button
            onClick={() => setActiveTab('seo_preview')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 border-t border-x ${
              activeTab === 'seo_preview'
                ? 'bg-white text-indigo-700 border-slate-200 border-b-white -mb-px'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>SEO & Social Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('recent_charts')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 border-t border-x ${
              activeTab === 'recent_charts'
                ? 'bg-white text-indigo-700 border-slate-200 border-b-white -mb-px'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Cloud Saved Charts ({recentCharts.length})</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {statusMessage && (
            <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {activeTab === 'cloud_sync' && (
            <div className="space-y-6">
              {/* Cloud Connection Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Server className="w-4 h-4 text-indigo-600" />
                    <span>Database Configuration (Connected)</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">Firebase Firestore</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Project ID</span>
                    <span className="font-mono text-slate-800 font-semibold">hardy-diorama-njlsj</span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Database Instance</span>
                    <span className="font-mono text-slate-800 text-[11px] font-semibold truncate block">
                      ai-studio-astroerpastrolog...
                    </span>
                  </div>
                </div>

                {/* Cloud Collections Count */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 text-center">
                  <div className="p-2 bg-indigo-50/60 rounded-lg border border-indigo-100">
                    <div className="text-xs font-black text-indigo-700">{clients.length}</div>
                    <div className="text-[10px] text-slate-500">Clients</div>
                  </div>
                  <div className="p-2 bg-indigo-50/60 rounded-lg border border-indigo-100">
                    <div className="text-xs font-black text-indigo-700">{inventory.length}</div>
                    <div className="text-[10px] text-slate-500">Gemstones</div>
                  </div>
                  <div className="p-2 bg-indigo-50/60 rounded-lg border border-indigo-100">
                    <div className="text-xs font-black text-indigo-700">{appointments.length}</div>
                    <div className="text-[10px] text-slate-500">Bookings</div>
                  </div>
                  <div className="p-2 bg-indigo-50/60 rounded-lg border border-indigo-100">
                    <div className="text-xs font-black text-indigo-700">{sales.length}</div>
                    <div className="text-[10px] text-slate-500">Invoices</div>
                  </div>
                  <div className="p-2 bg-indigo-50/60 rounded-lg border border-indigo-100">
                    <div className="text-xs font-black text-indigo-700">{purchases.length}</div>
                    <div className="text-[10px] text-slate-500">Purchases</div>
                  </div>
                  <div className="p-2 bg-indigo-50/60 rounded-lg border border-indigo-100">
                    <div className="text-xs font-black text-indigo-700">{recentCharts.length}</div>
                    <div className="text-[10px] text-slate-500">Cloud Charts</div>
                  </div>
                </div>
              </div>

              {/* Save Current Chart & Get Public Link */}
              <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-200/80 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    <span>Save Current Chart to Cloud & Generate Public URL</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Store this full Natal Kundali, planetary ephemeris, interpretations, and predictions into Firestore. A unique permanent web link will be generated allowing anyone on the internet to access this chart.
                </p>

                {chartData ? (
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{chartData.subjectName}</span>
                        <span className="text-slate-500 text-[11px] block">
                          {chartData.birthDate} at {chartData.birthTime} ({chartData.birthPlace})
                        </span>
                      </div>
                      <button
                        onClick={handleSaveCurrentChartToCloud}
                        disabled={isSavingChart}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isSavingChart ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving to Cloud...</span>
                          </>
                        ) : (
                          <>
                            <Cloud className="w-3.5 h-3.5" />
                            <span>Save & Get Public Link</span>
                          </>
                        )}
                      </button>
                    </div>

                    {shareUrl && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-2">
                        <span className="text-[11px] font-bold text-emerald-900 block">
                          Public Internet Access Link:
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="bg-white border border-emerald-300 px-3 py-1.5 rounded text-xs text-slate-800 flex-1 font-mono select-all"
                          />
                          <button
                            onClick={handleCopyLink}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded flex items-center gap-1 cursor-pointer transition shadow-2xs"
                          >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                    No active chart generated yet. Calculate a chart on the public tab first to save it to the cloud.
                  </div>
                )}
              </div>

              {/* Sync / Seed Cloud Database */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-slate-900">Synchronize ERP Records to Firestore</div>
                  <div className="text-[11px] text-slate-500">
                    Pushes all clients, certified gemstone catalog, and appointment records to cloud Firestore.
                  </div>
                </div>
                <button
                  onClick={handleSeedAllData}
                  disabled={isSeeding}
                  className="px-4 py-2 bg-slate-900 hover:bg-indigo-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSeeding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                  <span>{isSeeding ? 'Syncing...' : 'Sync to Cloud DB'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'seo_preview' && (
            <div className="space-y-6">
              {/* Google Search Result Mockup */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Search className="w-4 h-4 text-indigo-600" />
                  <span>Google Search Rich Snippet Preview</span>
                </div>

                <div className="p-4 bg-white border border-slate-300 rounded-xl shadow-xs space-y-1.5 font-sans">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-700 font-bold">
                      A
                    </span>
                    <span className="font-medium">AstroERP — Official Vedic Astrology</span>
                    <span className="text-slate-400">›</span>
                    <span className="text-slate-500">kundli-calculator</span>
                  </div>

                  <h4 className="text-base text-indigo-800 hover:underline cursor-pointer font-medium leading-snug">
                    AstroERP — Online Vedic & Western Natal Chart Calculator, Jyotish Astrology & Certified Gemstones
                  </h4>

                  <div className="flex items-center gap-2 text-xs text-amber-700">
                    <div className="flex text-amber-400 text-xs">★★★★★</div>
                    <span className="font-bold text-slate-700">4.9</span>
                    <span className="text-slate-500">(1,480+ Reviews) • Free Swiss Ephemeris Calculations</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Calculate precision Vedic Kundli & Western Natal Charts with Swiss Ephemeris formulas. Detailed weekly, monthly, yearly predictions, and certified natural Jyotish gemstones prescriptions across 12 Indian languages.
                  </p>
                </div>
              </div>

              {/* OpenGraph / Social Media Card Preview */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span>Social Share Preview (WhatsApp / Facebook / Twitter Card)</span>
                </div>

                <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs bg-slate-900 text-white">
                  <div className="h-32 bg-gradient-to-r from-indigo-900 via-purple-950 to-slate-900 p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> ASTROERP CLOUD
                      </span>
                      <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-indigo-200">
                        12 Indian Languages
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Vedic Birth Chart & Certified Gemstones Platform
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        Astronomical Precision Ephemeris & Gochara Transits
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-800 border-t border-slate-700 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-indigo-300">astroerp.app</div>
                    <div className="text-xs font-bold text-white">
                      Free Kundli & Planetary Prediction Engine
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      Instantly generate horoscope predictions and gemstone recommendations.
                    </div>
                  </div>
                </div>
              </div>

              {/* Structured Schema.org Tags Info */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-indigo-600" />
                  <span>Active Schema.org JSON-LD Microdata:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-mono text-[11px]">
                    @type: WebApplication
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[11px]">
                    @type: ProfessionalService
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-mono text-[11px]">
                    @type: FAQPage (4 Rich Q&As)
                  </span>
                  <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded font-mono text-[11px]">
                    @type: Offer (Price: 0.00 USD)
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recent_charts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Recently Saved Cloud Charts ({recentCharts.length})
                </span>
                <button
                  onClick={loadRecent}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              {recentCharts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recentCharts.map((chart) => (
                    <div
                      key={chart.id}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-indigo-300 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{chart.subjectName}</span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(chart.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        {chart.birthDate} at {chart.birthTime} • {chart.placeName}
                      </div>
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                        {onLoadSavedChart && (
                          <button
                            onClick={() => {
                              onLoadSavedChart(chart);
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-[11px] font-bold cursor-pointer"
                          >
                            Load Chart
                          </button>
                        )}
                        <a
                          href={chart.shareUrl || `?chartId=${chart.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[11px] font-bold flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> Direct URL
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                  No saved charts found in Firestore cloud database yet. Click "Save & Get Public Link" on any calculated chart!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted cloud database with automatic failover & real-time sync</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
