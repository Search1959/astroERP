import React, { useState, useMemo } from 'react';
import {
  Lead,
  LeadFollowup,
  LeadActivity,
  LeadMessage,
  LeadSettingsData,
  LeadDashboardMetrics,
  User,
  LeadStatus,
  LeadPriority,
} from '../../types';
import {
  Users,
  MessageSquare,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Plus,
  Settings,
  Sparkles,
  Download,
  Flame,
  UserCheck,
  TrendingUp,
  LayoutGrid,
  List,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Tag,
  Kanban,
  BarChart3,
  DollarSign,
  Send,
  Zap,
} from 'lucide-react';
import { LeadFormModal } from './LeadFormModal';
import { LeadDetailDrawer } from './LeadDetailDrawer';
import { LeadConvertModal } from './LeadConvertModal';
import { LeadLostModal } from './LeadLostModal';
import { LeadSettingsModal } from './LeadSettingsModal';
import { WhatsAppSimulatorModal } from './WhatsAppSimulatorModal';
import { LeadKanbanBoard } from './LeadKanbanBoard';
import { WhatsAppInboxView } from './WhatsAppInboxView';
import { calculateLeadMetrics } from '../../data/initialDemoData';

interface LeadManagementModuleProps {
  leads: Lead[];
  followups: LeadFollowup[];
  activities: LeadActivity[];
  messages: LeadMessage[];
  leadSettings: LeadSettingsData;
  staffUsers: User[];
  currentUser: User;
  onSaveLead: (leadData: Partial<Lead>) => void;
  onUpdateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  onUpdateLeadPriority: (leadId: string, newPriority: LeadPriority) => void;
  onUpdateLeadAssignee: (leadId: string, assignedToId: string, assignedToName: string) => void;
  onDeleteLead: (leadId: string) => void;
  onConvertLead: (
    leadId: string,
    conversionData: {
      servicePurchased: string;
      paymentAmount: number;
      paymentMethod: string;
      notes?: string;
      createClient: boolean;
    }
  ) => void;
  onMarkLeadLost: (leadId: string, reason: string, notes: string, isRejected: boolean) => void;
  onAddFollowup: (leadId: string, followup: Partial<LeadFollowup>) => void;
  onCompleteFollowup: (leadId: string, followupId: string, outcomeNotes: string) => void;
  onAddTimelineNote: (leadId: string, noteText: string) => void;
  onSendMessage: (leadId: string, text: string) => void;
  onSaveSettings: (newSettings: LeadSettingsData) => void;
  onSimulateInboundLead: (payload: {
    senderPhone: string;
    senderName: string;
    messageText: string;
    source: string;
    campaign: string;
    adName?: string;
  }) => void;
  currencySymbol?: string;
}

