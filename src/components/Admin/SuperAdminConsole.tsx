/**
 * Super Admin Management Console & Subscription Billing Ledger
 * Tab 1: All Registered Accounts & User Credentials (with View, Edit, Delete beside each)
 * Tab 2: Monthly Subscriptions & Billing Ledger with '+ Add ₹200 Monthly Fee' action
 * Live auto-load & instant refresh.
 */

import React, { useState } from 'react';
import { User, SubscriptionBillingRecord } from '../../types';
import {
  ShieldCheck,
  Users,
  DollarSign,
  Key,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Calendar,
  Building2,
  Mail,
  Phone,
  Search,
  Filter,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Lock,
  Compass,
  X,
} from 'lucide-react';

interface SuperAdminConsoleProps {
  users: User[];
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: string) => void;
  onCreateUser: (newUser: Partial<User>) => void;
  subscriptionRecords: SubscriptionBillingRecord[];
  onAddMonthlyBilling: (accountId: string, amount?: number) => void;
  onBatchAddMonthlyBilling: () => void;
  onToggleSubscriptionPayment: (recordId: string, newStatus: 'paid' | 'pending' | 'overdue') => void;
  currencySymbol?: string;
  clientsCountMap?: Record<string, number>;
  inventoryCountMap?: Record<string, number>;
  salesCountMap?: Record<string, number>;
}

