/**
 * Client Management (CRM) Table View
 * Search, filter, CRUD, and quick attach natal chart actions.
 */

import React, { useState } from 'react';
import { Client } from '../../types';
import { Users, Search, Plus, Sparkles, Calendar, DollarSign, Tag, Eye, Trash2, Edit3, Download } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onOpenNewClientModal: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onBookAppointmentForClient: (client: Client) => void;
  currencySymbol?: string;
}

export const ClientList: React.FC<ClientListProps> = ({
  clients,
  onSelectClient,
  onOpenNewClientModal,
  onEditClient,
  onDeleteClient,
  onBookAppointmentForClient,
  currencySymbol = '$',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Collect all unique tags
  const allTags = Array.from(new Set(clients.flatMap(c => c.tags || [])));

  const filteredClients = clients.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.placeOfBirth.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = selectedTag === 'all' || (c.tags && c.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const exportClientsCSV = () => {
    const headers = ['ID,Name,Email,Phone,DOB,TOB,BirthPlace,TotalConsultations,TotalSpent,Tags'];
    const rows = filteredClients.map(c =>
      `"${c.id}","${c.name || ''}","${c.email || ''}","${c.phone || ''}","${c.dateOfBirth || ''}","${c.timeOfBirth || ''}","${c.placeOfBirth || ''}",${c.totalConsultations || 0},${c.totalSpent || 0},"${(c.tags || []).join(';')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AstroERP_Clients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Client Management (CRM & Natal Profiles)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain client records, attached natal charts, consultation history, and gemstone purchases.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportClientsCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            id="btn-add-client-crm"
            onClick={onOpenNewClientModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + Add New Client
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="search-clients-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, city..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Tag className="w-3 h-3 text-slate-400" /> Filter:
          </span>
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
              selectedTag === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            All ({clients.length})
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                selectedTag === tag ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-semibold tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Client Name & Contact</th>
                <th className="py-3 px-4">Birth Details</th>
                <th className="py-3 px-4">Attached Charts</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4">Spend & Sessions</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No clients found matching your search.
                  </td>
                </tr>
              ) : (
                filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-slate-50/80 transition">
                    {/* Name & Contact */}
                    <td className="py-3 px-4">
                      <div
                        onClick={() => onSelectClient(client)}
                        className="font-bold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer transition"
                      >
                        {client.name}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{client.email}</div>
                      <div className="text-slate-400 text-[11px]">{client.phone}</div>
                    </td>

                    {/* Birth Details */}
                    <td className="py-3 px-4 text-slate-700">
                      <div>{client.dateOfBirth} at {client.timeOfBirth}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{client.placeOfBirth}</div>
                    </td>

                    {/* Attached Charts */}
                    <td className="py-3 px-4">
                      {client.attachedCharts && client.attachedCharts.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            {client.attachedCharts.length} Chart{client.attachedCharts.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No chart attached</span>
                      )}
                    </td>

                    {/* Tags */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(client.tags || []).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Spend & Consultations */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-emerald-700 text-sm">
                        {currencySymbol}{(client.totalSpent || 0).toLocaleString()}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {client.totalConsultations || 0} Consultation{(client.totalConsultations || 0) !== 1 ? 's' : ''}
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onBookAppointmentForClient(client)}
                          title="Book Consultation"
                          className="p-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg border border-slate-200 transition cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectClient(client)}
                          title="View Profile & Charts"
                          className="p-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg border border-slate-200 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditClient(client)}
                          title="Edit Profile"
                          className="p-1.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-600 text-slate-600 rounded-lg border border-slate-200 transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteClient(client.id)}
                          title="Delete Client"
                          className="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg border border-slate-200 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
