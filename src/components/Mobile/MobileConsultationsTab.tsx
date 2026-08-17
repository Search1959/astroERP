import React, { useState } from 'react';
import { Appointment, Client, StoreSettings } from '../../types';
import {
  Calendar,
  Clock,
  User,
  Plus,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Video,
  MapPin,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface MobileConsultationsTabProps {
  appointments: Appointment[];
  clients: Client[];
  currencySymbol: string;
  settings: StoreSettings | null;
  onOpenNewAppointmentModal: () => void;
  onUpdateAppointmentStatus: (aptId: string, status: Appointment['status']) => void;
}

export const MobileConsultationsTab: React.FC<MobileConsultationsTabProps> = ({
  appointments = [],
  clients = [],
  currencySymbol = '₹',
  settings,
  onOpenNewAppointmentModal,
  onUpdateAppointmentStatus,
}) => {
  const [filterMode, setFilterMode] = useState<'TODAY' | 'UPCOMING' | 'COMPLETED' | 'ALL'>('TODAY');
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredAppointments = appointments.filter(apt => {
    if (filterMode === 'TODAY') return apt.date === todayStr;
    if (filterMode === 'UPCOMING') return apt.date >= todayStr && apt.status === 'scheduled';
    if (filterMode === 'COMPLETED') return apt.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Consultations & Bookings</h2>
              <p className="text-[11px] text-slate-400">{appointments.length} Total Bookings</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenNewAppointmentModal}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Slot</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          {(['TODAY', 'UPCOMING', 'COMPLETED', 'ALL'] as const).map(mode => (
            <button
              type="button"
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold text-center transition cursor-pointer ${
                filterMode === mode
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {mode === 'TODAY' ? 'Today' : mode === 'UPCOMING' ? 'Upcoming' : mode === 'COMPLETED' ? 'Done' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-slate-400">No appointments found under {filterMode.toLowerCase()}.</p>
            <button
              type="button"
              onClick={onOpenNewAppointmentModal}
              className="mt-3 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>
        ) : (
          filteredAppointments.map(apt => {
            const client = clients.find(c => c.id === apt.clientId);
            const rawPhone = apt.clientPhone || client?.phone || '';
            const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
            const waPhone = cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone;

            return (
              <div
                key={apt.id}
                className={`bg-slate-900/90 border rounded-2xl p-4 shadow-md space-y-3 ${
                  apt.status === 'completed'
                    ? 'border-slate-800/80 bg-slate-950/40 opacity-80'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800/60 flex flex-col items-center justify-center text-sky-300 font-bold">
                      <span className="text-[10px] text-sky-400">{apt.date?.slice(5)}</span>
                      <span className="text-xs">{apt.time || '10:00'}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{apt.clientName}</h3>
                      <p className="text-xs text-amber-300 font-medium">{apt.serviceType || 'Kundli Analysis'}</p>
                      <p className="text-[11px] text-slate-400">{apt.meetingMode || 'In-Person / Phone'}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">
                      {currencySymbol}{apt.fee || 1100}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full inline-block mt-1 font-semibold ${
                        apt.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {apt.status === 'completed' ? 'Completed' : 'Scheduled'}
                    </span>
                  </div>
                </div>

                {/* 1-Tap Action Bar */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                  {rawPhone ? (
                    <a
                      href={`https://wa.me/${waPhone}?text=Namaste%20${encodeURIComponent(
                        apt.clientName
                      )},%20this%20is%20a%20confirmation%20for%20your%20Astrology%20Consultation%20with%20${encodeURIComponent(
                        settings?.storeName || 'VedicAstro'
                      )}%20on%20${apt.date}%20at%20${apt.time}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  ) : null}

                  {rawPhone ? (
                    <a
                      href={`tel:${rawPhone}`}
                      className="py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 border border-slate-700"
                    >
                      <Phone className="w-3.5 h-3.5 text-sky-400" />
                      <span>Call</span>
                    </a>
                  ) : null}

                  {apt.status !== 'completed' ? (
                    <button
                      type="button"
                      onClick={() => onUpdateAppointmentStatus(apt.id, 'completed')}
                      className="py-2 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Done</span>
                    </button>
                  ) : (
                    <div className="py-2 px-2 bg-slate-800/80 text-emerald-400 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Attended</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
