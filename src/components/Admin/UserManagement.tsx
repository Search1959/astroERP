/**
 * Staff & Astrologer User Management (Admin View)
 */

import React, { useState } from 'react';
import { User } from '../../types';
import { Users, Shield, Plus, Lock, Mail, CheckCircle2, Trash2 } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onAddUser,
  onDeleteUser,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'astrologer' | 'staff'>('astrologer');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onAddUser({
      name,
      email,
      role,
      title: title || (role === 'astrologer' ? 'Vedic Astrologer' : 'Staff Member'),
      phone,
      isActive: true,
      permissions: role === 'admin' ? ['all'] : role === 'astrologer' ? ['crm', 'astrology', 'calendar', 'inventory_read'] : ['inventory', 'sales', 'calendar'],
    });

    setName('');
    setEmail('');
    setTitle('');
    setPhone('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">Staff & Astrologer Accounts</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage system administrators, consulting astrologers, and inventory staff access.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          + Add Staff Member
        </button>
      </div>

      <div className="bg-[#0e0307]/90 border border-red-950/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#14050a] text-orange-200 uppercase font-bold tracking-wider border-b border-red-950/80 font-['Outfit',sans-serif] text-[10px]">
              <th className="py-3.5 px-4">Name & Title</th>
              <th className="py-3.5 px-4">Email & Phone</th>
              <th className="py-3.5 px-4">System Role</th>
              <th className="py-3.5 px-4">Access Level</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-red-950/50 font-medium text-slate-300">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-[#1a070e]/60 transition">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-white text-sm font-['Outfit',sans-serif]">{u.name}</div>
                  <div className="text-orange-400 text-[11px] mt-0.5 font-medium">{u.title || u.role}</div>
                </td>

                <td className="py-3.5 px-4 text-slate-300">
                  <div className="font-mono">{u.email}</div>
                  <div className="text-slate-400 text-[10px]">{u.phone || '—'}</div>
                </td>

                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    u.role === 'admin' ? 'bg-[#250813] text-orange-300 border border-orange-500/40' :
                    u.role === 'astrologer' ? 'bg-[#1c060e] text-orange-200 border border-red-900' :
                    'bg-[#14050a] text-slate-400 border border-red-950'
                  }`}>
                    {u.role}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                  {(u.permissions || []).includes('all') ? 'Full System Access' : (u.permissions && u.permissions.length > 0 ? u.permissions.join(', ') : 'Standard System Access')}
                </td>

                <td className="py-3.5 px-4">
                  <span className="text-orange-400 flex items-center gap-1 font-semibold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => onDeleteUser(u.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto font-sans">
          <div className="bg-[#0e0307] border border-red-900/80 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-white my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-red-950 pb-3">
              <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">Add Astrologer / Staff Account</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-rose-950/80 hover:text-rose-300 transition cursor-pointer"
              >
                <Trash2 className="hidden" /> {/* Keep imports valid */}
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Acharya Sharma"
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="acharya@astroerp.com"
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Professional Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Senior Vedic Astrologer & Gemologist"
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">System Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="astrologer">Astrologer (Consultations, Charts, Prescriptions)</option>
                  <option value="staff">Store Staff (Inventory, Billing, Orders)</option>
                  <option value="admin">Administrator (Full Control)</option>
                </select>
              </div>
              <div className="pt-3 border-t border-red-950 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#1c060e] hover:bg-[#280914] border border-red-900 text-white rounded-xl font-medium cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold rounded-xl cursor-pointer shadow-md transition"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
