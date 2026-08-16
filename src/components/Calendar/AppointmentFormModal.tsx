/**
 * Appointment Booking Modal
 */

import React, { useState, useEffect } from 'react';
import { Appointment, Client, User } from '../../types';
import { X, Calendar, Clock, User as UserIcon, DollarSign, Video, MapPin, FileText } from 'lucide-react';

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Appointment>) => void;
  clients: Client[];
  astrologers: User[];
  prefillClient?: Client | null;
}

export const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  clients,
  astrologers,
  prefillClient = null,
}) => {
  if (!isOpen) return null;

  const [clientId, setClientId] = useState(prefillClient ? prefillClient.id : (clients[0]?.id || ''));
  const [astrologerId, setAstrologerId] = useState(astrologers[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [type, setType] = useState<Appointment['type']>('natal_reading');
  const [meetingMode, setMeetingMode] = useState('Video Consultation (Google Meet / Zoom)');
  const [fee, setFee] = useState(150);
  const [isPaid, setIsPaid] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (prefillClient) {
      setClientId(prefillClient.id);
    } else if (!clientId && clients.length > 0) {
      setClientId(clients[0].id);
    }
  }, [prefillClient, clients, clientId]);

  useEffect(() => {
    if (!astrologerId && astrologers.length > 0) {
      setAstrologerId(astrologers[0].id);
    }
  }, [astrologers, astrologerId]);

  const selectedClient = clients.find(c => c.id === clientId);
  const selectedAstrologer = astrologers.find(a => a.id === astrologerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !astrologerId) return;

    onSubmit({
      clientId,
      clientName: selectedClient?.name || 'Client',
      clientEmail: selectedClient?.email,
      clientPhone: selectedClient?.phone,
      astrologerId,
      astrologerName: selectedAstrologer?.name || 'Astrologer',
      date,
      time,
      durationMinutes,
      type,
      meetingMode,
      fee,
      isPaid,
      status: 'scheduled',
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            Schedule Astrological Consultation
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Client Selector */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 flex items-center gap-1">
              <UserIcon className="w-3.5 h-3.5 text-cyan-400" /> Select Client *
            </label>
            <select
              required
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.placeOfBirth} • DOB: {c.dateOfBirth})
                </option>
              ))}
            </select>
          </div>

          {/* Astrologer Selector */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Assign Astrologer / Specialist *</label>
            <select
              required
              value={astrologerId}
              onChange={e => setAstrologerId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500"
            >
              {astrologers.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.title || a.role})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Time *
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Consultation Focus</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500"
              >
                <option value="natal_reading">Natal Chart Reading</option>
                <option value="gemstone_consultation">Gemstone Prescription & Remedies</option>
                <option value="synastry_relationship">Synastry / Kundli Match</option>
                <option value="transit_forecast">Yearly Transit & Dasha Forecast</option>
                <option value="muhurta_electional">Auspicious Muhurta Selection</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Duration (Minutes)</label>
              <select
                value={durationMinutes}
                onChange={e => setDurationMinutes(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500"
              >
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes (Full Deep Dive)</option>
                <option value={90}>90 Minutes (Master Reading)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Meeting Channel</label>
              <select
                value={meetingMode}
                onChange={e => setMeetingMode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500"
              >
                <option value="Video Consultation (Zoom / Meet)">Video (Zoom / Meet)</option>
                <option value="In-Person Office Session">In-Person Office Session</option>
                <option value="Phone Consultation">Phone Consultation</option>
                <option value="Recorded Video Report">Recorded Video / Audio Report</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Consultation Fee
              </label>
              <input
                type="number"
                value={fee}
                onChange={e => setFee(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 font-bold text-emerald-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPaidCheck"
              checked={isPaid}
              onChange={e => setIsPaid(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 bg-slate-950 border-slate-700"
            />
            <label htmlFor="isPaidCheck" className="text-slate-300 font-semibold cursor-pointer">
              Fee Already Paid / Collected upfront
            </label>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Agenda / Client Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Specific questions on career, relationship, health, or gemstone recommendations..."
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-600/25 transition cursor-pointer"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
