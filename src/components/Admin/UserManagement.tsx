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
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Staff & Astrologer Accounts</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage system administrators, consulting astrologers, and inventory staff access.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          + Add Staff Member
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase font-semibold tracking-wider border-b border-slate-200">
              <th className="py-3 px-4">Name & Title</th>
              <th className="py-3 px-4">Email & Phone</th>
              <th className="py-3 px-4">System Role</th>
              <th className="py-3 px-4">Access Level</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/80 transition">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                  <div className="text-indigo-600 text-[11px] mt-0.5 font-medium">{u.title || u.role}</div>
                </td>

                <td className="py-3.5 px-4 text-slate-700">
                  <div>{u.email}</div>
                  <div className="text-slate-400 text-[10px]">{u.phone || '—'}</div>
                </td>

                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                    u.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                    u.role === 'astrologer' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {u.role}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                  {(u.permissions || []).includes('all') ? 'Full System Access' : (u.permissions && u.permissions.length > 0 ? u.permissions.join(', ') : 'Standard System Access')}
                </td>

                <td className="py-3.5 px-4">
                  <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => onDeleteUser(u.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900">Add Astrologer / Staff Account</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Acharya Sharma"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="acharya@astroerp.com"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Professional Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Senior Vedic Astrologer & Gemologist"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">System Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="astrologer">Astrologer (Consultations, Charts, Prescriptions)</option>
                  <option value="staff">Store Staff (Inventory, Billing, Orders)</option>
                  <option value="admin">Administrator (Full Control)</option>
                </select>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg cursor-pointer shadow-sm transition"
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
