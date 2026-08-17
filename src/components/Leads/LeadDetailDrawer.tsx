import React, { useState } from 'react';
import {
  Lead,
  LeadFollowup,
  LeadActivity,
  LeadMessage,
  User,
  LeadStatus,
  LeadPriority,
} from '../../types';
import {
  X,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Send,
  Sparkles,
  Tag,
  UserCheck,
  ArrowRight,
  ExternalLink,
  Plus,
  Flame,
  AlertTriangle,
  Layers,
  History,
  FileText,
  Copy,
  Check,
} from 'lucide-react';

interface LeadDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  followups: LeadFollowup[];
  activities: LeadActivity[];
  messages: LeadMessage[];
  staffUsers: User[];
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onUpdatePriority: (leadId: string, priority: LeadPriority) => void;
  onUpdateAssignee: (leadId: string, assignedToId: string, assignedToName: string) => void;
  onSendMessage: (leadId: string, messageText: string) => void;
  onAddFollowup: (leadId: string, followup: Partial<LeadFollowup>) => void;
  onCompleteFollowup: (leadId: string, followupId: string, outcomeNotes: string) => void;
  onAddTimelineNote: (leadId: string, noteText: string) => void;
  onOpenConvertModal: (lead: Lead) => void;
  onOpenLostModal: (lead: Lead) => void;
  onOpenEditModal: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  templates?: { id: string; name: string; content: string }[];
  currencySymbol?: string;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  isOpen,
  onClose,
  lead,
  followups,
  activities,
  messages,
  staffUsers,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateAssignee,
  onSendMessage,
  onAddFollowup,
  onCompleteFollowup,
  onAddTimelineNote,
  onOpenConvertModal,
  onOpenLostModal,
  onOpenEditModal,
  onDeleteLead,
  templates = [],
  currencySymbol = '₹',
}) => {
  if (!isOpen || !lead) return null;

  const [activeTab, setActiveTab] = useState<'chat' | 'followups' | 'timeline' | 'details'>('chat');
  const [chatInput, setChatInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isAddingFollowup, setIsAddingFollowup] = useState(false);
  const [newFollowupDate, setNewFollowupDate] = useState(new Date().toISOString().split('T')[0]);
  const [newFollowupTime, setNewFollowupTime] = useState('11:00');
  const [newFollowupType, setNewFollowupType] = useState<LeadFollowup['type']>('WhatsApp');
  const [newFollowupNotes, setNewFollowupNotes] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(false);

  const cleanPhone = lead.whatsapp_number.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Namaste ${lead.name} Ji! Thank you for reaching out to AstroNexus Vedic Labs.`
  )}`;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(lead.whatsapp_number);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(lead.lead_id, chatInput.trim());
    setChatInput('');
  };

  const handleApplyTemplate = (tplContent: string) => {
    const customized = tplContent
      .replace(/{{name}}/g, lead.name)
      .replace(/{{lead_id}}/g, lead.lead_id)
      .replace(/{{time}}/g, '11:00 AM');
    setChatInput(customized);
  };

  const handleCreateFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFollowup(lead.lead_id, {
      followup_date: newFollowupDate,
      followup_time: newFollowupTime,
      type: newFollowupType,
      notes: newFollowupNotes,
      assigned_to: lead.assigned_to,
      assigned_to_name: lead.assigned_to_name,
    });
    setIsAddingFollowup(false);
    setNewFollowupNotes('');
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddTimelineNote(lead.lead_id, newNote.trim());
    setNewNote('');
  };

  const leadFollowups = followups.filter(f => f.lead_id === lead.lead_id);
  const leadActivities = activities.filter(a => a.lead_id === lead.lead_id);
  const leadMessages = messages.filter(m => m.lead_id === lead.lead_id);

  const pipelineStages: { stage: LeadStatus; label: string }[] = [
    { stage: 'NEW', label: 'New Lead' },
    { stage: 'CONTACTED', label: 'Contacted' },
    { stage: 'INTERESTED', label: 'Interested' },
    { stage: 'FOLLOW_UP', label: 'Follow-up' },
    { stage: 'CONVERTED', label: 'Converted' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex justify-end font-sans animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#0e0307] border-l border-red-900/60 shadow-2xl flex flex-col h-full text-slate-200 overflow-hidden">
        {/* Drawer Header */}
        <div className="bg-[#120408] px-6 py-4 border-b border-red-950/80 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-orange-400 bg-[#1c060e] border border-red-950 px-2 py-0.5 rounded-lg">
                  {lead.lead_id}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    lead.source === 'Meta Ads' || lead.source === 'Instagram' || lead.source === 'Facebook'
                      ? 'bg-blue-950/60 text-blue-300 border-blue-500/30'
                      : lead.source === 'Google Ads'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {lead.source}
                </span>
                {lead.priority === 'HIGH' && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950/50 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    HIGH 🔥
                  </span>
                )}
                {lead.priority === 'URGENT' && (
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-950/50 border border-rose-500/30 px-1.5 py-0.5 rounded">
                    URGENT ⚡
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-white flex items-center gap-2 font-['Outfit',sans-serif]">
                {lead.name}
              </h2>

              <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                <div className="flex items-center gap-1.5 font-mono text-emerald-400">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lead.whatsapp_number}</span>
                  <button
                    onClick={handleCopyPhone}
                    title="Copy phone"
                    className="p-1 text-slate-500 hover:text-white cursor-pointer"
                  >
                    {copiedPhone ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                {lead.email && (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lead.email}</span>
                  </div>
                )}
                <div className="text-[11px] text-slate-500">
                  Captured: {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 flex items-center gap-1.5 transition cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                WhatsApp Web
              </a>
              <button
                onClick={() => onOpenConvertModal(lead)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Convert
              </button>
              <button
                onClick={() => onOpenEditModal(lead)}
                title="Edit Lead"
                className="p-2 rounded-xl bg-[#1c060e] hover:bg-[#280814] text-slate-300 hover:text-white border border-red-950 transition cursor-pointer"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteLead(lead.lead_id)}
                title="Delete Lead"
                className="p-2 rounded-xl bg-[#1c060e] hover:bg-rose-950/80 hover:text-rose-400 text-slate-400 border border-red-950 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-[#1c060e] hover:bg-[#280814] text-slate-400 hover:text-white border border-red-950 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pipeline Stage Stepper */}
          <div className="mt-4 pt-3 border-t border-red-950/80">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {pipelineStages.map((step, idx) => {
                const isActive = lead.lead_status === step.stage;
                const isPast =
                  (lead.lead_status === 'CONTACTED' && idx <= 1) ||
                  (lead.lead_status === 'INTERESTED' && idx <= 2) ||
                  (lead.lead_status === 'FOLLOW_UP' && idx <= 3) ||
                  (lead.lead_status === 'CONVERTED' && idx <= 4);

                return (
                  <button
                    key={step.stage}
                    onClick={() => onUpdateStatus(lead.lead_id, step.stage)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white border-orange-400/50 shadow-md'
                        : isPast
                        ? 'bg-[#1c060e] text-slate-200 border-red-950 hover:border-orange-500/40'
                        : 'bg-[#120408] text-slate-500 border-red-950/60 hover:text-slate-300'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {step.label}
                  </button>
                );
              })}

              <button
                onClick={() => onOpenLostModal(lead)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ml-auto cursor-pointer ${
                  lead.lead_status === 'LOST' || lead.lead_status === 'REJECTED'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                    : 'bg-[#16050b] text-slate-400 border-red-950 hover:text-rose-400 hover:border-rose-900'
                }`}
              >
                {lead.lead_status === 'LOST'
                  ? 'Lost Lead ❌'
                  : lead.lead_status === 'REJECTED'
                  ? 'Rejected 🚫'
                  : 'Mark Lost / Close'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Assignment & Priority Bar */}
        <div className="bg-[#16050b] px-6 py-3 border-b border-red-950/80 grid grid-cols-3 gap-3 text-xs shrink-0">
          <div>
            <span className="text-slate-400 text-[11px] block font-semibold mb-1">Assigned Astrologer:</span>
            <select
              value={lead.assigned_to}
              onChange={e => {
                const user = staffUsers.find(u => u.id === e.target.value);
                onUpdateAssignee(lead.lead_id, e.target.value, user?.name || 'Staff');
              }}
              className="w-full bg-[#120408] border border-red-950/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            >
              {staffUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-slate-400 text-[11px] block font-semibold mb-1">Priority:</span>
            <select
              value={lead.priority}
              onChange={e => onUpdatePriority(lead.lead_id, e.target.value as any)}
              className="w-full bg-[#120408] border border-red-950/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High 🔥</option>
              <option value="URGENT">Urgent ⚡</option>
            </select>
          </div>

          <div>
            <span className="text-slate-400 text-[11px] block font-semibold mb-1">Service Interest:</span>
            <div className="mt-1 text-white font-semibold truncate" title={lead.service_interested}>
              {lead.service_interested || 'Vedic Consultation'}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 px-6 border-b border-red-950/80 bg-[#120408] text-xs shrink-0">
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-3 font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'chat'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp Chat ({leadMessages.length})
          </button>
          <button
            onClick={() => setActiveTab('followups')}
            className={`py-3 font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'followups'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Follow-ups ({leadFollowups.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            Activity Timeline ({leadActivities.length})
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'details'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Attribution & Notes
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs bg-[#0e0307]">
          {/* TAB 1: WHATSAPP CHAT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full space-y-4">
              {/* Message List */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {leadMessages.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                    <p className="text-sm font-medium">No messages logged yet</p>
                    <p className="text-xs">Send an initial greeting or use a canned WhatsApp template below</p>
                  </div>
                ) : (
                  leadMessages.map(msg => {
                    const isInbound = msg.direction === 'inbound';
                    return (
                      <div
                        key={msg.message_id}
                        className={`flex flex-col ${isInbound ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
                            isInbound
                              ? 'bg-[#16050b] border border-red-950/80 text-slate-100 rounded-tl-sm'
                              : 'bg-emerald-700 text-white rounded-tr-sm'
                          }`}
                        >
                          <div className="text-[10px] font-semibold opacity-75 mb-1 flex items-center justify-between gap-3">
                            <span>{isInbound ? msg.sender_name || lead.name : 'AstroNexus Support'}</span>
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="whitespace-pre-wrap leading-relaxed text-xs">{msg.message_text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Canned Templates Quick Picker */}
              <div className="pt-2 border-t border-red-950/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1 font-['Outfit',sans-serif]">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    Quick WhatsApp Template:
                  </span>
                  <select
                    value={selectedTemplate}
                    onChange={e => {
                      setSelectedTemplate(e.target.value);
                      const tpl = templates.find(t => t.id === e.target.value);
                      if (tpl) handleApplyTemplate(tpl.content);
                    }}
                    className="bg-[#16050b] border border-red-950 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="">-- Choose Template --</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Send Chat Form */}
                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type WhatsApp reply to customer..."
                    className="flex-1 bg-[#16050b] border border-red-950/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: FOLLOW-UPS */}
          {activeTab === 'followups' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white font-['Outfit',sans-serif]">Scheduled Follow-up Reminders</h4>
                <button
                  onClick={() => setIsAddingFollowup(!isAddingFollowup)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold flex items-center gap-1 transition shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Schedule Follow-up
                </button>
              </div>

              {/* Add Follow-up Form */}
              {isAddingFollowup && (
                <form
                  onSubmit={handleCreateFollowup}
                  className="bg-[#120408] border border-red-950/80 rounded-2xl p-4 space-y-3"
                >
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Date</label>
                      <input
                        type="date"
                        required
                        value={newFollowupDate}
                        onChange={e => setNewFollowupDate(e.target.value)}
                        className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Time</label>
                      <input
                        type="time"
                        value={newFollowupTime}
                        onChange={e => setNewFollowupTime(e.target.value)}
                        className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Channel</label>
                      <select
                        value={newFollowupType}
                        onChange={e => setNewFollowupType(e.target.value as any)}
                        className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Phone Call">Phone Call</option>
                        <option value="Email">Email</option>
                        <option value="In-Person">In-Person Studio</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Follow-up Notes / Task</label>
                    <input
                      type="text"
                      required
                      value={newFollowupNotes}
                      onChange={e => setNewFollowupNotes(e.target.value)}
                      placeholder="e.g. Share lab certificate of 5.25 Ratti Pukhraj & discuss auspicious wearing day."
                      className="w-full bg-[#16050b] border border-red-950/80 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingFollowup(false)}
                      className="px-3 py-1 text-slate-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold cursor-pointer"
                    >
                      Save Reminder
                    </button>
                  </div>
                </form>
              )}

              {/* Follow-up Items */}
              <div className="space-y-2.5">
                {leadFollowups.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">No follow-ups scheduled</div>
                ) : (
                  leadFollowups.map(flw => {
                    const isPending = flw.status === 'pending';
                    return (
                      <div
                        key={flw.followup_id}
                        className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 ${
                          isPending
                            ? 'bg-[#120408] border-red-950/80'
                            : 'bg-emerald-950/20 border-emerald-500/20 opacity-75'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white flex items-center gap-1 font-['Outfit',sans-serif]">
                              <Calendar className="w-3.5 h-3.5 text-orange-400" />
                              {flw.followup_date} at {flw.followup_time || '11:00'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-[#1c060e] text-slate-300 border border-red-950">
                              {flw.type}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                isPending
                                  ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {isPending ? 'Pending' : 'Completed'}
                            </span>
                          </div>
                          <p className="text-slate-300">{flw.notes}</p>
                          {flw.outcome_notes && (
                            <p className="text-[11px] text-emerald-400">Outcome: {flw.outcome_notes}</p>
                          )}
                        </div>

                        {isPending && (
                          <button
                            onClick={() => {
                              const outcome = prompt('Enter follow-up outcome notes:');
                              onCompleteFollowup(lead.lead_id, flw.followup_id, outcome || 'Completed');
                            }}
                            className="px-3 py-1 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white font-semibold shrink-0 flex items-center gap-1 cursor-pointer transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark Done
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE & LOGS */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {/* Add Note Form */}
              <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Add custom internal note to lead history..."
                  className="flex-1 bg-[#16050b] border border-red-950/80 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold shrink-0 cursor-pointer shadow-md"
                >
                  Add Log
                </button>
              </form>

              {/* Timeline Items */}
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-red-950">
                {leadActivities.map(act => (
                  <div key={act.activity_id} className="relative">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-orange-500 border-2 border-[#0e0307]" />
                    <div className="bg-[#120408] border border-red-950/80 rounded-2xl p-3.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-orange-300 font-['Outfit',sans-serif]">{act.title}</span>
                        <span className="text-slate-500">
                          {new Date(act.timestamp).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-slate-200">{act.description}</p>
                      <div className="text-[10px] text-slate-400">By: {act.performed_by_name || 'System'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ATTRIBUTION & NOTES */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="bg-[#120408] border border-red-950/80 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider font-['Outfit',sans-serif]">
                  Meta Ads & Campaign Tracking
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Lead Source:</span>
                    <span className="font-semibold text-white">{lead.source}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Campaign Name:</span>
                    <span className="font-mono text-orange-300">{lead.campaign_name || 'Direct / Organic'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Ad Set:</span>
                    <span className="text-slate-300">{lead.ad_set_name || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Ad Creative:</span>
                    <span className="text-slate-300">{lead.ad_name || 'None'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#120408] border border-red-950/80 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider font-['Outfit',sans-serif]">
                  Initial Requirement Notes
                </h4>
                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {lead.requirement || lead.notes || 'No notes provided.'}
                </p>
              </div>

              {lead.tags && lead.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {lead.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-[#16050b] text-slate-300 border border-red-950 text-xs flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-orange-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {lead.lead_status === 'CONVERTED' && lead.conversion_details && (
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 space-y-2 text-emerald-200">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Conversion Record
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Service: {lead.conversion_details.servicePurchased}</div>
                    <div>Paid: {currencySymbol}{lead.conversion_details.paymentAmount?.toLocaleString('en-IN')}</div>
                    <div>Invoice: {lead.conversion_details.invoiceNumber || 'N/A'}</div>
                    <div>Mode: {lead.conversion_details.paymentMethod}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
