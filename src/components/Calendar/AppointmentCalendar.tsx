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
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Appointment Scheduler & Consultations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage upcoming astrological chart readings, gemstone consultations, and client bookings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center text-xs">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              List Roster ({filteredAppointments.length})
            </button>
          </div>

          <button
            id="btn-book-consultation"
            onClick={() => onOpenBookingModal()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + Book Consultation
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Astrologer:</span>
            <select
              value={selectedAstrologerId}
              onChange={e => setSelectedAstrologerId(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none"
            >
              <option value="all">All Astrologers</option>
              {astrologers.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Month Navigation if in Calendar view */}
        {viewMode === 'calendar' && (
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-bold">
            <button
              onClick={() => setCurrentDateOffset(prev => prev - 1)}
              className="p-1 hover:bg-slate-100 rounded transition cursor-pointer text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="w-36 text-center text-slate-900">{monthName}</span>
            <button
              onClick={() => setCurrentDateOffset(prev => prev + 1)}
              className="p-1 hover:bg-slate-100 rounded transition cursor-pointer text-slate-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* View 1: Calendar Grid View */}
      {viewMode === 'calendar' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                return <div key={`empty-${idx}`} className="h-28 bg-slate-50/50 rounded-lg border border-slate-100" />;
              }

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayAppointments = filteredAppointments.filter(a => a.date === dateStr);
              const isCurrentDay = today.toISOString().split('T')[0] === dateStr;

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`h-28 p-2 rounded-lg border flex flex-col justify-between transition ${
                    isCurrentDay
                      ? 'bg-indigo-50/40 border-indigo-400 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      isCurrentDay ? 'bg-indigo-600 text-white font-bold' : 'text-slate-700'
                    }`}>
                      {dayNum}
                    </span>
                    {dayAppointments.length > 0 && (
                      <span className="text-[10px] text-indigo-600 font-bold">
                        {dayAppointments.length} apt{dayAppointments.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Appointments list in cell */}
                  <div className="overflow-y-auto space-y-1 my-1 max-h-16">
                    {dayAppointments.map(apt => (
                      <div
                        key={apt.id}
                        className={`text-[10px] p-1 rounded font-semibold truncate flex items-center justify-between ${
                          apt.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          apt.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                        title={`${apt.time} - ${apt.clientName} (${apt.type})`}
                      >
                        <span className="truncate">{apt.time} {apt.clientName}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onOpenBookingModal()}
                    className="text-[10px] text-slate-400 hover:text-indigo-600 text-center py-0.5 opacity-0 hover:opacity-100 transition font-medium"
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
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-semibold tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Client & Contact</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Consultation Type</th>
                  <th className="py-3 px-4">Astrologer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Fee</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No appointments matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">{apt.clientName}</div>
                        <div className="text-slate-500 text-[11px]">{apt.clientEmail || apt.clientPhone}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-900 font-semibold flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          {apt.date}
                        </div>
                        <div className="text-indigo-600 text-[11px] flex items-center gap-1 mt-0.5 font-medium">
                          <Clock className="w-3 h-3" />
                          {apt.time} ({apt.durationMinutes} min)
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="capitalize text-slate-800 font-semibold block">
                          {(apt.type || 'consultation').replace(/_/g, ' ')}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          {(apt.meetingMode || '').includes('Video') ? <Video className="w-3 h-3 text-indigo-500" /> : <MapPin className="w-3 h-3 text-amber-500" />}
                          {apt.meetingMode || 'In-Person / Online'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        {apt.astrologerName || 'Staff Astrologer'}
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={apt.status}
                          onChange={e => onUpdateAppointmentStatus(apt.id, e.target.value as any)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-semibold border ${
                            apt.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            apt.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            apt.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }`}
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-emerald-700">
                          {currencySymbol}{apt.fee}
                        </div>
                        <span className={`text-[10px] font-semibold ${apt.isPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {apt.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onDeleteAppointment(apt.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg text-xs font-semibold border border-slate-200 transition cursor-pointer"
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
