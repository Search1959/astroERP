import React, { useState } from 'react';
import { Lead, StoreSettings } from '../../types';
import {
  MessageSquare,
  Phone,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface MobileLeadsTabProps {
  leads: Lead[];
  currencySymbol: string;
  settings: StoreSettings | null;
  onOpenNewLeadModal: () => void;
  onUpdateLeadStatus: (leadId: string, newStatus: Lead['lead_status']) => void;
  onOpenConvertModal: (lead: Lead) => void;
}

export const MobileLeadsTab: React.FC<MobileLeadsTabProps> = ({
  leads = [],
  currencySymbol = '₹',
  settings,
  onOpenNewLeadModal,
  onUpdateLeadStatus,
  onOpenConvertModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'NEW' | 'FOLLOW_UP' | 'INTERESTED' | 'CONVERTED'>('ALL');
  const [selectedTemplate, setSelectedTemplate] = useState<'hindi' | 'english' | 'appointment'>('hindi');

  const filteredLeads = leads.filter(l => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (l.name || '').toLowerCase().includes(q);
    const phoneMatch = (l.whatsapp_number || l.phone || '').includes(q);
    const serviceMatch = (l.service_interested || '').toLowerCase().includes(q);
    const statusMatch = activeFilter === 'ALL' || l.lead_status === activeFilter;
    return (nameMatch || phoneMatch || serviceMatch) && statusMatch;
  });

  const getTemplateMessage = (lead: Lead, type: 'hindi' | 'english' | 'appointment') => {
    const store = settings?.storeName || 'VedicAstro Studio';
    if (type === 'hindi') {
      return `नमस्ते ${lead.name} जी 🙏, ${store} में संपर्क करने के लिए धन्यवाद। क्या आप अपनी जन्म कुंडली विश्लेषण या रत्न परामर्श के बारे में जानना चाहते हैं? कृपया अपना जन्म समय और स्थान साझा करें।`;
    }
    if (type === 'appointment') {
      return `Namaste ${lead.name}, thank you for reaching out to ${store}. We have available consultation slots today. Would you prefer an In-Person or Phone Consultation?`;
    }
    return `Namaste ${lead.name}, thank you for your inquiry at ${store}. Our senior Vedic Astrologer has reviewed your interest in ${lead.service_interested || 'Astrology Consultation'}. When is a good time to connect?`;
  };

  return (
    <div className="space-y-4 pb-24 select-none font-sans">
      {/* Top Header with Stats */}
      <div className="bg-[#0e0307] border border-red-950/80 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 font-bold shadow-xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-['Outfit',sans-serif]">Leads & WhatsApp CRM</h2>
              <p className="text-[11px] text-slate-400 font-mono">{leads.length} Total Captured Inquiries</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenNewLeadModal}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-orange-400/70 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search lead by name, phone or service..."
            className="w-full pl-9 pr-3 py-2 bg-[#120408] border border-red-950/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition shadow-inner"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs">
          {(['ALL', 'NEW', 'FOLLOW_UP', 'INTERESTED', 'CONVERTED'] as const).map(filterKey => {
            const count = filterKey === 'ALL' ? leads.length : leads.filter(l => l.lead_status === filterKey).length;
            const isActive = activeFilter === filterKey;
            return (
              <button
                type="button"
                key={filterKey}
                onClick={() => setActiveFilter(filterKey)}
                className={`px-3 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition cursor-pointer font-['Outfit',sans-serif] ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-xs'
                    : 'bg-[#14050b] text-slate-400 hover:text-white border border-red-950'
                }`}
              >
                {filterKey === 'ALL' ? 'All' : filterKey.replace('_', ' ')} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-8 bg-[#0e0307] border border-red-950/80 rounded-3xl p-4">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-slate-400">No leads found in this filter.</p>
          </div>
        ) : (
          filteredLeads.map(lead => {
            const rawPhone = lead.whatsapp_number || lead.phone || '';
            const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
            const waPhone = cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone;
            const isConverted = lead.lead_status === 'CONVERTED';

            return (
              <div
                key={lead.lead_id}
                className="bg-[#0e0307] border border-red-950/80 rounded-3xl p-4 shadow-xl space-y-3"
              >
                {/* Lead Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white font-['Outfit',sans-serif]">{lead.name}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          lead.lead_status === 'NEW'
                            ? 'bg-blue-950/80 text-blue-300 border border-blue-700/60'
                            : lead.lead_status === 'FOLLOW_UP'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
                            : lead.lead_status === 'INTERESTED'
                            ? 'bg-purple-950/80 text-purple-300 border border-purple-700/60'
                            : lead.lead_status === 'CONVERTED'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                            : 'bg-[#14050b] text-slate-400 border border-red-950'
                        }`}
                      >
                        {lead.lead_status}
                      </span>
                    </div>

                    <p className="text-xs text-orange-400 font-medium mt-0.5">
                      {lead.service_interested || 'Kundli Analysis'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Source: <span className="text-slate-200 font-semibold">{lead.source}</span> • {rawPhone}
                    </p>
                  </div>

                  {((lead.converted_value && lead.converted_value > 0) || (lead.conversion_details?.paymentAmount && lead.conversion_details.paymentAmount > 0)) && (
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        {currencySymbol}{(lead.converted_value || lead.conversion_details?.paymentAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Direct 1-Tap Action Row */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-red-950/70">
                  {rawPhone ? (
                    <a
                      href={`https://wa.me/${waPhone}?text=${encodeURIComponent(
                        getTemplateMessage(lead, selectedTemplate)
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  ) : (
                    <button disabled className="py-2 px-2 bg-[#120408] text-slate-600 rounded-xl text-[11px] font-medium border border-red-950">
                      No Phone
                    </button>
                  )}

                  {rawPhone ? (
                    <a
                      href={`tel:${rawPhone}`}
                      className="py-2 px-2 bg-[#1c060e] hover:bg-[#280814] text-slate-200 hover:text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 border border-red-900/60 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-rose-400" />
                      <span>Call</span>
                    </a>
                  ) : null}

                  {!isConverted ? (
                    <button
                      type="button"
                      onClick={() => onOpenConvertModal(lead)}
                      className="py-2 px-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Convert</span>
                    </button>
                  ) : (
                    <div className="py-2 px-2 bg-emerald-950/80 text-emerald-300 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 border border-emerald-700/60">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Customer</span>
                    </div>
                  )}
                </div>

                {/* Status Switcher Bar */}
                {!isConverted && (
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">Change Status:</span>
                    <div className="flex items-center gap-1">
                      {(['NEW', 'FOLLOW_UP', 'INTERESTED'] as const).map(st => (
                        <button
                          type="button"
                          key={st}
                          onClick={() => onUpdateLeadStatus(lead.lead_id || lead.id || '', st)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold cursor-pointer transition ${
                            lead.lead_status === st
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold'
                              : 'text-slate-400 hover:text-slate-200 bg-[#120408] border border-red-950/60'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
