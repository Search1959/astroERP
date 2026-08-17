import React, { useState, useEffect } from 'react';
import { Appointment, Client, GemstoneItem, InventoryItem, Lead, LeadFollowup, Sale, StoreSettings, User } from '../../types';
import { MobileTodayTab } from './MobileTodayTab';
import { MobileLeadsTab } from './MobileLeadsTab';
import { MobileKundliTab } from './MobileKundliTab';
import { MobileConsultationsTab } from './MobileConsultationsTab';
import { MobileBillingTab } from './MobileBillingTab';
import { MobileInventoryTab } from './MobileInventoryTab';
import {
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  Calendar,
  CreditCard,
  Gem,
  Plus,
  X,
  Bell,
  Monitor,
  Smartphone,
  CheckCircle2,
  Phone,
  UserPlus,
  QrCode,
  Shield,
  Clock,
  Wifi,
  BatteryCharging,
} from 'lucide-react';

interface AndroidAppViewProps {
  currentUser: User | null;
  settings: StoreSettings | null;
  currencySymbol: string;
  clients: Client[];
  inventory: GemstoneItem[];
  appointments: Appointment[];
  sales: Sale[];
  leads: Lead[];
  followups: LeadFollowup[];
  onSwitchToDesktop: () => void;
  onOpenNewClientModal: () => void;
  onOpenNewAppointmentModal: () => void;
  onOpenNewSaleModal: () => void;
  onOpenNewStoneModal: () => void;
  onOpenNewLeadModal: () => void;
  onOpenConvertModal: (lead: Lead) => void;
  onUpdateLeadStatus: (leadId: string, status: Lead['lead_status']) => void;
  onUpdateAppointmentStatus: (aptId: string, status: Appointment['status']) => void;
  onCreateSale: (newSale: Partial<Sale>) => void;
  onSaveClient: (clientData: Partial<Client>) => void;
}

