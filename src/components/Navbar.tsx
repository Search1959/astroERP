/**
 * Professional Polish Navigation Sidebar & Top Header
 * Supports Home Page landing view, Astro Ephemeris, Client CRM, Inventory Vault,
 * System Admin Data console (Tenant credentials & ₹200/mo subscriptions), and Demo Read-Only mode.
 */

import React, { useState } from 'react';
import { User, StoreSettings } from '../types';
import {
  Sparkles,
  LayoutDashboard,
  Users,
  Calendar,
  Gem,
  ShoppingBag,
  DollarSign,
  Shield,
  ShieldCheck,
  Settings,
  Menu,
  X,
  Home,
  LogOut,
  Eye,
  MessageSquare,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  currentUser: User | null;
  onOpenLoginModal: () => void;
  onGoToHome?: () => void;
  settings: StoreSettings | null;
  onQuickNewChart?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenCloudModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onOpenLoginModal,
  onGoToHome,
  settings,
  onOpenCloudModal,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';
  const isDemoUser = currentUser?.role === 'demo_user';

  const baseTabs = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads & WhatsApp', icon: MessageSquare, badge: 'CRM' },
    { id: 'astrology', label: 'Astro Engine', icon: Sparkles, badge: 'Ephemeris' },
    { id: 'clients', label: 'Client CRM', icon: Users },
    { id: 'appointments', label: 'Consultations', icon: Calendar },
    { id: 'inventory', label: 'Gemstone Vault', icon: Gem },
    { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
    { id: 'sales', label: 'Sales & Invoices', icon: DollarSign },
  ];

  // If super admin, append System Admin Data tab prominently
  const tabs = [
    ...baseTabs,
    ...(isSuperAdmin
      ? [{ id: 'system_admin', label: 'System Admin Data', icon: ShieldCheck, badge: '₹200/mo' }]
      : []),
    { id: 'admin', label: 'Staff & Security', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (id: string) => {
    onSelectTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar (w-64 bg-[#0F172A]) */}
      <aside className="hidden lg:flex w-64 bg-[#0F172A] flex-col shrink-0 sticky top-0 h-screen border-r border-slate-800 text-slate-300 z-30 select-none">
        {/* Brand Header */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleSelect('dashboard')}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') handleSelect('dashboard');
          }}
          className="p-5 flex items-center justify-between border-b border-slate-800/80 cursor-pointer group hover:bg-slate-800/40 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition">
              ✧
            </div>
            <div>
              <span className="text-white font-semibold text-sm tracking-tight block">
                {settings?.storeName ? settings.storeName.split(' ')[0] + ' Pro' : 'AstroNexus Pro'}
              </span>
              <span className="text-[10px] text-amber-400 font-mono tracking-wider block -mt-0.5 uppercase">
                वैदिक Ephemeris & ERP
              </span>
            </div>
          </div>

          {onGoToHome && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onGoToHome();
              }}
              title="Return to Home Landing Page"
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Demo Mode Notice Banner if Demo User */}
        {isDemoUser && (
          <div className="mx-3 mt-3 p-2 bg-amber-500/15 border border-amber-500/30 rounded-xl text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-xs">
              <Eye className="w-3.5 h-3.5" />
              <span>Demo Mode (Read-Only)</span>
            </div>
            <p className="text-[10px] text-slate-400">Sample preview data loaded.</p>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isSpecialAdmin = tab.id === 'system_admin';

            return (
              <button
                type="button"
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => handleSelect(tab.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                  isActive
                    ? isSpecialAdmin
                      ? 'bg-amber-500/20 text-amber-400 font-bold border-l-3 border-amber-500 pl-3 shadow-inner'
                      : 'bg-indigo-600/20 text-indigo-400 font-bold border-l-3 border-indigo-500 pl-3 shadow-inner'
                    : isSpecialAdmin
                    ? 'text-amber-300/90 hover:bg-amber-500/10 hover:text-amber-200'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? isSpecialAdmin
                          ? 'text-amber-400'
                          : 'text-indigo-400'
                        : isSpecialAdmin
                        ? 'text-amber-400/80'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      isSpecialAdmin
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Cloud Database & SEO Status Button */}
        {onOpenCloudModal && (
          <div className="px-3 py-1.5">
            <button
              type="button"
              id="btn-cloud-seo-status"
              onClick={onOpenCloudModal}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/90 border border-indigo-700/60 text-indigo-200 transition cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                  Cloud DB & Sync
                </span>
              </div>
              <span className="text-[9px] font-mono bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700/50">
                Online
              </span>
            </button>
          </div>
        )}

        {/* User Profile Card at Bottom of Sidebar */}
        <div className="p-3 mt-auto border-t border-slate-800/80 space-y-2">
          <div
            id="btn-role-switcher"
            role="button"
            tabIndex={0}
            onClick={onOpenLoginModal}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') onOpenLoginModal();
            }}
            className="bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-3 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-900 border border-indigo-700/60 flex items-center justify-center font-bold text-indigo-300 text-xs shrink-0">
              {(currentUser?.name || 'A').charAt(0)}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs text-white font-medium truncate">{currentUser?.name || 'Vedic Astrologer'}</p>
              <p className="text-[10px] text-amber-400 font-mono uppercase tracking-wider truncate">
                {currentUser?.role ? `${currentUser.role.replace('_', ' ')}` : 'Astrologer'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden bg-[#0F172A] border-b border-slate-800 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleSelect('dashboard')}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') handleSelect('dashboard');
          }}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            ✧
          </div>
          <span className="font-bold text-sm tracking-tight text-white">
            {settings?.storeName || 'AstroNexus Pro'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onGoToHome && (
            <button
              type="button"
              onClick={onGoToHome}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-amber-300 cursor-pointer"
              title="Home"
            >
              <Home className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onOpenLoginModal}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-200 border border-slate-700 cursor-pointer"
          >
            {currentUser?.name ? currentUser.name.split(' ')[0] : 'User'}
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex">
          <div className="w-72 bg-[#0F172A] h-full flex flex-col p-4 space-y-3 animate-in slide-in-from-left duration-200 border-r border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  ✧
                </div>
                <span className="text-white font-bold text-sm">AstroNexus Pro</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isSpecialAdmin = tab.id === 'system_admin';

                return (
                  <button
                    type="button"
                    key={tab.id}
                    id={`mobile-nav-tab-${tab.id}`}
                    onClick={() => handleSelect(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                      isActive
                        ? isSpecialAdmin
                          ? 'bg-amber-500/20 text-amber-400 font-bold border-l-2 border-amber-500 pl-2.5'
                          : 'bg-indigo-600/20 text-indigo-400 font-bold border-l-2 border-indigo-500 pl-2.5'
                        : isSpecialAdmin
                        ? 'text-amber-300 hover:bg-amber-500/10'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
