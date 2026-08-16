/**
 * Unified Astrologer & Gemstone Office ERP Dashboard
 * Professional Polish Command Center Theme
 */

import React, { useState } from 'react';
import { DashboardStats, User } from '../../types';
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
} from 'lucide-react';

interface OverviewDashboardProps {
  stats: DashboardStats | null;
  currentUser: User | null;
  onNavigateTab: (tabId: string) => void;
  onOpenNewClientModal: () => void;
  onOpenNewAppointmentModal: () => void;
  onOpenNewSaleModal: () => void;
  onOpenNewStoneModal: () => void;
  onQuickCalculate?: (name: string, date: string, time: string) => void;
  currencySymbol?: string;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  stats,
  currentUser,
  onNavigateTab,
  onOpenNewClientModal,
  onOpenNewAppointmentModal,
  onOpenNewSaleModal,
  onOpenNewStoneModal,
  currencySymbol = '$',
}) => {
  const [quickName, setQuickName] = useState('Ananya Sharma');
  const [quickDate, setQuickDate] = useState('1995-11-18');
  const [quickTime, setQuickTime] = useState('09:15');

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleQuickChart = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateTab('astrology');
  };

  return (
    <div className="space-y-6">
      {/* 4 Primary Top KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Total Clients */}
        <div
          onClick={() => onNavigateTab('clients')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400/80 transition cursor-pointer"
        >
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Total Clients
          </p>
          <h3 className="text-2xl font-bold text-slate-900">
            {stats.totalClients.toLocaleString()}
          </h3>
          <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <span>↑ 12% this month</span>
          </div>
        </div>

        {/* KPI 2: Today's / Weekly Consults */}
        <div
          onClick={() => onNavigateTab('appointments')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400/80 transition cursor-pointer"
        >
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Weekly Consults
          </p>
          <h3 className="text-2xl font-bold text-slate-900">
            {stats.weeklyAppointments < 10 ? `0${stats.weeklyAppointments}` : stats.weeklyAppointments}
          </h3>
          <div className="mt-2 text-xs text-amber-600 font-medium truncate">
            {stats.upcomingAppointments[0]
              ? `Next: ${stats.upcomingAppointments[0].clientName} (${stats.upcomingAppointments[0].time})`
              : 'All scheduled sessions active'}
          </div>
        </div>

        {/* KPI 3: Low Stock Alerts */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-red-400/80 transition cursor-pointer"
        >
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Low Stock Alerts
          </p>
          <h3 className="text-2xl font-bold text-red-600">
            {stats.lowStockCount < 10 ? `0${stats.lowStockCount}` : stats.lowStockCount}
          </h3>
          <div className="mt-2 text-xs text-red-500 font-medium truncate">
            {stats.lowStockItems.length > 0
              ? stats.lowStockItems.map((i) => i.name).slice(0, 2).join(', ')
              : 'Vault stock levels healthy'}
          </div>
        </div>

        {/* KPI 4: Monthly Revenue */}
        <div
          onClick={() => onNavigateTab('sales')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400/80 transition cursor-pointer"
        >
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Monthly Revenue
          </p>
          <h3 className="text-2xl font-bold text-slate-900">
            {currencySymbol}{stats.totalRevenue.toLocaleString()}
          </h3>
          <div className="mt-2 text-xs text-slate-400">
            Valuation: {currencySymbol}{stats.totalInventoryValuation.toLocaleString()}
          </div>
        </div>
      </section>

      {/* Main Grid: Inventory Spotlight + Quick Calc & Upcoming Sessions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Inventory Spotlight Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-slate-800 text-sm">Inventory Spotlight</h4>
            </div>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider cursor-pointer"
            >
              View All Inventory
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                    Stone Name
                  </th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                    Category
                  </th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                    Weight
                  </th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr className="hover:bg-slate-50/60 transition">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    Pukhraj (Yellow Sapphire)
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">Precious Jyotish</td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-700">4.52ct</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">
                      12 units
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      onClick={() => onNavigateTab('inventory')}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    Natural Neelam (Blue Sapphire)
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">Precious Jyotish</td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-700">6.10ct</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">
                      1 unit
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      onClick={onOpenNewStoneModal}
                      className="text-red-600 hover:text-red-800 font-semibold text-xs cursor-pointer"
                    >
                      Restock
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    Colombian Emerald (Panna)
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">Precious Jyotish</td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-700">2.15ct</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">
                      5 units
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      onClick={() => onNavigateTab('inventory')}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    Natural Manik (Burmese Ruby)
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">Precious Jyotish</td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-700">3.80ct</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">
                      8 units
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      onClick={() => onNavigateTab('inventory')}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-auto p-4 bg-slate-50 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="w-[78%] h-full bg-indigo-600 rounded-full"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">
                Vault Capacity: 78%
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Astro Calc + Upcoming Sessions */}
        <div className="flex flex-col gap-6">
          {/* Quick Astro Calc Banner Card */}
          <div className="bg-indigo-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-200">
                Quick Astro Calc
              </h4>
              <Sparkles className="w-4 h-4 text-indigo-300" />
            </div>

            <form onSubmit={handleQuickChart} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-indigo-200 block mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  className="w-full bg-indigo-950/60 border border-indigo-700/80 text-white text-xs p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-indigo-200 block mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={quickDate}
                    onChange={(e) => setQuickDate(e.target.value)}
                    className="w-full bg-indigo-950/60 border border-indigo-700/80 text-white text-xs p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-indigo-200 block mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={quickTime}
                    onChange={(e) => setQuickTime(e.target.value)}
                    className="w-full bg-indigo-950/60 border border-indigo-700/80 text-white text-xs p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-white text-indigo-900 rounded-lg text-xs font-bold hover:bg-indigo-50 mt-2 transition cursor-pointer shadow-sm"
              >
                GENERATE NATAL CHART
              </button>
            </form>
          </div>

          {/* Upcoming Sessions Card */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-800 text-sm">Upcoming Sessions</h4>
                <button
                  onClick={() => onNavigateTab('appointments')}
                  className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  View Calendar
                </button>
              </div>

              <div className="space-y-3">
                {stats.upcomingAppointments.slice(0, 3).map((apt, idx) => (
                  <div
                    key={apt.id || idx}
                    className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <div className={`w-1 h-8 rounded-full ${idx === 0 ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {apt.clientName}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {apt.type.replace('_', ' ')} • {apt.time}
                      </p>
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-medium">
                      {apt.meetingMode.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onOpenNewAppointmentModal}
              className="w-full mt-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              Book New Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