export const AndroidAppView: React.FC<AndroidAppViewProps> = ({
  currentUser,
  settings,
  currencySymbol = '₹',
  clients = [],
  inventory = [],
  appointments = [],
  sales = [],
  leads = [],
  followups = [],
  onSwitchToDesktop,
  onOpenNewClientModal,
  onOpenNewAppointmentModal,
  onOpenNewSaleModal,
  onOpenNewStoneModal,
  onOpenNewLeadModal,
  onOpenConvertModal,
  onUpdateLeadStatus,
  onUpdateAppointmentStatus,
  onCreateSale,
  onSaveClient,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'leads' | 'kundli' | 'consultations' | 'billing' | 'inventory'>('today');
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const newLeadsCount = leads.filter(l => l.lead_status === 'NEW').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointmentsCount = appointments.filter(a => a.date === todayStr && a.status === 'scheduled').length;

  return (
    <div className="w-full min-h-screen bg-[#070A12] text-slate-100 flex flex-col font-sans relative antialiased selection:bg-indigo-600 selection:text-white">
      {/* ========================================================================= */}
      {/* NATIVE ANDROID STATUS BAR                                                  */}
      {/* ========================================================================= */}
      <div className="bg-[#0B0F19] px-4 py-1.5 flex items-center justify-between text-[11px] font-medium text-slate-300 border-b border-slate-800/80 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold">{currentTime || '10:30 AM'}</span>
          <span className="text-[10px] text-amber-400 font-mono font-bold ml-1">IST</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-[10px] font-mono text-emerald-400 font-bold">5G</span>
          <Wifi className="w-3.5 h-3.5 text-slate-200" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono">98%</span>
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ANDROID TOP APP BAR                                                       */}
      {/* ========================================================================= */}
      <header className="bg-[#0F172A] border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-[29px] z-40 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            <span className="text-amber-100 font-serif">ॐ</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
                {settings?.storeName || 'AstroERP India'}
              </h1>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                INR ₹
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Android Astrologer App</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch to Desktop ERP Button */}
          <button
            type="button"
            onClick={onSwitchToDesktop}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-indigo-300 border border-indigo-500/30 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Switch to Desktop View"
          >
            <Monitor className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Desktop ERP</span>
            <span className="sm:hidden">Desktop</span>
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-indigo-900 border border-indigo-700/60 flex items-center justify-center text-indigo-200 text-xs font-bold shadow-xs">
            {(currentUser?.name || 'A').charAt(0)}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SCROLLABLE MAIN APP CONTENT AREA                                          */}
      {/* ========================================================================= */}
      <main className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        {activeTab === 'today' && (
          <MobileTodayTab
            currentUser={currentUser}
            settings={settings}
            currencySymbol={currencySymbol}
            appointments={appointments}
            clients={clients}
            leads={leads}
            followups={followups}
            sales={sales}
            onNavigateTab={tab => setActiveTab(tab as any)}
            onOpenNewAppointment={onOpenNewAppointmentModal}
            onOpenNewLead={onOpenNewLeadModal}
            onOpenNewSale={onOpenNewSaleModal}
            onOpenQuickKundli={() => setActiveTab('kundli')}
            onUpdateAppointmentStatus={onUpdateAppointmentStatus}
          />
        )}

        {activeTab === 'leads' && (
          <MobileLeadsTab
            leads={leads}
            currencySymbol={currencySymbol}
            settings={settings}
            onOpenNewLeadModal={onOpenNewLeadModal}
            onUpdateLeadStatus={onUpdateLeadStatus}
            onOpenConvertModal={onOpenConvertModal}
          />
        )}

        {activeTab === 'kundli' && (
          <MobileKundliTab
            onSaveAsClient={onSaveClient}
            onOpenNewSale={(stone, client) => onOpenNewSaleModal()}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'consultations' && (
          <MobileConsultationsTab
            appointments={appointments}
            clients={clients}
            currencySymbol={currencySymbol}
            settings={settings}
            onOpenNewAppointmentModal={onOpenNewAppointmentModal}
            onUpdateAppointmentStatus={onUpdateAppointmentStatus}
          />
        )}

        {activeTab === 'billing' && (
          <MobileBillingTab
            sales={sales}
            clients={clients}
            inventory={inventory}
            currencySymbol={currencySymbol}
            settings={settings}
            onCreateSale={onCreateSale}
          />
        )}

        {activeTab === 'inventory' && (
          <MobileInventoryTab
            inventory={inventory}
            currencySymbol={currencySymbol}
            onOpenNewStoneModal={onOpenNewStoneModal}
            onQuickSellStone={stone => onOpenNewSaleModal()}
          />
        )}
      </main>

      {/* ========================================================================= */}
      {/* EXPANDABLE FAB (FLOATING ACTION BUTTON) WITH SPEED DIAL                     */}
      {/* ========================================================================= */}
      <div className="fixed right-4 bottom-20 z-40 flex flex-col items-end">
        {/* Speed Dial Menu Items */}
        {isFabOpen && (
          <div className="flex flex-col items-end gap-2.5 mb-3 animate-in slide-in-from-bottom-5 duration-200">
            <button
              type="button"
              onClick={() => {
                setIsFabOpen(false);
                onOpenNewLeadModal();
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-xl text-xs font-bold cursor-pointer"
            >
              <span>+ New WhatsApp Lead</span>
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsFabOpen(false);
                setActiveTab('kundli');
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-xl text-xs font-bold cursor-pointer"
            >
              <span>+ Quick Kundli Check</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsFabOpen(false);
                onOpenNewAppointmentModal();
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-full shadow-xl text-xs font-bold cursor-pointer"
            >
              <span>+ Book Consultation</span>
              <Calendar className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsFabOpen(false);
                setActiveTab('billing');
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-xl text-xs font-bold cursor-pointer"
            >
              <span>+ Quick UPI Bill</span>
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Primary Action FAB */}
        <button
          type="button"
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-2xl flex items-center justify-center active:scale-90 transition transform cursor-pointer border-2 border-indigo-400/40"
          aria-label="Quick Actions"
        >
          {isFabOpen ? <X className="w-6 h-6" /> : <Plus className="w-7 h-7" />}
        </button>
      </div>

      {/* Backdrop overlay for FAB */}
      {isFabOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30"
          onClick={() => setIsFabOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* MATERIAL 3 BOTTOM NAVIGATION BAR                                          */}
      {/* ========================================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0F172A]/95 backdrop-blur-md border-t border-slate-800 z-40 py-1 px-2 select-none shadow-2xl">
        <div className="max-w-lg mx-auto flex items-center justify-around">
          {/* 1. Today Hub */}
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition cursor-pointer relative ${
              activeTab === 'today' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-full transition ${
                activeTab === 'today' ? 'bg-indigo-600/20 text-indigo-400' : ''
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">Today</span>
          </button>

          {/* 2. Leads & WhatsApp */}
          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition cursor-pointer relative ${
              activeTab === 'leads' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-full transition relative ${
                activeTab === 'leads' ? 'bg-emerald-600/20 text-emerald-400' : ''
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              {newLeadsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 rounded-full text-[9px] font-bold flex items-center justify-center">
                  {newLeadsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Leads</span>
          </button>

          {/* 3. Instant Kundli */}
          <button
            type="button"
            onClick={() => setActiveTab('kundli')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition cursor-pointer relative ${
              activeTab === 'kundli' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-full transition ${
                activeTab === 'kundli' ? 'bg-amber-500/20 text-amber-400' : ''
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">Kundli</span>
          </button>

          {/* 4. Consultations */}
          <button
            type="button"
            onClick={() => setActiveTab('consultations')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition cursor-pointer relative ${
              activeTab === 'consultations' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-full transition relative ${
                activeTab === 'consultations' ? 'bg-sky-600/20 text-sky-400' : ''
              }`}
            >
              <Calendar className="w-5 h-5" />
              {todayAppointmentsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 text-slate-950 rounded-full text-[9px] font-bold flex items-center justify-center">
                  {todayAppointmentsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Bookings</span>
          </button>

          {/* 5. UPI Billing */}
          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition cursor-pointer relative ${
              activeTab === 'billing' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-full transition ${
                activeTab === 'billing' ? 'bg-purple-600/20 text-purple-400' : ''
              }`}
            >
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">Billing</span>
          </button>

          {/* 6. Stock Vault */}
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition cursor-pointer relative ${
              activeTab === 'inventory' ? 'text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-full transition ${
                activeTab === 'inventory' ? 'bg-amber-500/20 text-amber-300' : ''
              }`}
            >
              <Gem className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">Stock</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
