/**
 * Client Add / Edit Form Modal
 */

import React, { useState, useEffect } from 'react';
import { Client } from '../../types';
import { WORLD_CITIES } from '../../../server/storage';
import { X, User, Calendar, Clock, MapPin, Tag, FileText } from 'lucide-react';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clientData: Partial<Client>) => void;
  editingClient?: Client | null;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingClient = null,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1990-01-01');
  const [timeOfBirth, setTimeOfBirth] = useState('12:00');
  const [placeOfBirth, setPlaceOfBirth] = useState('London, UK');
  const [latitude, setLatitude] = useState(51.5074);
  const [longitude, setLongitude] = useState(-0.1278);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Prefer not to say');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('VIP, Consultation');

  const [cityResults, setCityResults] = useState(WORLD_CITIES.slice(0, 6));
  const [isCityOpen, setIsCityOpen] = useState(false);

  useEffect(() => {
    if (editingClient) {
      setName(editingClient.name);
      setEmail(editingClient.email);
      setPhone(editingClient.phone || '');
      setDateOfBirth(editingClient.dateOfBirth);
      setTimeOfBirth(editingClient.timeOfBirth);
      setPlaceOfBirth(editingClient.placeOfBirth);
      setLatitude(editingClient.latitude);
      setLongitude(editingClient.longitude);
      setGender(editingClient.gender);
      setAddress(editingClient.address || '');
      setOccupation(editingClient.occupation || '');
      setNotes(editingClient.notes || '');
      setTagInput((editingClient.tags || []).join(', '));
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setDateOfBirth('1990-01-01');
      setTimeOfBirth('12:00');
      setPlaceOfBirth('London, UK');
      setLatitude(51.5074);
      setLongitude(-0.1278);
      setGender('Prefer not to say');
      setAddress('');
      setOccupation('');
      setNotes('');
      setTagInput('New Client');
    }
  }, [editingClient, isOpen]);

  const handleCitySearch = (query: string) => {
    setPlaceOfBirth(query);
    if (!query.trim()) {
      setCityResults(WORLD_CITIES.slice(0, 6));
    } else {
      const q = query.toLowerCase();
      setCityResults(WORLD_CITIES.filter(c => c.name.toLowerCase().includes(q)).slice(0, 8));
    }
    setIsCityOpen(true);
  };

  const handleSelectCity = (city: typeof WORLD_CITIES[0]) => {
    setPlaceOfBirth(city.name);
    setLatitude(city.lat);
    setLongitude(city.lng);
    setIsCityOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const tags = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onSubmit({
      name,
      email,
      phone,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      latitude,
      longitude,
      gender,
      address,
      occupation,
      notes,
      tags,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            {editingClient ? `Edit Client: ${editingClient.name}` : 'Create New Client Profile'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Maya Lin"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="maya@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Phone / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Gender</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Date of Birth *
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Time of Birth (Exact) *
              </label>
              <input
                type="time"
                required
                value={timeOfBirth}
                onChange={e => setTimeOfBirth(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Place of Birth & Autocomplete */}
          <div className="space-y-1 relative">
            <label className="font-semibold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Place of Birth (City & Coordinates)
            </label>
            <input
              type="text"
              required
              value={placeOfBirth}
              onChange={e => handleCitySearch(e.target.value)}
              onFocus={() => setIsCityOpen(true)}
              placeholder="e.g. London, Mumbai, New York..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500"
            />
            {isCityOpen && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto bg-slate-950 border border-slate-700 rounded-xl shadow-xl divide-y divide-slate-800">
                {cityResults.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectCity(c)}
                    className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-indigo-950/70 hover:text-white flex items-center justify-between"
                  >
                    <span>{c.name}</span>
                    <span className="text-slate-400 text-[11px]">{c.lat.toFixed(1)}°, {c.lng.toFixed(1)}°</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Occupation</label>
              <input
                type="text"
                value={occupation}
                onChange={e => setOccupation(e.target.value)}
                placeholder="e.g. Software Engineer / Entrepreneur"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-indigo-400" /> Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="VIP, Gemstone Buyer, Synastry..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-indigo-400" /> Initial Notes & Astrological Context
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Client inquiry details, primary life questions, chart requests..."
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition cursor-pointer"
            >
              {editingClient ? 'Save Changes' : 'Create Client & Auto-Calculate Chart'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
