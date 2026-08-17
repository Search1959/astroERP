import React from 'react';
import { Lead, LeadStatus } from '../../types';
import {
  MessageSquare,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  ExternalLink,
  Flame,
  User,
  ArrowRight,
  Plus,
} from 'lucide-react';

interface LeadKanbanBoardProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  onOpenNewLeadModal: () => void;
  currencySymbol?: string;
}

interface ColumnConfig {
  status: LeadStatus;
  title: string;
  badgeColor: string;
  borderColor: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    status: 'NEW',
    title: 'New Leads',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    borderColor: 'border-blue-500/30',
  },
  {
    status: 'CONTACTED',
    title: 'Contacted',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    borderColor: 'border-purple-500/30',
  },
  {
    status: 'INTERESTED',
    title: 'Interested',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    borderColor: 'border-amber-500/30',
  },
  {
    status: 'FOLLOW_UP',
    title: 'Follow-up Due',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    borderColor: 'border-cyan-500/30',
  },
  {
    status: 'CONVERTED',
    title: 'Converted 🎉',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    borderColor: 'border-emerald-500/30',
  },
  {
    status: 'LOST',
    title: 'Lost / Closed',
    badgeColor: 'bg-slate-700/40 text-slate-400 border-slate-700',
    borderColor: 'border-slate-700/50',
  },
];

export const LeadKanbanBoard: React.FC<LeadKanbanBoardProps> = ({
  leads,
  onSelectLead,
  onUpdateLeadStatus,
  onOpenNewLeadModal,
  currencySymbol = '₹',
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      onUpdateLeadStatus(leadId, status);
    }
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start min-h-[550px] scrollbar-thin">
      {COLUMNS.map(col => {
        const colLeads = leads.filter(l => {
          if (col.status === 'LOST') {
            return l.lead_status === 'LOST' || l.lead_status === 'REJECTED' || l.lead_status === 'NOT_INTERESTED';
          }
          return l.lead_status === col.status;
        });

        const totalValue = colLeads.reduce((acc, l) => acc + (l.converted_value || 0), 0);

        return (
          <div
            key={col.status}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, col.status)}
            className="w-80 shrink-0 bg-slate-900/70 border border-slate-800 rounded-2xl p-3 flex flex-col max-h-[calc(100vh-250px)]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${col.badgeColor}`}>
                  {colLeads.length}
                </span>
                <h3 className="text-xs font-bold text-white tracking-wide">{col.title}</h3>
              </div>
              {col.status === 'CONVERTED' && totalValue > 0 && (
                <span className="text-[11px] font-semibold text-emerald-400 font-mono">
                  {currencySymbol}{totalValue.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Leads Stack */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {colLeads.length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center text-slate-500 text-xs">
                  No leads in this stage
                </div>
              ) : (
                colLeads.map(lead => {
                  const cleanPhone = lead.whatsapp_number.replace(/[^0-9]/g, '');
                  const waUrl = `https://wa.me/${cleanPhone}`;

                  return (
                    <div
                      key={lead.lead_id}
                      draggable
                      onDragStart={e => handleDragStart(e, lead.lead_id)}
                      onClick={() => onSelectLead(lead)}
                      className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 rounded-xl p-3.5 space-y-2.5 cursor-grab active:cursor-grabbing transition shadow-sm group select-none"
                    >
                      {/* Top Row: Lead ID & Priority */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-indigo-300 font-medium">
                          {lead.lead_id}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {lead.priority === 'HIGH' && (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded">
                              HIGH 🔥
                            </span>
                          )}
                          {lead.priority === 'URGENT' && (
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-500/30 px-1.5 py-0.5 rounded">
                              URGENT ⚡
                            </span>
                          )}
                          <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                            {lead.source}
                          </span>
                        </div>
                      </div>

                      {/* Lead Name */}
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition">
                          {lead.name}
                        </h4>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                          {lead.service_interested || 'Vedic Consultation'}
                        </div>
                      </div>

                      {/* Requirement Snippet */}
                      {lead.requirement && (
                        <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed bg-slate-900/60 rounded-lg p-2 border border-slate-800/80">
                          "{lead.requirement}"
                        </p>
                      )}

                      {/* Meta Attribution or Follow-up */}
                      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                        {lead.next_followup_date ? (
                          <div className="flex items-center gap-1 text-cyan-400 font-medium">
                            <Calendar className="w-3 h-3" />
                            <span>{lead.next_followup_date}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-400">
                            <User className="w-3 h-3 text-slate-500" />
                            <span className="truncate max-w-[110px]">{lead.assigned_to_name || 'Unassigned'}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            title="Direct WhatsApp Web"
                            className="p-1 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/60 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