export const LeadManagementModule: React.FC<LeadManagementModuleProps> = ({
  leads,
  followups,
  activities,
  messages,
  leadSettings,
  staffUsers,
  currentUser,
  onSaveLead,
  onUpdateLeadStatus,
  onUpdateLeadPriority,
  onUpdateLeadAssignee,
  onDeleteLead,
  onConvertLead,
  onMarkLeadLost,
  onAddFollowup,
  onCompleteFollowup,
  onAddTimelineNote,
  onSendMessage,
  onSaveSettings,
  onSimulateInboundLead,
  currencySymbol = '₹',
}) => {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'inbox' | 'analytics'>('table');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('ALL');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Modals & Drawers State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);

  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);

  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);

  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const [leadToMarkLost, setLeadToMarkLost] = useState<Lead | null>(null);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);

  // Metrics computation
  const metrics: LeadDashboardMetrics = useMemo(() => {
    return calculateLeadMetrics(leads, followups);
  }, [leads, followups]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          lead.name.toLowerCase().includes(q) ||
          lead.whatsapp_number.includes(q) ||
          lead.lead_id.toLowerCase().includes(q) ||
          (lead.email && lead.email.toLowerCase().includes(q)) ||
          (lead.campaign_name && lead.campaign_name.toLowerCase().includes(q)) ||
          (lead.service_interested && lead.service_interested.toLowerCase().includes(q)) ||
          (lead.requirement && lead.requirement.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Status
      if (statusFilter !== 'ALL' && lead.lead_status !== statusFilter) {
        return false;
      }

      // Source
      if (sourceFilter !== 'ALL' && lead.source !== sourceFilter) {
        return false;
      }

      // Priority
      if (priorityFilter !== 'ALL' && lead.priority !== priorityFilter) {
        return false;
      }

      // Assignee
      if (assigneeFilter !== 'ALL' && lead.assigned_to !== assigneeFilter) {
        return false;
      }

      return true;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter, priorityFilter, assigneeFilter]);

  // Handlers for Drawer & Modal Interlinking
  const handleOpenLeadDetail = (lead: Lead) => {
    setSelectedLeadForDetail(lead);
    setIsDetailDrawerOpen(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsFormModalOpen(true);
  };

  const handleOpenConvert = (lead: Lead) => {
    setLeadToConvert(lead);
    setIsConvertModalOpen(true);
  };

  const handleOpenLost = (lead: Lead) => {
    setLeadToMarkLost(lead);
    setIsLostModalOpen(true);
  };

  // CSV Export for Broadcasts / Reporting
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) return;
    const headers = [
      'Lead ID',
      'Name',
      'WhatsApp Number',
      'Email',
      'Source',
      'Campaign',
      'Service Interested',
      'Status',
      'Priority',
      'Assigned To',
      'Created Date',
      'Next Follow-up',
      'Converted Value',
    ];

    const rows = filteredLeads.map(l => [
      l.lead_id,
      `"${l.name}"`,
      `"${l.whatsapp_number}"`,
      l.email || '',
      l.source,
      `"${l.campaign_name || ''}"`,
      `"${l.service_interested || ''}"`,
      l.lead_status,
      l.priority,
      `"${l.assigned_to_name || ''}"`,
      l.created_at?.split('T')[0] || '',
      l.next_followup_date || '',
      l.converted_value || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AstroNexus_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk Status Update
  const handleBulkStatusChange = (status: LeadStatus) => {
    selectedLeadIds.forEach(id => {
      onUpdateLeadStatus(id, status);
    });
    setSelectedLeadIds([]);
  };

  const toggleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map(l => l.lead_id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedLeadIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-emerald-400" />
              Lead Management & WhatsApp CRM
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Meta Ads & WhatsApp Cloud API
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Capture Click-to-WhatsApp enquiries, automate follow-up scheduling, track Meta campaign ROI & convert Jyotish consultations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsSimulatorModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:text-white hover:bg-amber-600/30 transition text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            title="Test incoming Meta Ad webhook event"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Simulate Meta Ad Lead
          </button>

          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            title="Configure Meta Webhook & CRM Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCSV}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            title="Export CSV / WhatsApp broadcast list"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setLeadToEdit(null);
              setIsFormModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            New Lead Entry
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Total Leads</span>
            <Users className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{metrics.totalLeads}</div>
          <div className="text-[10px] text-blue-400 font-medium">All Channels</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>New Enquiries</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-indigo-300 font-mono">{metrics.newLeads}</div>
          <div className="text-[10px] text-indigo-400 font-medium">Awaiting First Reply</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Follow-ups Due</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-300 font-mono">{metrics.followupsDueToday}</div>
          <div className="text-[10px] text-cyan-400 font-medium">Scheduled for Today</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Converted 🎉</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">{metrics.convertedLeads}</div>
          <div className="text-[10px] text-emerald-400 font-medium">{metrics.conversionRate}% Conversion Rate</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Attributed Revenue</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-300 font-mono">
            {currencySymbol}{metrics.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-400 font-medium">From Converted Leads</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Lost / Closed</span>
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-xl font-bold text-slate-400 font-mono">{metrics.lostLeads + metrics.rejectedLeads}</div>
          <div className="text-[10px] text-slate-500 font-medium">Disqualified or Dropped</div>
        </div>
      </div>

      {/* View Mode Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'table'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            Leads Table & List
          </button>

          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'kanban'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Pipeline Kanban
          </button>

          <button
            onClick={() => setViewMode('inbox')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'inbox'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            WhatsApp Web Inbox
          </button>

          <button
            onClick={() => setViewMode('analytics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'analytics'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Attribution Analytics
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono hidden sm:block">
          Showing <span className="text-white font-bold">{filteredLeads.length}</span> of {leads.length} leads
        </div>
      </div>

      {/* VIEW 1: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, lead ID, notes..."
                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-8 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Stages ({leads.length})</option>
                <option value="NEW">New Leads ({metrics.newLeads})</option>
                <option value="CONTACTED">Contacted</option>
                <option value="INTERESTED">Interested</option>
                <option value="FOLLOW_UP">Follow-up Due</option>
                <option value="CONVERTED">Converted 🎉</option>
                <option value="LOST">Lost</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Source Filter */}
            <div>
              <select
                value={sourceFilter}
                onChange={e => setSourceFilter(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Sources</option>
                <option value="Meta Ads">Meta Ads</option>
                <option value="Instagram">Instagram Direct / Reel</option>
                <option value="Facebook">Facebook</option>
                <option value="WhatsApp">Direct WhatsApp</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Website">Website Form</option>
                <option value="Referral">Referral</option>
                <option value="Walk-in">Studio Walk-in</option>
                <option value="Manual">Manual Entry</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Priorities</option>
                <option value="URGENT">Urgent ⚡</option>
                <option value="HIGH">High 🔥</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Assignee Filter */}
            <div>
              <select
                value={assigneeFilter}
                onChange={e => setAssigneeFilter(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Astrologers / Staff</option>
                {staffUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bulk Action Bar (when items selected) */}
          {selectedLeadIds.length > 0 && (
            <div className="bg-indigo-950/60 border border-indigo-500/40 rounded-xl p-3 flex items-center justify-between text-xs text-indigo-200 animate-fade-in">
              <span className="font-semibold">
                {selectedLeadIds.length} lead{selectedLeadIds.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Move to:</span>
                <button
                  onClick={() => handleBulkStatusChange('CONTACTED')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
                >
                  Contacted
                </button>
                <button
                  onClick={() => handleBulkStatusChange('INTERESTED')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
                >
                  Interested
                </button>
                <button
                  onClick={() => handleBulkStatusChange('FOLLOW_UP')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
                >
                  Follow-up
                </button>
                <button
                  onClick={() => setSelectedLeadIds([])}
                  className="px-2 py-1 text-slate-400 hover:text-white"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Leads Data Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 select-none">
                  <tr>
                    <th className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedLeadIds.length > 0 && selectedLeadIds.length === filteredLeads.length}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-700 bg-slate-800"
                      />
                    </th>
                    <th className="py-3 px-4">Lead ID & Customer</th>
                    <th className="py-3 px-4">WhatsApp / Contact</th>
                    <th className="py-3 px-4">Source & Campaign</th>
                    <th className="py-3 px-4">Service Interest</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Assigned To</th>
                    <th className="py-3 px-4">Next Follow-up</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-500">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                        <p className="font-medium">No leads match the active filters</p>
                        <p className="text-[11px]">Click "New Lead Entry" or clear filters to view records</p>
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map(lead => {
                      const isSelected = selectedLeadIds.includes(lead.lead_id);
                      const cleanPhone = lead.whatsapp_number.replace(/[^0-9]/g, '');
                      const waUrl = `https://wa.me/${cleanPhone}`;

                      return (
                        <tr
                          key={lead.lead_id}
                          onClick={() => handleOpenLeadDetail(lead)}
                          className={`hover:bg-slate-800/50 cursor-pointer transition select-none ${
                            isSelected ? 'bg-indigo-950/30' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectOne(lead.lead_id)}
                              className="rounded border-slate-700 bg-slate-800"
                            />
                          </td>

                          {/* ID & Customer */}
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-semibold text-white hover:text-indigo-300 transition flex items-center gap-1.5">
                                {lead.name}
                                {lead.unread_messages_count ? (
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                ) : null}
                              </div>
                              <span className="font-mono text-[10px] text-indigo-400">{lead.lead_id}</span>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="py-3 px-4">
                            <div className="space-y-0.5">
                              <div className="font-mono text-emerald-400 font-medium flex items-center gap-1">
                                <MessageSquare className="w-3 h-3 text-emerald-400" />
                                {lead.whatsapp_number}
                              </div>
                              {lead.email && <div className="text-[11px] text-slate-400">{lead.email}</div>}
                            </div>
                          </td>

                          {/* Source & Campaign */}
                          <td className="py-3 px-4">
                            <div>
                              <span
                                className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                                  lead.source === 'Meta Ads' || lead.source === 'Instagram' || lead.source === 'Facebook'
                                    ? 'bg-blue-950/60 text-blue-300 border-blue-500/30'
                                    : lead.source === 'Google Ads'
                                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                                }`}
                              >
                                {lead.source}
                              </span>
                              {lead.campaign_name && (
                                <div className="text-[10px] text-slate-400 font-mono truncate max-w-[140px] mt-0.5">
                                  {lead.campaign_name}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Service Interested */}
                          <td className="py-3 px-4">
                            <span className="truncate max-w-[180px] block text-slate-200" title={lead.service_interested}>
                              {lead.service_interested || 'Vedic Consultation'}
                            </span>
                          </td>

                          {/* Stage */}
                          <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                            <select
                              value={lead.lead_status}
                              onChange={e => onUpdateLeadStatus(lead.lead_id, e.target.value as any)}
                              className={`text-[11px] font-semibold rounded-lg px-2 py-1 border focus:outline-none ${
                                lead.lead_status === 'NEW'
                                  ? 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                                  : lead.lead_status === 'CONTACTED'
                                  ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                                  : lead.lead_status === 'INTERESTED'
                                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                                  : lead.lead_status === 'FOLLOW_UP'
                                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                                  : lead.lead_status === 'CONVERTED'
                                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              <option value="NEW">New</option>
                              <option value="CONTACTED">Contacted</option>
                              <option value="INTERESTED">Interested</option>
                              <option value="FOLLOW_UP">Follow-up</option>
                              <option value="CONVERTED">Converted 🎉</option>
                              <option value="LOST">Lost</option>
                              <option value="REJECTED">Rejected</option>
                            </select>
                          </td>

                          {/* Priority */}
                          <td className="py-3 px-4">
                            {lead.priority === 'URGENT' && (
                              <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-500/30 px-1.5 py-0.5 rounded">
                                URGENT ⚡
                              </span>
                            )}
                            {lead.priority === 'HIGH' && (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded">
                                HIGH 🔥
                              </span>
                            )}
                            {lead.priority === 'MEDIUM' && <span className="text-slate-400">Medium</span>}
                            {lead.priority === 'LOW' && <span className="text-slate-500">Low</span>}
                          </td>

                          {/* Assignee */}
                          <td className="py-3 px-4">
                            <span className="text-slate-300 truncate max-w-[120px] block">
                              {lead.assigned_to_name || 'Staff'}
                            </span>
                          </td>

                          {/* Next Follow-up */}
                          <td className="py-3 px-4">
                            {lead.next_followup_date ? (
                              <div className="flex items-center gap-1 text-cyan-400 font-mono">
                                <Calendar className="w-3 h-3" />
                                <span>{lead.next_followup_date}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500">—</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                title="Open WhatsApp Web"
                                className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 transition"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              {lead.lead_status !== 'CONVERTED' && (
                                <button
                                  onClick={() => handleOpenConvert(lead)}
                                  title="Convert to Paid Customer"
                                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenLeadDetail(lead)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <LeadKanbanBoard
          leads={filteredLeads}
          onSelectLead={handleOpenLeadDetail}
          onUpdateLeadStatus={onUpdateLeadStatus}
          onOpenNewLeadModal={() => {
            setLeadToEdit(null);
            setIsFormModalOpen(true);
          }}
          currencySymbol={currencySymbol}
        />
      )}

      {/* VIEW 3: WHATSAPP WEB INBOX */}
      {viewMode === 'inbox' && (
        <WhatsAppInboxView
          leads={leads}
          messages={messages}
          selectedLeadId={selectedLeadForDetail?.lead_id || null}
          onSelectLead={lead => setSelectedLeadForDetail(lead)}
          onSendMessage={onSendMessage}
          onOpenConvertModal={handleOpenConvert}
          leadSettings={leadSettings}
          currencySymbol={currencySymbol}
        />
      )}

      {/* VIEW 4: ATTRIBUTION ANALYTICS */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Meta Ad Campaigns Performance */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Campaign Attribution & Conversion ROI
              </h3>
              <div className="space-y-3">
                {metrics.leadsByCampaign.map((cmp, idx) => (
                  <div key={idx} className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span className="font-mono text-indigo-300">{cmp.campaign}</span>
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                          {cmp.source}
                        </span>
                      </div>
                      <div className="font-mono text-emerald-400 font-bold">
                        {currencySymbol}{cmp.revenue.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Leads: {cmp.leadCount}</span>
                      <span>Converted: {cmp.convertedCount} ({cmp.conversionRate}%)</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${Math.min(cmp.conversionRate, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leads by Source Platform */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Platform Distribution & Revenue
              </h3>
              <div className="space-y-3">
                {metrics.leadsBySource.map((src, idx) => (
                  <div key={idx} className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{src.source}</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {currencySymbol}{src.revenue.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Volume: {src.leadCount} enquiries</span>
                      <span>Conversion: {src.conversionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${Math.min(src.conversionRate, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Lead Form Modal */}
      <LeadFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setLeadToEdit(null);
        }}
        leadToEdit={leadToEdit}
        onSaveLead={onSaveLead}
        staffUsers={staffUsers}
        customServices={leadSettings.customServices}
        customSources={leadSettings.customSources}
        existingLeads={leads}
      />

      {/* MODAL 2: Lead 360 Detail Drawer */}
      <LeadDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setSelectedLeadForDetail(null);
        }}
        lead={selectedLeadForDetail}
        followups={followups}
        activities={activities}
        messages={messages}
        staffUsers={staffUsers}
        onUpdateStatus={onUpdateLeadStatus}
        onUpdatePriority={onUpdateLeadPriority}
        onUpdateAssignee={onUpdateLeadAssignee}
        onSendMessage={onSendMessage}
        onAddFollowup={onAddFollowup}
        onCompleteFollowup={onCompleteFollowup}
        onAddTimelineNote={onAddTimelineNote}
        onOpenConvertModal={handleOpenConvert}
        onOpenLostModal={handleOpenLost}
        onOpenEditModal={handleOpenEditModal}
        onDeleteLead={leadId => {
          onDeleteLead(leadId);
          setIsDetailDrawerOpen(false);
        }}
        templates={leadSettings.templates}
        currencySymbol={currencySymbol}
      />

      {/* MODAL 3: Convert to Customer */}
      <LeadConvertModal
        isOpen={isConvertModalOpen}
        onClose={() => {
          setIsConvertModalOpen(false);
          setLeadToConvert(null);
        }}
        lead={leadToConvert}
        onConvert={onConvertLead}
        currencySymbol={currencySymbol}
      />

      {/* MODAL 4: Mark Lost / Rejected */}
      <LeadLostModal
        isOpen={isLostModalOpen}
        onClose={() => {
          setIsLostModalOpen(false);
          setLeadToMarkLost(null);
        }}
        lead={leadToMarkLost}
        onConfirmLost={onMarkLeadLost}
        lostReasons={leadSettings.lostReasons}
      />

      {/* MODAL 5: Settings Modal */}
      <LeadSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={leadSettings}
        onSaveSettings={onSaveSettings}
      />

      {/* MODAL 6: WhatsApp Simulator Modal */}
      <WhatsAppSimulatorModal
        isOpen={isSimulatorModalOpen}
        onClose={() => setIsSimulatorModalOpen(false)}
        onSimulateInbound={onSimulateInboundLead}
      />
    </div>
  );
};
