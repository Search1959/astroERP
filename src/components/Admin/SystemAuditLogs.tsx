/**
 * System Audit & Security Logs Component
 */

import React, { useState } from 'react';
import { AuditLog } from '../../types';
import { Shield, Search, Clock, User, Filter } from 'lucide-react';

interface SystemAuditLogsProps {
  logs: AuditLog[];
}

export const SystemAuditLogs: React.FC<SystemAuditLogsProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  const modules = Array.from(new Set(logs.map(l => l.module)));

  const filteredLogs = logs.filter(log => {
    const matchQuery =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchModule = moduleFilter === 'all' || log.module === moduleFilter;
    return matchQuery && matchModule;
  });

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">System Security & Audit Trail</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Immutable tracking logs of staff operations, stock modifications, sales invoices, and chart calculations.
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search audit actions, user, details..."
            className="w-full pl-10 pr-4 py-2 bg-[#14050a] border border-red-950 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <select
          value={moduleFilter}
          onChange={e => setModuleFilter(e.target.value)}
          className="bg-[#14050a] border border-red-950 text-slate-200 font-medium px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
          <option value="all">All System Modules</option>
          {modules.map(m => (
            <option key={m} value={m} className="capitalize">{m}</option>
          ))}
        </select>
      </div>

      {/* Log Feed Table */}
      <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#14050a] text-orange-200 uppercase font-bold tracking-wider border-b border-red-950/80 font-['Outfit',sans-serif] text-[10px]">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Staff User</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Operation Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-950/50 font-medium font-mono text-[11px] text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-sans">
                    No security logs matching search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#1a070e]/60 transition">
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-white font-sans font-semibold font-['Outfit',sans-serif]">
                      {log.userName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#200610] text-orange-300 border border-orange-500/30 uppercase font-bold text-[10px]">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-orange-300 font-semibold font-sans">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-sans">
                      {log.details || '—'}
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
