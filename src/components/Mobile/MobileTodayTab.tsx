import React, { useState } from 'react';
import { Appointment, Client, Lead, LeadFollowup, Sale, StoreSettings, User } from '../../types';
import { getDailyPanchang } from '../../utils/panchangHelper';
import {
  Sparkles,
  Calendar,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  QrCode,
  UserPlus,
  Compass,
  Sun,
  Moon,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface MobileTodayTabProps {
  currentUser: User | null;
  settings: StoreSettings | null;
  currencySymbol: string;
  appointments: Appointment[];
  clients: Client[];
  leads: Lead[];
  followups: LeadFollowup[];
  sales: Sale[];
  onNavigateTab: (tabId: string) => void;
  onOpenNewAppointment: () => void;
  onOpenNewLead: () => void;
  onOpenNewSale: () => void;
  onOpenQuickKundli: () => void;
  onUpdateAppointmentStatus: (aptId: string, status: Appointment['status']) => void;
}

export const MobileTodayTab: React.FC<MobileTodayTabProps> = ({
  currentUser,
  settings,
  currencySymbol,
  appointments = [],
  clients = [],
  leads = [],
  followups = [],
  sales = [],
  onNavigateTab,
  onOpenNewAppointment,
  onOpenNewLead,
  onOpenNewSale,
  onOpenQuickKundli,
  onUpdateAppointmentStatus,
}) => {
  const panchang = getDailyPanchang(new Date());
  const todayStr = new Date().toISOString().split('T')[0];

  // Today's appointments
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const pendingAppointments = todayAppointments.filter(a => a.status === 'scheduled');
  const completedAppointments = todayAppointments.filter(a => a.status === 'completed');

  // Today's follow-ups
  const todayFollowups = followups.filter(f => f.followup_date === todayStr && f.status === 'pending');
  const hotLeads = leads.filter(l => l.lead_status === 'NEW' || l.lead_status === 'FOLLOW_UP');

  // Today's collections
  const todaySales = sales.filter(s => (s.saleDate || s.createdAt || '').startsWith(todayStr));
  const todayRevenue = todaySales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);

  const [expandedPanchang, setExpandedPanchang] = useState(false);

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Astrologer Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-900/60 rounded-2xl p-4 shadow-lg text-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-indigo-600 p-0.5 shadow-md flex items-center justify-center text-white font-bold text-lg">
              <span className="text-amber-200 font-serif">ॐ</span>
            </div>
            <div>
              <p className="text-xs text-amber-300 font-medium">Namaste, {currentUser?.name?.split(' ')[0] || 'Acharya'}</p>
              <h2 className="text-base font-bold text-white tracking-tight">{settings?.storeName || 'VedicAstro Studio'}</h2>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live (IST)
            </span>
          </div>
        </div>

        {/* 4 Quick Regular Action Buttons */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onOpenQuickKundli}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 active:scale-95 transition border border-indigo-500/20 text-indigo-200"
          >
            <Sparkles className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-[10px] font-medium text-center">Quick Kundli</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewLead}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 active:scale-95 transition border border-indigo-500/20 text-indigo-200"
          >
            <UserPlus className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-[10px] font-medium text-center">+ New Lead</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewAppointment}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 active:scale-95 transition border border-indigo-500/20 text-indigo-200"
          >
            <Calendar className="w-5 h-5 text-sky-400 mb-1" />
            <span className="text-[10px] font-medium text-center">Book Slot</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewSale}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 active:scale-95 transition border border-indigo-500/20 text-indigo-200"
          >
            <QrCode className="w-5 h-5 text-purple-400 mb-1" />
            <span className="text-[10px] font-medium text-center">UPI Bill</span>
          </button>
        </div>
      </div>

      {/* Daily Vedic Panchang & Muhurat Snapshot */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Today's Vedic Panchang ({panchang.hindiDayName})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">{panchang.dateFormatted}</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-3 text-xs">
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Tithi & Paksha</span>
            <span className="font-semibold text-amber-300">{panchang.tithi}</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Nakshatra (Lord {panchang.nakshatraLord})</span>
            <span className="font-semibold text-sky-300">{panchang.nakshatra} (Pada {panchang.nakshatraPada})</span>
          </div>
        </div>

        {/* Choghadiya / Shubh Muhurat Pill */}
        <div className="mt-2.5 flex items-center justify-between bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${panchang.choghadiyaNow.isGood ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <div>
              <span className="text-slate-400 text-[10px] block">Current Choghadiya</span>
              <span className={`font-bold ${panchang.choghadiyaNow.isGood ? 'text-emerald-300' : 'text-amber-300'}`}>
                {panchang.choghadiyaNow.name} • {panchang.choghadiyaNow.isGood ? 'Auspicious' : 'Moderate'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setExpandedPanchang(!expandedPanchang)}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
          >
            {expandedPanchang ? 'Less' : 'Details ▾'}
          </button>
        </div>

        {expandedPanchang && (
          <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-300 animate-in fade-in">
            <div className="flex items-center gap-1.5 text-rose-300 bg-rose-950/30 p-2 rounded-lg border border-rose-900/40">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Rahu Kaal: {panchang.rahuKaal}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/40">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Abhijit: {panchang.abhijitMuhurat.split(' ')[0]}</span>
            </div>
            <div className="p-1.5 text-slate-400">Yoga: <strong className="text-slate-200">{panchang.yoga}</strong></div>
            <div className="p-1.5 text-slate-400">Karana: <strong className="text-slate-200">{panchang.karana}</strong></div>
            <div className="p-1.5 text-slate-400">Moon Rashi: <strong className="text-amber-300">{panchang.moonSign.split(' ')[0]}</strong></div>
            <div className="p-1.5 text-slate-400">Active Hora: <strong className="text-indigo-300">{panchang.shubhHoraNow}</strong></div>
          </div>
        )}
      </div>

      {/* Daily Pulse Counters */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
          <span className="text-[10px] text-slate-400 block font-medium">Consultations</span>
          <span className="text-lg font-bold text-sky-400">{todayAppointments.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{completedAppointments.length} done</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
          <span className="text-[10px] text-slate-400 block font-medium">Follow-ups</span>
          <span className="text-lg font-bold text-amber-400">{todayFollowups.length || hotLeads.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Leads to call</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
          <span className="text-[10px] text-slate-400 block font-medium">Today's Sales</span>
          <span className="text-lg font-bold text-emerald-400">{currencySymbol}{todayRevenue.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{todaySales.length} bills</span>
        </div>
      </div>

      {/* Today's Consultations List with 1-Tap Call & WhatsApp */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Today's Schedule ({todayAppointments.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('appointments')}
            className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-0.5 cursor-pointer"
          >
            All Bookings <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="text-center py-6 px-4 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-slate-400">No scheduled consultations for today.</p>
            <button
              type="button"
              onClick={onOpenNewAppointment}
              className="mt-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayAppointments.map(apt => {
              const client = clients.find(c => c.id === apt.clientId);
              const phone = apt.clientPhone || client?.phone || '';
              const cleanPhone = phone.replace(/[^0-9]/g, '');

              return (
                <div
                  key={apt.id}
                  className={`p-3 rounded-xl border transition flex flex-col gap-2.5 ${
                    apt.status === 'completed'
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
                      : 'bg-slate-800/70 border-slate-700/70 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-800/60 flex items-center justify-center text-sky-300 font-bold text-xs">
                        {apt.time || '10:00'}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{apt.clientName}</h4>
                        <p className="text-[10px] text-slate-400">{apt.serviceType || 'Kundli Consultation'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {apt.status === 'completed' ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 text-[10px] font-semibold border border-emerald-800/60 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Done
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 text-[10px] font-semibold border border-amber-800/60">
                          {currencySymbol}{apt.fee || 1100}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 1-Tap Action Bar for Mobile Call & WhatsApp */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-750 gap-2">
                    <div className="flex items-center gap-2">
                      {phone && (
                        <>
                          <a
                            href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=Namaste%20${encodeURIComponent(apt.clientName)},%20this%20is%20a%20reminder%20for%20your%20Astrology%20Consultation%20at%20${encodeURIComponent(apt.time)}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 border border-emerald-500/30"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-400" />
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${phone}`}
                            className="px-2.5 py-1 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 border border-sky-500/30"
                          >
                            <Phone className="w-3 h-3 text-sky-400" />
                            <span>Call</span>
                          </a>
                        </>
                      )}
                    </div>

                    <div>
                      {apt.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => onUpdateAppointmentStatus(apt.id, 'completed')}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Complete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Priority Leads & WhatsApp Inquiries Requiring Quick Follow-up */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Hot Enquiries & Follow-ups
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('leads')}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-0.5 cursor-pointer"
          >
            Leads CRM <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {hotLeads.slice(0, 3).map(lead => {
            const cleanPhone = (lead.whatsapp_number || lead.phone || '').replace(/[^0-9]/g, '');
            return (
              <div key={lead.lead_id || lead.id || lead.name} className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{lead.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {lead.lead_status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {lead.service_interested || 'Kundli Analysis'} • {lead.source}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {cleanPhone && (
                    <a
                      href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=Namaste%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20contacting%20${encodeURIComponent(settings?.storeName || 'Vedic Astro')}.%20How%20can%20we%20assist%20you%20with%20your%20Kundli%20enquiry?`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs"
                      title="WhatsApp Chat"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {lead.phone && (
                    <a
                      href={`tel:${lead.phone}`}
                      className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl shadow-xs"
                      title="Direct Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
