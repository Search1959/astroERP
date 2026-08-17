import React, { useState } from 'react';
import { Lead, LeadMessage, LeadSettingsData } from '../../types';
import {
  MessageSquare,
  Search,
  Send,
  Sparkles,
  Phone,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Tag,
  User,
  Paperclip,
  Check,
  CheckCheck,
} from 'lucide-react';

interface WhatsAppInboxViewProps {
  leads: Lead[];
  messages: LeadMessage[];
  selectedLeadId: string | null;
  onSelectLead: (lead: Lead) => void;
  onSendMessage: (leadId: string, text: string) => void;
  onOpenConvertModal: (lead: Lead) => void;
  leadSettings: LeadSettingsData;
  currencySymbol?: string;
}

export const WhatsAppInboxView: React.FC<WhatsAppInboxViewProps> = ({
  leads,
  messages,
  selectedLeadId,
  onSelectLead,
  onSendMessage,
  onOpenConvertModal,
  leadSettings,
  currencySymbol = '₹',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  // Filter leads that have messages or are recent
  const filteredLeads = leads.filter(l => {
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.whatsapp_number.includes(q) ||
      (l.requirement && l.requirement.toLowerCase().includes(q))
    );
  });

  const activeLead = leads.find(l => l.lead_id === selectedLeadId) || filteredLeads[0] || null;
  const activeMessages = activeLead ? messages.filter(m => m.lead_id === activeLead.lead_id) : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeLead) return;
    onSendMessage(activeLead.lead_id, chatInput.trim());
    setChatInput('');
  };

  const handleApplyTemplate = (tplContent: string) => {
    if (!activeLead) return;
    const filled = tplContent
      .replace(/{{name}}/g, activeLead.name)
      .replace(/{{lead_id}}/g, activeLead.lead_id)
      .replace(/{{time}}/g, '11:00 AM');
    setChatInput(filled);
  };

  const cleanPhone = activeLead?.whatsapp_number.replace(/[^0-9]/g, '') || '';
  const waUrl = `https://wa.me/${cleanPhone}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex h-[620px] shadow-xl text-slate-200">
      {/* Left Column: Chat Conversation List */}
      <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-950/60 shrink-0">
        {/* Search Header */}
        <div className="p-3.5 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search chat or phone..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Lead Chats List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {filteredLeads.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">No matching conversations</div>
          ) : (
            filteredLeads.map(lead => {
              const isSelected = activeLead?.lead_id === lead.lead_id;
              const leadMsgs = messages.filter(m => m.lead_id === lead.lead_id);
              const lastMsg = leadMsgs[leadMsgs.length - 1];

              return (
                <button
                  key={lead.lead_id}
                  onClick={() => onSelectLead(lead)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition ${
                    isSelected
                      ? 'bg-slate-800/90 border-l-4 border-l-emerald-500'
                      : 'hover:bg-slate-850 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center text-sm shrink-0">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white truncate">{lead.name}</span>
                      <span className="text-[10px] text-slate-500">
                        {lastMsg
                          ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : ''}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-emerald-400/90 truncate">
                      {lead.whatsapp_number}
                    </div>

                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {lastMsg ? lastMsg.message_text : lead.requirement || 'No messages'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Active Conversation & Quick Dispatch */}
      {activeLead ? (
        <div className="flex-1 flex flex-col bg-slate-900">
          {/* Active Chat Header */}
          <div className="px-6 py-3.5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center text-sm">
                {activeLead.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  {activeLead.name}
                  <span className="text-[10px] font-mono font-normal text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {activeLead.lead_id}
                  </span>
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-mono text-emerald-400">{activeLead.whatsapp_number}</span>
                  <span>• {activeLead.source}</span>
                  <span>• Stage: <strong className="text-white">{activeLead.lead_status}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenConvertModal(activeLead)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Convert
              </button>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition"
                title="Launch in WhatsApp Web"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Chat Messages Flow */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3.5 bg-slate-950/20">
            {activeMessages.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                <p className="text-sm">No chat history yet with this lead</p>
                <p className="text-xs">Type a response below or select a canned template to send</p>
              </div>
            ) : (
              activeMessages.map(msg => {
                const isInbound = msg.direction === 'inbound';
                return (
                  <div
                    key={msg.message_id}
                    className={`flex flex-col ${isInbound ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm text-xs ${
                        isInbound
                          ? 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-sm'
                          : 'bg-emerald-700 text-white rounded-tr-sm'
                      }`}
                    >
                      <div className="text-[10px] font-medium opacity-75 mb-1 flex items-center justify-between gap-3">
                        <span>{isInbound ? msg.sender_name || activeLead.name : 'AstroNexus Astrologer'}</span>
                        <div className="flex items-center gap-1">
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {!isInbound && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.message_text}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat Input & Template Picker */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-2 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Select Quick Template:
              </span>
              <select
                value={selectedTemplateId}
                onChange={e => {
                  setSelectedTemplateId(e.target.value);
                  const tpl = leadSettings.templates?.find(t => t.id === e.target.value);
                  if (tpl) handleApplyTemplate(tpl.content);
                }}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
              >
                <option value="">-- Choose Template --</option>
                {(leadSettings.templates || []).map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder={`Message ${activeLead.name} on WhatsApp...`}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shrink-0"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          Select a conversation from the left to start chatting
        </div>
      )}
    </div>
  );
};
