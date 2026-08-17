import React, { useState, useEffect } from 'react';
import { Lead, User } from '../../types';
import { UserPlus, UserCheck, AlertCircle, Calendar, Clock, Tag, X, Sparkles } from 'lucide-react';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToEdit?: Lead | null;
  onSaveLead: (leadData: Partial<Lead>) => void;
  staffUsers?: User[];
  customServices?: string[];
  customSources?: string[];
  existingLeads?: Lead[];
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  leadToEdit,
  onSaveLead,
  staffUsers = [],
  customServices = [
    'Gemstone Consultation & Prescription',
    'Complete Kundli Birth Chart Analysis',
    'Matchmaking & Kundli Milan (Gun Milan)',
    'Career & Wealth Astro Consultation',
    'Shani Sade Sati & Dosha Remedy Puja',
    'Pran Pratishtha Certified Navratna Purchase',
    'Annual Transit & Varshphal Forecast',
    'Medical Astrology & Health Assessment',
  ],
  customSources = [
    'Meta Ads',
    'Facebook',
    'Instagram',
    'WhatsApp',
    'Google Ads',
    'Website',
    'Referral',
    'Walk-in',
    'Existing Customer',
    'Phone',
    'Manual',
  ],
  existingLeads = [],
}) => {
  if (!isOpen) return null;

  const isEditing = !!leadToEdit;

  const [name, setName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('+91');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('Meta Ads');
  const [campaignName, setCampaignName] = useState('');
  const [adSetName, setAdSetName] = useState('');
  const [adName, setAdName] = useState('');
  const [serviceInterested, setServiceInterested] = useState(customServices[0] || 'Gemstone Consultation');
  const [requirement, setRequirement] = useState('');
  const [leadStatus, setLeadStatus] = useState<Lead['lead_status']>('NEW');
  const [priority, setPriority] = useState<Lead['priority']>('MEDIUM');
  const [assignedTo, setAssignedTo] = useState('usr_astro_1');
  const [nextFollowupDate, setNextFollowupDate] = useState('');
  const [nextFollowupTime, setNextFollowupTime] = useState('11:00');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  useEffect(() => {
    if (leadToEdit) {
      setName(leadToEdit.name || '');
      setWhatsappNumber(leadToEdit.whatsapp_number || '+91');
      setAlternatePhone(leadToEdit.alternate_phone || '');
      setEmail(leadToEdit.email || '');
      setSource(leadToEdit.source || 'Meta Ads');
      setCampaignName(leadToEdit.campaign_name || '');
      setAdSetName(leadToEdit.ad_set_name || '');
      setAdName(leadToEdit.ad_name || '');
      setServiceInterested(leadToEdit.service_interested || customServices[0]);
      setRequirement(leadToEdit.requirement || '');
      setLeadStatus(leadToEdit.lead_status || 'NEW');
      setPriority(leadToEdit.priority || 'MEDIUM');
      setAssignedTo(leadToEdit.assigned_to || (staffUsers[0]?.id || 'usr_astro_1'));
      setNextFollowupDate(leadToEdit.next_followup_date || '');
      setNextFollowupTime(leadToEdit.next_followup_time || '11:00');
      setNotes(leadToEdit.notes || '');
      setTagsInput((leadToEdit.tags || []).join(', '));
    } else {
      setName('');
      setWhatsappNumber('+91 ');
      setAlternatePhone('');
      setEmail('');
      setSource('Manual');
      setCampaignName('Direct_WalkIn');
      setAdSetName('');
      setAdName('');
      setServiceInterested(customServices[0] || 'Gemstone Consultation');
      setRequirement('');
      setLeadStatus('NEW');
      setPriority('MEDIUM');
      setAssignedTo(staffUsers[0]?.id || 'usr_astro_1');
      setNextFollowupDate(new Date().toISOString().split('T')[0]);
      setNextFollowupTime('12:00');
      setNotes('');
      setTagsInput('Manual Lead, Walk-in');
      setDuplicateWarning(null);
    }
  }, [leadToEdit, isOpen]);

  // Phone number duplicate validation
  const handlePhoneChange = (val: string) => {
    setWhatsappNumber(val);
    const clean = val.replace(/[^0-9]/g, '');
    if (clean.length >= 10 && !isEditing) {
      const match = existingLeads.find(l => {
        const leadClean = l.whatsapp_number.replace(/[^0-9]/g, '');
        return leadClean.endsWith(clean.slice(-10));
      });
      if (match) {
        setDuplicateWarning(`Warning: Lead already exists for this number (${match.name} - ${match.lead_id})`);
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const assignedUser = staffUsers.find(u => u.id === assignedTo);
    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const leadData: Partial<Lead> = {
      name: name.trim(),
      whatsapp_number: whatsappNumber.trim(),
      alternate_phone: alternatePhone.trim() || undefined,
      email: email.trim() || undefined,
      source: source as any,
      campaign_name: campaignName.trim() || undefined,
      ad_set_name: adSetName.trim() || undefined,
      ad_name: adName.trim() || undefined,
      service_interested: serviceInterested,
      requirement: requirement.trim(),
      lead_status: leadStatus,
      priority,
      assigned_to: assignedTo,
      assigned_to_name: assignedUser?.name || 'Assigned Astrologer',
      next_followup_date: nextFollowupDate || undefined,
      next_followup_time: nextFollowupTime || undefined,
      notes: notes.trim(),
      tags: parsedTags.length > 0 ? parsedTags : ['Lead'],
    };

    onSaveLead(leadData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-200 my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              {isEditing ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {isEditing ? `Edit Lead (${leadToEdit?.lead_id})` : 'New Lead Manual Entry'}
              </h3>
              <p className="text-xs text-slate-400">
                Capture customer contact, Meta campaign attribution, and Vedic consultation interests
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate Warning */}
        {duplicateWarning && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{duplicateWarning}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Section 1: Contact Info */}
          <div>
            <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider mb-2">
              1. Customer Identity & Contacts
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Rahul Varma"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  WhatsApp Number (+Country Code) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={e => handlePhoneChange(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Alternate Phone (Optional)</label>
                <input
                  type="text"
                  value={alternatePhone}
                  onChange={e => setAlternatePhone(e.target.value)}
                  placeholder="+91 98765 43211"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Source & Campaign Attribution */}
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider mb-2">
              2. Source & Meta Ads Attribution
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Lead Source</label>
                <select
                  value={source}
                  onChange={e => setSource(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {customSources.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Campaign Name / Identifier</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={e => setCampaignName(e.target.value)}
                  placeholder="e.g. Meta_ClickToWhatsApp_Gemstone_Q1"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Ad Set / Target Audience</label>
                <input
                  type="text"
                  value={adSetName}
                  onChange={e => setAdSetName(e.target.value)}
                  placeholder="e.g. Audience_Bangalore_Professionals"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Ad Creative / Reel Name</label>
                <input
                  type="text"
                  value={adName}
                  onChange={e => setAdName(e.target.value)}
                  placeholder="e.g. Ad_Pukhraj_YellowSapphire_Video"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Consultation Service & Requirement */}
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider mb-2">
              3. Astrological Interest & Client Requirement
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Service Interested</label>
                <select
                  value={serviceInterested}
                  onChange={e => setServiceInterested(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {customServices.map(srv => (
                    <option key={srv} value={srv}>
                      {srv}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Assigned Astrologer / Staff</label>
                <select
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {staffUsers.length > 0 ? (
                    staffUsers.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="usr_astro_1">Dr. Elena Rostova (Astrologer)</option>
                      <option value="usr_admin_1">Acharya Rajesh Sharma (Super Admin)</option>
                      <option value="usr_staff_1">Priya Sundaram (Front Desk)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Requirement / First Enquiry Notes</label>
              <textarea
                rows={2}
                value={requirement}
                onChange={e => setRequirement(e.target.value)}
                placeholder="e.g. Inquiring for Ceylon Yellow Sapphire (Pukhraj) 5.25 Ratti for Jupiter enhancement. Birth: 12-Aug-1991, 06:45 AM, Bangalore."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Section 4: Pipeline Status & Follow-up */}
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider mb-2">
              4. Pipeline Status & Next Follow-up
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Lead Stage</label>
                <select
                  value={leadStatus}
                  onChange={e => setLeadStatus(e.target.value as any)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="NEW">New Lead</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="INTERESTED">Interested</option>
                  <option value="FOLLOW_UP">Follow-up Scheduled</option>
                  <option value="CONVERTED">Converted / Paid</option>
                  <option value="NO_RESPONSE">No Response</option>
                  <option value="NOT_INTERESTED">Not Interested</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="WRONG_NUMBER">Wrong Number</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High 🔥</option>
                  <option value="URGENT">Urgent ⚡</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Next Follow-up Date</label>
                <input
                  type="date"
                  value={nextFollowupDate}
                  onChange={e => setNextFollowupDate(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Time</label>
                <input
                  type="time"
                  value={nextFollowupTime}
                  onChange={e => setNextFollowupTime(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block font-medium text-slate-300 mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="e.g. Meta Click-to-WA, High Value, Pukhraj Inquiry"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-900/30 flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              {isEditing ? 'Save Lead Changes' : 'Create & Assign Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
