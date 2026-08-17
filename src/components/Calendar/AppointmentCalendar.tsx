/**
 * Interactive Appointment Scheduler & Calendar View
 * Month / Week / Day / List Views for booking consultations with clients
 */

import React, { useState } from 'react';
import { Appointment, Client, User } from '../../types';
import { Calendar, Clock, Plus, Filter, CheckCircle, Video, MapPin, Phone, User as UserIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  clients: Client[];
  astrologers: User[];
  onOpenBookingModal: (prefillClient?: Client) => void;
  onUpdateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
  onDeleteAppointment: (appointmentId: string) => void;
  currencySymbol?: string;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  clients,
  astrologers,
  onOpenBookingModal,
  onUpdateAppointmentStatus,
  onDeleteAppointment,
  currencySymbol = '$',
}) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedAstrologerId, setSelectedAstrologerId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentDateOffset, setCurrentDateOffset] = useState<number>(0);

  const filteredAppointments = appointments.filter(apt => {
    const matchAstro = selectedAstrologerId === 'all' || apt.astrologerId === selectedAstrologerId;
    const matchStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchAstro && matchStatus;
  });

  // Simple Month Matrix calculation
  const today = new Date();
  const targetDate = new Date(today.getFullYear(), today.getMonth() + currentDateOffset, 1);
  const monthName = targetDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) daysArray.push(null);
  for (let d = 1; d <= daysInMonth; d++) daysArray.push(d);

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header and Controls */}
      <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-['Outfit',sans-serif]">
            <Calendar className="w-5 h-5 text-orange-400" />
            Appointment Scheduler & Consultations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage upcoming astrological chart readings, gemstone consultations, and client bookings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="bg-[#14050a] p-1 rounded-xl border border-red-950/80 flex items-center text-xs">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              List Roster ({filteredAppointments.length})
            </button>
          </div>

          <button
            id="btn-book-consultation"
            onClick={() => onOpenBookingModal()}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + Book Consultation
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0e0307] px-3.5 py-2 rounded-xl border border-red-950/80 text-slate-300">
            <span className="text-slate-400 font-medium">Astrologer:</span>
            <select
              value={selectedAstrologerId}
              onChange={e => setSelectedAstrologerId(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#14050a] text-white">All Astrologers</option>
              {astrologers.map(a => (
                <option key={a.id} value={a.id} className="bg-[#14050a] text-white">{a.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#0e0307] px-3.5 py-2 rounded-xl border border-red-950/80 text-slate-300">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#14050a] text-white">All Statuses</option>
              <option value="scheduled" className="bg-[#14050a] text-white">Scheduled</option>
              <option value="in_progress" className="bg-[#14050a] text-white">In Progress</option>
              <option value="completed" className="bg-[#14050a] text-white">Completed</option>
              <option value="cancelled" className="bg-[#14050a] text-white">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Month Navigation if in Calendar view */}
        {viewMode === 'calendar' && (
          <div className="flex items-center gap-2 bg-[#0e0307] px-3 py-1.5 rounded-xl border border-red-950/80 text-slate-200 font-bold">
            <button
              onClick={() => setCurrentDateOffset(prev => prev - 1)}
              className="p-1 hover:bg-[#1a070e] rounded-lg transition cursor-pointer text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="w-36 text-center text-white font-['Cinzel',serif]">{monthName}</span>
            <button
              onClick={() => setCurrentDateOffset(prev => prev + 1)}
              className="p-1 hover:bg-[#1a070e] rounded-lg transition cursor-pointer text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* View 1: Calendar Grid View */}
      {viewMode === 'calendar' && (
        <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl p-5 shadow-sm overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-orange-300 uppercase tracking-wider font-['Outfit',sans-serif]">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-2">
            {daysArray.map((dayNum, idx) => {
              if (dayNum === null) {
                return <div key={`empty-${idx}`} className="h-28 bg-[#0a0205]/40 rounded-xl border border-red-950/30" />;
              }

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayAppointments = filteredAppointments.filter(a => a.date === dateStr);
              const isCurrentDay = today.toISOString().split('T')[0] === dateStr;

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`h-28 p-2.5 rounded-xl border flex flex-col justify-between transition ${
                    isCurrentDay
                      ? 'bg-[#250813] border-orange-500/80 shadow-md shadow-orange-950/40'
                      : 'bg-[#14050a] border-red-950/70 hover:border-orange-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      isCurrentDay ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold' : 'text-slate-300'
                    }`}>
                      {dayNum}
                    </span>
                    {dayAppointments.length > 0 && (
                      <span className="text-[10px] text-orange-400 font-bold">
                        {dayAppointments.length} apt{dayAppointments.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Appointments list in cell */}
                  <div className="overflow-y-auto space-y-1 my-1 max-h-16">
                    {dayAppointments.map(apt => (
                      <div
                        key={apt.id}
                        className={`text-[10px] p-1 rounded-md font-semibold truncate flex items-center justify-between ${
                          apt.status === 'completed' ? 'bg-[#1c060e] text-orange-300 border border-orange-500/30' :
                          apt.status === 'cancelled' ? 'bg-[#20040a] text-red-300 border border-red-800/80' :
                          'bg-[#250813] text-orange-200 border border-orange-500/40'
                        }`}
                        title={`${apt.time} - ${apt.clientName} (${apt.type})`}
                      >
                        <span className="truncate">{apt.time} {apt.clientName}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onOpenBookingModal()}
                    className="text-[10px] text-slate-500 hover:text-orange-400 text-center py-0.5 opacity-0 hover:opacity-100 transition font-medium cursor-pointer"
                  >
                    + Book
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: List Roster View */}
      {viewMode === 'list' && (
        <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#14050a] text-orange-200 uppercase font-semibold tracking-wider border-b border-red-950/80 font-['Outfit',sans-serif]">
                  <th className="py-3.5 px-4">Client & Contact</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Consultation Type</th>
                  <th className="py-3.5 px-4">Astrologer</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Fee</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-950/50 font-medium text-slate-300">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No appointments matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-[#1a070e]/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm font-['Outfit',sans-serif]">{apt.clientName}</div>
                        <div className="text-slate-400 text-[11px]">{apt.clientEmail || apt.clientPhone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-white font-semibold flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-orange-400" />
                          {apt.date}
                        </div>
                        <div className="text-orange-400 text-[11px] flex items-center gap-1 mt-0.5 font-medium">
                          <Clock className="w-3 h-3" />
                          {apt.time} ({apt.durationMinutes} min)
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="capitalize text-slate-200 font-semibold block">
                          {(apt.type || 'consultation').replace(/_/g, ' ')}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          {(apt.meetingMode || '').includes('Video') ? <Video className="w-3 h-3 text-orange-400" /> : <MapPin className="w-3 h-3 text-amber-400" />}
                          {apt.meetingMode || 'In-Person / Online'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {apt.astrologerName || 'Staff Astrologer'}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={apt.status}
                          onChange={e => onUpdateAppointmentStatus(apt.id, e.target.value as any)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-semibold border focus:outline-none cursor-pointer ${
                            apt.status === 'completed' ? 'bg-[#1c060e] text-orange-300 border-orange-500/40' :
                            apt.status === 'cancelled' ? 'bg-[#20040a] text-red-300 border-red-800' :
                            apt.status === 'in_progress' ? 'bg-[#2a0914] text-amber-300 border-amber-800' :
                            'bg-[#14050a] text-orange-200 border-red-900/60'
                          }`}
                        >
                          <option value="scheduled" className="bg-[#14050a] text-white">Scheduled</option>
                          <option value="in_progress" className="bg-[#14050a] text-white">In Progress</option>
                          <option value="completed" className="bg-[#14050a] text-white">Completed</option>
                          <option value="cancelled" className="bg-[#14050a] text-white">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-orange-400 font-['Cinzel',serif]">
                          {currencySymbol}{apt.fee}
                        </div>
                        <span className={`text-[10px] font-semibold ${apt.isPaid ? 'text-orange-400' : 'text-amber-400'}`}>
                          {apt.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onDeleteAppointment(apt.id)}
                          className="px-2.5 py-1 bg-[#14050a] hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-lg text-xs font-semibold border border-red-950 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