export const SuperAdminConsole: React.FC<SuperAdminConsoleProps> = ({
  users,
  onUpdateUser,
  onDeleteUser,
  onCreateUser,
  subscriptionRecords,
  onAddMonthlyBilling,
  onBatchAddMonthlyBilling,
  onToggleSubscriptionPayment,
  currencySymbol = '$',
  clientsCountMap = {},
  inventoryCountMap = {},
  salesCountMap = {},
}) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'billing'>('accounts');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Password Visibility Toggle Map
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // New User Form State
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newAstrologerName, setNewAstrologerName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('Vedic Parashari & Gemology');
  const [newPassword, setNewPassword] = useState('pass1234');
  const [newRole, setNewRole] = useState<'astrologer' | 'staff' | 'admin'>('astrologer');

  // Feedback Notification
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.companyName && u.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (u.status || 'active') === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate High-Level Metrics
  const totalAccounts = users.length;
  const activeSubscribedUsers = users.filter(u => u.role !== 'demo_user');
  const monthlyRecurringRevenue = activeSubscribedUsers.reduce((sum, u) => sum + (u.monthlyFee ?? 200), 0);
  const totalLifetimeBilling = subscriptionRecords
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.amount, 0);

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAstrologerName || !newEmail || !newUsername || !newPassword) return;

    onCreateUser({
      name: newAstrologerName.trim(),
      email: newEmail.trim().toLowerCase(),
      username: newUsername.trim().toLowerCase(),
      password: newPassword,
      companyName: newCompanyName.trim() || 'Vedic Astrology Studio',
      specialty: newSpecialty,
      role: newRole,
      status: 'active',
      monthlyFee: 200,
      subscriptionStatus: 'active_paid',
      lastBillingDate: new Date().toISOString().split('T')[0],
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalBilled: 200,
    });

    setIsNewUserModalOpen(false);
    setNewCompanyName('');
    setNewAstrologerName('');
    setNewUsername('');
    setNewEmail('');
    setNewPhone('');
    showNotice(`New account '${newUsername}' created successfully with fresh zero-data workspace.`);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    onUpdateUser(editingUser);
    setEditingUser(null);
    showNotice(`Account credentials for '${editingUser.name}' updated successfully.`);
  };

  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    if (deletingUser.role === 'super_admin' && users.filter(u => u.role === 'super_admin').length <= 1) {
      alert('Cannot delete the last Super Admin account.');
      setDeletingUser(null);
      return;
    }

    onDeleteUser(deletingUser.id);
    showNotice(`Account '${deletingUser.name}' (${deletingUser.username || deletingUser.id}) has been removed.`);
    setDeletingUser(null);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Banner Notice */}
      {notice && (
        <div className="p-4 rounded-xl bg-[#1c060e] border border-orange-500/50 text-orange-200 text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-orange-400" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-orange-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & High Level Metrics Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-bold text-white font-['Outfit',sans-serif]">System Admin Command & Tenant Console</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage all tenant astrologer credentials, fresh zero-data workspaces, and ₹200/month recurring subscription billing ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsNewUserModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Tenant Account</span>
          </button>
        </div>
      </div>

      {/* 4 Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0e0307]/90 border border-red-950/80 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <Users className="w-4 h-4 text-orange-400" />
            <span>Total Tenant Accounts</span>
          </span>
          <div className="text-2xl font-bold text-white font-['Cinzel',serif]">{totalAccounts}</div>
          <span className="text-[10px] text-orange-300 font-medium">All registered practitioners & clinics</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e0307]/90 border border-red-950/80 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-orange-400" />
            <span>Monthly Recurring Billing (MRR)</span>
          </span>
          <div className="text-2xl font-bold text-orange-400 font-['Cinzel',serif]">
            {currencySymbol}
            {monthlyRecurringRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-orange-300/80 font-medium">Standard ₹200.00 / account / month</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e0307]/90 border border-red-950/80 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-orange-400" />
            <span>Lifetime Subscriptions Collected</span>
          </span>
          <div className="text-2xl font-bold text-white font-['Cinzel',serif]">
            {currencySymbol}
            {totalLifetimeBilling.toLocaleString()}
          </div>
          <span className="text-[10px] text-orange-300/80 font-medium">Recorded subscription invoices</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e0307]/90 border border-red-950/80 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-orange-400" />
            <span>Active Paid Subscriptions</span>
          </span>
          <div className="text-2xl font-bold text-orange-400 font-['Cinzel',serif]">
            {activeSubscribedUsers.length} / {totalAccounts}
          </div>
          <span className="text-[10px] text-orange-300/80 font-medium">100% cloud automated synchronization</span>
        </div>
      </div>

      {/* Main 2-Tab Navigation */}
      <div className="flex border-b border-red-950/80 gap-4">
        <button
          type="button"
          id="admin-tab-accounts"
          onClick={() => setActiveTab('accounts')}
          className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'accounts'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>All Registered Accounts & Credentials</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#250813] text-orange-300 border border-orange-500/30 font-bold">
            {users.length}
          </span>
        </button>

        <button
          type="button"
          id="admin-tab-billing"
          onClick={() => setActiveTab('billing')}
          className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'billing'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Monthly Subscriptions & Billing Ledger (₹200/mo)</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#250813] text-orange-300 border border-orange-500/30 font-bold">
            {subscriptionRecords.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ALL REGISTERED ACCOUNTS & CREDENTIALS WITH VIEW, EDIT, DELETE       */}
      {/* ========================================================================= */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          {/* Search and Filters Bar */}
          <div className="p-4 bg-[#0e0307]/90 rounded-2xl border border-red-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-orange-400/70" />
              <input
                type="text"
                placeholder="Search by name, company, email, username..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#14050a] border border-red-950/80 rounded-xl text-xs text-white focus:bg-[#1a070e] focus:ring-1 focus:ring-orange-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-[#14050a] border border-red-950/80 rounded-xl text-xs text-slate-200 outline-none"
              >
                <option value="all">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="astrologer">Astrologer</option>
                <option value="staff">Staff</option>
                <option value="demo_user">Demo User</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#14050a] border border-red-950/80 rounded-xl text-xs text-slate-200 outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="bg-[#0e0307]/90 rounded-2xl border border-red-950/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#14050a] border-b border-red-950/80 font-bold text-orange-200 uppercase tracking-wider text-[10px] font-['Outfit',sans-serif]">
                  <tr>
                    <th className="py-3.5 px-4">User ID & Astrologer</th>
                    <th className="py-3.5 px-4">Company / Organization</th>
                    <th className="py-3.5 px-4">Email & Phone</th>
                    <th className="py-3.5 px-4">Role & Status</th>
                    <th className="py-3.5 px-4">Password (Secure)</th>
                    <th className="py-3.5 px-4">Workspace Data</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-950/50">
                  {filteredUsers.map(user => {
                    const isVisible = visiblePasswords[user.id];
                    const rawPassword = user.password || '••••••••';
                    const clientsCount = clientsCountMap[user.id] ?? (user.role === 'super_admin' || user.role === 'demo_user' ? 8 : 0);
                    const stonesCount = inventoryCountMap[user.id] ?? (user.role === 'super_admin' || user.role === 'demo_user' ? 9 : 0);
                    const salesCount = salesCountMap[user.id] ?? (user.role === 'super_admin' || user.role === 'demo_user' ? 6 : 0);

                    return (
                      <tr key={user.id} className="hover:bg-[#1a070e]/60 transition">
                        {/* User ID & Astrologer */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#250813] border border-orange-500/30 flex items-center justify-center font-bold text-orange-400 text-xs shrink-0 font-['Cinzel',serif]">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-white text-xs flex items-center gap-1.5 font-['Outfit',sans-serif]">
                                <span>{user.name}</span>
                                {user.role === 'super_admin' && (
                                  <span className="text-[9px] bg-gradient-to-r from-red-600 to-orange-500 text-white font-extrabold px-1.5 py-0.2 rounded shadow-2xs">
                                    ADMIN
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                <span>ID:</span>
                                <span className="font-bold text-orange-400">{user.username || user.id}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Company */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{user.companyName || 'Private Practice'}</div>
                          <div className="text-[10px] text-slate-400">{user.specialty || 'Vedic Astrology'}</div>
                        </td>

                        {/* Email & Phone */}
                        <td className="py-3.5 px-4">
                          <div className="text-slate-200 font-mono">{user.email}</div>
                          <div className="text-[10px] text-slate-400">{user.phone || 'No phone entered'}</div>
                        </td>

                        {/* Role & Status */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                user.role === 'super_admin'
                                  ? 'bg-[#250813] text-orange-300 border border-orange-500/40'
                                  : user.role === 'astrologer'
                                  ? 'bg-[#1c060e] text-orange-200 border border-red-900'
                                  : user.role === 'demo_user'
                                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                                  : 'bg-[#14050a] text-slate-400 border border-red-950'
                              }`}
                            >
                              {user.role}
                            </span>
                            <div>
                              <span
                                className={`text-[10px] font-semibold flex items-center gap-1 ${
                                  (user.status || 'active') === 'active' ? 'text-orange-400' : 'text-rose-400'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    (user.status || 'active') === 'active' ? 'bg-orange-500' : 'bg-rose-500'
                                  }`}
                                />
                                {user.status || 'active'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Password */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-slate-200 text-xs px-2 py-1 bg-[#14050a] rounded-md border border-red-950/80">
                              {isVisible ? rawPassword : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(user.id)}
                              className="p-1 text-slate-400 hover:text-orange-400 transition cursor-pointer"
                              title={isVisible ? 'Hide Password' : 'Show Password'}
                            >
                              {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(user.password || '', user.id)}
                              className="p-1 text-slate-400 hover:text-orange-400 transition cursor-pointer"
                              title="Copy password"
                            >
                              {copiedId === user.id ? (
                                <Check className="w-3.5 h-3.5 text-orange-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Workspace Data Metrics */}
                        <td className="py-3.5 px-4">
                          <div className="text-[10px] space-y-0.5">
                            <div className="text-slate-400">
                              Clients: <strong className="text-white">{clientsCount}</strong>
                            </div>
                            <div className="text-slate-400">
                              Vault Stones: <strong className="text-orange-400">{stonesCount}</strong>
                            </div>
                            <div className="text-slate-400">
                              Invoices: <strong className="text-white">{salesCount}</strong>
                            </div>
                          </div>
                        </td>

                        {/* Action Buttons: VIEW, EDIT, DELETE */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* VIEW BUTTON */}
                            <button
                              type="button"
                              onClick={() => setViewingUser(user)}
                              className="p-1.5 bg-[#1c060e] hover:bg-[#280914] text-orange-300 rounded-lg border border-red-900 transition cursor-pointer"
                              title="View Account Dossier"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* EDIT BUTTON */}
                            <button
                              type="button"
                              onClick={() => setEditingUser({ ...user })}
                              className="p-1.5 bg-[#250813] hover:bg-[#340c1c] text-orange-300 rounded-lg border border-orange-500/30 transition cursor-pointer"
                              title="Edit Credentials & Details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* DELETE BUTTON */}
                            <button
                              type="button"
                              onClick={() => setDeletingUser(user)}
                              className="p-1.5 bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 rounded-lg border border-rose-800/40 transition cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No user accounts match the search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MONTHLY SUBSCRIPTIONS & BILLING LEDGER (₹200/MO)                   */}
      {/* ========================================================================= */}
      {activeTab === 'billing' && (
        <div className="space-y-4">
          {/* Header Action Bar */}
          <div className="p-4 bg-[#0e0307]/90 rounded-2xl border border-red-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div>
              <h3 className="font-bold text-sm text-white font-['Outfit',sans-serif]">Tenant Subscription Licensing (₹200.00 / month)</h3>
              <p className="text-xs text-slate-400">
                Click '+ Add ₹200 Monthly Fee' to record billing cycle charges and renew astrologer licenses.
              </p>
            </div>

            <button
              type="button"
              onClick={onBatchAddMonthlyBilling}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Batch Add ₹200 Monthly Fee to All Active Accounts</span>
            </button>
          </div>

          {/* Active Tenant Accounts Billing Status Table */}
          <div className="bg-[#0e0307]/90 rounded-2xl border border-red-950/80 overflow-hidden shadow-sm">
            <div className="p-4 bg-[#14050a] border-b border-red-950/80 flex items-center justify-between">
              <span className="font-bold text-xs text-orange-200 uppercase tracking-wider font-['Outfit',sans-serif]">
                Tenant Accounts Subscription Schedule
              </span>
              <span className="text-xs text-slate-400">Fixed Rate: ₹200.00 INR / mo</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#14050a] border-b border-red-950/80 font-bold text-orange-200 uppercase tracking-wider text-[10px] font-['Outfit',sans-serif]">
                  <tr>
                    <th className="py-3 px-4">Tenant / Astrologer</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Monthly Rate</th>
                    <th className="py-3 px-4">Subscription Status</th>
                    <th className="py-3 px-4">Billing Cycle Dates</th>
                    <th className="py-3 px-4">Lifetime Billed</th>
                    <th className="py-3 px-4 text-right">Instant Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-950/50">
                  {users.map(user => {
                    const fee = user.monthlyFee || 200;
                    const status = user.subscriptionStatus || 'active_paid';
                    const lastDate = user.lastBillingDate || '2026-08-01';
                    const nextDate = user.nextBillingDate || '2026-09-01';
                    const totalBilled = user.totalBilled || fee;

                    return (
                      <tr key={user.id} className="hover:bg-[#1a070e]/60 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white font-['Outfit',sans-serif]">{user.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-200">{user.companyName || 'Astrology Studio'}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-orange-400 text-sm font-['Cinzel',serif]">
                            {currencySymbol}
                            {fee.toLocaleString('en-IN')}.00
                          </span>
                          <span className="text-[10px] text-slate-400 block">/ month</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              status === 'active_paid'
                                ? 'bg-[#1c060e] text-orange-300 border border-orange-500/40'
                                : status === 'trial'
                                ? 'bg-[#250813] text-orange-200 border border-red-900'
                                : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {status === 'active_paid' ? 'Active Paid' : status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-[11px] text-slate-300">
                            Last: <span className="font-mono font-semibold text-white">{lastDate}</span>
                          </div>
                          <div className="text-[11px] text-slate-300">
                            Next Due: <span className="font-mono font-semibold text-orange-400">{nextDate}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-orange-400 font-['Cinzel',serif]">
                            {currencySymbol}
                            {totalBilled.toLocaleString('en-IN')}
                          </span>
                        </td>

                        {/* Prominent '+ Add ₹200 Monthly Fee' Button */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              onAddMonthlyBilling(user.id, 200);
                              showNotice(`Recorded ₹200 monthly subscription fee for ${user.name}.`);
                            }}
                            className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5 ml-auto cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-white" />
                            <span>+ Add ₹200 Monthly Fee</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historical Subscription Invoices Ledger */}
          <div className="bg-[#0e0307]/90 rounded-2xl border border-red-950/80 overflow-hidden shadow-sm">
            <div className="p-4 bg-[#14050a] border-b border-red-950/80 flex items-center justify-between">
              <span className="font-bold text-xs text-orange-200 uppercase tracking-wider font-['Outfit',sans-serif]">
                Historical Subscription Invoices Ledger
              </span>
              <span className="text-xs text-slate-400 font-mono">Auto-refreshed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#14050a] border-b border-red-950/80 font-bold text-orange-200 uppercase tracking-wider text-[10px] font-['Outfit',sans-serif]">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Account & Company</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Toggle Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-950/50">
                  {subscriptionRecords.map(record => (
                    <tr key={record.id} className="hover:bg-[#1a070e]/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-orange-400">{record.invoiceNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white font-['Outfit',sans-serif]">{record.accountName}</div>
                        <div className="text-[10px] text-slate-400">{record.companyName}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 text-[11px]">{record.description}</td>
                      <td className="py-3 px-4 font-bold text-orange-400 text-sm font-['Cinzel',serif]">
                        ₹{record.amount.toLocaleString('en-IN')}.00
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{record.billingDate}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            record.status === 'paid'
                              ? 'bg-[#1c060e] text-orange-300 border border-orange-500/40'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const next = record.status === 'paid' ? 'pending' : 'paid';
                            onToggleSubscriptionPayment(record.id, next);
                            showNotice(`Invoice ${record.invoiceNumber} status changed to ${next}.`);
                          }}
                          className="px-2.5 py-1 bg-[#14050a] hover:bg-[#200812] text-slate-200 rounded-lg text-[10px] font-semibold border border-red-900 transition cursor-pointer"
                        >
                          Mark {record.status === 'paid' ? 'Pending' : 'Paid'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW ACCOUNT DOSSIER                                               */}
      {/* ========================================================================= */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0e0307] border border-red-900/80 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl text-white animate-in fade-in">
            <div className="flex items-center justify-between border-b border-red-950 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#250813] border border-orange-500/30 flex items-center justify-center font-bold text-orange-400 text-sm font-['Cinzel',serif]">
                  {viewingUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white font-['Outfit',sans-serif]">{viewingUser.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">User ID: {viewingUser.username || viewingUser.id}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingUser(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#14050a] rounded-xl border border-red-950 space-y-1">
                <span className="text-slate-400 block">Company / Clinic</span>
                <span className="font-bold text-white text-sm">{viewingUser.companyName || 'Not specified'}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#14050a] rounded-xl border border-red-950 space-y-1">
                  <span className="text-slate-400 block">Email Address</span>
                  <span className="font-semibold text-slate-200 font-mono">{viewingUser.email}</span>
                </div>
                <div className="p-3 bg-[#14050a] rounded-xl border border-red-950 space-y-1">
                  <span className="text-slate-400 block">Phone / WhatsApp</span>
                  <span className="font-semibold text-slate-200">{viewingUser.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="p-3 bg-[#14050a] rounded-xl border border-red-950 space-y-1">
                <span className="text-slate-400 block">Astrological Specialization</span>
                <span className="font-semibold text-slate-200">{viewingUser.specialty || 'Vedic Astrology'}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#14050a] rounded-xl border border-red-950 space-y-1">
                  <span className="text-slate-400 block">Monthly Fee</span>
                  <span className="font-bold text-orange-400 text-sm font-['Cinzel',serif]">${viewingUser.monthlyFee || 200}/mo</span>
                </div>
                <div className="p-3 bg-[#14050a] rounded-xl border border-red-950 space-y-1">
                  <span className="text-slate-400 block">Account Password</span>
                  <span className="font-mono font-bold text-white">{viewingUser.password || '••••••••'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-red-950 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 bg-[#1c060e] hover:bg-[#280914] border border-red-900 text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT ACCOUNT CREDENTIALS & ROLE                                    */}
      {/* ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <form
            onSubmit={handleSaveEditUser}
            className="bg-[#0e0307] border border-red-900/80 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-white animate-in fade-in"
          >
            <div className="flex items-center justify-between border-b border-red-950 pb-3">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-orange-400" />
                <h3 className="font-bold text-base text-white font-['Outfit',sans-serif]">Edit Account & Credentials</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-300">Company / Clinic Name</label>
                <input
                  type="text"
                  value={editingUser.companyName || ''}
                  onChange={e => setEditingUser({ ...editingUser, companyName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Astrologer / Owner Name *</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">User ID / Username *</label>
                <input
                  type="text"
                  required
                  value={editingUser.username || ''}
                  onChange={e => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-xs font-mono text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Phone</label>
                <input
                  type="text"
                  value={editingUser.phone || ''}
                  onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Password</label>
                <input
                  type="text"
                  value={editingUser.password || ''}
                  onChange={e => setEditingUser({ ...editingUser, password: e.target.value })}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-xs font-mono text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Monthly Fee ($)</label>
                <input
                  type="number"
                  value={editingUser.monthlyFee || 200}
                  onChange={e => setEditingUser({ ...editingUser, monthlyFee: parseFloat(e.target.value) || 200 })}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Role</label>
                <select
                  value={editingUser.role}
                  onChange={e => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-xs text-white"
                >
                  <option value="astrologer">Astrologer</option>
                  <option value="staff">Staff</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="demo_user">Demo User</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Status</label>
                <select
                  value={editingUser.status || 'active'}
                  onChange={e => setEditingUser({ ...editingUser, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-xs text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-red-950 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-[#1c060e] hover:bg-[#280914] border border-red-900 text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW TENANT ACCOUNT                                             */}
      {/* ========================================================================= */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <form
            onSubmit={handleCreateNewUser}
            className="bg-[#0e0307] border border-red-900/80 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-white animate-in fade-in"
          >
            <div className="flex items-center justify-between border-b border-red-950 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-400" />
                <h3 className="font-bold text-base text-white font-['Outfit',sans-serif]">Provision New Tenant Account</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewUserModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#250813] border border-orange-500/30 rounded-xl text-[11px] text-orange-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
              <span>
                New tenant accounts will receive an isolated, fresh 0-data workspace with zero initial records.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-300">Company / Clinic Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navagraha Astro Labs"
                  value={newCompanyName}
                  onChange={e => setNewCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Astrologer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acharya Ramesh"
                  value={newAstrologerName}
                  onChange={e => setNewAstrologerName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">User ID / Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ramesh_jyotish"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-xs font-mono text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh@astro.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98000 12345"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Password *</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-xs font-mono text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Role</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#14050a] border border-red-950 rounded-xl text-xs text-white"
                >
                  <option value="astrologer">Astrologer (₹200/mo)</option>
                  <option value="staff">Staff (₹200/mo)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-red-950 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNewUserModalOpen(false)}
                className="px-4 py-2 bg-[#1c060e] hover:bg-[#280914] border border-red-900 text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CONFIRMATION                                                */}
      {/* ========================================================================= */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0e0307] border border-red-900/80 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl text-white animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-white font-['Outfit',sans-serif]">Delete Tenant Account?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to delete <strong className="text-white">{deletingUser.name}</strong> ({deletingUser.username || deletingUser.id})?
                This action is irreversible and will purge all private workspace data.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="py-2.5 bg-[#1c060e] hover:bg-[#280914] border border-red-900 text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2.5 bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
