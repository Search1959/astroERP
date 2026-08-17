/**
 * Unified Astrologer & Gemstone Office ERP Dashboard
 * Executive Command Center Theme with Dynamic Real Inventory, Consultations, Invoices, and Astro Engine
 * Palette: Red, Fiery Orange, Bright White
 * Typography: Cinzel (Display), Outfit (Headings), Plus Jakarta Sans (Body)
 */

import React, { useState } from 'react';
import {
  DashboardStats,
  User,
  GemstoneItem,
  Client,
  Appointment,
  SalesInvoice,
  AstrologyChartData,
} from '../../types';
import {
  Users,
  Calendar,
  AlertTriangle,
  DollarSign,
  Gem,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Camera,
  FileSpreadsheet,
  Receipt,
  Star,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Activity,
  PackageCheck,
  Compass,
  Flame,
  Zap,
} from 'lucide-react';

interface OverviewDashboardProps {
  stats: DashboardStats | null;
  currentUser: User | null;
  inventory?: GemstoneItem[];
  clients?: Client[];
  appointments?: Appointment[];
  sales?: SalesInvoice[];
  chartData?: AstrologyChartData | null;
  onNavigateTab: (tabId: string) => void;
  onOpenNewClientModal: () => void;
  onOpenNewAppointmentModal: () => void;
  onOpenNewSaleModal: () => void;
  onOpenNewStoneModal: () => void;
  onOpenScannerModal?: () => void;
  onOpenCsvImportModal?: () => void;
  onOpenPredictionsWindow?: () => void;
  onQuickCalculate?: (name: string, date: string, time: string) => void;
  currencySymbol?: string;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  stats,
  currentUser,
  inventory = [],
  clients = [],
  appointments = [],
  sales = [],
  chartData,
  onNavigateTab,
  onOpenNewClientModal,
  onOpenNewAppointmentModal,
  onOpenNewSaleModal,
  onOpenNewStoneModal,
  onOpenScannerModal,
  onOpenCsvImportModal,
  onOpenPredictionsWindow,
  onQuickCalculate,
  currencySymbol = '₹',
}) => {
  const [quickName, setQuickName] = useState('Ananya Sharma');
  const [quickDate, setQuickDate] = useState('1995-11-18');
  const [quickTime, setQuickTime] = useState('09:15');

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleQuickChart = (e: React.FormEvent) => {
    e.preventDefault();
    if (onQuickCalculate) {
      onQuickCalculate(quickName, quickDate, quickTime);
    } else {
      onNavigateTab('astrology');
    }
  };

  // Safe inventory sliced for spotlight
  const displayInventory = inventory.length > 0 ? inventory.slice(0, 5) : stats.lowStockItems.slice(0, 5);
  const displayAppointments = appointments.length > 0 ? appointments.slice(0, 4) : stats.upcomingAppointments.slice(0, 4);
  const displaySales = sales.length > 0 ? sales.slice(0, 4) : stats.recentSales.slice(0, 4);

  return (
    <div className="space-y-6 font-sans text-white">
      {/* ========================================================================= */}
      {/* Top Welcome Banner with Quick Shortcuts Ribbon                            */}
      {/* ========================================================================= */}
      <div className="bg-[#120408] border border-red-900/60 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-red-950 text-orange-300 border border-orange-600/50 rounded-md flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" />
              <span>Office Command Center</span>
            </span>
            <span className="text-xs text-slate-300">
              Welcome back, <strong className="text-white">{currentUser?.name || 'Astrologer Admin'}</strong>
            </span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-black text-white mt-1.5 tracking-wide">
            Astrology ERP & Gemstone Practice Overview
          </h2>
          <p className="font-body text-xs text-slate-300 mt-0.5">
            Zero-Human-Overhead automated ledger, real-time inventory vaults, and high-precision ephemeris calculations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenPredictionsWindow && (
            <button
              id="btn-dash-open-predictions"
              type="button"
              onClick={onOpenPredictionsWindow}
              className="px-3.5 py-2 bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Predictions Window</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenNewAppointmentModal}
            className="px-3 py-2 bg-[#1c060e] hover:bg-[#280914] border border-red-900/80 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span>Book Session</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewStoneModal}
            className="px-3 py-2 bg-[#1c060e] hover:bg-[#280914] border border-red-900/80 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-orange-400" />
            <span>Add Stock</span>
          </button>

          {onOpenScannerModal && (
            <button
              type="button"
              onClick={onOpenScannerModal}
              className="px-3 py-2 bg-[#1c060e] hover:bg-[#280914] border border-red-900/80 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-orange-400" />
              <span>Scan Barcode</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 Primary Top KPI Metric Cards                                            */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Registered Clients */}
        <div
          onClick={() => onNavigateTab('clients')}
          className="bg-[#120408] p-5 rounded-2xl border border-red-950 hover:border-orange-500/60 shadow-lg transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-orange-200/80 uppercase tracking-wider">
              Total Clients
            </span>
            <div className="p-2 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-400 group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-orange-500 group-hover:text-white transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-white">
            {stats.totalClients.toLocaleString()}
          </h3>
          <div className="text-[11px] text-orange-400 font-semibold flex items-center gap-1">
            <span>↑ Active CRM client profiles</span>
          </div>
        </div>

        {/* KPI 2: Weekly Consultations */}
        <div
          onClick={() => onNavigateTab('appointments')}
          className="bg-[#120408] p-5 rounded-2xl border border-red-950 hover:border-orange-500/60 shadow-lg transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-orange-200/80 uppercase tracking-wider">
              Weekly Consultations
            </span>
            <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-orange-500 group-hover:text-white transition">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-white">
            {stats.weeklyAppointments < 10 ? `0${stats.weeklyAppointments}` : stats.weeklyAppointments}
          </h3>
          <div className="text-[11px] text-orange-300 font-semibold truncate">
            {displayAppointments[0]
              ? `Next: ${displayAppointments[0].clientName} (${displayAppointments[0].time})`
              : 'Consultation calendar active'}
          </div>
        </div>

        {/* KPI 3: Low Stock Alerts */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-[#120408] p-5 rounded-2xl border border-red-950 hover:border-red-500/60 shadow-lg transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-red-200/80 uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <div className="p-2 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 group-hover:bg-red-600 group-hover:text-white transition">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-red-400">
            {stats.lowStockCount < 10 ? `0${stats.lowStockCount}` : stats.lowStockCount}
          </h3>
          <div className="text-[11px] text-red-300 font-semibold truncate">
            {stats.lowStockItems.length > 0
              ? `${stats.lowStockItems.length} items require restocking`
              : 'Vault stock levels healthy'}
          </div>
        </div>

        {/* KPI 4: Monthly Revenue */}
        <div
          onClick={() => onNavigateTab('sales')}
          className="bg-[#120408] p-5 rounded-2xl border border-red-950 hover:border-orange-500/60 shadow-lg transition cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-orange-200/80 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="p-2 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-400 group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-orange-500 group-hover:text-white transition">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-white">
            {currencySymbol}{stats.totalRevenue.toLocaleString()}
          </h3>
          <div className="text-[11px] text-slate-300 font-medium">
            Vault Valuation: <span className="text-orange-400 font-bold">{currencySymbol}{stats.totalInventoryValuation.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* Main Grid: Real Inventory Vault + Quick Astro Calc & Upcoming Consults    */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Real Inventory Vault Table */}
        <div className="lg:col-span-8 bg-[#120408] rounded-2xl border border-red-950 shadow-xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-red-950 flex items-center justify-between bg-[#16050b]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-orange-500/15 border border-orange-500/40 rounded-xl text-orange-400">
                <Gem className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-outfit font-bold text-white text-sm">Gemstone Vault Inventory Monitor</h4>
                <p className="text-[11px] text-slate-300">Real-time certified stones and automated stock alerts</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenNewStoneModal}
                className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-sm"
              >
                + Add Stone
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('inventory')}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 uppercase tracking-wider cursor-pointer ml-1"
              >
                View Vault →
              </button>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-[#18050c] border-b border-red-950">
                <tr>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-orange-200 font-bold">
                    Stone Name
                  </th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-orange-200 font-bold">
                    Category
                  </th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-orange-200 font-bold">
                    Weight
                  </th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-orange-200 font-bold">
                    Sale Price
                  </th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-orange-200 font-bold">
                    Stock Status
                  </th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-orange-200 font-bold text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-950/70">
                {displayInventory.map((item, idx) => {
                  const isLow = item.stockQuantity <= item.minStockThreshold;
                  return (
                    <tr key={item.id || idx} className="hover:bg-[#1a060e] transition">
                      <td className="px-4 py-3.5 text-sm font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-300 capitalize">
                        {String(item.categoryName || item.category || 'Gemstone').replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-mono text-slate-300">
                        {item.weightCarats} ct ({item.weightRatti || (item.weightCarats * 1.09).toFixed(2)} Ratti)
                      </td>
                      <td className="px-4 py-3.5 text-xs font-mono text-orange-400 font-bold">
                        {currencySymbol}{(item.salePrice || item.sellingPrice || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            isLow
                              ? 'bg-red-500/15 text-red-300 border border-red-500/40'
                              : 'bg-orange-500/15 text-orange-300 border border-orange-500/40'
                          }`}
                        >
                          {item.stockQuantity} in stock {isLow && '(Low)'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-right">
                        <button
                          type="button"
                          onClick={() => onNavigateTab('inventory')}
                          className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#16050b] border-t border-red-950 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-orange-400" />
              <span>Total Vault Items: <strong className="text-white">{stats.totalStonesInStock} units</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">Valuation:</span>
              <strong className="text-orange-400 font-mono font-bold">{currencySymbol}{stats.totalInventoryValuation.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Quick Astro Calc & Upcoming Appointments */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick Astro Calc Banner Card */}
          <div className="bg-gradient-to-br from-[#240810] via-[#16040a] to-[#0c0205] rounded-2xl p-5 border border-orange-500/40 shadow-xl text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-orange-200">
                  Quick Kundli & Ephemeris
                </h4>
              </div>
              <span className="text-[10px] bg-red-950 text-orange-300 px-2 py-0.5 rounded-full border border-orange-500/40 font-mono">
                Instant Calc
              </span>
            </div>

            <form onSubmit={handleQuickChart} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-orange-200/80 block mb-1">
                  Client / Subject Name
                </label>
                <input
                  type="text"
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  className="w-full bg-[#070204] border border-red-900 text-white text-xs p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="Enter full name..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-orange-200/80 block mb-1">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={quickDate}
                    onChange={(e) => setQuickDate(e.target.value)}
                    className="w-full bg-[#070204] border border-red-900 text-white text-xs p-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-orange-200/80 block mb-1">
                    Birth Time
                  </label>
                  <input
                    type="time"
                    value={quickTime}
                    onChange={(e) => setQuickTime(e.target.value)}
                    className="w-full bg-[#070204] border border-red-900 text-white text-xs p-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
                >
                  Generate Kundli
                </button>
                {onOpenPredictionsWindow && (
                  <button
                    type="button"
                    onClick={onOpenPredictionsWindow}
                    className="px-3 py-2.5 bg-[#1c060e] hover:bg-[#280914] border border-red-900 text-orange-300 rounded-xl text-xs font-bold transition cursor-pointer"
                    title="View Weekly/Monthly/Yearly Predictions"
                  >
                    <Star className="w-4 h-4 text-orange-400" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Upcoming Sessions Card */}
          <div className="bg-[#120408] rounded-2xl border border-red-950 shadow-xl p-5 flex flex-col justify-between flex-1 space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-red-950 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <h4 className="font-outfit font-bold text-white text-sm">Upcoming Consultations</h4>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('appointments')}
                  className="text-xs font-semibold text-orange-400 hover:text-orange-300 cursor-pointer"
                >
                  Full Calendar →
                </button>
              </div>

              <div className="space-y-2.5">
                {displayAppointments.map((apt, idx) => (
                  <div
                    key={apt.id || idx}
                    className="flex items-center gap-3 p-3 bg-[#19060d] rounded-xl border border-red-950"
                  >
                    <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-red-500 to-orange-500"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {apt.clientName}
                      </p>
                      <p className="text-[10px] text-slate-300 truncate">
                        {String(apt.type || apt.serviceType || 'Consultation').replace(/_/g, ' ')} • {apt.time || '10:00 AM'}
                      </p>
                    </div>
                    <span className="text-[10px] bg-[#070204] text-orange-300 border border-red-950 px-2 py-0.5 rounded-md font-mono">
                      {apt.meetingMode?.split(' ')[0] || 'Office'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenNewAppointmentModal}
              className="w-full py-2.5 border border-red-900 hover:bg-[#1a060e] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-orange-400" />
              Book New Client Consultation
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* Bottom Section: Recent Invoices & Point of Sale Summary                   */}
      {/* ========================================================================= */}
      <section className="bg-[#120408] rounded-2xl border border-red-950 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-red-950 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/15 border border-orange-500/40 rounded-xl text-orange-400">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-outfit font-bold text-white text-sm">Recent Sales & Prescription Invoices</h4>
              <p className="text-[11px] text-slate-300">Automated invoices created from direct consultations & gemstone dispensing</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('sales')}
            className="text-xs font-bold text-orange-400 hover:text-orange-300 uppercase tracking-wider cursor-pointer"
          >
            All Sales Ledgers →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displaySales.map((sale, idx) => (
            <div key={sale.id || idx} className="p-4 bg-[#19060d] rounded-xl border border-red-950 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-300">#{sale.invoiceNumber}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/15 text-orange-300 border border-orange-500/40">
                  {sale.paymentStatus}
                </span>
              </div>
              <div className="text-sm font-bold text-white truncate">{sale.clientName}</div>
              <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-red-950">
                <span>{sale.items?.length || 1} stone items</span>
                <span className="text-orange-400 font-bold font-mono">
                  {currencySymbol}{sale.grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
